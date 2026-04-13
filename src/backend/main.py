from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import time
import sys
import requests

from wireless import get_wireless_status

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def gen_camera(index=0):
    cap = cv2.VideoCapture(index)

    while True:
        success, frame = cap.read()
        if not success:
            break

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )


@app.get("/camera/{cam_id}")
def camera_stream(cam_id: int):
    return StreamingResponse(
        gen_camera(cam_id),
        media_type='multipart/x-mixed-replace; boundary=frame'
    )


# ---- API GERAL ----
@app.get("/api/temp")
def get_temp(lat: float, lon: float):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"

    res = requests.get(url)
    data = res.json()

    temp = round(data["current_weather"]["temperature"])

    return {"temp": temp}

@app.get("/api/system/wireless")
def wireless():
    return get_wireless_status()


@app.get("/open/{package}")
def open_app(package: str):
    if sys.platform.startswith("linux"):
        # import subprocess
        # subprocess.Popen(["waydroid", "app", "launch", package])
        return {"status": "opened", "app": package, "mode": 'mobile'}
    else:
        return {"status": "opened", "app": package, "mode": 'mobile'}



@app.get("/close/{package}")
def close_app(package: str):
    if sys.platform.startswith("linux"):
        # import subprocess
        # subprocess.Popen(["waydroid", "app", "stop", package])
        return {"status": "closed", "app": package}
    else:
        return {"status": "closed", "app": package}