
const fromHexString = hexString =>
    new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));



function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
  }

const toHexString = bytes =>
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

class Serial {
    constructor() {
        this.buffer = [];
        this.send_active = false;
    }

    static getPorts() {
        return navigator.usb.getDevices().then(devices => {
            return devices;
        });
    }

    static requestPort() {
        const filters = [
            { 'vendorId': 0x239A }, // Adafruit boards
            { 'vendorId': 0xCAFE }, // TinyUSB example
        ];
        return navigator.usb.requestDevice({ 'filters': filters }).then(
            device => {
                return device;
            }
        );
    }

    getEndpoints(interfaces) {
        interfaces.forEach(element => {
            var alternates = element.alternates;
            alternates.forEach(elementalt => {
                if (elementalt.interfaceClass === 0xFF) {
                    console.log("Interface number:");
                    console.log(element.interfaceNumber);
                    this.ifNum = element.interfaceNumber;
                    elementalt.endpoints.forEach(elementendpoint => {
                        if (elementendpoint.direction === "out") {
                            console.log("Endpoint out: ");
                            console.log(elementendpoint.endpointNumber);
                            this.epOut = elementendpoint.endpointNumber;
                        }

                        if (elementendpoint.direction === "in") {
                            console.log("Endpoint in: ");
                            console.log(elementendpoint.endpointNumber);
                            this.epIn = elementendpoint.endpointNumber;
                        }
                    });
                }
            })
        })
    }

    getDevice() {
        let device = null;
        this.ready = false;
        return new Promise((resolve, reject) => {
            Serial.requestPort().then(dev => {
                console.log("Opening device...");
                device = dev;
                this.device = device;
                return dev.open();
            }).then(() => {
                console.log("Selecting configuration");
                return device.selectConfiguration(1);
            }).then(() => {
                console.log("Getting endpoints")
                this.getEndpoints(device.configuration.interfaces);
            }).then(() => {
                console.log("Claiming interface");
                return device.claimInterface(this.ifNum);
            }).then(() => {
                console.log("Select alt interface");
                return device.selectAlternateInterface(this.ifNum, 0);
            }).then(() => {
                console.log("Control Transfer Out");
                return device.controlTransferOut({
                    'requestType': 'class',
                    'recipient': 'interface',
                    'request': 0x22,
                    'value': 0x01,
                    'index': this.ifNum
                })
            }).then(() => {
                console.log("Ready!");
                this.ready = true;
                this.device = device;
                resolve();
            })
        });
    }

    read(num) {
        return new Promise((resolve, reject) => {
            this.device.transferIn(this.epIn, num).then(result => {
                var dataAsHex = buf2hex(result.data.buffer);
                console.log(">>> " + dataAsHex);
                resolve(result);
            },
            error => {
                console.log("Error");
                console.log(error);
                reject(error);
            });
        });
    }

    readHex(num) {
        return new Promise((resolve, reject) => {
            this.read(num).then(result => {
                resolve(buf2hex(result.data.buffer));
            },
            error => {
                reject(error);
            })
        });
    }

    readString() {
        this.device.transferIn(this.epIn, 64).then(result => {
            var textDecoder = new TextDecoder();
            console.log(">>> " + textDecoder.decode(result.data));
            var element = document.getElementById("data");
            element.textContent += textDecoder.decode(result.data);
        },
            error => {
                console.log("ReadError");
                console.log(error);
            })
    }

    sendString(str) {
        return this.send(new TextEncoder('utf-8').encode(str));
    }

    sendHex(str) {
        return this.send(fromHexString(str));
    }

    send(data) {
        return this.device.transferOut(this.epOut, data);
    }
}

ser = null;
function connectViaWebusb () {
  // simple loop that shows that data is flowing.
  function readFromUsb() {
    ser.readString();
    setTimeout(readFromUsb, 10);
  }

    ser = new Serial();
    ser.getDevice().then(() => {
      console.log("USB connection successful");
      readFromUsb();
    }).catch(c => {
      console.log("USB connection not successful:", c);
    });
}