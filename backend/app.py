import socketio
from flask import Flask

app = Flask(__name__)
sio = socketio.Server()
rooms = {}


@sio.on("message", namespace="/")
def message(sid, data):
    sio.emit("message", data=data, skip_sid=sid)

@sio.on("left", namespace="/")
def left(sid, data):
    for room, clients in rooms.items():
        try:
            clients.remove(sid)
        except ValueError:
            continue

@sio.on("create or join", namespace="/")
def create_or_join(sid, data):
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


@app.route("/", methods=["GET"])
def index():
    with open("index.js") as f:
        return f"""
        <head>
        <style>* {{font-size: 2rem;}}</style>
        </head>
        <body>
        <input id="in"></input>
        <div id="message"></div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.js" integrity="sha512-zoJXRvW2gC8Z0Xo3lBbao5+AS3g6YWr5ztKqaicua11xHo+AvE1b0lT9ODgrHTmNUxeCw0Ry4BGRYZfXu70weg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script>
        {f.read()}
        </script>
        </body>
        """


app = socketio.Middleware(sio, app)
