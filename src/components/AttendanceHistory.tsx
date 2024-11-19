"use client";

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, TrendingUp } from 'lucide-react';
import { Student, AttendanceRecord, MonthlyAttendance } from '@/types';

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

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                hasAttendance: (date) => hasAttendanceForDate(date),
              }}
              modifiersStyles={{
                hasAttendance: {
                  fontWeight: 'bold',
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Attendance statistics for {monthName} {currentYear}
              </p>
              <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

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
          {selectedDateRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Daily Status</TableHead>
                  <TableHead>Monthly Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const record = selectedDateRecords.find(
                    (r) => r.studentId === student.id
                  );
                  const monthlyStats = calculateMonthlyAttendance(student.id);
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        {record ? (
                          <Badge
                            variant={record.isPresent ? "default" : "destructive"}
                          >
                            {record.isPresent ? 'Present' : 'Absent'}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Not Marked</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Progress 
                            value={monthlyStats.percentage} 
                            className="h-2"
                          />
                          <p className="text-sm text-muted-foreground">
                            {monthlyStats.present}/{monthlyStats.total} days ({monthlyStats.percentage.toFixed(1)}%)
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records for this date.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}