import { useEffect, useState } from "react";
import {
  useAddEngagementTemplate,
  useEngagementTemplates,
  useUpdateEngagementTemplate,
} from "../api";
import { extractSubjectAndContent } from "../utils";

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

export const useEmailTemplates = (editorRef) => {
  const { data, isLoading, isError } = useEngagementTemplates({});
  const _templates = data?.results || [];
  const [editorState, setEditorState] = useState(defaultEditorState);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [templates, setTemplates] = useState([]);

  const { mutate: updateMutation, isPending: isUpdating } =
    useUpdateEngagementTemplate();
  const { mutateAsync: addMutation, isPending: isAdding } =
    useAddEngagementTemplate();

  useEffect(() => {
    if (_templates.length > 0) {
      selectTemplate({ ..._templates[0] });
      setTemplates([..._templates]);
    }
  }, [!!_templates.length]);

  const selectTemplate = (template) => {
    setHasChanges(false);
    setSelectedTemplate(template);
    if (template) {
      setEditorState({ ...template });
    } else {
      setIsAddingNew(false);
    }
  };

  const handleTemplateNameChange = (value) => {
    setHasChanges(true);
    setEditorState((prev) => ({ ...prev, template_name: value }));
  };

  const updateTemplate = async () => {
    setHasChanges(false);
    const { subject, content: template_html_content } =
      extractSubjectAndContent(editorRef?.current?.value);
    const updatedData = {
      ...editorState,
      subject,
      template_html_content,
    };
    updateMutation(updatedData);
  };

  const addTemplate = async () => {
    const { subject, content: template_html_content } =
      extractSubjectAndContent(editorRef?.current?.value);
    const newData = {
      ...editorState,
      subject,
      template_html_content,
    };
    const newTemplate = await addMutation(newData);
    selectTemplate(newTemplate);
    setIsAddingNew(false);
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
    handleTemplateNameChange,
    updateTemplate,
    addTemplate,
    isLoading,
    isError,
    isUpdating,
    isAdding,
  };
};
