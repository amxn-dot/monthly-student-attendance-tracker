import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, UserPlus } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!email && !username) || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (isLoginMode) {
      const storedEmail = localStorage.getItem('signupEmail');
      const storedUsername = localStorage.getItem('signupUsername');
      const storedPassword = localStorage.getItem('signupPassword');

      const isEmailValid = email && email === storedEmail;
      const isUsernameValid = username && username === storedUsername;
      const isPasswordValid = password === storedPassword;

      if ((isEmailValid || isUsernameValid) && isPasswordValid) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('adminName', username || email.split('@')[0]);
        navigate('/attendance');
        toast({
          title: "Welcome to AttenEase",
          description: "Logged in successfully",
        });
      } else if ((email === "admin@attenease.com" || username === "admin") && password === "admin") {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('adminName', 'Administrator');
        navigate('/attendance');
        toast({
          title: "Welcome to AttenEase",
          description: "Admin logged in successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials",
        });
      }
    } else {
      localStorage.setItem('signupEmail', email);
      localStorage.setItem('signupUsername', username);
      localStorage.setItem('signupPassword', password);
      
      setIsLoginMode(true);
      toast({
        title: "Account Created",
        description: "Please login with your credentials",
      });
    }

    setEmail('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">AttenEase</h1>
      <p className="text-center text-muted-foreground mb-8">
        Intelligent Attendance Management System
      </p>
      
      <div className="max-w-md mx-auto">
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLoginMode && (
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <Input
            type="text"
            placeholder={isLoginMode ? "Email or Username" : "Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full gap-2">
              {isLoginMode ? (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}