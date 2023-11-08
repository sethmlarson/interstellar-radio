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

## Using the firmware with WebUSB

```
$ lsusb
...
Bus 003 Device 006: ID cafe:4011 stacksmashing USB to Game Boy Link Cable
...
# Note: 'cafe' for Vendor and '4011' for Product.

$ sudo bash -c 'echo SUBSYSTEM==\"usb\", ATTR{idVendor}==\"cafe\", ATTR{idProduct}==\"4011\", MODE=\"0664\", GROUP=\"plugdev\" > /etc/udev/rules.d/50-microbit.rules'
$ sudo useradd -a -G plugdev
$ sudo udevadm control --reload-rules
```

After these commands you must restart your computer for the addition of the `plugdev` group to take effect.
