from collections import defaultdict
from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.active_connections = defaultdict(list)

    async def connect(
        self,
        conversation_id: int,
        websocket: WebSocket
    ):
        await websocket.accept()

        self.active_connections[conversation_id].append(websocket)

    def disconnect(
        self,
        conversation_id: int,
        websocket: WebSocket
    ):
        if websocket in self.active_connections[conversation_id]:
            self.active_connections[conversation_id].remove(websocket)

        if len(self.active_connections[conversation_id]) == 0:
            del self.active_connections[conversation_id]

    async def send_personal_message(
        self,
        websocket: WebSocket,
        data: dict
    ):
        await websocket.send_json(data)

    async def broadcast(
        self,
        conversation_id: int,
        data: dict
    ):
        if conversation_id not in self.active_connections:
            return

        disconnected = []

        for ws in self.active_connections[conversation_id]:

            try:

                await ws.send_json(data)

            except Exception:

                disconnected.append(ws)

        for ws in disconnected:

            self.disconnect(conversation_id, ws)


manager = ConnectionManager()