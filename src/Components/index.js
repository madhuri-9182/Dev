import Hello from "./Hello";

//SignIn-SignUp Imports
import SignUpSignInLayout from "./Authentication/SignUpSignInLayout";
import ForgetPass from "./Authentication/ForgetPass";
import LoginUsingEmail from "./Authentication/LoginUsingEmail";
import LoginUsingNumber from "./Authentication/LoginUsingNumber";
// import page from "./Authentication/page";
import PasswordReset from "./Authentication/PasswordReset";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import PersistLogin from "./Authentication/PersistentLogin";
import RequireAuth from "./Authentication/RequireAuth";

//Client Imports
import Dashboard from "./Client/Dashboard/Dashboard";
import Settings from "./Client/Settings/Settings";
import Jobs from "./Client/Jobs/Jobs";
import Candidates from "./Client/Candidates/view-candidate/Candidates";
import Analytics from "./Client/Analytics/Analytics";
import AnalyticsDateFilter from "./Client/Analytics/AnalyticsDateFilter";
import Integration from "./Client/Integration";
import Finance from "./Client/Finance";
import Engagement from "./Client/Engagement";
import Message from "./Client/Message";

//Agency Imports
import { AgencyDashboard } from "./Agency/Dashboard";
import { AgencyCandidates } from "./Agency/Candidates";
import { AgencyAddCandidate } from "./Agency/AddCandidate";
import { AgencyScheduleInterview } from "./Agency/ScheduleInterview";

//Internal Imports
import { InternalDashboard } from "./Internal/Dashboard";
import { InternalClients } from "./Internal/Clients";
import { InternalInterviewer } from "./Internal/Interviewer";
import { InternalUsers } from "./Internal/Users";
import { InternalAgreements } from "./Internal/Agreement";
import { InternalFinance } from "./Internal/Finance";
import { InternalEngagement } from "./Internal/Engagement";
import { InternalMessages } from "./Internal/Messages";

// Interviewer Imports
import Layout from "./Interviewer/Layout";
import CalendarComponent from "./Interviewer/Calendar";
import InterviewRecord from "./Interviewer/InterviewRecord";
import Payments from "./Interviewer/Payments";
import { Feedback } from "./Interviewer/Feedback";

//SignIn-SignUp Exports
export {
  SignIn,
  SignUp,
  ForgetPass,
  PasswordReset,
  SignUpSignInLayout,
  LoginUsingEmail,
  LoginUsingNumber,
  PersistLogin,
  RequireAuth,
};

//Client Exports
export {
  Dashboard,
  Settings,
  Jobs,
  Candidates,
  Analytics,
  AnalyticsDateFilter,
  Integration,
  Finance,
  Engagement,
  Message,
};

//Agency Exports
export {
  AgencyDashboard,
  AgencyCandidates,
  AgencyAddCandidate,
  AgencyScheduleInterview,
};

//Internal Exports

export {
  InternalDashboard,
  InternalClients,
  InternalInterviewer,
  InternalUsers,
  InternalAgreements,
  InternalFinance,
  InternalEngagement,
  InternalMessages,
};

//Interviewer Exports
export {
  Layout,
  CalendarComponent,
  InterviewRecord,
  Payments,
  Feedback,
};

export { Hello };
