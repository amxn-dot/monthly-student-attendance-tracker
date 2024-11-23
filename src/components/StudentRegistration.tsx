import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, UserPlus, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Student } from '@/types';

interface StudentRegistrationProps {
  onRegister: (student: Student) => void;
  onDelete: (studentId: string) => void;
  students: Student[];
}

export default function StudentRegistration({ 
  onRegister, 
  onDelete,
  students 
}: StudentRegistrationProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Student, 'id'>>();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const onSubmit = (data: Omit<Student, 'id'>) => {
    // Check for duplicate name
    const isDuplicateName = students.some(
      student => student.name.toLowerCase() === data.name.toLowerCase()
    );

    // Check for duplicate roll number
    const isDuplicateRoll = students.some(
      student => student.rollNumber.toLowerCase() === data.rollNumber.toLowerCase()
    );

    if (isDuplicateName) {
      toast({
        title: "Error",
        description: "A student with this name already exists",
        variant: "destructive"
      });
      return;
    }

    if (isDuplicateRoll) {
      toast({
        title: "Error",
        description: "This roll number is already assigned",
        variant: "destructive"
      });
      return;
    }

    const newStudent: Student = {
      ...data,
      id: crypto.randomUUID(),
    };
    
    onRegister(newStudent);
    toast({
      title: "Success",
      description: "Student registered successfully",
      className: "bg-green-500 text-white",
    });
    reset();
  };

  // Sort students by name
  const sortedStudents = [...students].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const filteredStudents = sortedStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Register New Student
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Student Name"
                className="border-purple-200 focus:border-purple-500 transition-colors dark:bg-gray-800 dark:text-white"
                {...register('name', { 
                  required: "Name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Name should only contain letters and spaces"
                  }
                })}
              />
              <Input
                placeholder="Roll Number"
                className="border-purple-200 focus:border-purple-500 transition-colors dark:bg-gray-800 dark:text-white"
                {...register('rollNumber', { 
                  required: "Roll number is required",
                  pattern: {
                    value: /^[A-Za-z0-9]+$/,
                    message: "Roll number should only contain letters and numbers"
                  }
                })}
              />
              <Input
                placeholder="Class"
                className="border-purple-200 focus:border-purple-500 transition-colors dark:bg-gray-800 dark:text-white"
                {...register('class', { required: "Class is required" })}
              />
            </div>
            {(errors.name || errors.rollNumber || errors.class) && (
              <p className="text-red-500 text-sm">
                {errors.name?.message || errors.rollNumber?.message || errors.class?.message}
              </p>
            )}
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transition-all duration-300 transform hover:scale-105"
            >
              Register Student
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle>Registered Students</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-purple-200 focus:border-purple-500 transition-colors dark:bg-gray-800 dark:text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="rounded-lg overflow-hidden border border-purple-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50 dark:bg-gray-800">
                    <TableHead className="text-purple-900 dark:text-white">Roll Number</TableHead>
                    <TableHead className="text-purple-900 dark:text-white">Name</TableHead>
                    <TableHead className="text-purple-900 dark:text-white">Class</TableHead>
                    <TableHead className="text-right text-purple-900 dark:text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow 
                      key={student.id}
                      className="hover:bg-purple-50 transition-colors dark:hover:bg-gray-700 dark:text-white"
                    >
                      <TableCell className="dark:text-white">{student.rollNumber}</TableCell>
                      <TableCell className="dark:text-white">{student.name}</TableCell>
                      <TableCell className="dark:text-white">{student.class}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            onDelete(student.id);
                            toast({
                              title: "Success",
                              description: "Student deleted successfully",
                              className: "bg-red-500 text-white",
                            });
                          }}
                          className="hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400 bg-purple-50 dark:bg-gray-800 rounded-lg">
              No students found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}