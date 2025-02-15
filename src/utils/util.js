import pdfToText from "react-pdftotext";
import { JOB_NAMES } from "../Components/Constants/constants";

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB");
};

export const revertDateFormat = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

export const getJobLabel = (key) => {
  const job = JOB_NAMES.find((job) => job.id === key);
  return job ? job.name : key;
};

export const handleTxtAndDocxFile = (
  file,
  setJobDescription
) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    setJobDescription(event.target.result);
  };
  reader.readAsText(file);
};

export const handlePdfFile = (file, setJobDescription) => {
  console.log(file);
  pdfToText(file)
    .then((text) => {
      setJobDescription(text);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export async function getFileFromPath(filePath) {
  try {
    if (!filePath) throw new Error("File path is required");

    const response = await fetch(filePath);
    if (!response.ok)
      throw new Error("Failed to fetch file");

    const blob = await response.blob();
    const fileName = filePath.split("/").pop();
    const fileExtension = filePath
      .split(".")
      .pop()
      .toLowerCase();

    let fileType;
    switch (fileExtension) {
      case "pdf":
        fileType = "application/pdf";
        break;
      case "docx":
        fileType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      default:
        fileType = "text/plain";
    }

    return new File([blob], fileName, { type: fileType });
  } catch (error) {
    console.error("Error converting path to file:", error);
    return null;
  }
}
