# Binary Protocol

This document describes the binary protocol between the Game Boy cartridge and JavaScript after reading data from WebUSB.
This protocol design is a work-in-progress.

## Requirements

- Protocol must be byte-wise to support all Game Boy flavors. Game Boy Advance 
  sends two bytes per "write", but DMG and Color send one byte per write.
- 0x00 and 0xFF are illegal due to Game Boy Link Cable Protocol.
  Game Boy Advance is slightly more allowing, only disallowed from sending 0xFFFF.
- Figure out largest frame size, likely from looking at total bandwidth?
- Game Boys use a lot of single-byte data, minimize number of bytes for that sort of data.

## Specification

There are two frame types, data and control:

- Data (bits `0XXXXXXX`) where `XXXXXXX` is the byte between `0x01` and `0x76`.
- Data (bits `1000XXXX`) where `XXXX` is the number of `0x00` bytes.
- Data (bits `1001XXXX`) where `XXXX` is the number of `0xFF` bytes.
- Data (bits `101XXXXX`) where `XXXXX` is the length of raw bytes.
- Control (bits `11XXXXXX`) where `XXXXXX` is the control frame type.
  - (0x0) `000000`: Padding or waiting for frame (Skip this byte, used by GBA for padding)
  - (0x1) `000001`: Waiting for non-local connection.
  - (0x2) `000010`: Exchange cartridge information.
  - (0x20-0x3F) `11XXXX`: Error state (`XXXX`)
