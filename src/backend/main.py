from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import sys
import subprocess

from wireless import get_wireless_status, scan_wifi_networks
from cameras import camera_stream
from radio import router as radio_router

app = FastAPI()

open_apps = {}
app_configs = {
    "youtube": {
        "url": "https://m.youtube.com/?persist_app=1&app=m",
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

app.include_router(radio_router)


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


def activate_window(title: str, pid: int = None):
    if not sys.platform.startswith("linux"):
        return

    windows = []
    try:
        if pid is not None:
            output = subprocess.check_output([
                "xdotool",
                "search",
                "--pid",
                str(pid),
            ])
            windows = [line.strip() for line in output.decode().splitlines() if line.strip()]
    except subprocess.CalledProcessError:
        windows = []

    if not windows:
        try:
            output = subprocess.check_output([
                "xdotool",
                "search",
                "--name",
                title,
            ])
            windows = [line.strip() for line in output.decode().splitlines() if line.strip()]
        except subprocess.CalledProcessError:
            windows = []

    if not windows:
        return

    window_id = windows[0]
    for cmd in [
        ["xdotool", "windowmap", window_id],
        ["xdotool", "windowraise", window_id],
        ["xdotool", "windowfocus", window_id],
        ["xdotool", "windowactivate", window_id],
    ]:
        try:
            subprocess.call(cmd)
        except Exception:
            pass


@app.get("/open/{package}")
def open_app(package: str):
    config = app_configs.get(package)
    if not config:
        return {"status": "error", "error": "App desconhecido"}

    process = open_apps.get(package)
    if process and process.poll() is None:
        activate_window(config["title"], process.pid)
        return {"status": "opened", "reused": True}

    try:
        process = subprocess.Popen([
            "chromium",
            f"--app={config['url']}",
            "--new-window",
            f"--user-data-dir={config['user_data_dir']}",
            "--window-size=944,600",
            "--window-position=80,-24",
            "--disable-infobars"
        ])
        open_apps[package] = process
        time.sleep(1)
        activate_window(config["title"], process.pid)
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