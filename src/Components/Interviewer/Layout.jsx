import React from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom'

function Layout() {
    const location = useLocation();
    const isMessageRouteActive = location.pathname === "/hiring-dog/message";
    return (
        <>
            <div>
                <header className='p-2 h-[60px] bg-[#056DDC] flex items-center justify-between'>
                    <div className='px-5 logo-brandName '>
                        <h1 className='text-white text-[24px]'> <span className='font-bold'>HD</span> INTERVIEW PLATFORM</h1>
                    </div>
                    <div className='horizontal-navigation px-5 gap-x-2 flex items-center justify-center'>
                        <NavLink
                            to="settings"
                            className="horizontal-setting p-2 bg-[#F5F7FA] rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="718EBF"><path d="m382-80-18.67-126.67q-17-6.33-34.83-16.66-17.83-10.34-32.17-21.67L178-192.33 79.33-365l106.34-78.67q-1.67-8.33-2-18.16-.34-9.84-.34-18.17 0-8.33.34-18.17.33-9.83 2-18.16L79.33-595 178-767.67 296.33-715q14.34-11.33 32.34-21.67 18-10.33 34.66-16L382-880h196l18.67 126.67q17 6.33 35.16 16.33 18.17 10 31.84 22L782-767.67 880.67-595l-106.34 77.33q1.67 9 2 18.84.34 9.83.34 18.83 0 9-.34 18.5Q776-452 774-443l106.33 78-98.66 172.67-118-52.67q-14.34 11.33-32 22-17.67 10.67-35 16.33L578-80H382Zm55.33-66.67h85l14-110q32.34-8 60.84-24.5T649-321l103.67 44.33 39.66-70.66L701-415q4.33-16 6.67-32.17Q710-463.33 710-480q0-16.67-2-32.83-2-16.17-7-32.17l91.33-67.67-39.66-70.66L649-638.67q-22.67-25-50.83-41.83-28.17-16.83-61.84-22.83l-13.66-110h-85l-14 110q-33 7.33-61.5 23.83T311-639l-103.67-44.33-39.66 70.66L259-545.33Q254.67-529 252.33-513 250-497 250-480q0 16.67 2.33 32.67 2.34 16 6.67 32.33l-91.33 67.67 39.66 70.66L311-321.33q23.33 23.66 51.83 40.16 28.5 16.5 60.84 24.5l13.66 110Zm43.34-200q55.33 0 94.33-39T614-480q0-55.33-39-94.33t-94.33-39q-55.67 0-94.5 39-38.84 39-38.84 94.33t38.84 94.33q38.83 39 94.5 39ZM480-480Z" /></svg>
                        </NavLink>
                        {/* <Link
                            to="/hiring-dog/message"
                            className="message p-2 bg-[#F5F7FA] rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#F00000"><path d="M146.67-160q-27 0-46.84-19.83Q80-199.67 80-226.67v-506.66q0-27 19.83-46.84Q119.67-800 146.67-800h424q-3.34 16.67-4 33.33-.67 16.67 2 33.34H150l330 212L629.33-617q11.34 10.33 24.17 18.62 12.83 8.28 26.83 14.38L480-454.67 146.67-670v443.33h666.66v-348q18.87-4.85 35.27-13.59Q865-597 880-608.67v382q0 27-19.83 46.84Q840.33-160 813.33-160H146.67Zm0-573.33v506.66-506.66Zm613.25 86.66q-47.25 0-80.25-33.08-33-33.07-33-80.33 0-47.25 33.08-80.25 33.07-33 80.33-33 47.25 0 80.25 33.08 33 33.07 33 80.33 0 47.25-33.08 80.25-33.07 33-80.33 33Z" /></svg>
                        </Link> */}

                        <Link
                            to="/hiring-dog/message"
                            className="message p-2 bg-[#F5F7FA] rounded-full"
                        >
                            {isMessageRouteActive ? (
                                // SVG icon to display when the route is active
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#EA3323"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
                            ) : (
                                // Default SVG icon
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
                </header>
               <div>
                <Outlet/>
               </div>
            </div>
        </>
    )
}

export default Layout
