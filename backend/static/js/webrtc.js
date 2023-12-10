'use strict';

var peerConnection = null;
var sendChannel = null;
var room = 'hello-world';
var socket = io.connect();
var createdRoom = false;
var roomIsReady = false;
var isStarted = false;
var rtcPeerConnectionConfig = {
  'iceServers': [{
    'urls': 'stun:stun.l.google.com:19302'
  }]
};

// Socket.IO event handlers
socket.on('created', function(room) {
  console.log('received created', room);
  createdRoom = true;
});

socket.on('join', function(room) {
  console.log('received join', room);
  roomIsReady = true;
  maybeConnectPeer();
});

socket.on('message', function(message) {
  console.log('received message', message);
  if (message.type === 'offer') {
    if (!createdRoom && !isStarted) {
      maybeConnectPeer();
    };
    peerConnection.setRemoteDescription(new RTCSessionDescription(message));
    peerConnection.createAnswer().then(
      setLocalAndSendDescription,
      handleCreateAnswerError
    );
  } else if (message.type === 'answer' && isStarted) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(message));
    peerConnection.createAnswer().then(
      setLocalAndSendDescription,
      handleCreateAnswerError
    );
  } else if (message.type === 'candidate' && isStarted) {
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate
    });
    peerConnection.addIceCandidate(candidate);
  } else if (message === 'bye' && isStarted) {
    handleRemoteHangup();
  }
});

window.onbeforeunload = function() {
  socket.emit('left', room);
};

// WebRTC high-level APIs
function createPeerConnection() {
  try {
    peerConnection = new RTCPeerConnection(rtcPeerConnectionConfig);
    sendChannel = peerConnection.createDataChannel('chat', null);
    peerConnection.onicecandidate = handleIceCandidate;
    peerConnection.ondatachannel = handleDataChannel;
  } catch (e) {
    console.log('failed to create peer connection', e.message);
    return;
  }
};

function maybeConnectPeer() {
  if (!isStarted && roomIsReady) {
    createPeerConnection();
    isStarted = true;
    if (createdRoom) {
      peerConnection.createOffer(setLocalAndSendDescription, handleCreateOfferError);
    };
  };
};

function setLocalAndSendDescription(description) {
  // Ping our description to others
  peerConnection.setLocalDescription(description);
  socket.emit('message', description);
}

// WebRTC event handlers
function handleCreateOfferError(event) {
  console.log('createOffer() error', event);
};

function handleCreateAnswerError(event) {
  console.log('createAnswer() error', event);
};

function handleIceCandidate(event) {
  if (event.candidate) {
    socket.emit('message', {
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate
    });
  } else {
    console.log('end of candidates');
  }
};

function handleDataChannel(event) {
  var receiveChannel = event.channel;
  receiveChannel.onmessage = handleReceiveMessage;
};

function handleReceiveMessage(event) {
  console.log('received rtc message', event.data);
  document.getElementById("message").innerHTML = event.data;
};

// Join the room!
document.getElementById("in").addEventListener("input", function(event) {sendChannel.send(event.target.value)});
socket.emit('create or join', room);
