from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import sys
import subprocess

from wireless import get_wireless_status, scan_wifi_networks
from cameras import camera_stream

app = FastAPI()

open_apps = {}
app_configs = {
    "youtube": {
        "url": "https://youtube.com",
        "title": "YouTube",
        "user_data_dir": "/tmp/chromium-app-youtube",
    }
}

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


def activate_window(title: str):
    if not sys.platform.startswith("linux"):
        return

    try:
        output = subprocess.check_output([
            "xdotool",
            "search",
            "--name",
            title,
        ])
        window_ids = [line.strip() for line in output.decode().splitlines() if line.strip()]
        if not window_ids:
            return

        window_id = window_ids[0]
        subprocess.call(["xdotool", "windowmap", window_id])
        subprocess.call(["xdotool", "windowraise", window_id])
        subprocess.call(["xdotool", "windowfocus", window_id])
        subprocess.call(["xdotool", "windowactivate", window_id])
    except subprocess.CalledProcessError:
        pass
    except Exception:
        pass


@app.get("/open/{package}")
def open_app(package: str):
    config = app_configs.get(package)
    if not config:
        return {"status": "error", "error": "App desconhecido"}

    process = open_apps.get(package)
    if process and process.poll() is None:
        activate_window(config["title"])
        return {"status": "opened", "reused": True}

    try:
        process = subprocess.Popen([
            "chromium",
            f"--app={config['url']}",
            "--new-window",
            f"--user-data-dir={config['user_data_dir']}",
            "--window-size=1024,500",
            "--window-position=-5,-22",
            "--disable-infobars"
        ])
        open_apps[package] = process
        time.sleep(1)
        activate_window(config["title"])
        return {"status": "opened"}
    except Exception as e:
        return {"status": "error", "error": str(e)}



@app.get("/close/{package}")
def close_app(package: str):
    process = open_apps.pop(package, None)
    if process and process.poll() is None:
        try:
            process.terminate()
            process.wait(timeout=3)
        except Exception:
            process.kill()
    return {"status": "closed", "app": package}