import notfound from "../../../assets/404.png";

const NotFound = () => {
  return (
    <div className="w-[500px] p-10 flex items-center justify-center flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <img src={notfound} alt="notfound" />
        <h2 className="text-2xl text-[#184680] font-bold">
          Page Not Found
        </h2>
      </div>
      <p className="text-sm text-[#6B6F7B] font-semibold">{`Sorry, we could not find the page you are looking for.`}</p>
      <button
        onClick={() => window.history.back()}
        className="p-1 px-4 rounded-full text-sm font-semibold text-white w-[125px] h-[40px] 
             bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
