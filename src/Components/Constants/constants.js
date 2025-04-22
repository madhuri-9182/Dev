import {
  Briefcase,
  Chart2,
  Setting2,
  Profile2User,
  // ChartSquare,
  // Setting,
  Cards,
  Share,
  UserOctagon,
  UserSquare,
  People,
  ReceiptEdit,
  Personalcard,
  Lock,
  DocumentText,
  Calendar2,
  Book1,
} from "iconsax-react";

export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const MOBILE_REGEX = /^\d{10}$/;

export const WEBSITE_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export const ROLES = {
  CLIENT: ["client_admin", "client_user", "client_owner"],
  AGENCY: ["agency"],
  INTERVIEWER: ["interviewer"],
  USER: ["user"],
  INTERNAL: ["super_admin", "moderator", "admin"],
};

export const ROLES_REDIRECTS = {
  CLIENT: "/client/dashboard",
  AGENCY: "/agency/dashboard",
  INTERVIEWER: "/interviewer/dashboard",
  USER: "/",
  INTERNAL: "/internal/dashboard",
  UNKNOWN: "/unauthorized",
};

export const CLIENT_NAVLINKS = [
  {
    text: "Dashboard",
    icon: Chart2,
    link: "/client/dashboard",
  },
  {
    text: "Settings",
    icon: Setting2,
    link: "/client/settings",
  },
  {
    text: "Jobs",
    icon: Briefcase,
    link: "/client/jobs",
  },
  {
    text: "Candidates",
    icon: Profile2User,
    link: "/client/candidates",
  },
  // {
  //   text: "Analytics",
  //   icon: ChartSquare,
  //   link: "/client/analytics",
  // },
  // {
  //   text: "Integration",
  //   icon: Setting,
  //   link: "/client/integration",
  // },
  {
    text: "Finance",
    icon: Cards,
    link: "/client/finance",
  },
  {
    text: "Engagement",
    icon: Share,
    link: "/client/engagement/dashboard",
  },
  {
    text: "Terms & Conditions",
    icon: DocumentText,
    link: "/client/tnc",
  },
  {
    text: "Privacy Policy",
    icon: Lock,
    link: "/client/privacy-policy",
  },
  {
    text: "User Manual",
    icon: Book1,
    link: "/client/manual",
  },
];

export const INTERNAL_NAVLINKS = [
  {
    text: "Dashboard",
    icon: Chart2,
    link: "/internal/dashboard",
  },
  {
    text: "Clients",
    icon: UserOctagon,
    link: "/internal/clients",
  },
  {
    text: "Interviewer",
    icon: UserSquare,
    link: "/internal/interviewer",
  },
  {
    text: "User",
    icon: People,
    link: "/internal/users",
  },
  {
    text: "Agreements",
    icon: ReceiptEdit,
    link: "/internal/agreements",
  },
  {
    text: "Finance",
    icon: Cards,
    link: "/internal/finance",
  },
  {
    text: "Engagement",
    icon: Share,
    link: "/internal/engagement",
  },
];

export const AGENCY_NAVLINKS = [
  {
    text: "Dashboard",
    icon: Chart2,
    link: "/agency/dashboard",
  },
  {
    text: "Candidates",
    icon: Personalcard,
    link: "/agency/candidates",
  },
  {
    text: "Terms & Conditions",
    icon: DocumentText,
    link: "/agency/tnc",
  },
  {
    text: "Privacy Policy",
    icon: Lock,
    link: "/agency/privacy-policy",
  },
];

export const INTERVIEWER_NAVLINKS = [
  {
    text: "Dashboard",
    icon: Chart2,
    link: "/interviewer/dashboard",
  },
  {
    text: "Calendar",
    icon: Calendar2,
    link: "/interviewer/calendar",
  },
  // {
  //   text: "Check Receivables",
  //   icon: Cards,
  //   link: "/interviewer/payments",
  // },
  {
    text: "Terms & Conditions",
    icon: DocumentText,
    link: "/interviewer/tnc",
  },
  {
    text: "Privacy Policy",
    icon: Lock,
    link: "/interviewer/privacy-policy",
  },
];

export const USER_TYPE = {
  client_owner: "Super Admin",
  client_admin: "Admin",
  client_user: "User",
  agency: "Agency",
};

export const ACCESSIBILITY = {
  AGJ: "Assigned Jobs",
  AJ: "All Jobs",
};

export const JOB_NAMES = [
  { id: "SDE_I", name: "SDE-I" },
  { id: "SDE_II", name: "SDE-II" },
  { id: "SDE_III", name: "SDE-III" },
  { id: "PE", name: "Principal Engineer" },
  { id: "EM", name: "Engineering Manager" },
  { id: "TL", name: "Technical Lead" },
  { id: "VPE", name: "VP Engineering" },
  { id: "DOE", name: "Director of Engineering" },
  { id: "DE", name: "DevOps Engineer" },
  { id: "SR_DE", name: "Senior DevOps Engineer" },
  { id: "LD_DE", name: "Lead DevOps Engineer" },
  { id: "SDET", name: "SDET" },
  { id: "SR_SDET", name: "Sr. SDET" },
  { id: "MGR_SDET", name: "Manager-SDET" },
  { id: "DIR_SDET", name: "Director-SDET" },
  { id: "MLS", name: "ML Scientist" },
  { id: "SR_MLS", name: "Sr. ML Scientist" },
  { id: "LD_MLS", name: "Lead ML Scientist" },
  { id: "P_MLS", name: "Principal ML Scientist" },
  { id: "DEE", name: "Data Engineer" },
  { id: "SR_DEE", name: "Sr. Data Engineer" },
  { id: "LD_DEE", name: "Lead Data Engineer" },
  { id: "P_DEE", name: "Principal Data Engineer" },
];

export const JOB_TYPES = {
  ARCHIVED: ["PF", "POH", "OTH"],
  ACTIVE: ["", null, undefined],
};

export const CANDIDATE_SOURCE = [
  { id: "INT", name: "Internal" },
  // { id: "AGN", name: "Agency" },
];

export const SPECIALIZATIONS = [
  { id: "frontend", name: "Frontend" },
  { id: "backend", name: "Backend" },
  { id: "fullstack", name: "Fullstack" },
  { id: "aiml", name: "AI/ML" },
  { id: "devops", name: "DevOps" },
  { id: "data_engineer", name: "Data Engineering" },
  { id: "testing", name: "Testing/QA" },
  { id: "android", name: "Android" },
  { id: "ios", name: "iOS" },
  { id: "mobile", name: "Mobile (Android + iOS)" },
];

export const DOMAINS = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Fullstack",
  aiml: "AI/ML",
  devops: "DevOps",
  data_engineer: "Data Engineering",
  testing: "Testing",
  android: "Android",
  ios: "iOS",
  mobile: "Mobile (Android + iOS)",
};

export const CANDIDATE_STATUS = [
  {
    id: "All",
    name: "All",
  },
  {
    id: "HREC",
    name: "Highly Recommended",
  },
  {
    id: "REC",
    name: "Recommended",
  },
  {
    id: "NREC",
    name: "Not Recommended",
  },
  {
    id: "SNREC",
    name: "Strongly Not Recommended",
  },
  {
    id: "SCH",
    name: "Scheduled",
  },
  {
    id: "CSCH",
    name: "Scheduled",
  },
  {
    id: "NSCH",
    name: "Not Scheduled",
  },
  {
    id: "SLD",
    name: "Selected",
  },
  {
    id: "RJD",
    name: "Rejected",
  },
  {
    id: "NJ",
    name: "Not Joined",
  },
  {
    id: "drop",
    name: "Dropped",
  },
];

export const JOB_STATUS = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "archive",
    label: "Archived",
  },
];

export const GENDERS = [
  {
    id: "M",
    name: "Male",
  },
  {
    id: "F",
    name: "Female",
  },
  {
    id: "TG",
    name: "Other",
  },
];

export const REMARK_OPTIONS = [
  { id: "HREC", name: "Highly Recommended" },
  { id: "REC", name: "Recommended" },
  { id: "NREC", name: "Not Recommended" },
  { id: "SNREC", name: "Strongly Not Recommended" },
  { id: "NJ", name: "Not Joined" },
];
