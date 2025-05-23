import PropTypes from "prop-types";
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
        sx={{
          backgroundColor: "#007AFF",
          color: "white",
          marginTop: "16px",
        }}
        fullWidth
        onClick={() => navigate("/client/engagement/email-templates")}
      >
        Create More
      </Button>
    </div>
  );
};

TemplateList.propTypes = {
  templates: PropTypes.array,
};
