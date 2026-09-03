class Admin:
    def __init__(self):
        pass
    def adminsignin(self):
            admindict={"email":"amaan@gmail.com","password":"amaan123"}
            email=input("Enter Admin email :")
            for key,value in admindict.items():
                if key=="email":
                    if value==email:
                        password=input("Enter Admin password :")
                        for key,value in admindict.items():
                            if key=="password":
                                if value==password:
                                    print("Admin successfully login.")
                                    break                             
                                else:
                                    print("Incorrect Password")
                                    data.adminsignin()        
                    else:
                        print("Enter a valid admin email .")
                        data.adminsignin()
data=Admin()
data.adminsignin()                     