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
# CAMERA GLOBAL
# ================================
cap = cv2.VideoCapture(DEVICE, cv2.CAP_V4L2)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, WIDTH)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, HEIGHT)

if not cap.isOpened():
    raise RuntimeError("Não foi possível acessar a câmera")

frame = None
lock = threading.Lock()

# ================================
# THREAD DE CAPTURA (RODA UMA VEZ SÓ)
# ================================
def capture_loop():
    global frame

    while True:
        ret, img = cap.read()

        if not ret:
            # evita travar se perder sinal
            time.sleep(0.01)
            continue

        with lock:
            frame = img

        time.sleep(1 / FPS)

threading.Thread(target=capture_loop, daemon=True).start()

# ================================
# STREAM MJPEG
# ================================
def gen_camera():
    global frame

    while True:
        try:
            if frame is None:
                time.sleep(0.01)
                continue

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
    return StreamingResponse(
        gen_camera(),
        media_type='multipart/x-mixed-replace; boundary=frame'
    )

# ================================
# SNAPSHOT (ALTERNATIVA MAIS ESTÁVEL)
# ================================
def camera_snapshot():
    global frame

    if frame is None:
        return Response(status_code=503)

    with lock:
        ret, buffer = cv2.imencode('.jpg', frame)

    if not ret:
        return Response(status_code=500)

    return Response(buffer.tobytes(), media_type="image/jpeg")