# Student Attendance Management System

A comprehensive system for managing student attendance with features for student registration, attendance marking, and attendance history tracking.

## 🚀 Features

- Student Registration
- Daily Attendance Marking
- Attendance History Tracking
- Admin Dashboard
- Responsive Design
- Data Visualization

## 🛠 Tech Stack

### Frontend
- **React**: UI library for building user interfaces
- **TypeScript**: Static typing for JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **React Query**: Data fetching and state management
- **React Router**: Client-side routing
- **Recharts**: Data visualization library

### Backend
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **TypeScript**: Type safety for backend code

## 📁 Project Structure

### Frontend Components

#### Core Components
- `AdminDashboard.tsx`: Main admin interface
- `AttendanceHistory.tsx`: View and track attendance records
- `AttendanceMarking.tsx`: Mark daily attendance
- `StudentRegistration.tsx`: Register new students
- `DashboardLayout.tsx`: Layout wrapper for dashboard pages

#### UI Components
- `ClassFilter.tsx`: Filter students by class
- `AttendanceCalendar.tsx`: Calendar view of attendance
- `AttendanceTable.tsx`: Tabular view of attendance records
- `AttendanceGraph.tsx`: Visual representation of attendance data

### Backend Structure
- `server.ts`: Main server file
- `models/`: Database schemas
  - `Student.ts`: Student model
  - `Attendance.ts`: Attendance records model
  - `Admin.ts`: Admin user model

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
MONGODB_URI=mongodb://localhost:27017/attendance-system
PORT=5000
VITE_API_URL=http://localhost:5000/api
```

4. Start the development servers:

For Backend:
```bash
# Navigate to server directory
cd backend
# Run the server with ts-node
npx ts-node src/server/server.ts
```

For Frontend:
```bash
# In a new terminal, navigate to frontend directory
cd frontend
npm run dev
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login`: Admin login

### Students
- `GET /api/students`: Get all students
- `POST /api/students`: Register new student
- `DELETE /api/students/:id`: Delete student

### Attendance
- `GET /api/attendance`: Get attendance records
- `POST /api/attendance`: Mark attendance

## 💻 Usage

1. **Admin Login**
   - Use admin credentials to access the dashboard

2. **Student Registration**
   - Navigate to Student Registration
   - Fill in student details
   - Submit the form

3. **Mark Attendance**
   - Go to Attendance Marking
   - Select date
   - Mark present/absent for each student
   - Save attendance

4. **View History**
   - Access Attendance History
   - View attendance records
   - Filter by date or student

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.