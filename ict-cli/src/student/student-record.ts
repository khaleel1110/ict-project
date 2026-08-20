import {ad as admin} from '../index';
export interface AppointmentDetails {
    address: string;
    amount: number;
    appointment: string;
    appointmentDate: Date;
    appointmentDuration: number;
    appointmentStartHour: number;
    email: string;
    firstName: string;
    gender: string;
    lastName: string;
    localGovernment: string;
    location: string;
    paymentReference: string;
    phone: string;
    phoneType: string;
    teamA: string;
    teamB: string;
}


// Define the Student interface
/*export interface Student {
    id: number;             // Unique ID for the student
    fullName: string;       // Full name of the student
    age: number;            // Age of the student
    gender: string;         // Gender (e.g., "Male", "Female", "Other")
    grade: string;          // Current grade or class
    email: string;          // Contact email
    phoneNumber: string;    // Contact phone number
    courses: string[];      // List of enrolled courses
    isActive: boolean;      // Whether the student is currently active
    level: string;          // Academic level or classification (e.g., Level 1, Level 2)
}*/

// Array of students
export const appointments: AppointmentDetails[] = [
    {
        address: "no 280 Naibawa kudu, kano state",
        amount: 10000,
        appointment: "11:00 AM - 1:00 PM, 04/30/2025",
        appointmentDate: new Date("2025-04-30T10:00:00Z"),
        appointmentDuration: 2,
        appointmentStartHour: 11,
        email: "khaleelmatic@gmail.com",
        firstName: "Ibrahim",
        gender: "Male",
        lastName: "Yusuf",
        localGovernment: "hhhhhhhhh",
        location: "Enugu",
        paymentReference: "ref-99134921252813",
        phone: "+2347031140046",
        phoneType: "Mobile",
        teamA: "pro xi",
        teamB: "city boys Naibawa"
    },
    {
        address: "12 Bompai Road, Kano",
        amount: 15000,
        appointment: "9:00 AM - 11:00 AM, 05/01/2025",
        appointmentDate: new Date("2025-05-01T08:00:00Z"),
        appointmentDuration: 2,
        appointmentStartHour: 9,
        email: "aminu.bello@gmail.com",
        firstName: "Aminu",
        gender: "Male",
        lastName: "Bello",
        localGovernment: "Tarauni",
        location: "Kano",
        paymentReference: "ref-88112233445566",
        phone: "+2348012345678",
        phoneType: "Mobile",
        teamA: "Falcons",
        teamB: "Eagles"
    },
    {
        address: "45 Ring Road, Ibadan",
        amount: 20000,
        appointment: "3:00 PM - 5:00 PM, 05/03/2025",
        appointmentDate: new Date("2025-05-03T14:00:00Z"),
        appointmentDuration: 2,
        appointmentStartHour: 15,
        email: "funmi.adewale@yahoo.com",
        firstName: "Funmi",
        gender: "Female",
        lastName: "Adewale",
        localGovernment: "Ibadan North",
        location: "Ibadan",
        paymentReference: "ref-99887766554433",
        phone: "+2348123456789",
        phoneType: "Mobile",
        teamA: "Lions",
        teamB: "Panthers"
    },
    {
        address: "77 Sapele Road, Benin City",
        amount: 12000,
        appointment: "1:00 PM - 3:00 PM, 05/05/2025",
        appointmentDate: new Date("2025-05-05T12:00:00Z"),
        appointmentDuration: 2,
        appointmentStartHour: 13,
        email: "osaretin.udeh@gmail.com",
        firstName: "Osaretin",
        gender: "Male",
        lastName: "Udeh",
        localGovernment: "Oredo",
        location: "Benin",
        paymentReference: "ref-22334455667788",
        phone: "+2348067894321",
        phoneType: "Mobile",
        teamA: "Warriors",
        teamB: "Titans"
    },
    {
        address: "9 Lekki Phase 1, Lagos",
        amount: 25000,
        appointment: "10:00 AM - 12:00 PM, 05/07/2025",
        appointmentDate: new Date("2025-05-07T09:00:00Z"),
        appointmentDuration: 2,
        appointmentStartHour: 10,
        email: "chiamaka.okezie@outlook.com",
        firstName: "Chiamaka",
        gender: "Female",
        lastName: "Okezie",
        localGovernment: "Eti-Osa",
        location: "Lagos",
        paymentReference: "ref-55443322110099",
        phone: "+2349098765432",
        phoneType: "Mobile",
        teamA: "Sharks",
        teamB: "Dolphins"
    }
];



console.log(appointments);
/*

{ id: 2, fullName: "Jane Smith", age: 17, gender: "Female", grade: "11th", email: "jane.smith@example.com", phoneNumber: "08023456789", courses: ["English", "Biology"], isActive: true, level: "Level 1" },
{ id: 3, fullName: "Michael Brown", age: 19, gender: "Male", grade: "12th", email: "michael.brown@example.com", phoneNumber: "08034567890", courses: ["Chemistry", "History"], isActive: true, level: "Level 1" },
{ id: 4, fullName: "Emily Davis", age: 16, gender: "Female", grade: "10th", email: "emily.davis@example.com", phoneNumber: "08045678901", courses: ["Economics", "Art"], isActive: true, level: "Level 1" },
{ id: 5, fullName: "Liam Wilson", age: 20, gender: "Male", grade: "College Freshman", email: "liam.wilson@example.com", phoneNumber: "08056789012", courses: ["Programming", "Statistics"], isActive: true, level: "Level 2" },
{ id: 6, fullName: "Sophia Martinez", age: 15, gender: "Female", grade: "9th", email: "sophia.martinez@example.com", phoneNumber: "08067890123", courses: ["Geography", "Sociology"], isActive: true, level: "Level 1" },
{ id: 7, fullName: "Ethan Garcia", age: 17, gender: "Male", grade: "11th", email: "ethan.garcia@example.com", phoneNumber: "08078901234", courses: ["Political Science", "Philosophy"], isActive: true, level: "Level 1" },
{ id: 8, fullName: "Isabella Hernandez", age: 18, gender: "Female", grade: "12th", email: "isabella.hernandez@example.com", phoneNumber: "08089012345", courses: ["Computer Science", "Psychology"], isActive: true, level: "Level 1" },
{ id: 9, fullName: "Mason Lee", age: 16, gender: "Male", grade: "10th", email: "mason.lee@example.com", phoneNumber: "08090123456", courses: ["Biology", "Chemistry"], isActive: true, level: "Level 1" },
{ id: 10, fullName: "Olivia Clark", age: 14, gender: "Female", grade: "8th", email: "olivia.clark@example.com", phoneNumber: "08101234567", courses: ["English", "Art"], isActive: true, level: "Level 0" },
{ id: 11, fullName: "Noah Adams", age: 19, gender: "Male", grade: "College Sophomore", email: "noah.adams@example.com", phoneNumber: "08112345678", courses: ["Physics", "Mathematics"], isActive: true, level: "Level 2" },
{ id: 12, fullName: "Emma Wright", age: 15, gender: "Female", grade: "9th", email: "emma.wright@example.com", phoneNumber: "08123456789", courses: ["History", "Sociology"], isActive: true, level: "Level 1" },
{ id: 13, fullName: "Alexander Scott", age: 17, gender: "Male", grade: "11th", email: "alexander.scott@example.com", phoneNumber: "08134567890", courses: ["Programming", "Statistics"], isActive: true, level: "Level 1" },
{ id: 14, fullName: "Ava Rivera", age: 16, gender: "Female", grade: "10th", email: "ava.rivera@example.com", phoneNumber: "08145678901", courses: ["Economics", "Philosophy"], isActive: true, level: "Level 1" },
{ id: 15, fullName: "William Walker", age: 18, gender: "Male", grade: "12th", email: "william.walker@example.com", phoneNumber: "08156789012", courses: ["Computer Science", "Geography"], isActive: true, level: "Level 1" }*/
