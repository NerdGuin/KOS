import sys
import subprocess


def get_wireless_status():
    status = {
        "wifi_enabled": False,
        "wifi_connected": False,
        "connection_type": None,  # wifi / ethernet / none
        "bluetooth_enabled": False,
        "bluetooth_connected": False
    }

    if sys.platform.startswith("linux"):

        # ---------------------------
        # 🌐 REDE (WIFI OU CABO)
        # ---------------------------
        try:
            output = subprocess.check_output(
                ["nmcli", "-t", "-f", "TYPE,STATE", "device"],
                text=True
            )

            for line in output.splitlines():
                dev_type, state = line.split(":")

                if state == "connected":
                    status["wifi_connected"] = True
                    status["wifi_enabled"] = True
                    status["connection_type"] = dev_type  # wifi / ethernet
                    break

        except Exception:
            pass

        # ---------------------------
        # 📶 WIFI (estado geral)
        # ---------------------------
        try:
            wifi_state = subprocess.check_output(
                ["nmcli", "radio", "wifi"],
                text=True
            ).strip()

            status["wifi_enabled"] = wifi_state.lower() == "enabled"

        except Exception:
            pass

        # ---------------------------
        # 🔵 BLUETOOTH
        # ---------------------------
        try:
            bt_state = subprocess.check_output(
                ["bluetoothctl", "show"],
                text=True
            )

            status["bluetooth_enabled"] = "Powered: yes" in bt_state

            bt_conn = subprocess.check_output(
                ["bluetoothctl", "info"],
                text=True
            )

            status["bluetooth_connected"] = "Connected: yes" in bt_conn

        except Exception:
            pass

    else:
        # 💻 Ambiente de desenvolvimento (Windows, etc)
        status["wifi_enabled"] = True
        status["wifi_connected"] = True
        status["connection_type"] = "wifi"
        status["bluetooth_enabled"] = False
        status["bluetooth_connected"] = False

    return status