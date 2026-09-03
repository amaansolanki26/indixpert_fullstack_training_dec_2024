from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from jose.utils import base64url_decode
import requests
import os
from dotenv import load_dotenv
from jose import jwk
import time

load_dotenv()

security = HTTPBearer()

COGNITO_REGION = os.getenv("COGNITO_REGION")
USER_POOL_ID = os.getenv("USER_POOL_ID")
CLIENT_ID = os.getenv("CLIENT_ID")

ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}"
JWKS_URL = f"{ISSUER}/.well-known/jwks.json"


def get_jwks():
    return requests.get(JWKS_URL).json()


def verify_jwt_token(token: str):
    jwks = get_jwks()

    headers = jwt.get_unverified_header(token)
    kid = headers["kid"]

    key = next(k for k in jwks["keys"] if k["kid"] == kid)
    public_key = jwk.construct(key)

    message, encoded_signature = token.rsplit('.', 1)
    decoded_signature = base64url_decode(encoded_signature.encode('utf-8'))

    if not public_key.verify(message.encode("utf8"), decoded_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")

    payload = jwt.get_unverified_claims(token)

    if payload.get("exp") < time.time():
        raise HTTPException(status_code=401, detail="Token expired")

    return payload


def verify_token(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    access_token = credentials.credentials

    try:
        auth_payload = verify_jwt_token(access_token)

        if auth_payload.get("token_use") != "access":
            raise HTTPException(status_code=401, detail="Invalid access token")

        if auth_payload.get("client_id") != CLIENT_ID:
            raise HTTPException(status_code=401, detail="Invalid client_id")

        if auth_payload.get("iss") != ISSUER:
            raise HTTPException(status_code=401, detail="Invalid issuer")

        id_token = request.headers.get("x-id-token")
        user_payload = {}

        if id_token:
            user_payload = verify_jwt_token(id_token)

            if user_payload.get("token_use") != "id":
                raise HTTPException(status_code=401, detail="Invalid ID token")

            if user_payload.get("aud") != CLIENT_ID:
                raise HTTPException(status_code=401, detail="Invalid audience")

            if user_payload.get("iss") != ISSUER:
                raise HTTPException(status_code=401, detail="Invalid issuer")

        return {
            "auth": auth_payload,
            "user": user_payload   
        }

    except JWTError as e:
        print("JWT ERROR:", str(e))
        raise HTTPException(status_code=401, detail="Invalid or expired token")