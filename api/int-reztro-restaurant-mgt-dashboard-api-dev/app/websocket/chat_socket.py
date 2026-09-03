from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.db.database import SessionLocal
from app.schemas.message_schemas import CreateMessageSchema
from app.services.message_service import create_message_service
from app.services.message_conversation_service import update_conversation_online_status_service
from app.websocket.manager import manager
from app.security.jwt import verify_token_from_query   
router = APIRouter()


@router.websocket("/ws/chat/{conversation_id}")
async def websocket_chat(
    websocket: WebSocket,
    conversation_id: int,
):

    db = SessionLocal()

    try:
        # Get token from query params
        token = websocket.query_params.get("token")

        if not token:
            await websocket.close(code=4001, reason="Missing authentication token")
            return

        # Verify Cognito Token
        await verify_token_from_query(token)

        await manager.connect(
            conversation_id,
            websocket,
        )

        update_conversation_online_status_service(
            db,
            conversation_id,
            True,
        )

        while True:

            data = await websocket.receive_json()

            payload = CreateMessageSchema(**data)

            message = create_message_service(
                db,
                payload,
            )

            await manager.broadcast(
                conversation_id,
                {
                    "event": "new_message",
                    "data": message,
                },
            )

    except WebSocketDisconnect:
        pass

    except HTTPException as e:
        await websocket.close(code=4001, reason=e.detail)

    except SQLAlchemyError as e:
        db.rollback()
        await manager.send_personal_message(
            websocket,
            {
                "event": "error",
                "message": str(getattr(e, "orig", e)),
            },
        )

    except Exception as e:
        await manager.send_personal_message(
            websocket,
            {
                "event": "error",
                "message": str(e),
            },
        )

    finally:
        try:
            manager.disconnect(
                conversation_id,
                websocket,
            )
        except Exception:
            pass

        try:
            update_conversation_online_status_service(
                db,
                conversation_id,
                False,
            )
        except Exception:
            pass

        db.close()