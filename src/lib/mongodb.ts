import * as Realm from "realm-web";

// Initialize the App
const app = new Realm.App({
  id: import.meta.env.VITE_APP_MONGODB_APP_ID as string
});

// Authentication function
export async function loginAnonymous() {
  const user = await app.logIn(Realm.Credentials.anonymous());
  return user;
}

// Example function to fetch data
export async function fetchStudents() {
  try {
    const user = await loginAnonymous();
    const mongodb = user.mongoClient("mongodb-atlas");
    const collection = mongodb.db("attendance-system").collection("students");
    
    console.log("Fetching students from MongoDB Atlas");
    const students = await collection.find({});
    console.log(`Found ${students.length} students`);
    
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

// Example function to insert data
export async function addStudent(studentData: any) {
  try {
    const user = await loginAnonymous();
    const mongodb = user.mongoClient("mongodb-atlas");
    const collection = mongodb.db("attendance-system").collection("students");
    
    console.log("Adding new student to MongoDB Atlas:", studentData);
    const result = await collection.insertOne(studentData);
    console.log("Student added successfully:", result);
    
    return result;
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
}