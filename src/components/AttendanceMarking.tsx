import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Student, AttendanceRecord } from '@/types';

interface AttendanceMarkingProps {
  students: Student[];
  onSubmit: (records: AttendanceRecord[]) => void;
}

export default function AttendanceMarking({
  students,
  onSubmit,
}: AttendanceMarkingProps) {
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const markAttendance = (studentId: string, isPresent: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: isPresent,
    }));
  };

  const handleSubmit = () => {
    const date = new Date().toISOString().split('T')[0];
    const records: AttendanceRecord[] = Object.entries(attendance).map(
      ([studentId, isPresent]) => ({
        id: crypto.randomUUID(),
        studentId,
        date,
        isPresent,
      })
    );

    onSubmit(records);
    setAttendance({});
    toast({
      title: "Success",
      description: "Attendance marked successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-center">Mark Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant={attendance[student.id] ? "default" : "outline"}
                      size="sm"
                      onClick={() => markAttendance(student.id, true)}
                      className="w-24"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      variant={attendance[student.id] === false ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => markAttendance(student.id, false)}
                      className="w-24"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {students.length > 0 ? (
          <Button onClick={handleSubmit} className="mt-4">
            Submit Attendance
          </Button>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            No students registered yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}