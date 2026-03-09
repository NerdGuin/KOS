from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import time
import sys

app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

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

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

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