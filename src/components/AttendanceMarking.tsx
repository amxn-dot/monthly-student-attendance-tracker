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

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
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
              <TableHead>Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>
                  <Button
                    variant={attendance[student.id] ? "default" : "destructive"}
                    size="sm"
                    onClick={() => toggleAttendance(student.id)}
                  >
                    {attendance[student.id] ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
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