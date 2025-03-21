import { useRef, useState } from "react";
import EngagementDashboard from "./EngagementDashboard";
import EmailTemplates from "./EmailTemplates";
import EventScheduler from "./EventSchedular";
import EngagementForm from "./EngagementForm";
import {
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect } from "react";

const RedirectToDashboard = () => {
  const navigate = useNavigate();
  const { "*":org_id } = useParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (org_id){
      navigate("/internal/engagement/dashboard/", { state: {org_id: org_id} });
    }else{
      navigate("/client/engagement/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

function Engagement() {
  const [selectedEngagement, setSelectedEngagement] =
    useState(null);

  return (
    <>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <EngagementDashboard
              setSelectedEngagement={setSelectedEngagement}
            />
          }
        />
        <Route
          path="/email-templates"
          element={
            <EmailTemplates
              engagement={selectedEngagement}
            />
          }
        />

        <Route
          path="/form"
          element={
            <EngagementForm
              setSelectedEngagement={setSelectedEngagement}
              engagement={selectedEngagement}
            />
          }
        />
        {selectedEngagement ? (
          <>
            <Route
              path="/event-schedular"
              element={
                <EventScheduler
                  setSelectedEngagement={
                    setSelectedEngagement
                  }
                  engagement={selectedEngagement}
                />
              }
            />
          </>
        ) : null}

        <Route path="*" element={<RedirectToDashboard />} />
      </Routes>
    </>
  );
}

export default Engagement;
