from fastapi import APIRouter, HTTPException
from app.schemas.student import Student
from app.utils.file_handler import read_students, write_students

router = APIRouter()

@router.post("/students")
def create_student(student: Student):
    students = read_students()

    new_id = max([s["id"] for s in students], default=0) + 1

    student_dict = student.model_dump()
    student_dict["id"] = new_id

    students.append(student_dict)
    write_students(students)

    return {"message": "Student saved successfully", "data": student_dict}


@router.get("/students")
def get_students(page: int = 1, limit: int = 3, search: str = "",course: str = ""):
    students = read_students()  

    if search:
        search = search.lower()
        students = [
            s for s in students
            if search in s["fullName"].lower()
            or search in s["email"].lower()
        ]

    if course:
        students = [
            s for s in students
            if (s.get("course") or "").lower() == course.lower()
        ]

    total = len(students)

    start = (page - 1) * limit
    end = start + limit

    paginated_data = students[start:end]

    return {
        "data": paginated_data,
        "total": total,
        "page": page,
        "limit": limit
    }


@router.get("/students/{student_id}")
def get_single_student(student_id: int):
    students = read_students()

    for student in students:
        if student["id"] == student_id:
            return student

    raise HTTPException(status_code=404, detail="Student not found")


@router.put("/students/{student_id}")
def update_student(student_id: int, updated_student: Student):
    students = read_students()

    for index, student in enumerate(students):
        if student["id"] == student_id:
            updated_data = updated_student.model_dump()
            updated_data["id"] = student_id

            students[index] = updated_data
            write_students(students)

            return {"message": "Student updated", "data": updated_data}

    raise HTTPException(status_code=404, detail="Student not found")


@router.delete("/students/{student_id}")
def delete_student(student_id: int):
    students = read_students()

    new_students = [s for s in students if s["id"] != student_id]

    if len(students) == len(new_students):
        raise HTTPException(status_code=404, detail="Student not found")

    write_students(new_students)

    return {"message": "Student deleted"}