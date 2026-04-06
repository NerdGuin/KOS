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

@app.get("/api/system/wireless")
def get_wireless_status():
    status = {
        "wifi_enabled": False,
        "wifi_connected": False,
        "bluetooth_enabled": False,
        "bluetooth_connected": False
    }

    if sys.platform.startswith("linux"):
        import subprocess
        # Wifi
        try:
            wifi_state = subprocess.check_output(
                ["nmcli", "radio", "wifi"], text=True
            ).strip()

            status["wifi_enabled"] = wifi_state.lower() == "enabled"

            wifi_conn = subprocess.check_output(
                ["nmcli", "-t", "-f", "ACTIVE", "dev", "wifi"], text=True
            )

            status["wifi_connected"] = "yes" in wifi_conn

        except Exception:
            pass

        # Bluetooth
        try:
            bt_state = subprocess.check_output(
                ["bluetoothctl", "show"], text=True
            )

            status["bluetooth_enabled"] = "Powered: yes" in bt_state

            bt_conn = subprocess.check_output(
                ["bluetoothctl", "info"], text=True
            )

            status["bluetooth_connected"] = "Connected: yes" in bt_conn

        except Exception:
            pass

        return status
    else:
        # Windows Simulation
        status["wifi_enabled"] = True
        status["wifi_connected"] = True
        status["bluetooth_enabled"] = False
        status["bluetooth_connected"] = False
        return status

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