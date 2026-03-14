if [ "$(tty)" = "/dev/tty1" ]; then
    export XDG_RUNTIME_DIR=/run/user/$(id -u)

    weston &

    sleep 3

    /home/rock/kos/start.sh >> /home/rock/kos/kos.log 2>&1
f