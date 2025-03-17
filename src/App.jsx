import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ROLES } from "./Components/Constants/constants";
import AuthWrapper from "./Components/Authentication/AuthWrapper";
import UserActivation from "./Components/Client/UserActivation";
// Interviewer Imports
import {
  Layout,
  CalendarComponent,
  InterviewRecord,
  Payments,
} from "./Components";
import { Hello } from "./Components";
import { InternalAddInterviewer } from "./Components/Internal/AddInterviewer";
import InternalAddClient from "./Components/Internal/AddClient";
import { Feedback } from "./Components/Interviewer/Feedback";
// Internal Imports
import {
  InternalDashboard,
  InternalClients,
  InternalInterviewer,
  InternalUsers,
  InternalAgreements,
  InternalFinance,
  InternalEngagement,
  InternalMessages,
} from "./Components";
// Agency Imports
import {
  AgencyDashboard,
  AgencyCandidates,
  AgencyAddCandidate,
  AgencyScheduleInterview,
} from "./Components";
// Client Imports
import {
  Dashboard,
  Settings,
  Jobs,
  Candidates,
  Analytics,
  AnalyticsDateFilter,
  Integration,
  Finance,
  Message,
} from "./Components";
import NavigationLayout from "./Components/shared/NavigationLayout";
// Authentication Imports
import {
  // SignIn,
  SignUp,
  ForgetPass,
  PasswordReset,
  SignUpSignInLayout,
  // page,
  LoginUsingEmail,
  LoginUsingNumber,
  PersistLogin,
  RequireAuth,
} from "./Components";
import ClientAddCandidate from "./Components/Client/Candidates/add-candidate/AddCandidate";
import ClientScheduleInterview from "./Components/Client/Candidates/schedule-interview/ClientScheduleInterview";
import Engagement from "./Components/Client/Engagement/Engagement";
import {
  Unauthorized,
  NotFound,
  UnauthorizedLayout,
} from "./Components/shared/unauthorized";
import { JobProvider } from "./context/JobContext";
import AddJob from "./Components/Client/Jobs/AddJob";
import JobDetails from "./Components/Client/Jobs/JobDetails";
import EmailVerification from "./Components/Authentication/EmailVerification";
import InterviewerConfirmation from "./Components/Interviewer/confirmation/InterviewConfirmation";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<PersistLogin />}>
        {/* Authentication Routes */}
        <Route element={<AuthWrapper />}>
          <Route
            path="auth"
            element={<SignUpSignInLayout />}
          >
            <Route
              path="forgetpass"
              element={<ForgetPass />}
            />
            <Route path="signup" element={<SignUp />} />
            <Route
              path="signin/loginmail"
              element={<LoginUsingEmail />}
            />
            <Route
              path="signin/loginnumber"
              element={<LoginUsingNumber />}
            />
            <Route
              path="password-reset/:id"
              element={<PasswordReset />}
            />
          </Route>
          <Route
            path="verification/:verification_data_uid"
            element={<EmailVerification />}
          />
        </Route>
        {/* User Routes */}
        <Route
          element={
            <RequireAuth allowedRoles={ROLES.USER} />
          }
        >
          <Route path="" element={<Hello />} />
        </Route>
        {/* Client Activation Route */}
        <Route element={<SignUpSignInLayout />}>
          <Route
            path="/client/client-user-activate/:id"
            element={<UserActivation />}
          />
        </Route>
        {/* //Client Routes */}
        <Route
          element={
            <RequireAuth allowedRoles={ROLES.CLIENT} />
          }
        >
          <Route
            path="client"
            element={<NavigationLayout />}
          >
            <Route path="message" element={<Message />} />
            <Route
              path="dashboard"
              element={<Dashboard />}
            />
            <Route path="settings" element={<Settings />} />
            <Route path="" element={<JobProvider />}>
              <Route path="jobs">
                <Route index element={<Jobs />} />
                <Route
                  path="add-job"
                  element={<AddJob />}
                />
                <Route
                  path="job-details"
                  element={<JobDetails />}
                />
              </Route>
            </Route>

            <Route path="candidates">
              <Route index element={<Candidates />} />
              <Route
                path="add-candidate"
                element={<ClientAddCandidate />}
              />
              <Route
                path="schedule-interview"
                element={<ClientScheduleInterview />}
              />
            </Route>

            <Route path="analytics">
              <Route index element={<Analytics />} />
              <Route
                path="filter"
                element={<AnalyticsDateFilter />}
              />
            </Route>

            <Route
              path="integration"
              element={<Integration />}
            />
            <Route path="finance" element={<Finance />} />
            <Route
              path="engagement/*"
              element={<Engagement />}
            />
          </Route>
        </Route>
        {/* //Agency Routes */}
        <Route
          element={
            <RequireAuth allowedRoles={ROLES.AGENCY} />
          }
        >
          <Route
            path="agency"
            element={<NavigationLayout />}
          >
            <Route
              path="dashboard"
              element={<AgencyDashboard />}
            />
            <Route path="candidates">
              <Route
                path=""
                element={<AgencyCandidates />}
              />
              <Route
                path="schedule-interview"
                element={<AgencyScheduleInterview />}
              />
              <Route
                path="addcandidate"
                element={<AgencyAddCandidate />}
              />
            </Route>
          </Route>
        </Route>
        {/* //Internal Routes */}
        <Route
          element={
            <RequireAuth allowedRoles={ROLES.INTERNAL} />
          }
        >
          <Route
            path="internal"
            element={<NavigationLayout />}
          >
            <Route
              path="dashboard"
              element={<InternalDashboard />}
            />
            <Route path="clients">
              <Route
                path=""
                element={<InternalClients />}
              />
              <Route
                path="addclient"
                element={<InternalAddClient />}
              />
            </Route>
            <Route path="interviewer">
              <Route
                path=""
                element={<InternalInterviewer />}
              />
              <Route
                path="addinterviewer"
                element={<InternalAddInterviewer />}
              />
            </Route>
            <Route
              path="users"
              element={<InternalUsers />}
            />
            <Route
              path="agreements"
              element={<InternalAgreements />}
            />
            <Route
              path="finance"
              element={<InternalFinance />}
            />
            <Route
              path="engagement"
              element={<InternalEngagement />}
            />
            <Route
              path="engagement/*"
              element={<Engagement />}
            />
            <Route
              path="message"
              element={<InternalMessages />}
            />
          </Route>
        </Route>
        {/* //Interviewer Routes */}
        <Route
          element={
            <RequireAuth allowedRoles={ROLES.INTERVIEWER} />
          }
        >
          <Route path="interviewer" element={<Layout />}>
            <Route
              path="dashboard"
              element={<InterviewRecord />}
            />
            <Route
              path="calendar"
              element={<CalendarComponent />}
            />
            <Route path="payments" element={<Payments />} />
            <Route
              path="feedback/:id"
              element={<Feedback />}
            />
          </Route>
        </Route>
      </Route>
      <Route path="" element={<UnauthorizedLayout />}>
        <Route
          path="unauthorized"
          element={<Unauthorized />}
        />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/confirmation/:id"
          element={<InterviewerConfirmation />}
        />
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
};

export default App;
