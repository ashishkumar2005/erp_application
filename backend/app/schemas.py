from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from .models import UserRole

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.STUDENT
    department: Optional[str] = None
    roll_number: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str = Field(alias="_id")
    is_active: int
    created_at: datetime

    class Config:
        populate_by_name = True

class UserRoleUpdate(BaseModel):
    role: UserRole

class ActivityLogBase(BaseModel):
    action: str
    details: Optional[str] = None

class ActivityLog(ActivityLogBase):
    id: str = Field(alias="_id")
    user_id: str
    timestamp: datetime

    class Config:
        populate_by_name = True

# Student Specific Schemas
class StudentProfile(BaseModel):
    user_id: str
    roll_number: str
    contact_number: str
    address: Optional[str] = None
    registered_courses: List[str]
    current_semester: int

class AcademicSubject(BaseModel):
    code: str
    name: str
    credits: int
    semester: int
    department: Optional[str] = None
    instructor: str
    faculty_details: Optional[str] = None
    curriculum: Optional[List[str]] = None
    semester_overview: Optional[str] = None

class AttendanceRecord(BaseModel):
    user_id: str
    user_name: Optional[str] = None
    roll_number: Optional[str] = None
    subject_code: str
    subject_name: str
    total_lectures: int
    lectures_attended: int
    percentage: float
    department: Optional[str] = None

class PlacementDrive(BaseModel):
    company_name: str
    role: str
    package: str
    eligibility: str
    deadline: datetime
    status: str # 'open', 'closed', 'ongoing'
    job_description: Optional[str] = None

class PlacedCompanyDetail(BaseModel):
    company_name: str
    total_placed: int
    avg_package: str
    location: str
    description: str

class SubjectMark(BaseModel):
    subject_code: str
    subject_name: str
    marks: int
    total_marks: int
    grade: str

class SemesterResult(BaseModel):
    semester: int
    sgpa: float
    subjects: List[SubjectMark]

class AlertDetail(BaseModel):
    title: str
    severity: str # 'critical', 'warning', 'info'
    description: str
    timestamp: datetime

class SystemStats(BaseModel):
    total_users: int
    active_sessions: int
    api_latency: str
    db_health: str
    storage_status: str
    total_students: int
    total_faculty: int
    placement_rate: str

class AnalyticsData(BaseModel):
    department_readiness: List[dict]
    hiring_trends: List[dict]
    performance_distribution: List[dict]
