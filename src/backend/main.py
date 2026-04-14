from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
import sys
import requests

from wireless import get_wireless_status
from cameras import camera_stream

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/camera/{cam_id}")
def cameras(cam_id: int):
    return camera_stream(cam_id)


@app.get("/open/{package}")
def open_app(package: str):
    if sys.platform.startswith("linux"):
        return {"status": "opened", "app": package, "mode": 'mobile'}
    else:
        return {"status": "opened", "app": package, "mode": 'mobile'}



@app.get("/close/{package}")
def close_app(package: str):
    if sys.platform.startswith("linux"):
        return {"status": "closed", "app": package}
    else:
        return {"status": "closed", "app": package}