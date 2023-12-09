#!/bin/bash

git clone --recurse-submodules https://github.com/raspberrypi/pico-sdk
rm gbusb.*
cp pico-sdk/external/pico_sdk_import.cmake .
PICO_SDK_PATH=pico-sdk cmake .
make
