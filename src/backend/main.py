from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
import sys
import requests
import subprocess

from wireless import get_wireless_status, scan_wifi_networks
from cameras import camera_stream

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- API GERAL ----

@app.get("/api/system/wireless")
def wireless():
    return get_wireless_status()

@app.get("/api/system/wireless/list")
def wireless_list():
    return scan_wifi_networks()

@app.get("/camera/0")
def camera():
    return camera_stream()


@app.get("/open/{package}")
def open_app(package: str):
    try:
        subprocess.Popen([
            "chromium",
            "--app=https://youtube.com",
            "--new-window",
            "--user-data-dir=/tmp/chromium-app",
            "--window-size=1024,500",
            "--window-position=0,0"
        ])

        time.sleep(1)

        # força posição + tamanho (caso o WM ignore)
        subprocess.call([
            "wmctrl",
            "-r", "YouTube",
            "-e", "0,0,0,1024,500"
        ])

        return {"status": "opened"}
    except Exception as e:
        return {"status": "error", "error": str(e)}



@app.get("/close/{package}")
def close_app(package: str):
    if sys.platform.startswith("linux"):
        return {"status": "closed", "app": package}
    else:
        return {"status": "closed", "app": package}