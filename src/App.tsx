import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error-boundary";
import { api } from "@/lib/api";
import { Student } from "@/types";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import AttendanceMarking from "./components/AttendanceMarking";
import AttendanceHistory from "./components/AttendanceHistory";
import AdminDashboard from "./components/AdminDashboard";
import DashboardLayout from "./components/DashboardLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  // Get students from localStorage if API is not available
  const getStoredStudents = () => {
    const storedStudents = localStorage.getItem('students');
    return storedStudents ? JSON.parse(storedStudents) : [];
  };

  const { data: students = getStoredStudents() } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      try {
        const apiStudents = await api.getStudents();
        return apiStudents;
      } catch (error) {
        console.log('Error fetching students from API, using localStorage:', error);
        return getStoredStudents();
      }
    },
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ['attendance'],
    queryFn: api.getAttendance,
  });

  const handleAttendanceSubmit = async (records: any[]) => {
    await api.markAttendance(records);
    queryClient.invalidateQueries({ queryKey: ['attendance'] });
  };

  const handleStudentUpdate = async (student: Student) => {
    console.log('Updating student:', student);
    queryClient.invalidateQueries({ queryKey: ['students'] });
  };

  console.log('Current students in AppContent:', students); // Debug log

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/attendance" element={
          <ProtectedRoute>
            <DashboardLayout>
              <AttendanceMarking 
                students={students}
                onSubmit={handleAttendanceSubmit}
              />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <DashboardLayout>
              <AttendanceHistory 
                students={students}
                attendance={attendance}
              />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminDashboard 
                students={students}
                attendance={attendance}
                onStudentUpdate={handleStudentUpdate}
              />
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </ErrorBoundary>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="app-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;