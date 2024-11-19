import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';
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
  const { register, handleSubmit, reset } = useForm<Omit<Student, 'id'>>();
  const { toast } = useToast();

  const onSubmit = (data: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...data,
      id: crypto.randomUUID(),
    };
    
    onRegister(newStudent);
    toast({
      title: "Success",
      description: "Student registered successfully",
    });
    reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Register New Student</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                placeholder="Student Name"
                {...register('name', { required: true })}
              />
            </div>
            <div>
              <Input
                placeholder="Roll Number"
                {...register('rollNumber', { required: true })}
              />
            </div>
            <div>
              <Input
                placeholder="Class"
                {...register('class', { required: true })}
              />
            </div>
            <Button type="submit">Register Student</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          onDelete(student.id);
                          toast({
                            title: "Success",
                            description: "Student deleted successfully",
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No students registered yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}