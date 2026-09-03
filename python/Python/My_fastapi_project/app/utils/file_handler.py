import json
import os

FILE_NAME = "students.json"

def read_students():
    if not os.path.exists(FILE_NAME):
        return []

    try:
        with open(FILE_NAME, "r") as file:
            return json.load(file)
    except json.JSONDecodeError:
        return []

def write_students(data):
    with open(FILE_NAME, "w") as file:
        json.dump(data, file, indent=4)