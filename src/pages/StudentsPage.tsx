import StudentRegistration from '@/components/StudentRegistration';
import { useState, useEffect } from 'react';
import { Student } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleStudentRegistration = (student: Student) => {
    setStudents((prev) => [...prev, student]);
    console.log('New student registered:', student);
  };

  const handleStudentDelete = (studentId: string) => {
    setStudents((prev) => prev.filter(student => student.id !== studentId));
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