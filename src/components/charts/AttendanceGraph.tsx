import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AttendanceGraphProps {
  data: {
    month: string;
    attendance: number;
  }[];
}

export function AttendanceGraph({ data }: AttendanceGraphProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Monthly Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer 
          className="h-[300px]"
          config={{
            attendance: {
              theme: {
                light: "#8B5CF6",
                dark: "#A78BFA"
              }
            }
          }}
        >
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="attendance" stroke="#8B5CF6" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}