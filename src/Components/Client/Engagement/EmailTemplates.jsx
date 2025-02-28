import React, { useRef } from "react";
import Editor from "./components/Editor";
import Button, {
  primaryButtonStyles,
  secondaryButtonStyles,
  tertiaryButtonStyles,
} from "./components/Button";
import { Box } from "@mui/material";
import EventCard from "./components/EventCard";
import { useEmailTemplates } from "./hooks/useEmailTemplates";
import { AddTemplateButton } from "./components/AddTemplateButton";
import { useNavigate } from "react-router-dom";

function EmailTemplates() {
  const editorRef = useRef();
  const navigate = useNavigate();
  const {
    templates,
    editorState,
    setEditorState,
    selectedTemplate,
    hasChanges,
    setHasChanges,
    isAddingNew,
    setIsAddingNew,
    selectTemplate,
    handleTemplateNameChange,
    updateTemplate,
    addTemplate,
    isLoading,
    isError,
    isUpdating,
    isAdding,
  } = useEmailTemplates(editorRef);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        Failed to load templates
      </div>
    );
  }

  return (
    <div style={{ height: "calc(100vh - 160px)" }} className="flex">
      <div className="p-2 overflow-auto full-h min-w-[220px] mt-2">
        {templates?.map((template) => (
          <EventCard
            key={template.id}
            title={
              selectedTemplate?.id === template.id
                ? editorState.template_name
                : template.template_name
            }
            selected={selectedTemplate?.id === template.id}
            onClick={selectTemplate}
            onChange={handleTemplateNameChange}
            template={template}
          />
        ))}

        <AddTemplateButton
          isAddingNew={isAddingNew}
          setIsAddingNew={setIsAddingNew}
          editorState={editorState}
          hasChanges={hasChanges}
          selectTemplate={selectTemplate}
          handleTemplateNameChange={handleTemplateNameChange}
        />
      </div>

      {selectedTemplate && (
        <div className="p-2 flex-grow h-full flex flex-col">
          <Editor
            editorState={editorState}
            setEditorState={setEditorState}
            onChange={() => setHasChanges(true)}
            innerRef={editorRef}
          />

          <Box className="flex gap-2 mt-2 ml-auto justify-end">
            {hasChanges ? (
              <>
                <Button
                  sx={{
                    ...secondaryButtonStyles,
                    paddingBlock: 0.5,
                  }}
                  onClick={() =>
                    selectTemplate(isAddingNew ? null : selectedTemplate)
                  }
                >
                  Cancel
                </Button>

                <Button
                  sx={{
                    paddingBlock: 0.5,
                    ...primaryButtonStyles,
                  }}
                  onClick={isAddingNew ? addTemplate : updateTemplate}
                  loading={isUpdating || isAdding}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button
                sx={{
                  ...tertiaryButtonStyles,
                  paddingBlock: 0.5,
                }}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            )}
          </Box>
        </div>
      )}
    </div>
  );
}

export default EmailTemplates;
