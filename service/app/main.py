import logging
import os
import signal
import sys
import time

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

start_time = time.time()
logger.info("Initalized at %s", start_time)

app = FastAPI()


@app.get("/heartbeat/")
def heartbeat_endpoint():
    hearbeat: dict[str, int | float | str] = {
        "status": "ok",
        "time": time.time(),
        "uptime": time.time() - start_time,
        "PID": os.getpid(),
    }

    return hearbeat


# make a websocket endpoint for demo purposes
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            data = await websocket.receive_text()
            python_version = f"Python {sys.version_info.major}.{sys.version_info.minor}"
            await websocket.send_text(
                f"Message text was: {data}, and server is running on {python_version}"
            )
        except WebSocketDisconnect:
            break


# add a route to shutdown server
@app.get("/shutdown/")
def shutdown():
    os.kill(os.getpid(), signal.SIGTERM)
    return "Shutting down..."
