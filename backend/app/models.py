from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    FACULTY = "faculty"
    STUDENT = "student"

class Department(str, Enum):
    CS = "Computer Science"
    IT = "Information Technology"
    ECE = "Electronics"
    MECH = "Mechanical"
