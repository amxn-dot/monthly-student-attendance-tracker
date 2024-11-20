import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">AttenEase</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="gap-2"
        >
          <LogIn className="h-4 w-4" />
          Logout
        </Button>
      </div>
      <nav className="flex gap-4 mb-8">
        <Button variant="outline" onClick={() => navigate('/students')}>Register Students</Button>
        <Button variant="outline" onClick={() => navigate('/attendance')}>Mark Attendance</Button>
        <Button variant="outline" onClick={() => navigate('/history')}>Attendance History</Button>
        <Button variant="outline" onClick={() => navigate('/admin')}>Admin Dashboard</Button>
      </nav>
    </div>
  );
}