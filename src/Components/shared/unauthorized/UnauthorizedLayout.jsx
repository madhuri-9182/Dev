import { Outlet } from "react-router-dom";

const UnauthorizedLayout = () => {
  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="w-full h-full flex bg-gradient-to-b from-[#0575E6] via-[#02298A] to-[#021B79] ">
        <div className="w-[44%] h-full  ">
          <div className="w-full h-[55%] flex justify-center items-end  "></div>
          <div className="w-full h-[45%]  ">
            <div
              className="h-[600px] w-[600px] bg-transparent fixed left-[-15%] top-[55%] rounded-full border-[1px] border-[#056DDC] 
                lg:h-[550px] lg:w-[550px]
                md:h-[500px] md:w-[500px] 
                sm:h-[400px] sm:w-[400px] 
                xs:h-[300px] xs:w-[300px]"
            ></div>
            <div
              className="h-[600px] w-[600px] bg-transparent fixed left-[-10%] top-[60%] rounded-full border-[1px] border-[#056DDC] 
                lg:h-[550px] lg:w-[550px]
                md:h-[500px] md:w-[500px] 
                sm:h-[400px] sm:w-[400px] 
                xs:h-[300px] xs:w-[300px]"
            ></div>
          </div>
        </div>
        <div className="w-[56%] h-full flex justify-center items-center  ">
          <div className=" rounded-[35px] bg-[#FFFFFF] flex flex-col items-center ">
            <div className=" w-full h-full ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedLayout;
