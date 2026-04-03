// src/utils/mockData.js

export const mockUser = {
    id: 1,
    name: "Abebe Bikila",
    email: "abebe@example.com",
    role: "student",
    department: "Computer Science",
    profile_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abebe",
    join_date: "2023-09-12"
};

export const mockOpportunities = [
    {
        id: 1,
        title: "Summer Internship: Software Engineering",
        organization: "Ethio Telecom",
        location: "Addis Ababa",
        type: "Internship",
        category: "Tech",
        description: "Join the largest telecom in Ethiopia for a 3-month summer internship program.",
        deadline: "2024-06-30",
        posted_at: "2024-03-20",
        jobTitle: "Software Engineering Intern",
        applicantNeed: "Both",
        salary: "Fixed Rate (4500.00 ETB)",
        skillRequired: "React, Node.js, basic Python"
    },
    {
        id: 2,
        title: "Master's Scholarship in AI",
        organization: "Addis Ababa University",
        location: "Addis Ababa",
        type: "Scholarship",
        category: "Education",
        description: "Full scholarship for talented students interested in Artificial Intelligence research.",
        deadline: "2024-05-15",
        posted_at: "2024-03-22"
    },
    {
        id: 3,
        title: "Junior Web Developer",
        organization: "Gebeya",
        location: "Remote",
        type: "Full-time",
        category: "Tech",
        description: "Opportunity for fresh graduates to kickstart their career in MERN stack development.",
        deadline: "2024-04-10",
        posted_at: "2024-03-25",
        jobTitle: "Junior Web Developer",
        applicantNeed: "Both",
        salary: "Monthly (12,000 ETB)",
        skillRequired: "MERN Stack, Git, Agile"
    },
    {
        id: 4,
        title: "Research Assistant - Health Tech",
        organization: "St. Paul's Hospital",
        location: "Addis Ababa",
        type: "Part-time",
        category: "Research",
        description: "Collaborate on groundbreaking health informatics research.",
        deadline: "2024-04-30",
        posted_at: "2024-03-26",
        jobTitle: "Research Data Analyst",
        applicantNeed: "Female",
        salary: "Contract",
        skillRequired: "SPSS, Python, Data Visualization"
    }
];

export const mockGPAData = [
    { semester: 'Year 1 Sem 1', gpa: 3.2 },
    { semester: 'Year 1 Sem 2', gpa: 3.5 },
    { semester: 'Year 2 Sem 1', gpa: 3.4 },
    { semester: 'Year 2 Sem 2', gpa: 3.8 },
    { semester: 'Year 3 Sem 1', gpa: 3.7 },
];

export const mockRoadmap = [
    {
        id: 1,
        title: "Fundamentals",
        status: "completed",
        topics: ["Python Basics", "Algorithms", "Data Structures"]
    },
    {
        id: 2,
        title: "Web Development",
        status: "current",
        topics: ["HTML/CSS", "JavaScript", "React Foundations"]
    },
    {
        id: 3,
        title: "Advanced Systems",
        status: "locked",
        topics: ["Database Systems", "Operating Systems", "Networking"]
    }
];

export const mockLanguageLevels = [
    { language: "Amharic", level: "Beginner", progress: 65 },
    { language: "Oromo", level: "None", progress: 0 },
    { language: "English", level: "Advanced", progress: 90 }
];
