from fastapi.responses import StreamingResponse
import cv2

def gen_camera(index="/dev/video0"):
    cap = cv2.VideoCapture(index)

    if not cap.isOpened():
        raise RuntimeError("Não foi possível acessar a câmera")

    try:
        while True:
            success, frame = cap.read()
            if not success:
                continue

            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            yield (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
            )
    finally:
        print("Liberando câmera")
        cap.release()

def camera_stream(cam_id: int):
    return StreamingResponse(
        gen_camera(cam_id),
        media_type='multipart/x-mixed-replace; boundary=frame'
    )