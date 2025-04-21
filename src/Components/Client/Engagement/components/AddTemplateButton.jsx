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
  createNewTemplate,
}) => {
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
        boxShadow:
          "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
      }}
      fullWidth
      variant="contained"
      onClick={createNewTemplate} // Use the new function instead
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
  createNewTemplate: PropTypes.func, // Added new prop
};
