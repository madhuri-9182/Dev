import {
  Briefcase,
  Chart2,
  Setting2,
  Profile2User,
  ChartSquare,
  Setting,
  Cards,
  Share,
  UserOctagon,
  UserSquare,
  People,
  ReceiptEdit,
  Personalcard,
} from "iconsax-react";

export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const MOBILE_REGEX = /^\d{10}$/;

export const ROLES = {
  CLIENT: ["client_admin", "client_user", "client_owner"],
  AGENCY: ["agency"],
  INTERVIEWER: ["interviewer"],
  USER: ["user"],
  INTERNAL: ["super_admin", "moderator"],
};

export const ROLES_REDIRECTS = {
  CLIENT: "/client/dashboard",
  AGENCY: "/agency/dashboard",
  INTERVIEWER: "/interviewer/dashboard",
  USER: "/",
  INTERNAL: "/internal/dashboard",
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
  {
    text: "Analytics",
    icon: ChartSquare,
    link: "/client/analytics",
  },
  {
    text: "Integration",
    icon: Setting,
    link: "/client/integration",
  },
  {
    text: "Finance",
    icon: Cards,
    link: "/client/finance",
  },
  {
    text: "Engagement",
    icon: Share,
    link: "/client/engagement",
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
];

export const USER_TYPE = {
  client_owner: "Owner",
  client_admin: "Admin",
  client_user: "User",
  agency: "Agency",
};

export const ACCESSIBILITY = {
  AGJ: "Assigned Jobs",
  AJ: "All Jobs",
};

export const JOB_NAMES = [
  { key: "SDE_I", label: "SDE-I" },
  { key: "SDE_II", label: "SDE-II" },
  { key: "SDE_III", label: "SDE-III" },
  { key: "PE", label: "Principal Engineer" },
  { key: "EM", label: "Engineering Manager" },
  { key: "TL", label: "Technical Lead" },
  { key: "VPE", label: "VP Engineering" },
  { key: "DOE", label: "Director of Engineering" },
  { key: "DE", label: "DevOps Engineer" },
  { key: "SR_DE", label: "Senior DevOps Engineer" },
  { key: "LD_DE", label: "Lead DevOps Engineer" },
  { key: "SDET", label: "SDET" },
  { key: "SR_SDET", label: "Sr. SDET" },
  { key: "MGR_SDET", label: "Manager-SDET" },
  { key: "DIR_SDET", label: "Director-SDET" },
  { key: "MLS", label: "ML Scientist" },
  { key: "SR_MLS", label: "Sr. ML Scientist" },
  { key: "LD_MLS", label: "Lead ML Scientist" },
  { key: "P_MLS", label: "Principal ML Scientist" },
  { key: "DEE", label: "Data Engineer" },
  { key: "SR_DEE", label: "Sr. Data Engineer" },
  { key: "LD_DEE", label: "Lead Data Engineer" },
  { key: "P_DEE", label: "Principal Data Engineer" },
];
