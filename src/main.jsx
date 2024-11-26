import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
//SignIn-SignUp Imports
import { SignIn, SignUp, ForgetPass, PasswordReset, SignUpSignInLayout, page, LoginUsingEmail, LoginUsingNumber } from './Components'
// Client Imports
import { NavigationLayout, Dashboard, Settings, Jobs, Candidates, Analytics, Integration, Finance, Engagement, Message } from './Components'
//Internal Imports
import {InternalNavigationLayout,InternalDashboard,InternalClients,InternalInterviewer,InternalUsers,InternalAgreements,InternalFinance,InternalEngagement,InternalMessages} from "./Components"
//Interviewer Imports
import { Layout, Calendar, InterviewRecord, Payments } from './Components'
import { Hello } from './Components'
import { InternalAddInterviewer } from './Components/Internal/AddInterviewer'
const router = createBrowserRouter( 
  createRoutesFromElements(
    <Route>
      <Route path='' element={<Hello />} />
      <Route path='auth'>
        
        <Route path='forgetpassword' element={<ForgetPass />} />


        <Route path='' element={<SignUpSignInLayout />} >
          <Route path='signup' element={<SignUp />} />
          <Route path='signin-mail' element={<LoginUsingEmail />} />
          <Route path='signin-number' element={<LoginUsingNumber />} />
          <Route path='resetpassword' element={<PasswordReset />} />
        </Route>

      </Route>




      <Route path='/auth/forgetpass' element={<ForgetPass />} />

      //Client Routes
      <Route path='client' element={<NavigationLayout />}>
        <Route path='message' element={<Message />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='settings' element={<Settings />} />
        <Route path='jobs' element={<Jobs />} />
        <Route path='candidates' element={<Candidates />} />
        <Route path='analytics' element={<Analytics />} />
        <Route path='integration' element={<Integration />} />
        <Route path='finance' element={<Finance />} />
        <Route path='engagement' element={<Engagement />} />
      </Route>

      //Internal Routes
      <Route path='internal' element={<InternalNavigationLayout/>}>
        <Route path='dashboard' element={<InternalDashboard/>} />
        <Route path='clients'>
        <Route path='' element={<InternalClients/>}/>
        <Route path='addclient' element={<InternalClients/>} />
        </Route>
        <Route path='interviewer' element={<InternalInterviewer/>} />
        <Route path='addinterviewer' element={<InternalAddInterviewer/>} />
        <Route path='users' element={<InternalUsers/>} />
        <Route path='agreements' element={<InternalAgreements/>} />
        <Route path='finance' element={<InternalFinance/>} />
        <Route path='engagement' element={<InternalEngagement/>}/>
        <Route path='message' element={<InternalMessages/>}/>
       
      </Route>


      //Interviewer Routes
      <Route path='interviewer' element={<Layout />}>
        <Route path='dashboard' element={<InterviewRecord />} />
        <Route path='calendar' element={<Calendar />} />
        <Route path='payments' element={<Payments />} />
      </Route>
























      <Route path='/auth' element={<SignUpSignInLayout />} >

        <Route path='signup' element={<SignUp />} />
        {/* <Route path='signin' element={<SignIn/>} /> */}
        <Route path='signin/loginmail' element={<LoginUsingEmail />} />
        <Route path='signin/loginnumber' element={<LoginUsingNumber />} />
        <Route path='signin/passwordreset' element={<PasswordReset />} />


      </Route>

      <Route>


      </Route>








    </Route>

  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
