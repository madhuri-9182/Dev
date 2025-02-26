import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import EngagementDashboard from "./EngagementDashboard";
import EmailTemplates from "./EmailTemplates";
import EventSchedular from "./EventSchedular";
import EngagementForm from "./EngagementForm";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RedirectToDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/client/engagement/dashboard");
  }, []);
};

function Engagement() {
  const [selectedEngagement, setSelectedEngagement] = useState(null);

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <EngagementDashboard setSelectedEngagement={setSelectedEngagement} />
        }
      />
      <Route
        path="/email-templates"
        element={<EmailTemplates engagement={selectedEngagement} />}
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
              <EventSchedular
                setSelectedEngagement={setSelectedEngagement}
                engagement={selectedEngagement}
              />
            }
          />
        </>
      ) : null}

      <Route path="*" element={<RedirectToDashboard />} />
    </Routes>
  );
}

export default Engagement;
