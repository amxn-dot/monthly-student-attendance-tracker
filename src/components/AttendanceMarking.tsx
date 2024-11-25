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

  // Sort students alphabetically
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
  const uniqueClasses = Array.from(new Set(sortedStudents.map(student => student.class))).sort();

  const filteredStudents = selectedClass === 'all' 
    ? sortedStudents 
    : sortedStudents.filter(student => student.class === selectedClass);

  const markAttendance = (studentId: string, isPresent: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: isPresent,
    }));
  };

  const handleSubmit = () => {
    // Check for unmarked students
    const unmarkedStudents = filteredStudents.filter(
      student => attendance[student.id] === undefined
    );

    if (unmarkedStudents.length > 0) {
      toast({
        title: "Warning",
        description: `${unmarkedStudents.length} student(s) not marked: ${unmarkedStudents.map(s => s.name).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    if (Object.keys(attendance).length === 0) {
      toast({
        title: "Error",
        description: "Please mark attendance for at least one student",
        variant: "destructive"
      });
      return;
    }

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

  if (!students || students.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle>Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-muted-foreground">
            No students registered yet. Please add students first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle>Mark Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4 mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-[240px] justify-start text-left font-normal bg-white">
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
            <SelectTrigger className="w-full md:w-[180px] bg-white">
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

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100/50">
                <TableHead className="font-semibold">Roll Number</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Class</TableHead>
                <TableHead className="font-semibold text-center">Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-purple-50/50">
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{student.class}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant={attendance[student.id] ? "default" : "outline"}
                        size="sm"
                        onClick={() => markAttendance(student.id, true)}
                        className={`w-full md:w-24 ${
                          attendance[student.id] 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "bg-white hover:bg-green-50"
                        }`}
                      >
                        <Check className="h-4 w-4 md:mr-1" />
                        <span className="hidden md:inline">Present</span>
                      </Button>
                      <Button
                        variant={attendance[student.id] === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => markAttendance(student.id, false)}
                        className={`w-full md:w-24 ${
                          attendance[student.id] === false 
                            ? "bg-red-500 hover:bg-red-600" 
                            : "bg-white hover:bg-red-50"
                        }`}
                      >
                        <X className="h-4 w-4 md:mr-1" />
                        <span className="hidden md:inline">Absent</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredStudents.length > 0 ? (
          <Button 
            onClick={handleSubmit} 
            className="mt-4 w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Submit Attendance
          </Button>
        ) : (
          <p className="text-center py-4 text-muted-foreground bg-purple-50/50 rounded-lg mt-4">
            {students.length === 0 ? "No students registered yet." : "No students found in selected class."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}