if [ "$(tty)" = "/dev/tty1" ]; then
  exec weston >> /home/rock/kos/weston.log 2>&1
fi