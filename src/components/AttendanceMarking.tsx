import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, Calendar } from 'lucide-react';
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
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const { toast } = useToast();

  const uniqueClasses = Array.from(new Set(students.map(student => student.class))).sort();

  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(student => student.class === selectedClass);

  const markAttendance = (studentId: string, isPresent: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: isPresent,
    }));
  };

  const handleSubmit = () => {
    const date = format(selectedDate, 'yyyy-MM-dd');
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
        <div className="flex gap-4 mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select
            value={selectedClass}
            onValueChange={setSelectedClass}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select class" />
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
            {filteredStudents.map((student) => (
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
        {filteredStudents.length > 0 ? (
          <Button onClick={handleSubmit} className="mt-4">
            Submit Attendance
          </Button>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            {students.length === 0 ? "No students registered yet." : "No students found in selected class."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}