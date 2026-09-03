import json

data = {
    "name": "Alice",
    "age": 25,
    "city": "Jodhpur"
}

with open("data.json", "w") as f:
    json.dump(data, f, indent=4)