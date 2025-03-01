import pdfToText from "react-pdftotext";
import { JOB_NAMES } from "../Components/Constants/constants";
import axios from "../api/axios";

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
  pdfToText(file)
    .then((text) => {
      setJobDescription(text);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const formatExperience = (experience) => {
  const { year, month } = experience;

  if (year === 0 && month === 0) {
    return "-";
  }

  const years = year ? `${year} Years` : "";
  const months = month ? `${month} Months` : "";

  return `${years} ${months}`.trim();
};

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const base64ToFile = (base64, filename) => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const createFileFromUrl = async (url) => {
  const response = await axios.get(url, {
    responseType: "blob",
  });

  const fileName = url.split("/").pop();
  const fileExtension = url.split(".").pop().toLowerCase();

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

  const file = new File([response.data], fileName, {
    type: fileType,
  });

  return file;
};
