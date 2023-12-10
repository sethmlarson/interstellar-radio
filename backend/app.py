import socketio
from flask import Flask, render_template
from whitenoise import WhiteNoise

app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app, root="static/", prefix="static/")
sio = socketio.Server()
rooms = {}


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@sio.on("message", namespace="/")
def message(sid, data):
    """Send a message to everyone else in the room."""
    sio.emit("message", data=data, skip_sid=sid)


@sio.on("leave", namespace="/")
def leave(sid, data):
    """Leave a room"""
    for room, clients in rooms.items():
        try:
            clients.remove(sid)
        except ValueError:
            continue


@sio.on("join", namespace="/")
def join(sid, data):
    """Join a room that already exists"""
    try:
        rooms[data].append(sid)
        new_room = False
    except KeyError:
        new_room = True
        rooms[data] = [sid]

    if new_room:
        sio.emit("created", data)
    elif len(rooms[data]) == 2:
        sio.emit("join")


app = socketio.Middleware(sio, app)
