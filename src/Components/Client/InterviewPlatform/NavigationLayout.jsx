// import React from 'react'
// import { NavLink, Link, useLocation } from 'react-router-dom';
// import { Outlet } from 'react-router-dom'

// function NavigationLayout() {
//     const location = useLocation();
//     const isMessageRouteActive = location.pathname === "/hiring-dog/client/message";
//     return (
//         <>
//             <div>
//                 <header className='p-2 h-[60px] bg-[#056DDC] flex items-center justify-between'>
//                     <div className='px-5 logo-brandName '>
//                         <h1 className='text-white text-[24px]'> <span className='font-bold'>HD</span> INTERVIEW PLATFORM</h1>
//                     </div>
//                     <div className='horizontal-navigation px-5 gap-x-2 flex items-center justify-center'>
//                         <NavLink
//                             to="settings"
//                             className="horizontal-setting p-2 bg-[#F5F7FA] rounded-full"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="718EBF"><path d="m382-80-18.67-126.67q-17-6.33-34.83-16.66-17.83-10.34-32.17-21.67L178-192.33 79.33-365l106.34-78.67q-1.67-8.33-2-18.16-.34-9.84-.34-18.17 0-8.33.34-18.17.33-9.83 2-18.16L79.33-595 178-767.67 296.33-715q14.34-11.33 32.34-21.67 18-10.33 34.66-16L382-880h196l18.67 126.67q17 6.33 35.16 16.33 18.17 10 31.84 22L782-767.67 880.67-595l-106.34 77.33q1.67 9 2 18.84.34 9.83.34 18.83 0 9-.34 18.5Q776-452 774-443l106.33 78-98.66 172.67-118-52.67q-14.34 11.33-32 22-17.67 10.67-35 16.33L578-80H382Zm55.33-66.67h85l14-110q32.34-8 60.84-24.5T649-321l103.67 44.33 39.66-70.66L701-415q4.33-16 6.67-32.17Q710-463.33 710-480q0-16.67-2-32.83-2-16.17-7-32.17l91.33-67.67-39.66-70.66L649-638.67q-22.67-25-50.83-41.83-28.17-16.83-61.84-22.83l-13.66-110h-85l-14 110q-33 7.33-61.5 23.83T311-639l-103.67-44.33-39.66 70.66L259-545.33Q254.67-529 252.33-513 250-497 250-480q0 16.67 2.33 32.67 2.34 16 6.67 32.33l-91.33 67.67 39.66 70.66L311-321.33q23.33 23.66 51.83 40.16 28.5 16.5 60.84 24.5l13.66 110Zm43.34-200q55.33 0 94.33-39T614-480q0-55.33-39-94.33t-94.33-39q-55.67 0-94.5 39-38.84 39-38.84 94.33t38.84 94.33q38.83 39 94.5 39ZM480-480Z" /></svg>
//                         </NavLink>
//                         <Link
//                             to="/hiring-dog/client/message"
//                             className="message p-2 bg-[#F5F7FA] rounded-full"
//                         >
//                             {isMessageRouteActive ? (
//                                 // SVG icon to display when the route is active
//                                 <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#EA3323"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
//                             ) : (
//                                 // Default SVG icon
//                                 <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#F00000"><path d="M146.67-160q-27 0-46.84-19.83Q80-199.67 80-226.67v-506.66q0-27 19.83-46.84Q119.67-800 146.67-800h424q-3.34 16.67-4 33.33-.67 16.67 2 33.34H150l330 212L629.33-617q11.34 10.33 24.17 18.62 12.83 8.28 26.83 14.38L480-454.67 146.67-670v443.33h666.66v-348q18.87-4.85 35.27-13.59Q865-597 880-608.67v382q0 27-19.83 46.84Q840.33-160 813.33-160H146.67Zm0-573.33v506.66-506.66Zm613.25 86.66q-47.25 0-80.25-33.08-33-33.07-33-80.33 0-47.25 33.08-80.25 33.07-33 80.33-33 47.25 0 80.25 33.08 33 33.07 33 80.33 0 47.25-33.08 80.25-33.07 33-80.33 33Z" /></svg>
//                             )}
//                         </Link>
//                         <Link
//                             to="#"
//                             className="loggedInUser"
//                         >

//                             <img
//                                 className='p-2 h-16 rounded-full overflow-hidden'
//                                 src="https://t4.ftcdn.net/jpg/05/86/94/95/360_F_586949566_ZRFuSSy8GSY6npXqnrJWhEdjqmlGURf2.jpg" alt="LoggedIn User" />

//                         </Link>

//                     </div>
//                 </header>
//                 <div className='flex'>
//                     <div className='verticalNavigation w-1/6 bg-gray-50'>
//                         <ul className='mt-10 flex flex-col items-center justify-center gap-1'>
//                             <li className='flex w-5/6 items-start justify-center gap-1'>
//                                 <NavLink
//                                     to="dashboard"
//                                     className={({ isActive }) =>
//                                         `${isActive ? "bg-blue-100" : ""} p-2 pl-8 w-full flex items-center justify-start gap-x-4 rounded-lg`
//                                     }

//                                 >
//                                     <div>
//                                         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M530-600v-220h290v220H530ZM140-460v-360h290v360H140Zm390 320v-360h290v360H530Zm-390 0v-220h290v220H140Zm60-380h170v-240H200v240Zm390 320h170v-240H590v240Zm0-460h170v-100H590v100ZM200-200h170v-100H200v100Zm170-320Zm220-140Zm0 220ZM370-300Z" /></svg>
//                                     </div>
//                                     <div>
//                                         <p className='text-[18px] font-medium'>Dashboard</p>
//                                     </div>
//                                 </NavLink>
//                             </li>
//                             <li className='flex w-5/6 items-start justify-center gap-1'>
//                                 <NavLink
//                                     to="settings"
//                                     className={({ isActive }) =>
//                                         `${isActive ? "bg-blue-100" : ""} p-2 pl-8 w-full flex items-center justify-start gap-x-4 rounded-lg`
//                                     }
//                                 >
//                                     <div>
//                                         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="m387.69-100-15.23-121.85q-16.07-5.38-32.96-15.07-16.88-9.7-30.19-20.77L196.46-210l-92.3-160 97.61-73.77q-1.38-8.92-1.96-17.92-.58-9-.58-17.93 0-8.53.58-17.34t1.96-19.27L104.16-590l92.3-159.23 112.46 47.31q14.47-11.46 30.89-20.96t32.27-15.27L387.69-860h184.62l15.23 122.23q18 6.54 32.57 15.27 14.58 8.73 29.43 20.58l114-47.31L855.84-590l-99.15 74.92q2.15 9.69 2.35 18.12.19 8.42.19 16.96 0 8.15-.39 16.58-.38 8.42-2.76 19.27L854.46-370l-92.31 160-112.61-48.08q-14.85 11.85-30.31 20.96-15.46 9.12-31.69 14.89L572.31-100H387.69ZM440-160h78.62L533-267.15q30.62-8 55.96-22.73 25.35-14.74 48.89-37.89L737.23-286l39.39-68-86.77-65.38q5-15.54 6.8-30.47 1.81-14.92 1.81-30.15 0-15.62-1.81-30.15-1.8-14.54-6.8-29.7L777.38-606 738-674l-100.54 42.38q-20.08-21.46-48.11-37.92-28.04-16.46-56.73-23.31L520-800h-79.38l-13.24 106.77q-30.61 7.23-56.53 22.15-25.93 14.93-49.47 38.46L222-674l-39.38 68L269-541.62q-5 14.24-7 29.62t-2 32.38q0 15.62 2 30.62 2 15 6.62 29.62l-86 65.38L222-286l99-42q22.77 23.38 48.69 38.31 25.93 14.92 57.31 22.92L440-160Zm40.46-200q49.92 0 84.96-35.04 35.04-35.04 35.04-84.96 0-49.92-35.04-84.96Q530.38-600 480.46-600q-50.54 0-85.27 35.04T360.46-480q0 49.92 34.73 84.96Q429.92-360 480.46-360ZM480-480Z" /></svg>
//                                     </div>
//                                     <div>
//                                         <p className='text-[18px] font-medium'>Settings</p>
//                                     </div>
//                                 </NavLink>
//                             </li>
//                             <li className='flex w-5/6 items-start justify-center gap-1'>
//                                 <NavLink
//                                     to="jobs"
//                                     className={({ isActive }) =>
//                                         `${isActive ? "bg-blue-100" : ""} p-2 pl-8 w-full flex items-center justify-start gap-x-4 rounded-lg`
//                                     }
//                                 >
//                                     <div>
//                                         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Zm400 360H600v80H360v-80H160v160h640v-160Zm-360 0h80v-80h-80v80Zm-280-80h200v-80h240v80h200v-200H160v200Zm320 40Z" /></svg>
//                                     </div>
//                                     <div>
//                                         <p className='text-[18px] font-medium'>Jobs</p>
//                                     </div>
//                                 </NavLink>
//                             </li>
//                             <li className='flex w-5/6 items-start justify-center gap-1'>
//                                 <NavLink
//                                     to="candidates"
//                                     className={({ isActive }) =>
//                                         `${isActive ? "bg-blue-100" : ""} p-2 pl-8 w-full flex items-center justify-start gap-x-4 rounded-lg`
//                                     }
//                                 >
//                                     <div>
//                                         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg>
//                                     </div>
//                                     <div>
//                                         <p className='text-[18px] font-medium'>Candidates</p>
//                                     </div>
//                                 </NavLink>
//                             </li>
//                             <li className='flex w-5/6 items-start justify-center gap-1'>
//                                 <NavLink
//                                     to="analytics"
//                                     className={({ isActive }) =>
//                                         `${isActive ? "bg-blue-100" : ""} p-2 pl-8 w-full flex items-center justify-start gap-x-4 rounded-lg`
//                                     }
//                                 >
//                                     <div>
//                                         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M280-280h80v-280h-80v280Zm160 0h80v-400h-80v400Zm160 0h80v-160h-80v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
//                                     </div>
//                                     <div>
//                                         <p className='text-[18px] font-medium'>Analytics</p>
//                                     </div>
//                                 </NavLink>
//                             </li>
//                             <li className='flex w-5/6 items-start justify-center gap-1'>
//                                 <NavLink
//                                     to="integration"
//                                     className={({ isActive }) =>
//                                         `${isActive ? "bg-blue-100" : ""} p-2 pl-8 w-full flex items-center justify-start gap-x-4 rounded-lg`
//                                     }
//                                 >
//                                     <div>
//                                         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M480-91.54 130-285.77v-388.46l350-194.23 350 194.23v388.46L480-91.54ZM365.92-577.69q21.85-24.77 51.46-38.54Q447-630 480-630t62.62 13.77q29.61 13.77 51.46 38.54L736.39-657 480-799.54 223.61-657l142.31 79.31ZM450-177.08v-155.61q-52.85-11.7-86.42-52.77Q330-426.54 330-480q0-12.15 1.58-22.81 1.57-10.65 5.34-21.81L190-606.92v285.69l260 144.15ZM480-390q37.62 0 63.81-26.19Q570-442.38 570-480q0-37.62-26.19-63.81Q517.62-570 480-570q-37.62 0-63.81 26.19Q390-517.62 390-480q0 37.62 26.19 63.81Q442.38-390 480-390Zm30 212.92 260-144.15v-285.69l-146.92 82.3q3.77 11.16 5.34 21.81Q630-492.15 630-480q0 53.46-33.58 94.54-33.57 41.07-86.42 52.77v155.61Z" /></svg>
//                                     </div>
//                                     <div>
//                                         <p className='text-[18px] font-medium'>Integration</p>
//                                     </div>
//                                 </NavLink>
//                             </li>
//                             <li className='flex w-5/6 items-start justify-center gap-1'>
//                                 <NavLink
//                                     to="finance"
//                                     className={({ isActive }) =>
//                                         `${isActive ? "bg-blue-100" : ""} p-2 pl-8 w-full flex items-center justify-start gap-x-4 rounded-lg`
//                                     }
//                                 >
//                                     <div>
//                                         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M550-451.54q-41.92 0-70.96-29.04Q450-509.62 450-551.54q0-41.92 29.04-70.96 29.04-29.04 70.96-29.04 41.92 0 70.96 29.04Q650-593.46 650-551.54q0 41.92-29.04 70.96-29.04 29.04-70.96 29.04ZM286.15-327.69q-29.82 0-51.06-21.24-21.24-21.24-21.24-51.07v-303.08q0-29.82 21.24-51.06 21.24-21.24 51.06-21.24h527.69q29.83 0 51.07 21.24 21.24 21.24 21.24 51.06V-400q0 29.83-21.24 51.07-21.24 21.24-51.07 21.24H286.15Zm60-60h407.7q0-29.92 21.24-51.12Q796.33-460 826.15-460v-183.08q-29.92 0-51.11-21.24-21.19-21.24-21.19-51.06h-407.7q0 29.92-21.24 51.11-21.24 21.19-51.06 21.19V-460q29.92 0 51.11 21.24 21.19 21.24 21.19 51.07Zm420.77 200H146.16q-29.83 0-51.07-21.24Q73.85-230.17 73.85-260v-396.15h60V-260q0 4.61 3.84 8.46 3.85 3.85 8.47 3.85h620.76v60Zm-480.77-200h-12.3V-715.38h12.3q-5 0-8.65 3.65-3.65 3.65-3.65 8.65V-400q0 5 3.65 8.65 3.65 3.66 8.65 3.66Z" /></svg>
//                                     </div>
//                                     <div>
//                                         <p className='text-[18px] font-medium'>Finance</p>
//                                     </div>
//                                 </NavLink>
//                             </li>
//                             <li className='flex w-5/6 items-start justify-center gap-1'>
//                                 <NavLink
//                                     to="engagement"
//                                     className={({ isActive }) =>
//                                         `${isActive ? "bg-blue-100" : ""} p-2 pl-8 w-full flex items-center justify-start gap-x-4 rounded-lg`
//                                     }
//                                 >
//                                     <div>
//                                         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="m430-59.62-41.77-42.77 83-83H310.69q-9.92 30.39-35.8 50.2-25.89 19.8-59.5 19.8-41.67 0-70.84-29.16-29.16-29.17-29.16-70.84 0-33.61 19.8-59.5 19.81-25.88 50.2-35.8v-338.62q-30.39-9.92-50.2-35.8-19.8-25.89-19.8-59.5 0-41.67 29.16-70.84 29.17-29.16 70.84-29.16 33.61 0 59.5 19.8 25.88 19.81 35.8 50.2h160.54l-83.38-83L430-900.38l155.77 155.77L430-588.85l-42.15-42.76 83.38-83H310.69q-7.46 23.69-24.54 40.76-17.07 17.08-40.76 24.54v338.62q23.69 7.46 40.76 24.54 17.08 17.07 24.54 40.76h160.16l-82.62-83L430-371.15l155.77 155.76L430-59.62Zm314.7-55.77q-41.62 0-70.85-29.16-29.23-29.17-29.23-70.84 0-34.05 19.8-60.02 19.81-25.97 50.19-35.28v-338.62q-30.38-9.31-50.19-35.28-19.8-25.97-19.8-60.02 0-41.67 29.14-70.84 29.14-29.16 70.76-29.16 41.63 0 70.86 29.16 29.23 29.17 29.23 70.84 0 34.05-19.8 60.02-19.81 25.97-50.2 35.28v338.62q30.39 9.92 50.2 35.8 19.8 25.89 19.8 59.5 0 41.67-29.14 70.84-29.14 29.16-70.77 29.16Zm-529.31-60q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Zm529.22 0q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5ZM215.39-704.61q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Zm529.22 0q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5ZM215.39-215.39Zm529.22 0ZM215.39-744.61Zm529.22 0Z" /></svg>
//                                     </div>
//                                     <div>
//                                         <p className='text-[18px] font-medium'>Engagement</p>
//                                     </div>
//                                 </NavLink>
//                             </li>

//                         </ul>
//                     </div>
//                     <div className='navigationContent m-0 p-0 w-full'>
//                         <Outlet />
//                     </div>

//                 </div>
//             </div>
//         </>
//     )
// }

// export default NavigationLayout



import * as React from 'react';
import { NavLink, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M530-600v-220h290v220H530ZM140-460v-360h290v360H140Zm390 320v-360h290v360H530Zm-390 0v-220h290v220H140Zm60-380h170v-240H200v240Zm390 320h170v-240H590v240Zm0-460h170v-100H590v100ZM200-200h170v-100H200v100Zm170-320Zm220-140Zm0 220ZM370-300Z" /></svg>

);
const ActiveDashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M530-600v-220h290v220H530ZM140-460v-360h290v360H140Zm390 320v-360h290v360H530Zm-390 0v-220h290v220H140Zm60-380h170v-240H200v240Zm390 320h170v-240H590v240Zm0-460h170v-100H590v100ZM200-200h170v-100H200v100Zm170-320Zm220-140Zm0 220ZM370-300Z" /></svg>
);

const SettingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="m387.69-100-15.23-121.85q-16.07-5.38-32.96-15.07-16.88-9.7-30.19-20.77L196.46-210l-92.3-160 97.61-73.77q-1.38-8.92-1.96-17.92-.58-9-.58-17.93 0-8.53.58-17.34t1.96-19.27L104.16-590l92.3-159.23 112.46 47.31q14.47-11.46 30.89-20.96t32.27-15.27L387.69-860h184.62l15.23 122.23q18 6.54 32.57 15.27 14.58 8.73 29.43 20.58l114-47.31L855.84-590l-99.15 74.92q2.15 9.69 2.35 18.12.19 8.42.19 16.96 0 8.15-.39 16.58-.38 8.42-2.76 19.27L854.46-370l-92.31 160-112.61-48.08q-14.85 11.85-30.31 20.96-15.46 9.12-31.69 14.89L572.31-100H387.69ZM440-160h78.62L533-267.15q30.62-8 55.96-22.73 25.35-14.74 48.89-37.89L737.23-286l39.39-68-86.77-65.38q5-15.54 6.8-30.47 1.81-14.92 1.81-30.15 0-15.62-1.81-30.15-1.8-14.54-6.8-29.7L777.38-606 738-674l-100.54 42.38q-20.08-21.46-48.11-37.92-28.04-16.46-56.73-23.31L520-800h-79.38l-13.24 106.77q-30.61 7.23-56.53 22.15-25.93 14.93-49.47 38.46L222-674l-39.38 68L269-541.62q-5 14.24-7 29.62t-2 32.38q0 15.62 2 30.62 2 15 6.62 29.62l-86 65.38L222-286l99-42q22.77 23.38 48.69 38.31 25.93 14.92 57.31 22.92L440-160Zm40.46-200q49.92 0 84.96-35.04 35.04-35.04 35.04-84.96 0-49.92-35.04-84.96Q530.38-600 480.46-600q-50.54 0-85.27 35.04T360.46-480q0 49.92 34.73 84.96Q429.92-360 480.46-360ZM480-480Z" /></svg>
);
const ActiveSettingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="m387.69-100-15.23-121.85q-16.07-5.38-32.96-15.07-16.88-9.7-30.19-20.77L196.46-210l-92.3-160 97.61-73.77q-1.38-8.92-1.96-17.92-.58-9-.58-17.93 0-8.53.58-17.34t1.96-19.27L104.16-590l92.3-159.23 112.46 47.31q14.47-11.46 30.89-20.96t32.27-15.27L387.69-860h184.62l15.23 122.23q18 6.54 32.57 15.27 14.58 8.73 29.43 20.58l114-47.31L855.84-590l-99.15 74.92q2.15 9.69 2.35 18.12.19 8.42.19 16.96 0 8.15-.39 16.58-.38 8.42-2.76 19.27L854.46-370l-92.31 160-112.61-48.08q-14.85 11.85-30.31 20.96-15.46 9.12-31.69 14.89L572.31-100H387.69ZM440-160h78.62L533-267.15q30.62-8 55.96-22.73 25.35-14.74 48.89-37.89L737.23-286l39.39-68-86.77-65.38q5-15.54 6.8-30.47 1.81-14.92 1.81-30.15 0-15.62-1.81-30.15-1.8-14.54-6.8-29.7L777.38-606 738-674l-100.54 42.38q-20.08-21.46-48.11-37.92-28.04-16.46-56.73-23.31L520-800h-79.38l-13.24 106.77q-30.61 7.23-56.53 22.15-25.93 14.93-49.47 38.46L222-674l-39.38 68L269-541.62q-5 14.24-7 29.62t-2 32.38q0 15.62 2 30.62 2 15 6.62 29.62l-86 65.38L222-286l99-42q22.77 23.38 48.69 38.31 25.93 14.92 57.31 22.92L440-160Zm40.46-200q49.92 0 84.96-35.04 35.04-35.04 35.04-84.96 0-49.92-35.04-84.96Q530.38-600 480.46-600q-50.54 0-85.27 35.04T360.46-480q0 49.92 34.73 84.96Q429.92-360 480.46-360ZM480-480Z" /></svg>
    

);
const JobIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Zm400 360H600v80H360v-80H160v160h640v-160Zm-360 0h80v-80h-80v80Zm-280-80h200v-80h240v80h200v-200H160v200Zm320 40Z" /></svg>


);
const ActiveJobIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Zm400 360H600v80H360v-80H160v160h640v-160Zm-360 0h80v-80h-80v80Zm-280-80h200v-80h240v80h200v-200H160v200Zm320 40Z" /></svg>
    

);
const CandidatesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg>


);
const ActiveCandidatesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg>
    
 
);
const AnalyticsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M280-280h80v-280h-80v280Zm160 0h80v-400h-80v400Zm160 0h80v-160h-80v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>


);
const ActiveAnalyticsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M280-280h80v-280h-80v280Zm160 0h80v-400h-80v400Zm160 0h80v-160h-80v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
    

);
const IntegrationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M480-91.54 130-285.77v-388.46l350-194.23 350 194.23v388.46L480-91.54ZM365.92-577.69q21.85-24.77 51.46-38.54Q447-630 480-630t62.62 13.77q29.61 13.77 51.46 38.54L736.39-657 480-799.54 223.61-657l142.31 79.31ZM450-177.08v-155.61q-52.85-11.7-86.42-52.77Q330-426.54 330-480q0-12.15 1.58-22.81 1.57-10.65 5.34-21.81L190-606.92v285.69l260 144.15ZM480-390q37.62 0 63.81-26.19Q570-442.38 570-480q0-37.62-26.19-63.81Q517.62-570 480-570q-37.62 0-63.81 26.19Q390-517.62 390-480q0 37.62 26.19 63.81Q442.38-390 480-390Zm30 212.92 260-144.15v-285.69l-146.92 82.3q3.77 11.16 5.34 21.81Q630-492.15 630-480q0 53.46-33.58 94.54-33.57 41.07-86.42 52.77v155.61Z" /></svg>


);
const ActiveIntegrationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M480-91.54 130-285.77v-388.46l350-194.23 350 194.23v388.46L480-91.54ZM365.92-577.69q21.85-24.77 51.46-38.54Q447-630 480-630t62.62 13.77q29.61 13.77 51.46 38.54L736.39-657 480-799.54 223.61-657l142.31 79.31ZM450-177.08v-155.61q-52.85-11.7-86.42-52.77Q330-426.54 330-480q0-12.15 1.58-22.81 1.57-10.65 5.34-21.81L190-606.92v285.69l260 144.15ZM480-390q37.62 0 63.81-26.19Q570-442.38 570-480q0-37.62-26.19-63.81Q517.62-570 480-570q-37.62 0-63.81 26.19Q390-517.62 390-480q0 37.62 26.19 63.81Q442.38-390 480-390Zm30 212.92 260-144.15v-285.69l-146.92 82.3q3.77 11.16 5.34 21.81Q630-492.15 630-480q0 53.46-33.58 94.54-33.57 41.07-86.42 52.77v155.61Z" /></svg>
    

);
const FinanceIcon= () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M550-451.54q-41.92 0-70.96-29.04Q450-509.62 450-551.54q0-41.92 29.04-70.96 29.04-29.04 70.96-29.04 41.92 0 70.96 29.04Q650-593.46 650-551.54q0 41.92-29.04 70.96-29.04 29.04-70.96 29.04ZM286.15-327.69q-29.82 0-51.06-21.24-21.24-21.24-21.24-51.07v-303.08q0-29.82 21.24-51.06 21.24-21.24 51.06-21.24h527.69q29.83 0 51.07 21.24 21.24 21.24 21.24 51.06V-400q0 29.83-21.24 51.07-21.24 21.24-51.07 21.24H286.15Zm60-60h407.7q0-29.92 21.24-51.12Q796.33-460 826.15-460v-183.08q-29.92 0-51.11-21.24-21.19-21.24-21.19-51.06h-407.7q0 29.92-21.24 51.11-21.24 21.19-51.06 21.19V-460q29.92 0 51.11 21.24 21.19 21.24 21.19 51.07Zm420.77 200H146.16q-29.83 0-51.07-21.24Q73.85-230.17 73.85-260v-396.15h60V-260q0 4.61 3.84 8.46 3.85 3.85 8.47 3.85h620.76v60Zm-480.77-200h-12.3V-715.38h12.3q-5 0-8.65 3.65-3.65 3.65-3.65 8.65V-400q0 5 3.65 8.65 3.65 3.66 8.65 3.66Z" /></svg>


);
const ActiveFinanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M550-451.54q-41.92 0-70.96-29.04Q450-509.62 450-551.54q0-41.92 29.04-70.96 29.04-29.04 70.96-29.04 41.92 0 70.96 29.04Q650-593.46 650-551.54q0 41.92-29.04 70.96-29.04 29.04-70.96 29.04ZM286.15-327.69q-29.82 0-51.06-21.24-21.24-21.24-21.24-51.07v-303.08q0-29.82 21.24-51.06 21.24-21.24 51.06-21.24h527.69q29.83 0 51.07 21.24 21.24 21.24 21.24 51.06V-400q0 29.83-21.24 51.07-21.24 21.24-51.07 21.24H286.15Zm60-60h407.7q0-29.92 21.24-51.12Q796.33-460 826.15-460v-183.08q-29.92 0-51.11-21.24-21.19-21.24-21.19-51.06h-407.7q0 29.92-21.24 51.11-21.24 21.19-51.06 21.19V-460q29.92 0 51.11 21.24 21.19 21.24 21.19 51.07Zm420.77 200H146.16q-29.83 0-51.07-21.24Q73.85-230.17 73.85-260v-396.15h60V-260q0 4.61 3.84 8.46 3.85 3.85 8.47 3.85h620.76v60Zm-480.77-200h-12.3V-715.38h12.3q-5 0-8.65 3.65-3.65 3.65-3.65 8.65V-400q0 5 3.65 8.65 3.65 3.66 8.65 3.66Z" /></svg>
    

);
const EngagementIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="m430-59.62-41.77-42.77 83-83H310.69q-9.92 30.39-35.8 50.2-25.89 19.8-59.5 19.8-41.67 0-70.84-29.16-29.16-29.17-29.16-70.84 0-33.61 19.8-59.5 19.81-25.88 50.2-35.8v-338.62q-30.39-9.92-50.2-35.8-19.8-25.89-19.8-59.5 0-41.67 29.16-70.84 29.17-29.16 70.84-29.16 33.61 0 59.5 19.8 25.88 19.81 35.8 50.2h160.54l-83.38-83L430-900.38l155.77 155.77L430-588.85l-42.15-42.76 83.38-83H310.69q-7.46 23.69-24.54 40.76-17.07 17.08-40.76 24.54v338.62q23.69 7.46 40.76 24.54 17.08 17.07 24.54 40.76h160.16l-82.62-83L430-371.15l155.77 155.76L430-59.62Zm314.7-55.77q-41.62 0-70.85-29.16-29.23-29.17-29.23-70.84 0-34.05 19.8-60.02 19.81-25.97 50.19-35.28v-338.62q-30.38-9.31-50.19-35.28-19.8-25.97-19.8-60.02 0-41.67 29.14-70.84 29.14-29.16 70.76-29.16 41.63 0 70.86 29.16 29.23 29.17 29.23 70.84 0 34.05-19.8 60.02-19.81 25.97-50.2 35.28v338.62q30.39 9.92 50.2 35.8 19.8 25.89 19.8 59.5 0 41.67-29.14 70.84-29.14 29.16-70.77 29.16Zm-529.31-60q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Zm529.22 0q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5ZM215.39-704.61q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Zm529.22 0q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5ZM215.39-215.39Zm529.22 0ZM215.39-744.61Zm529.22 0Z" /></svg>


);
const ActiveEngagementIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="m430-59.62-41.77-42.77 83-83H310.69q-9.92 30.39-35.8 50.2-25.89 19.8-59.5 19.8-41.67 0-70.84-29.16-29.16-29.17-29.16-70.84 0-33.61 19.8-59.5 19.81-25.88 50.2-35.8v-338.62q-30.39-9.92-50.2-35.8-19.8-25.89-19.8-59.5 0-41.67 29.16-70.84 29.17-29.16 70.84-29.16 33.61 0 59.5 19.8 25.88 19.81 35.8 50.2h160.54l-83.38-83L430-900.38l155.77 155.77L430-588.85l-42.15-42.76 83.38-83H310.69q-7.46 23.69-24.54 40.76-17.07 17.08-40.76 24.54v338.62q23.69 7.46 40.76 24.54 17.08 17.07 24.54 40.76h160.16l-82.62-83L430-371.15l155.77 155.76L430-59.62Zm314.7-55.77q-41.62 0-70.85-29.16-29.23-29.17-29.23-70.84 0-34.05 19.8-60.02 19.81-25.97 50.19-35.28v-338.62q-30.38-9.31-50.19-35.28-19.8-25.97-19.8-60.02 0-41.67 29.14-70.84 29.14-29.16 70.76-29.16 41.63 0 70.86 29.16 29.23 29.17 29.23 70.84 0 34.05-19.8 60.02-19.81 25.97-50.2 35.28v338.62q30.39 9.92 50.2 35.8 19.8 25.89 19.8 59.5 0 41.67-29.14 70.84-29.14 29.16-70.77 29.16Zm-529.31-60q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Zm529.22 0q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5ZM215.39-704.61q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5Zm529.22 0q17 0 28.5-11.5t11.5-28.5q0-17-11.5-28.5t-28.5-11.5q-17 0-28.5 11.5t-11.5 28.5q0 17 11.5 28.5t28.5 11.5ZM215.39-215.39Zm529.22 0ZM215.39-744.61Zm529.22 0Z" /></svg>


);

function NavigationLayout() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const location = useLocation();
    const isMessageRouteActive = location.pathname === "/hiring-dog/client/message";

    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />,icon2:<ActiveDashboardIcon/>, link: '/client/dashboard' },
        { text: 'Settings', icon: <SettingIcon />,icon2:<ActiveSettingIcon/>, link: '/client/settings' },
        { text: 'Jobs', icon: <JobIcon />,icon2:<ActiveJobIcon/>, link: '/client/jobs' },
        { text: 'Candidates', icon: <CandidatesIcon />,icon2:<ActiveCandidatesIcon/>, link: '/client/candidates' },
        { text: 'Analytics', icon: <AnalyticsIcon />,icon2:<ActiveAnalyticsIcon/>, link: '/client/analytics' },
        { text: 'Integration', icon: <IntegrationIcon />,icon2:<ActiveIntegrationIcon/>, link: '/client/integration' },
        { text: 'Finance', icon: <FinanceIcon />,icon2:<ActiveFinanceIcon/>, link: '/client/finance' },
        { text: 'Engagement', icon: <EngagementIcon />,icon2:<ActiveEngagementIcon/>, link: '/client/engagement' },
    ];



    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar
                    className=' bg-[#056DDC]'
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div"
                        className='w-full'
                    >
                        <div className='p-2 h-[60px] bg-[#056DDC] flex items-center justify-between'>
                            <div className=' logo-brandName '>
                                <h1 className='text-white text-[24px]'> <span className='font-bold'>HD</span> INTERVIEW PLATFORM</h1>
                            </div>
                            <div className='horizontal-navigation px-5 gap-x-2 flex items-center justify-center'>
                                <Link
                                    to="/internal/message"
                                    className="message p-2 bg-[#F5F7FA] rounded-full"
                                >
                                    {isMessageRouteActive ? (
                                        // SVG icon to display when the route is active
                                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#EA3323"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" /></svg>
                                    ) : (
                                        // Default SVG ico
                                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#F00000"><path d="M146.67-160q-27 0-46.84-19.83Q80-199.67 80-226.67v-506.66q0-27 19.83-46.84Q119.67-800 146.67-800h424q-3.34 16.67-4 33.33-.67 16.67 2 33.34H150l330 212L629.33-617q11.34 10.33 24.17 18.62 12.83 8.28 26.83 14.38L480-454.67 146.67-670v443.33h666.66v-348q18.87-4.85 35.27-13.59Q865-597 880-608.67v382q0 27-19.83 46.84Q840.33-160 813.33-160H146.67Zm0-573.33v506.66-506.66Zm613.25 86.66q-47.25 0-80.25-33.08-33-33.07-33-80.33 0-47.25 33.08-80.25 33.07-33 80.33-33 47.25 0 80.25 33.08 33 33.07 33 80.33 0 47.25-33.08 80.25-33.07 33-80.33 33Z" /></svg>
                                    )}
                                </Link>
                                <Link
                                    to="#"
                                    className="loggedInUser"
                                >
                                    <img
                                        className='p-2 h-16 rounded-full overflow-hidden'
                                        src="https://t4.ftcdn.net/jpg/05/86/94/95/360_F_586949566_ZRFuSSy8GSY6npXqnrJWhEdjqmlGURf2.jpg" alt="LoggedIn User" />

                                </Link>

                            </div>

                        </div>

                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer 
            variant="permanent" 
            open={open}
            // sx={{
            //     width: drawerWidth,
            //     flexShrink: 0,
            //     '& .MuiDrawer-paper': {
            //       width: drawerWidth,
            //       boxSizing: 'border-box',
            //       border: 'none', // Highlight: Removed border from Drawer
            //     },
            //   }}
            >
                <DrawerHeader>
                    <div
                    className='flex items-center justify-around h-full w-full'
                    >
                        <div>
                            <h1 className='text-2xl text-[#056DDC]'>Hi, Ashok</h1>
                        </div>
                        <div>
                        <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                        </div>
                    </div>
                
                   
                </DrawerHeader>
                <Divider />
                <List
                 sx={ {border: 'none'}}
                >
                    {navItems.map((items) => (
                        <ListItem key={items.text} disablePadding sx={{ display: 'block' }}
                            className={`${location.pathname.startsWith(items.link) ? "bg-blue-100" : ""} `}
                        >
                            <ListItemButton
                                sx={[
                                    { minHeight: 48, px: 2.5 },
                                    open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                                ]}

                                onClick={() => navigate(items.link)}
                            >
                                <ListItemIcon
                                    sx={[
                                        { minWidth: 0, justifyContent: 'center' },
                                        open ? { mr: 3 } : { mr: 'auto' },
                                    ]}
                                    className=''
                                >
                                     {location.pathname.startsWith(items.link) ? items.icon2 : items.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={items.text}
                                    className={`${location.pathname.startsWith(items.link)? "text-[#056DDC]" : ""} ${open ? "opacity-100" : "opacity-0"}`}
                                    style={{ fontWeight: location.pathname === items.link ? "800" : "normal" }}
                                    // sx={[open ? { opacity: 1,} : { opacity: 0 }]}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
}


export default NavigationLayout 
