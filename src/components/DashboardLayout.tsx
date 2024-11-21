import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogIn, Menu, User, X } from "lucide-react";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { Avatar, AvatarFallback } from './ui/avatar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const adminName = localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminName');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            AttenEase
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{adminName}</span>
              </div>
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <LogIn className="h-4 w-4" />
                Logout
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <nav className={cn(
          "flex flex-col md:flex-row gap-2 md:gap-4 mb-8",
          isMenuOpen ? "block" : "hidden md:flex"
        )}>
          <Button 
            variant="outline" 
            onClick={() => navigate('/students')}
            className="w-full md:w-auto bg-white hover:bg-gray-50 hover:text-purple-600 transition-colors"
          >
            Register Students
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/attendance')}
            className="w-full md:w-auto bg-white hover:bg-gray-50 hover:text-purple-600 transition-colors"
          >
            Mark Attendance
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/history')}
            className="w-full md:w-auto bg-white hover:bg-gray-50 hover:text-purple-600 transition-colors"
          >
            Attendance History
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="w-full md:w-auto bg-white hover:bg-gray-50 hover:text-purple-600 transition-colors"
          >
            Admin Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="md:hidden w-full bg-white hover:bg-gray-50 hover:text-red-600 transition-colors"
          >
            Logout
          </Button>
        </nav>

        <div className="bg-card rounded-lg shadow-lg p-4 md:p-6 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}