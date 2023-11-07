# Interstellar Radio

## Principles

- Firmware is dumb, sends stuff to WebRTC based on instructions.
- Library needs to handle direct connection /OR/ Dream Link device opaquely to game.
- Some unmodified games may be supported, but will need to be implemented in WebUSB?

## Components

- GameBoy
- Game Link Cable
- Custom board for Link Cable -> RPI
- Raspberry Pi Pico w/ Firmware
- microUSB -> USB cable
- Computer with WebUSB compatible browser
- Website running WebUSB, WebRTC for connecting
- Server serving the web frontend and WebRTC matcher

## Protocol

- 0x00 and 0xFF are illegal
- Commands:
  - Send data to all players
  - Get game state (waiting, )
  - Get number of players
  - Get player name?

- Send data: 0XXXXXXX YYYYYYYY (X length of data in 2-byte frames, Y reserved)
- 

## Game Config

- Protocol major version (1 byte)
- Max connections 1 byte ( + 1, so 0x00 is )
- Game Group ID 4 bytes (game compatibility)
- Cart name (16 bytes)