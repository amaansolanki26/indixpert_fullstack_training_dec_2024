import json
import os

BASE_DIR = os.path.dirname(__file__)
FILE_NAME = os.path.join(BASE_DIR, "user.json")

def read_user():
    if not os.path.exists(FILE_NAME):
        return []

    try:
        with open(FILE_NAME, "r") as file:
            return json.load(file)
    except json.JSONDecodeError:
        return []

def write_user(data):
    with open(FILE_NAME, "w") as file:
        json.dump(data, file, indent=4)