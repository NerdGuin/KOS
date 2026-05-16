from fastapi.responses import StreamingResponse, Response
import cv2
import threading
import time

# ================================
# CONFIG
# ================================
DEVICE = "/dev/video0"
WIDTH = 480
HEIGHT = 320
FPS = 25

# ================================
# ESTADO GLOBAL
# ================================
cap = None
frame = None
lock = threading.Lock()
camera_available = False

# ================================
# INIT CAMERA (SAFE)
# ================================
def init_camera():
    global cap, camera_available

    # já está funcionando
    if cap is not None and cap.isOpened():
        return True

    cap = cv2.VideoCapture(DEVICE, cv2.CAP_V4L2)

    if not cap.isOpened():
        cap = None
        camera_available = False
        return False

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, HEIGHT)

    camera_available = True
    print("📷 Câmera conectada")
    return True


# ================================
# THREAD DE CAPTURA
# ================================
def capture_loop():
    global frame, camera_available, cap

    while True:
        if not init_camera():
            print("⚠️ Câmera não disponível, tentando novamente...")
            time.sleep(2)
            continue

        ret, img = cap.read()

        if not ret:
            print("⚠️ Falha ao ler câmera")
            camera_available = False

            if cap:
                cap.release()
                cap = None

            time.sleep(1)
            continue

        with lock:
            frame = img

        time.sleep(1 / FPS)


# ================================
# START THREAD (chamar no FastAPI)
# ================================
def start_camera():
    threading.Thread(target=capture_loop, daemon=True).start()


# ================================
# STREAM MJPEG
# ================================
def gen_camera():
    global frame

    while True:
        if frame is None:
            time.sleep(0.1)
            continue

        try:
            with lock:
                ret, buffer = cv2.imencode('.jpg', frame)

            if not ret:
                continue

            yield (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' +
                buffer.tobytes() +
                b'\r\n'
            )

        except Exception as e:
            print("Erro no stream:", e)
            break

        time.sleep(1 / FPS)


def camera_stream():
    if not camera_available:
        return Response("Camera offline", status_code=503)

    return StreamingResponse(
        gen_camera(),
        media_type='multipart/x-mixed-replace; boundary=frame'
    )


# ================================
# SNAPSHOT
# ================================
def camera_snapshot():
    global frame

    if not camera_available or frame is None:
        return Response("Camera offline", status_code=503)

    with lock:
        ret, buffer = cv2.imencode('.jpg', frame)

    if not ret:
        return Response(status_code=500)

    return Response(buffer.tobytes(), media_type="image/jpeg")


init_camera()