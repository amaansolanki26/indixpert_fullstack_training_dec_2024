import json
import uuid

class Staffsingup:
    
    path=r"C:\Indixpert\Restaurent_Management_System_December_Python\Src\Database\staffdata.json"
    def __init__(self):
        self.stafflist=[]
    
    def signup(self):

        try:
            with open(data.path,"r") as file:
                self.stafflist=json.load(file)
        except Exception as e:
            self.stafflist=[]  

        idd=uuid.uuid4()
        name=input("Enter your name :")    
        staffdict={
            "id":name+"_"+str(idd)[:3],
            "name":name,
            "contact":int(input("Enter your contact :")),
            "email":input("Enter your email :"),
            "password":input("Enter your password :")
            }
        self.stafflist.append(staffdict)
                  
        with open(data.path,"w") as file:
            file.write(json.dumps(self.stafflist,indent=4))
       
        print("Staff successfully signed up.")

data=Staffsingup()
data.signup()     
