import {
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

function SignUpSignInLayout() {
  const location = useLocation();

  return (
    <div className="h-screen w-full">
      <div className="w-full h-full flex flex-col sm:flex-row bg-gradient-to-b from-[#0575E6] via-[#02298A] to-[#021B79]">
        {/* Left side - responsive */}
        <div className="w-full sm:w-[44%] h-1/5 sm:h-full">
          <div className="w-full h-full sm:h-[55%] flex justify-center items-center sm:items-end">
            <div className="font-semibold text-center">
              {/* Responsive heading with color change */}
              <p className="text-2xl sm:text-[40px] leading-tight sm:leading-[46.88px] text-[#022382] sm:text-[#056DDC]">
                Hiring Dog
              </p>
              <p className="text-xl sm:text-[36px] leading-tight sm:leading-[42.19px] text-[#FFFFFF]">
                INTERVIEW PLATFORM
              </p>
            </div>
          </div>
          
          {/* Decorative circles - hidden on mobile */}
          <div className=" w-full h-[45%] relative">
            <div
              className="h-[600px] w-[600px] bg-transparent fixed left-[-15%] top-3/4 sm:top-[55%] rounded-full border-[1px] border-[#056DDC] 
                lg:h-[550px] lg:w-[550px]
                md:h-[500px] md:w-[500px]"
            ></div>
            <div
              className="h-[600px] w-[600px] bg-transparent fixed left-[-10%] top-[80%] sm:top-[60%] rounded-full border-[1px] border-[#056DDC] 
                lg:h-[550px] lg:w-[550px]
                md:h-[500px] md:w-[500px]"
            ></div>
          </div>
        </div>
        
        {/* Right side - responsive */}
        <div className="w-full sm:w-[56%] h-[70%] sm:h-full flex justify-center items-start sm:items-center p-4 sm:p-0">
          {/* White card - keeping this unchanged as requested */}
          <div className="w-full sm:w-[58%] rounded-[35px] bg-[#FFFFFF] flex flex-col items-center z-10">
            <div className="p-2 text-[#056DDC] w-full flex items-center justify-center">
              {!location.pathname.includes(
                "/client/client-user-activate"
              ) && (
                <nav className="RegisterNav flex items-center justify-start font-bold leading-[19.92px] w-[75%] h-[80px] text-[17px] text-center tracking-wide gap-5">
                  <div className="flex items-center text-center justify-center">
                    <NavLink
                      to={
                        location.pathname ===
                          "/auth/forgetpass" ||
                        location.pathname.includes(
                          "/auth/password-reset"
                        )
                          ? "#"
                          : location.pathname ===
                            "/auth/signin/loginnumber"
                          ? "signin/loginnumber"
                          : "signin/loginmail"
                      }
                      className={({ isActive }) =>
                        `${
                          isActive
                            ? `text-[#056DDC] font-bold relative after:content-[''] after:absolute ${
                                location.pathname ===
                                "/auth/forgetpass"
                                  ? "after:left-[22%] after:w-[25%]"
                                  : "after:left-1/2 after:w-[33%]"
                              } after:bottom-0 after:h-[2px] after:bg-current after:-translate-x-1/2 pb-2`
                            : "border-0 shadow-md rounded-[99px] py-[11px] px-5"
                        }  w-full `
                      }
                    >
                      {location.pathname ===
                      "/auth/forgetpass"
                        ? "Forget Password"
                        : "Sign In"}
                    </NavLink>
                  </div>
                </nav>
              )}
            </div>

            <div className="w-full h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpSignInLayout;