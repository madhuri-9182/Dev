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
