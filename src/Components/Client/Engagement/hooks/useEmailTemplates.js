/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  useAddEngagementTemplate,
  useEngagementTemplates,
  useUpdateEngagementTemplate,
} from "../api";
import { extractSubjectAndContent } from "../utils";
import toast from "react-hot-toast";

export const defaultEditorState = {
  id: 0,
  template_html_content: ` 
<p>Dear [Candidate's Name],</p>
<p>\n</p>
<p>
Congratulations once again, and welcome to [Your Company Name]! We are thrilled that you've accepted our offer to join us as [Job Title]. We are confident that your skills and expertise in [mention key strengths or skills] will help us achieve great things, and we can't wait to see the impact you'll make.
</p>
<p>\n</p>
<p>
Next Steps:
Our HR team will be in touch shortly with all the details regarding your start date, onboarding process, and any additional documentation we might need. In the meantime, feel free to reach out to [ Person's Name], who will be your go-to person for any questions or support as you get ready to join us.

Go-To Contact: [ Person's Name] Phone: [ Person's Phone Number] Email: [ Person's Email Address]

We'll also be happy to connect you with the leadership team and introduce you to the colleagues you'll be working closely with. This will help you get familiar with our culture and ensure a smooth transition as you step into your new role.

Once again, welcome aboard! We're excited to have you as part of the [Your Company Name] family and are looking forward to working closely with you.
</p>
<p>\n</p>
<p>Best regards,<br/>Your Name</p>`,
  attachment: null,
  subject:
    "Welcome to [Your Company Name] – We're Excited to Have You [CANDIDATE'S FIRST NAME]!",
};

// New default state for a new template
export const newTemplateDefault = {
  template_name: "",
  subject: "Subject",
  template_html_content: "Content",
  attachment: null,
  id: -1,
};

export const useEmailTemplates = (editorRef) => {
  const { data, isLoading, isError } =
    useEngagementTemplates({});
  const _templates = data?.results || [];
  const [editorState, setEditorState] = useState(
    defaultEditorState
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [templates, setTemplates] = useState([]);
  // Store draft template separately
  const [draftTemplate, setDraftTemplate] = useState(
    newTemplateDefault
  );

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [
    pendingTemplateSelection,
    setPendingTemplateSelection,
  ] = useState(null);

  // Use this ref to track if a save operation is in progress
  const saveInProgress = useRef(false);
  // Use this ref to store the next template to select after saving
  const nextTemplateAfterSave = useRef(null);

  const { mutate: updateMutation, isPending: isUpdating } =
    useUpdateEngagementTemplate();
  const { mutateAsync: addMutation, isPending: isAdding } =
    useAddEngagementTemplate();

  useEffect(() => {
    if (!isLoading && _templates.length > 0) {
      selectTemplate({ ..._templates[0] });
    }
  }, [isLoading]);

  useEffect(() => {
    if (_templates.length > 0) {
      setTemplates([..._templates]);
    }
  }, [_templates.length]);

  // Handle dialog close
  const handleDialogClose = (continueWithSelection) => {
    setDialogOpen(false);

    if (continueWithSelection && pendingTemplateSelection) {
      // Process the template switch since user confirmed
      processTemplateSelection(pendingTemplateSelection);
    }

    setPendingTemplateSelection(null);
  };

  // Process the actual template selection after confirmation or if no confirmation needed
  const processTemplateSelection = useCallback(
    (template) => {
      setHasChanges(false);
      setSelectedTemplate(template);

      if (template) {
        if (template.id === -1) {
          // For a new template, use the draft state
          setIsAddingNew(true);
          setEditorState({ ...draftTemplate });
        } else {
          // For existing template
          setIsAddingNew(false);
          setEditorState({ ...template });
        }
      } else {
        setIsAddingNew(false);
      }
    },
    [draftTemplate]
  );

  // Modified to handle unsaved changes using dialog
  const selectTemplate = useCallback(
    (template) => {
      // If a save operation is in progress, store this template to select after saving
      if (saveInProgress.current) {
        nextTemplateAfterSave.current = template;
        return;
      }

      // If we have unsaved changes and trying to select a different template
      if (
        hasChanges &&
        template &&
        selectedTemplate &&
        template.id !== selectedTemplate.id
      ) {
        // Show dialog instead of browser alert
        setPendingTemplateSelection(template);
        setDialogOpen(true);
      } else {
        // No changes or same template, proceed directly
        processTemplateSelection(template);
      }
    },
    [hasChanges, selectedTemplate, processTemplateSelection]
  );

  // New function to create a new template
  const createNewTemplate = useCallback(() => {
    // If a save operation is in progress, store the new template default to select after saving
    if (saveInProgress.current) {
      nextTemplateAfterSave.current = newTemplateDefault;
      return;
    }

    // If we have unsaved changes, confirm first
    if (hasChanges) {
      setPendingTemplateSelection(newTemplateDefault);
      setDialogOpen(true);
      return;
    }

    // Reset draft template
    setDraftTemplate({ ...newTemplateDefault });
    setIsAddingNew(true);
    setSelectedTemplate(newTemplateDefault);
    setEditorState({ ...newTemplateDefault });
    setHasChanges(false);
  }, [hasChanges]);

  const handleTemplateNameChange = useCallback(
    (value) => {
      setHasChanges(true);

      if (isAddingNew) {
        // Update both draft and editor state for new template
        setDraftTemplate((prev) => ({
          ...prev,
          template_name: value,
        }));
      }

      setEditorState((prev) => ({
        ...prev,
        template_name: value,
      }));
    },
    [isAddingNew]
  );

  // Update function to handle editor changes
  const handleEditorChange = useCallback(() => {
    setHasChanges(true);

    if (isAddingNew && editorRef?.current?.value) {
      // If we're editing a new template, update the draft too
      const { subject, content: template_html_content } =
        extractSubjectAndContent(editorRef.current.value);

      setDraftTemplate((prev) => ({
        ...prev,
        subject,
        template_html_content,
      }));
    }
  }, [isAddingNew, editorRef]);

  // Function to call after successful save
  const afterSaveSuccess = useCallback(
    (message) => {
      toast.success(message);
      setHasChanges(false);

      // If there's a pending template selection after save, process it
      if (nextTemplateAfterSave.current) {
        processTemplateSelection(
          nextTemplateAfterSave.current
        );
        nextTemplateAfterSave.current = null;
      }

      // Mark save as complete
      saveInProgress.current = false;
    },
    [processTemplateSelection]
  );

  const updateTemplate = async () => {
    // Mark save operation as in progress
    saveInProgress.current = true;

    const { subject, content: template_html_content } =
      extractSubjectAndContent(editorRef?.current?.value);
    const updatedData = {
      ...editorState,
      subject,
      template_html_content,
    };

    // Update the templates array
    setTemplates((prev) => {
      const updatedTemplateIndex = prev.findIndex(
        (template) => template.id === selectedTemplate.id
      );
      prev[updatedTemplateIndex] = {
        ...selectedTemplate,
        ...updatedData,
      };
      return [...prev];
    });

    // Send the update to the server
    updateMutation(updatedData, {
      onSuccess: () => {
        afterSaveSuccess("Template updated successfully");
      },
      onError: (error) => {
        toast.error("Failed to update template");
        console.error("Update template error:", error);
        saveInProgress.current = false;
      },
    });
  };

  const addTemplate = async () => {
    // Mark save operation as in progress
    saveInProgress.current = true;

    const { subject, content: template_html_content } =
      extractSubjectAndContent(editorRef?.current?.value);
    const isSubjectEmpty =
      !subject ||
      subject.trim() === "" ||
      subject.trim() === "Subject";
    const isContentEmpty =
      !template_html_content ||
      template_html_content.trim() === "";

    if (isSubjectEmpty || isContentEmpty) {
      toast.error("Subject and content cannot be empty");
      saveInProgress.current = false;
      return;
    }

    const newData = {
      ...editorState,
      subject,
      template_html_content,
    };

    try {
      const newTemplate = await addMutation(newData);

      // Set hasChanges to false first to avoid the dialog
      setHasChanges(false);
      setIsAddingNew(false);

      // Reset draft template after successful save
      setDraftTemplate({ ...newTemplateDefault });

      // If the user has already tried to select another template while saving
      if (nextTemplateAfterSave.current) {
        processTemplateSelection(
          nextTemplateAfterSave.current
        );
        nextTemplateAfterSave.current = null;
      } else {
        // Otherwise select the newly created template
        processTemplateSelection(newTemplate);
      }

      toast.success("Template created successfully");

      // Mark save as complete
      saveInProgress.current = false;
    } catch (error) {
      toast.error("Failed to save template");
      console.error("Add template error:", error);
      saveInProgress.current = false;
    }
  };

  return {
    templates,
    editorState,
    setEditorState,
    selectedTemplate,
    hasChanges,
    setHasChanges,
    isAddingNew,
    setIsAddingNew,
    selectTemplate,
    createNewTemplate,
    handleTemplateNameChange,
    handleEditorChange,
    updateTemplate,
    addTemplate,
    isLoading,
    isError,
    isUpdating,
    isAdding,
    // Dialog related
    dialogOpen,
    setDialogOpen,
    handleDialogClose,
  };
};
