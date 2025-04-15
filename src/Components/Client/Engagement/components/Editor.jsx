import { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.bubble.css";
import Button from "./Button";
import { AttachFile } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { extractSubjectAndContent, joinContentAndSubject } from "../utils";
import { Trash } from "iconsax-react";

const BlockEmbed = Quill.import("blots/block/embed");

class DividerBlot extends BlockEmbed {
  static blotName = "divider";
  static tagName = "hr";
}

Quill.register(DividerBlot);

const icons = Quill.import("ui/icons");

icons[
  "divider"
] = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.1" viewBox="0 0 17 17" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g></g><path d="M17 8v1h-17v-1h17z"></path></svg>`;

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["divider"],
      ["clean"],
    ],
    handlers: {
      divider: function () {
        if (this.quill) {
          const range = this.quill.getSelection();
          if (range) {
            this.quill.insertEmbed(range.index, "divider", true, "user");
          }
        }
      },
    },
  },
  clipboard: {
    matchVisual: false,
  },
};

const Editor = ({ editorState, setEditorState, onChange, innerRef }) => {
  const fileInputRef = useRef(null);

  const handleContentChange = (v, d, source) => {
    source === "user" && onChange();
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    onChange();
    const file = event.target.files[0];
    if (file) {
      // Extract current content before updating state
      const { subject, content: template_html_content } = 
        extractSubjectAndContent(innerRef?.current?.value || initialValue);
      
      setEditorState({
        ...editorState,
        subject,
        template_html_content,
        attachment: file,
      });
    }
  };

  const removeAttachment = () => {
    onChange();
    setEditorState({
      ...editorState,
      attachment: null,
    });
    fileInputRef.current.value = "";
  };

  const initialValue = useMemo(
    () =>
      joinContentAndSubject(
        editorState.subject,
        editorState.template_html_content
      ),
    [editorState]
  );

  return (
    <div className="relative flex flex-col h-full">
      {useMemo(
        () => (
          <ReactQuill
            style={{
              border: "1px #979797 solid",
              borderRadius: "16px",
              color: "#0000008F",
              height: "100%",
              padding: "20px 5px",
            }}
            theme="bubble"
            value={initialValue}
            onChange={handleContentChange}
            modules={modules}
            ref={innerRef}
          />
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [editorState]
      )}

      <Box className="absolute right-[60px] bottom-[30px]">
        <Button
          startIcon={<AttachFile />}
          onClick={handleAttachmentClick}
          sx={{
            backgroundColor: "white",
            color: "#79747E",
            borderColor: "#79747E",
            padding: "3px 14px",
            minWidth: "140px",
          }}
          variant="outlined"
        >
          {(() => {
            const attachmentName = editorState.attachment
              ? editorState.attachment.name
                ? editorState.attachment.name
                : editorState.attachment
              : "Attachment";

            return attachmentName.length > 30
              ? "..." + attachmentName.substring(attachmentName.length - 27)
              : attachmentName;
          })()}
        </Button>

        {!!editorState.attachment && (
          <IconButton size="small" onClick={removeAttachment}>
            <Trash size="20" color="red" />
          </IconButton>
        )}
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".pdf,.doc,.docx"
      />
    </div>
  );
};

export default Editor;

Editor.propTypes = {
  editorState: PropTypes.object,
  setEditorState: PropTypes.func,
  onChange: PropTypes.func,
  innerRef: PropTypes.any,
}
