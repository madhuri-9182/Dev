import { useEffect } from "react";
import PropTypes from "prop-types";
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

AddTemplateButton.propTypes = {
  isAddingNew: PropTypes.bool,
  setIsAddingNew: PropTypes.func,
  editorState: PropTypes.object,
  hasChanges: PropTypes.bool,
  selectTemplate: PropTypes.func,
  handleTemplateNameChange: PropTypes.func,
}
