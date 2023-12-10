# Interstellar Radio

Framework to connect the Game Boy to the internet.
This project is a genericization of [Stacksmashing's excellent work creating online multiplayer for Tetris](https://www.youtube.com/watch?v=KtHu693wE9o).

## How it works

- Firmware forwards data between WebUSB and the Game Boy Link Cable (SPI).
- WebUSB and framework implement the Interstellar Radio protocol to send and receive arbitrary packetized message data.
- Web frontend takes the configuration from Interstellar Radio (P2P WebRTC or Server WebRTC)
  and configures WebRTC appropriately.

## Components

- Game Boy or Analogue Pocket
- Compatible game cartridge
- Game Link Cable
- Custom board for Link Cable -> RPI
- Raspberry Pi Pico w/ Firmware
- microUSB -> USB cable
- Computer with WebUSB compatible browser
- Website running WebUSB, WebRTC for connecting
- Server serving the web frontend
- Server serving the WebRTC game API

## Protocol

- Protocol must be byte-wise to support all Game Boy flavors. Game Boy Advance 
  sends two bytes per "write", but DMG and Color send one byte per write.
- 0x00 and 0xFF are illegal due to Game Boy Link Cable Protocol.
  Game Boy Advance is slightly more allowing, only disallowed from sending 0xFFFF.
- Figure out largest frame size, likely from looking at total bandwidth?

There are two frame types, data and control:

- Data (bits `0EXXXXXX`) where `E` is the end flag and `XXXXXX` is the length of the frame in bytes.
- Data (bits `1001EXXX`) where `E` is the end flag and `XXX` is the length of `0x00` bytes to send.
- Data (bits `1010EXXX`) where `E` is the end flag and `XXX` is the length of `0xFF` bytes to send.
- Control (bits `10XXXXXX`) where `XXXXXX` is the control frame type.
  - (0x0) `000000`: Padding or waiting for frame (Skip this byte, used by GBA for padding)
  - (0x1) `000001`: Waiting for non-local connection.
  - (0x2) `000010`: Exchange cartridge information.
  - (0x20-0x3F) `11XXXX`: Error state (`XXXXX`)

## Licenses

- Web Backend (`backend/`) - GPL-3.0
- Firmware (`firmware/`) - GPL-3.0
- PICO SDK (`firmware/pico-sdk/`) - BSD-3-Clause
- Framework (`framework/`) - MIT
- GBA Link Connection in C (`framework/gba-link-connection-c`) - MIT
