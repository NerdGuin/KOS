from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
import sys
import requests

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


# ---- CONFIG TELA 1024x600 ----
ANDROID_X = 200
ANDROID_Y = 0
ANDROID_W = 824
ANDROID_H = 600

def move_android_window():
    if sys.platform.startswith("linux"):
        import subprocess
        time.sleep(2)
        subprocess.run([
            "wmctrl", "-r", "Waydroid",
            "-e", f"0,{ANDROID_X},{ANDROID_Y},{ANDROID_W},{ANDROID_H}"
        ])
    else:
        pass

@app.get("/open/{package}")
def open_app(package: str):
    if sys.platform.startswith("linux"):
        import subprocess
        subprocess.Popen(["waydroid", "app", "launch", package])
        move_android_window()
        return {"status": "opened", "platform": "linux"}
    else:
        return {"status": "opened", "platform": "windows (simulação)"}

@app.get("/close/{package}")
def close_app(package: str):
    if sys.platform.startswith("linux"):
        import subprocess
        subprocess.Popen(["waydroid", "app", "stop", package])
        return {"status": "closed", "platform": "linux"}
    else:
        return {"status": "closed", "platform": "windows (simulação)"}