import { Outlet } from "react-router-dom";
import { Typography } from "@mui/material";
import { SmsTracking } from "iconsax-react";
import UserAvatar from "../shared/UserAvatar";

function Layout() {
  return (
    <>
      <div>
        <Typography
          noWrap
          component="div"
          className="w-full"
        >
          <div className="p-2 h-[50px] bg-[#056DDC] flex items-center justify-between">
            <div className=" logo-brandName ">
              <h1 className="text-white text-md">
                {" "}
                <span className="font-bold">HD</span>{" "}
                INTERVIEW PLATFORM
              </h1>
            </div>
            <div className="horizontal-navigation px-5 gap-x-2 flex items-center justify-center">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@hiringdog.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-[6px] bg-[#F5F7FA] rounded-full"
              >
                <SmsTracking
                  size={20}
                  color="#F00000"
                  variant="Bold"
                />
              </a>
              <UserAvatar />
            </div>
          </div>
        </Typography>
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
