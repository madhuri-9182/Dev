import React, { useEffect } from "react";
import Button, { primaryButtonStyles } from "./Button";
import EventCard from "./EventCard";

export const AddTemplateButton = ({
  isAddingNew,
  setIsAddingNew,
  editorState,
  hasChanges,
  selectTemplate,
  handleTemplateNameChange,
}) => {
  useEffect(() => {
    if (isAddingNew) {
      selectTemplate({
        template_name: "",
        subject: "Subject",
        template_html_content: "Content",
        attachment: null,
        id: -1,
      });
    }
  }, [isAddingNew]);

  if (isAddingNew) {
    return (
      <EventCard
        key={-1}
        title={editorState.template_name}
        selected={true}
        autoFocus={true}
        onClick={() => {}}
        onChange={handleTemplateNameChange}
        onBlur={() => {
          if (!hasChanges) {
            setIsAddingNew(false);
            selectTemplate(null);
          }
        }}
      />
    );
  }

  return (
    <Button
      sx={{
        ...primaryButtonStyles,
      }}
      fullWidth
      variant="contained"
      onClick={() => setIsAddingNew(true)}
    >
      Add Template
    </Button>
  );
};
