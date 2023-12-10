# Interstellar Radio

Framework to connect the Game Boy to the internet.
This project is a genericization of [Stacksmashing's excellent work creating online multiplayer for Tetris](https://www.youtube.com/watch?v=KtHu693wE9o).

## How it will work

- User connects device via USB. This prompts the browser to visit [interstellar-radio.link](https://interstellar-radio.link) and to connects via WebUSB.
- Firmware forwards data between WebUSB and the Game Boy Link Cable (SPI).
- WebUSB and framework implement the Interstellar Radio protocol to send and receive control and data messages.
- Web frontend takes the configuration from Interstellar Radio and configures WebRTC or Websockets appropriately.

## Components

- Game Boy, Game Boy Color, Game Boy Advance, or Analogue Pocket
- Compatible game cartridge (doesn't work with any Link Cable Game Boy cartridge)
- Custom board for Link Cable -> Raspberry Pi, flashed with Interstellar Radio firmware
  - [Original store by Stacksmashing](https://stacksmashing.gumroad.com/l/gb-link) (currently unavailable)
  - [Etsy store selling kits](https://www.etsy.com/listing/1517956485/usb-to-gameboy-link-adapter-for-pi-pico)
  - [Open source hardware](https://github.com/agtbaskara/game-boy-pico-link-board)
- microUSB -> USB cable with power and data
- Browser that supports WebUSB (e.g. Chrome)

## Licenses

- Web Backend (`backend/`) - GPL-3.0
- Firmware (`firmware/`) - GPL-3.0
- PICO SDK (`firmware/pico-sdk/`) - BSD-3-Clause
- Framework (`framework/`) - MIT
- GBA Link Connection in C (`framework/gba-link-connection-c`) - MIT
