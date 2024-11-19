import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Student } from '@/types';

interface StudentRegistrationProps {
  onRegister: (student: Student) => void;
}

export default function StudentRegistration({ onRegister }: StudentRegistrationProps) {
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
  );
}