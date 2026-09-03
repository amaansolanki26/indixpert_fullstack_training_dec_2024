import json
class Signinstaff:
    path=r"C:\Indixpert\Restaurent_Management_System_December_Python\Src\Database\staffdata.json"
    
    def __init__(self):
        pass
    
    def readingstafflist(self):
        with open(data.path,'r') as file:
            return json.load(file)
    def signinstaff(self):
        liststaff=data.readingstafflist()

        email=input("Enter staff email :")

        for liststaffdata in liststaff:            
            for key,value in liststaffdata.items():
                if key=="email":
                    if value==email:
                        password=input("Enter staff password :")
                        for key,value in liststaffdata.items():
                            if key=="password":
                                if value==password:
                                    print("Staff successfully login.")
                                    break                             
                                else:
                                    print("Incorrect Password")
                                    data.signinstaff()        
                    else:
                        print("Enter a valid staff email .")
                        data.signinstaff()
                        

data=Signinstaff()
data.readingstafflist()
data.signinstaff()