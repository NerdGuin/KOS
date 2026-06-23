from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import sys
import subprocess

from wireless import get_wireless_status, scan_wifi_networks
from cameras import camera_stream
from radio import router as radio_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- API GERAL ----

app.include_router(radio_router)

@app.get("/api/system/wireless")
def wireless():
    return get_wireless_status()

@app.get("/api/system/wireless/list")
def wireless_list():
    return scan_wifi_networks()

@app.get("/camera/0")
def camera():
    return camera_stream()