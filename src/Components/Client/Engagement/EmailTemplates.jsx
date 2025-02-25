import React, { useRef } from "react";
import Editor from "./components/Editor";
import Button from "./components/Button";
import { Box } from "@mui/material";
import EventCard from "./components/EventCard";
import { useEmailTemplates } from "./hooks/useEmailTemplates";
import { AddTemplateButton } from "./components/AddTemplateButton";

function EmailTemplates() {
  const editorRef = useRef();
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
            onClick={() => selectTemplate(template)}
            onChange={handleTemplateNameChange}
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

          {hasChanges && (
            <Box className="flex gap-2 mt-2 ml-auto justify-end">
              <Button
                style={{
                  backgroundColor: "white",
                  color: "#79747E",
                  borderColor: "#79747E",
                  paddingBlock: 4,
                }}
                variant="outlined"
                onClick={() =>
                  selectTemplate(isAddingNew ? null : selectedTemplate)
                }
              >
                Cancel
              </Button>

              <Button
                style={{
                  paddingBlock: 4,
                  backgroundColor: "#007AFF",
                  color: "white",
                }}
                onClick={isAddingNew ? addTemplate : updateTemplate}
                loading={isUpdating || isAdding}
              >
                Save
              </Button>
            </Box>
          )}
        </div>
      )}
    </div>
  );
}

export default EmailTemplates;
