// Authentication Imports
import SignUpSignInLayout from "./Authentication/SignUpSignInLayout";
import ForgetPass from "./Authentication/ForgetPass";
import LoginUsingEmail from "./Authentication/LoginUsingEmail";
import LoginUsingNumber from "./Authentication/LoginUsingNumber";
import PasswordReset from "./Authentication/PasswordReset";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import PersistLogin from "./Authentication/PersistentLogin";
import RequireAuth from "./Authentication/RequireAuth";
import VerificationEmail from "./Authentication/EmailVerification";
import AuthWrapper from "./Authentication/AuthWrapper";

//Client Imports
import Dashboard from "./Client/Dashboard/Dashboard";
import Settings from "./Client/Settings/Settings";
import Jobs from "./Client/Jobs/Jobs";
import Candidates from "./Client/Candidates/view-candidate/Candidates";
import Analytics from "./Client/Analytics/Analytics";
import AnalyticsDateFilter from "./Client/Analytics/AnalyticsDateFilter";
import Integration from "./Client/Integration";
import Finance from "./Client/Finance";
import Message from "./Client/Message";
import TermsAndConditions from "./Client/tnc";
import PrivacyPolicy from "./Client/PrivacyPolicy";
import CandidateFeedback from "./Client/Candidates/view-candidate-feedback/candidate-feedback/CandidateFeedback";
import CandidateView from "./Client/Candidates/view-candidate-feedback/CandidateView";
import JobDetails from "./Client/Jobs/JobDetails";
import AddJob from "./Client/Jobs/AddJob";
import { JobProvider } from "../context/JobContext";
import ClientScheduleInterview from "./Client/Candidates/schedule-interview/ClientScheduleInterview";
import ClientAddCandidate from "./Client/Candidates/add-candidate/AddCandidate";
import Engagement from "./Client/Engagement/Engagement";
import UserActivation from "./Client/UserActivation";

//Agency Imports
import { AgencyDashboard } from "./Agency/Dashboard";

//Internal Imports
import { InternalDashboard } from "./Internal/Dashboard";
import { InternalClients } from "./Internal/Clients";
import { InternalInterviewer } from "./Internal/Interviewer";
import { InternalUsers } from "./Internal/Users";
import { InternalAgreements } from "./Internal/Agreement";
import { InternalFinance } from "./Internal/Finance";
import { InternalEngagement } from "./Internal/Engagement";
import { InternalMessages } from "./Internal/Messages";
import { InternalAddInterviewer } from "./Internal/AddInterviewer";
import InternalAddClient from "./Internal/AddClient";

// Interviewer Imports
import Layout from "./Interviewer/Layout";
import CalendarComponent from "./Interviewer/Calendar";
import InterviewRecord from "./Interviewer/Dashboard/InterviewRecord";
import Payments from "./Interviewer/Payments";
import Feedback from "./Interviewer/Feedback";
import InterviewerConfirmation from "./Interviewer/confirmation/InterviewConfirmation";
import InterviewerTermsAndConditions from "./Client/tnc/InterviewTnC";

// shared imports
import {
  Unauthorized,
  UnauthorizedLayout,
  NotFound,
} from "./shared/unauthorized";
import NavigationLayout from "./shared/NavigationLayout";

// Authentication Exports
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
  AuthWrapper,
  VerificationEmail,
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
  Message,
  TermsAndConditions,
  PrivacyPolicy,
  CandidateFeedback,
  CandidateView,
  JobDetails,
  JobProvider,
  AddJob,
  ClientAddCandidate,
  ClientScheduleInterview,
  Engagement,
  UserActivation,
};

//Agency Exports
export { AgencyDashboard };

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
  InternalAddClient,
  InternalAddInterviewer,
};

//Interviewer Exports
export {
  Layout,
  CalendarComponent,
  InterviewRecord,
  Payments,
  Feedback,
  InterviewerConfirmation,
  InterviewerTermsAndConditions,
};

// Shared Exports
export {
  Unauthorized,
  UnauthorizedLayout,
  NotFound,
  NavigationLayout,
};
