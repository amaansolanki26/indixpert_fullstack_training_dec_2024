import json

name = input("Enter name: ")
age = int(input("Enter age: "))

new_data = {
    "name": name,
    "age": age
}

try:
    with open("data1.json", "r") as f:
        data = json.load(f)
except:
    data = []

data.append(new_data)

with open("data1.json", "w") as f:
    json.dump(data, f, indent=4)

print("Data added successfully!")