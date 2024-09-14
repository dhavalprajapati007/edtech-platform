import NavItem from "../components/NavItem";

export const navLinks = [
    {
        name: "Home", 
        path: "/home" 
    },
    {
        name: "Past Papers",
        path: "/pastPapers"
    },
    {
        name: "Test Series",
        path: "/testSeries"
    },
    {
        name: "Courses",
        path: "/courses"
    },
    {
        name: "Forum",
        path: "/forum"
    },
    {
        name: <NavItem item="Contact Us" />,
        path: "#contact"
    }
];

export const excludeHeaderPath = ["/selectDepartment"];

export const publicAPI = [
    "/api/auth/signup",
    "/api/auth/email-login",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/google-signin",
    "/api/departments/get-all-departments",
    "/api/departments/get-single-department",
    "/api/reviews/get-random-reviews",
    "/api/syllabus/get-syllabus",
    "/api/examAnalysis/get-exam-analysis",
    "/api/yearCutOff/get-year-cut-off",
    "/api/payments/get-department-wise-payments",
    "/api/reviews/get-department-wise-reviews",
    "/api/sms/send-sms"
];