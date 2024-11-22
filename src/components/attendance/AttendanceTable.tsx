import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Student, AttendanceRecord, MonthlyAttendance } from '@/types';

interface AttendanceTableProps {
  selectedDateRecords: AttendanceRecord[];
  filteredStudents: Student[];
  calculateMonthlyAttendance: (studentId: string) => MonthlyAttendance;
  selectedDate: Date | undefined;
}

export const AttendanceTable = ({
  selectedDateRecords,
  filteredStudents,
  calculateMonthlyAttendance,
  selectedDate,
}: AttendanceTableProps) => {
  if (selectedDateRecords.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No attendance records for this date.
      </div>
    );
  }

  return (
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
  );
};