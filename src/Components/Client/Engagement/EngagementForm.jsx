import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DocumentUpload, Calendar, SmsTracking, Trash } from "iconsax-react";
import Button from "./components/Button";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  useAddEngagement,
  useClientUser,
  useJobs,
  useResumeParser,
} from "./api";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StyledDatePicker } from "./components/StyledDatePicker";
import { NOTICE_PERIOD } from "./constants";
import { Close, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "white",
    height: "30px",
    "& fieldset": {
      borderColor: "rgba(202, 196, 208, 1)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(202, 196, 208, 1)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#007AFF",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "12px",
    padding: "8px 12px",
    "&::placeholder": {
      color: "#6B7280",
      opacity: 1,
    },
  },
}));

const FieldWrapper = ({ children, label, style }) => {
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", width: "100%" }}
      style={style}
    >
      <Typography
        fontWeight={600}
        color="rgba(107, 111, 123, 1)"
        sx={{ width: "120px", flexShrink: 0 }}
        fontSize={12}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
};

const EngagementForm = ({ setSelectedEngagement, engagement }) => {
  const { data, isPending, error, mutateAsync } = useResumeParser();
  const { mutateAsync: addEngagement, isPending: isAddingEngagement } =
    useAddEngagement();

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    const [data] = await mutateAsync(file);

    setFormData((prev) => {
      const update = {
        ...prev,
        candidate_cv: file,
        candidate_name: data.name,
        candidate_email: data.email,
        candidate_phone: data.phone_number,
        candidate_company: data.current_company,
      };
      validateForm(update);
      return update;
    });

    fileInputRef.current.value = "";

    //     current_company
    // :
    // "HubSpot"
    // current_designation
    // :
    // "Front-End Developer"
    // email
    // :
    // "j.bach@email.com"
    // file_name
    // :
    // "front-end-developer-resume-example.pdf"
    // name
    // :
    // "JOHANN BACH"
    // phone_number
    // :
    // "+11234567890"
    // years_of_experience
    // :
    // {year: 0, month: 0}
  };

  const validateForm = useCallback((formData) => {
    const newErrors = {};

    // Required fields validation with trim()
    if (!formData.candidate_name?.trim())
      newErrors.candidate_name = "Name is required";
    if (!formData.candidate_phone?.trim())
      newErrors.candidate_phone = "Phone number is required";
    if (!formData.candidate_email?.trim())
      newErrors.candidate_email = "Email is required";
    if (!formData.candidate_company?.trim())
      newErrors.candidate_company = "Company is required";
    if (!formData.notice_period?.trim())
      newErrors.notice_period = "Notice period is required";
    if (!formData.job_id) newErrors.job_id = "Role is required";

    if (!formData.candidate_cv) newErrors.candidate_cv = "Resume is required";
    if (!formData.offer_date && formData.offered)
      newErrors.offer_date = "Offer date is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      formData.candidate_email?.trim() &&
      !emailRegex.test(formData.candidate_email.trim())
    ) {
      newErrors.candidate_email = "Please enter a valid email address";
    }

    // Phone validation - must start with +91 followed by 10 digits
    const phoneRegex = /^\+91\d{10}$/;
    if (
      formData.candidate_phone?.trim() &&
      !phoneRegex.test(formData.candidate_phone.trim())
    ) {
      newErrors.candidate_phone = "Phone number must start with +91";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSubmit = async () => {
    if (validateForm(formData)) {
      const payload = {
        ...formData,
      };
      delete payload.client_user_email;
      delete payload.client_user_name;
      delete payload.candidate_company;
      const res = await addEngagement(payload);

      setSelectedEngagement({ ...res.data });

      setTimeout(() => {
        navigate("/client/engagement/event-schedular");
      }, 500);
    }
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, candidate_cv: null });
  };

  const { data: jobsData } = useJobs();
  const { data: clientUserData } = useClientUser();

  const jobs = jobsData?.results || [];

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    candidate_cv: null,
    candidate_name: "",
    candidate_phone: "",
    candidate_email: "",
    candidate_company: "",
    notice_period: "",
    offer_accepted: false,
    offered: false,
    offer_date: null,
    client_user_id: "",
    client_user_email: "",
    other_offer: false,
    job_id: "",
    client_user_name: "",
  });

  useEffect(() => {
    if (clientUserData) {
      setFormData((prev) => ({
        ...prev,
        client_user_id: clientUserData.data.id,
        client_user_email: clientUserData.data.user.email,
        client_user_name: clientUserData.data.name,
      }));
    }
  }, [clientUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 pl-0 ">
      <FieldWrapper
        style={{ justifyContent: "flex-start" }}
        label={"Upload CV"}
      >
        <Button
          startIcon={<DocumentUpload size={20} />}
          sx={{
            borderStyle: "dashed",
            color: "rgba(107, 111, 123, 1)",
            backgroundColor: "rgba(248, 248, 248, 1)",
            borderColor: errors.candidate_cv ? "red" : "rgba(107, 111, 123, 1)",
            borderRadius: "8px",
            paddingInline: "40px",
            minWidth: "300px",
          }}
          endIcon={
            formData.candidate_cv ? (
              <IconButton
                size="small"
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                style={{ padding: 0 }}
              >
                <Trash size="20" color="red" />
              </IconButton>
            ) : (
              ""
            )
          }
          variant="outlined"
          loading={isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          {formData.candidate_cv ? formData.candidate_cv.name : "Upload here"}
        </Button>
        {errors.candidate_cv && (
          <Typography fontSize={12} sx={{ mt: 0.5, ml: 1.5 }} color="error">
            {errors.candidate_cv}
          </Typography>
        )}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf,.doc,.docx"
        />
      </FieldWrapper>
      <Table
        sx={{
          border: "none",
          mt: 4,
          "& th": {
            color: "black",
            textTransform: "uppercase",
            fontWeight: 600,
            fontSize: 12,
            border: "none",
            padding: "12px 40px",
          },
          "& td": {
            fontSize: 12,
            border: "none",
            padding: "12px 40px",
            backgroundColor: "rgba(235, 235, 235, 0.5)",
            height: 40,
          },
          "& tbody": {
            borderRadius: 16,
          },
          "& td:first-child": {
            borderRadius: "16px 0 0 16px",
          },
          "& td:last-child": {
            borderRadius: "0 16px 16px 0",
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Mobile Number</TableCell>
            <TableCell>Email ID</TableCell>
            <TableCell>Company</TableCell>
            {/* <TableCell></TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{formData.candidate_name}</TableCell>
            <TableCell>{formData.candidate_email}</TableCell>
            <TableCell>{formData.candidate_phone}</TableCell>
            <TableCell>{formData.candidate_company}</TableCell>
            {/* <TableCell>
              <IconButton
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "rgba(236, 230, 240, 1) ",
                  boxShadow: ` 0px 1px 3px 0px rgba(0, 0, 0, 0.3);


`,
                }}
                size="small"
              >
                <EditOutlinedIcon />
              </IconButton>
            </TableCell> */}
          </TableRow>
        </TableBody>
      </Table>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          columnGap: "32px",
          rowGap: "24px",
          mt: 10,
          width: "100%",
          "& .MuiTextField-root": {
            width: "100%",
            maxWidth: "220px",
          },
        }}
      >
        <FieldWrapper label="Name">
          <StyledTextField
            name="candidate_name"
            value={formData.candidate_name}
            onChange={handleChange}
            placeholder="Name"
            variant="outlined"
            required
            error={Boolean(errors.candidate_name)}
            helperText={errors.candidate_name}
          />
        </FieldWrapper>

        <FieldWrapper label="Phone Number">
          <StyledTextField
            name="candidate_phone"
            value={formData.candidate_phone}
            onChange={handleChange}
            placeholder="+91XXXXXXXXXX"
            required
            error={Boolean(errors.candidate_phone)}
            helperText={errors.candidate_phone}
            type="tel"
          />
        </FieldWrapper>

        <FieldWrapper label="Email ID">
          <StyledTextField
            name="candidate_email"
            value={formData.candidate_email}
            onChange={handleChange}
            placeholder="abc@xyz.com"
            required
            error={Boolean(errors.candidate_email)}
            helperText={errors.candidate_email}
          />
        </FieldWrapper>

        <FieldWrapper label="Company">
          <StyledTextField
            name="candidate_company"
            value={formData.candidate_company}
            onChange={handleChange}
            placeholder="Company"
            required
            error={Boolean(errors.candidate_company)}
            helperText={errors.candidate_company}
          />
        </FieldWrapper>

        <FieldWrapper label="Offered">
          <StyledTextField
            name="offered"
            value={formData.offered ? 1 : 0}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "offered",
                  value: !!+e.target.value,
                },
              });
            }}
            select
            SelectProps={{
              native: true,
            }}
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </StyledTextField>
        </FieldWrapper>

        <FieldWrapper label="Offer Date">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledDatePicker
              value={
                formData.offer_date
                  ? dayjs(formData.offer_date, "DD/MM/YYYY")
                  : null
              }
              onChange={(newValue) => {
                handleChange({
                  target: {
                    name: "offer_date",
                    value: newValue ? newValue.format("DD/MM/YYYY") : null,
                  },
                });
              }}
              format="DD/MM/YYYY"
              slots={{
                openPickerIcon: () => <Calendar size={20} color="#171717" />,
              }}
              slotProps={{
                textField: {
                  error: Boolean(errors.offer_date),
                  helperText: errors.offer_date,
                },
              }}
            />
          </LocalizationProvider>
        </FieldWrapper>

        <FieldWrapper label="Offer Accepeted">
          <StyledTextField
            name="offer_accepted"
            value={formData.offer_accepted ? 1 : 0}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "offer_accepted",
                  value: !!+e.target.value,
                },
              })
            }
            select
            SelectProps={{
              native: true,
            }}
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </StyledTextField>
        </FieldWrapper>

        <FieldWrapper label="Notice Period">
          <Box sx={{ position: "relative" }}>
            <StyledTextField
              name="notice_period"
              value={formData.notice_period}
              onChange={handleChange}
              placeholder="15-30 Days"
              select
              SelectProps={{
                native: true,
              }}
              required
              error={Boolean(errors.notice_period)}
              helperText={errors.notice_period}
            >
              <option value="">Select Days</option>
              {NOTICE_PERIOD.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </StyledTextField>
          </Box>
        </FieldWrapper>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          columnGap: "32px",
          rowGap: "24px",

          width: "100%",
          "& .MuiTextField-root": {
            width: "100%",
            maxWidth: "220px",
          },
        }}
      >
        <FieldWrapper label="GTP Name">
          <StyledTextField
            name="client_user_id"
            value={formData.client_user_name}
            placeholder="GTP Name"
            onChange={() => {}}
          ></StyledTextField>
        </FieldWrapper>

        <FieldWrapper label="GTP Email ID">
          <StyledTextField
            name="client_user_email"
            value={formData.client_user_email}
            placeholder="abc@xyz.com"
            required
            onChange={() => {}}
          />
        </FieldWrapper>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          columnGap: "32px",
          rowGap: "24px",

          width: "100%",
          "& .MuiTextField-root": {
            width: "100%",
            maxWidth: "220px",
          },
        }}
      >
        <FieldWrapper label="Other Offer">
          <StyledTextField
            name="other_offer"
            value={formData.other_offer ? 1 : 0}
            onChange={(e) => {
              handleChange({
                target: {
                  name: "other_offer",
                  value: !!+e.target.value,
                },
              });
            }}
            select
            SelectProps={{
              native: true,
            }}
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </StyledTextField>
        </FieldWrapper>

        <FieldWrapper label="Role Offer">
          <StyledTextField
            name="job_id"
            value={formData.job_id}
            onChange={handleChange}
            select
            required
            error={Boolean(errors.job_id)}
            helperText={errors.job_id}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select Role</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.name.split("_").join(" ")}
              </option>
            ))}
          </StyledTextField>
        </FieldWrapper>
      </Box>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#007AFF",
            color: "white",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
          onClick={handleSubmit}
          loading={isAddingEngagement}
        >
          Save
        </Button>
      </Box>
    </div>
  );
};

export default EngagementForm;
