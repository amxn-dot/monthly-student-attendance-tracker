import DashboardLayout from "@/components/DashboardLayout";
import StudentRegistration from "@/components/StudentRegistration";
import { Student } from "@/types";
import { useState, useEffect } from "react";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);

  const handleStudentRegistration = (student: Student) => {
    const updatedStudents = [...students, student];
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  const handleStudentDelete = (studentId: string) => {
    const updatedStudents = students.filter(student => student.id !== studentId);
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  return (
    <DashboardLayout>
      <StudentRegistration
        onRegister={handleStudentRegistration}
        onDelete={handleStudentDelete}
        students={students}
      />
    </DashboardLayout>
  );
}