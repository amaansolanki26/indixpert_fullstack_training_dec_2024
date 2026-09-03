student1={}
qualificationdict={}
student2={}
list=[]

student1["id"]=int(input("Please enter student id:"))
student1["name"]=input("Please enter student name:")
student1["experience"]=input("Please enter student experience:")
student1["skills"]=input("please enter skills (use:  ,  ):")
qualificationdict["qualification name"]=input("please enter qualification name :")
qualificationdict["passing year"]=input("please enter passing year :")

list.append(student1)
list.append(qualificationdict)
qualificationdict={}
qualificationdict["qualification name"]=input("please enter qualification name :")
qualificationdict["passing year"]=input("please enter passing year :")
list.append(qualificationdict)
qualificationdict={}

student2["id"]=int(input("Please enter student id:"))
student2["name"]=input("Please enter student name:")
student2["experience"]=input("Please enter student experience:")
student2["skills"]=input("please enter skills (use:  ,  ):")
qualificationdict["qualification name"]=input("please enter qualification name :")
qualificationdict["passing year"]=input("please enter passing year :")

list.append(student2)
list.append(qualificationdict)

print(list)