# Raspberry Pi Pico firmware

Forked from Stacksmashing's [gb-link-firmware](https://github.com/stacksmashing/gb-link-firmware) project which is licensed under GPL-3.0.
License is included in the file `LICENSE`.

## Compiling from source

On Ubuntu:

```
$ sudo apt-get install build-essential cmake gcc-arm-none-eabi \
    libnewlib-arm-none-eabi libstdc++-arm-none-eabi-newlib

$ ./build.sh
```

Compiled firmware will be built to `gbusb.uf2`.
