import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Edit, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Student, AttendanceRecord } from '@/types';

interface AdminDashboardProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onStudentUpdate: (student: Student) => void;
}

export default function AdminDashboard({
  students,
  attendance,
  onStudentUpdate,
}: AdminDashboardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Student>>({});
  const { toast } = useToast();

  const calculateOverallAttendance = (studentId: string) => {
    const studentRecords = attendance.filter((record) => record.studentId === studentId);
    const present = studentRecords.filter((record) => record.isPresent).length;
    const total = studentRecords.length;
    return total > 0 ? (present / total) * 100 : 0;
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setEditForm(student);
  };

  const handleSave = () => {
    if (editingId && editForm.name && editForm.rollNumber && editForm.class) {
      const updatedStudent = {
        id: editingId,
        name: editForm.name,
        rollNumber: editForm.rollNumber,
        class: editForm.class,
      };
      onStudentUpdate(updatedStudent);
      setEditingId(null);
      setEditForm({});
      toast({
        title: "Success",
        description: "Student information updated successfully",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Student Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Overall Attendance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  {editingId === student.id ? (
                    <Input
                      value={editForm.rollNumber}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, rollNumber: e.target.value }))
                      }
                    />
                  ) : (
                    student.rollNumber
                  )}
                </TableCell>
                <TableCell>
                  {editingId === student.id ? (
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  ) : (
                    student.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === student.id ? (
                    <Input
                      value={editForm.class}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, class: e.target.value }))
                      }
                    />
                  ) : (
                    student.class
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Progress
                      value={calculateOverallAttendance(student.id)}
                      className="h-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      {calculateOverallAttendance(student.id).toFixed(1)}%
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {editingId === student.id ? (
                    <Button onClick={handleSave} size="sm">
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(student)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}