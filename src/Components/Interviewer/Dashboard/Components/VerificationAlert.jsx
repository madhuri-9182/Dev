import { Warning2 } from "iconsax-react";

/**
 * Alert component for displaying email/phone verification requirement
 */
const VerificationAlert = () => {
  return (
    <div className="bg-[#FFF3F3] border border-[#FF3B30] rounded-lg p-4 mb-4 flex items-center mt-16">
      <Warning2 className=" text-[#FF3B30] mr-3" size={40} />
      <p className="text-sm text-[#FF3B30]">
        <span className="font-semibold">Action Required: </span>
        {`Please verify your email address using the verification link sent to your inbox. 
        This verification is necessary to access all platform features and ensure the security of your account.
        If you haven't received the email, please check your spam folder or request a new verification link.`}
      </p>
    </div>
  );
};

export default VerificationAlert;