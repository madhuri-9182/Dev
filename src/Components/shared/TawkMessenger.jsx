import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../Constants/constants";
import { useTawkMessenger } from "../../hooks/useTawkMessenger";

const TawkMessenger = () => {
  const { auth } = useAuth();

  const allowedRoles = [
    ...ROLES.CLIENT,
    ...ROLES.AGENCY,
    ...ROLES.INTERVIEWER,
  ];

  const { isVisible, tawkContainerRef } = useTawkMessenger(
    !!auth?.accessToken,
    auth?.role,
    allowedRoles
  );

  if (!isVisible) {
    return null;
  }

  return (
    <div ref={tawkContainerRef}>
      <TawkMessengerReact
        propertyId="6818bbf1138f991917bc7112"
        widgetId="1iqg9sah9"
        onLoad={() => {
          // Optional: Set visitor info when widget loads
          if (auth?.email) {
            window.Tawk_API?.setAttributes(
              {
                name: auth?.name || "User",
                email: auth?.email,
              },
              (error) => {
                if (error)
                  console.error("Tawk API Error:", error);
              }
            );
          }
        }}
      />
    </div>
  );
};

export default TawkMessenger;
