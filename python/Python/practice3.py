import json
import os

# Step 1: Take input
name = input("Enter name: ")
age = int(input("Enter age: "))

new_data = {
    "name": name,
    "age": age
}

file_name = "data2.json"

# Step 2: Check if file exists
if os.path.exists(file_name):
    with open(file_name, "r") as f:
        try:
            data = json.load(f)
        except:
            data = []
else:
    data = []

# Step 3: Append new data
data.append(new_data)

# Step 4: Write back
with open(file_name, "w") as f:
    json.dump(data, f, indent=4)

print("Data added successfully!")