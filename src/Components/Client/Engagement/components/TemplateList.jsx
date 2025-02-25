import React from "react";
import Button from "./Button";
import { DraggableEventCard } from "./EventCard";
import { useNavigate } from "react-router-dom";

export const TemplateList = ({ templates }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{ height: "calc(100vh - 275px" }}
      className="p-2 overflow-auto min-w-[200px]"
    >
      {templates.map((event, index) =>
        event ? (
          <DraggableEventCard
            key={`template-${event.id}-${index}`}
            index={index}
            title={event.template_name}
            selected={false}
          />
        ) : null
      )}
      <Button
        style={{
          backgroundColor: "#007AFF",
          color: "white",
          marginTop: "16px",
        }}
        fullWidth
        variant="contained"
        onClick={() => navigate("/client/engagement/email-templates")}
      >
        Create More
      </Button>
    </div>
  );
};
