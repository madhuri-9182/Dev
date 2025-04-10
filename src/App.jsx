import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ROLES } from "./Components/Constants/constants";
// Interviewer Imports
import {
  CalendarComponent,
  InterviewRecord,
  Payments,
  Feedback,
  InterviewerConfirmation,
  Layout,
  InterviewerTermsAndConditions,
} from "./Components";
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
  InternalAddClient,
  InternalAddInterviewer,
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
} from "./Components";
// Authentication Imports
import {
  // SignIn,
  VerificationEmail,
  AuthWrapper,
  SignUp,
  ForgetPass,
  PasswordReset,
  SignUpSignInLayout,
  LoginUsingEmail,
  LoginUsingNumber,
  PersistLogin,
  RequireAuth,
} from "./Components";
// Shared Imports
import {
  NotFound,
  NavigationLayout,
  Unauthorized,
  UnauthorizedLayout,
} from "./Components";

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
            element={<VerificationEmail />}
          />
        </Route>
        {/* User Routes */}
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
              <Route path=":id">
                <Route index element={<CandidateView />} />
                <Route
                  path="feedback"
                  element={<CandidateFeedback />}
                />
              </Route>
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
            <Route
              path="tnc"
              element={<TermsAndConditions />}
            />
            <Route
              path="privacy-policy"
              element={<PrivacyPolicy />}
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
            <Route
              path="tnc"
              element={<TermsAndConditions />}
            />
            <Route
              path="privacy-policy"
              element={<PrivacyPolicy />}
            />
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
          <Route path="interviewer">
            {/* Feedback route with its own layout */}
            <Route element={<Layout />}>
              <Route
                path="feedback/:id"
                element={<Feedback />}
              />
            </Route>

            {/* Navigation layout routes */}
            <Route element={<NavigationLayout />}>
              <Route
                path="dashboard"
                element={<InterviewRecord />}
              />
              <Route
                path="calendar"
                element={<CalendarComponent />}
              />
              <Route
                path="payments"
                element={<Payments />}
              />
              <Route
                path="tnc"
                element={<InterviewerTermsAndConditions />}
              />
              <Route
                path="privacy-policy"
                element={<PrivacyPolicy />}
              />
            </Route>
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
