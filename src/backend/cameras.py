from fastapi.responses import StreamingResponse
import cv2

def gen_camera(index=0):
    cap = cv2.VideoCapture(index)

    if not cap.isOpened():
        return {"error": "Não foi possível acessar a câmera" }

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

def camera_stream(cam_id: int):
    return StreamingResponse(
        gen_camera(cam_id),
        media_type='multipart/x-mixed-replace; boundary=frame'
    )