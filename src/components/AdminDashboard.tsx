import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Edit, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Student, AttendanceRecord } from '@/types';
import { ClassFilter } from './admin/ClassFilter';
import { AttendanceGraph } from './charts/AttendanceGraph';

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
  const [selectedClass, setSelectedClass] = useState('all');
  const { toast } = useToast();

  const uniqueClasses = useMemo(() => 
    Array.from(new Set(students.map(student => student.class))).sort(),
    [students]
  );

  const filteredStudents = useMemo(() => 
    selectedClass === 'all'
      ? students
      : students.filter(student => student.class === selectedClass),
    [students, selectedClass]
  );

  const monthlyAttendanceData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => {
      const monthRecords = attendance.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.toLocaleString('default', { month: 'short' }) === month;
      });
      
      const present = monthRecords.filter(record => record.isPresent).length;
      const total = monthRecords.length || 1; // Avoid division by zero
      return {
        month,
        attendance: (present / total) * 100
      };
    });
  }, [attendance]);

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
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{students.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{uniqueClasses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(monthlyAttendanceData.reduce((acc, curr) => acc + curr.attendance, 0) / monthlyAttendanceData.length).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <AttendanceGraph data={monthlyAttendanceData} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Management
            </CardTitle>
            <ClassFilter
              selectedClass={selectedClass}
              classes={uniqueClasses}
              onClassChange={setSelectedClass}
            />
          </div>
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
              {filteredStudents.map((student) => (
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
    </div>
  );
}