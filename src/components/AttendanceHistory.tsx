import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student, AttendanceRecord, MonthlyAttendance } from '@/types';
import { AttendanceCalendar } from './attendance/AttendanceCalendar';
import { AttendanceTable } from './attendance/AttendanceTable';

interface AttendanceHistoryProps {
  students: Student[];
  attendance: AttendanceRecord[];
}

export default function AttendanceHistory({
  students,
  attendance,
}: AttendanceHistoryProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all');
  
  const currentMonth = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
  const currentYear = selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();

  const uniqueClasses = Array.from(new Set(students.map(student => student.class))).sort();

  const filteredStudents = selectedClass === 'all'
    ? students
    : students.filter(student => student.class === selectedClass);

  const getAttendanceForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return attendance.filter((record) => record.date === dateStr);
  };

  const calculateMonthlyAttendance = (studentId: string): MonthlyAttendance => {
    const monthlyRecords = attendance.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear &&
        record.studentId === studentId
      );
    });

    const present = monthlyRecords.filter((record) => record.isPresent).length;
    const total = monthlyRecords.length;
    const percentage = total > 0 ? (present / total) * 100 : 0;

    return {
      present,
      total,
      percentage,
    };
  };

  const selectedDateRecords = selectedDate
    ? getAttendanceForDate(selectedDate)
    : [];

  const hasAttendanceForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return attendance.some((record) => record.date === dateStr);
  };

  const monthName = selectedDate?.toLocaleString('default', { month: 'long' });

  console.log('Current attendance records:', attendance);
  console.log('Selected date records:', selectedDateRecords);
  console.log('Filtered students:', filteredStudents);

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <AttendanceCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        uniqueClasses={uniqueClasses}
        hasAttendanceForDate={hasAttendanceForDate}
        monthName={monthName}
        currentYear={currentYear}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Attendance for{' '}
              {selectedDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceTable
            selectedDateRecords={selectedDateRecords}
            filteredStudents={filteredStudents}
            calculateMonthlyAttendance={calculateMonthlyAttendance}
            selectedDate={selectedDate}
          />
        </CardContent>
      </Card>
    </div>
  );
}