import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  CloseCircle,
  Edit,
  LogoutCurve,
} from "iconsax-react";
import { FaCheck } from "react-icons/fa6";
import {
  fileToBase64,
  formatExperience,
} from "../../../../utils/util";
import {
  EMAIL_REGEX,
  GENDERS,
} from "../../../Constants/constants";

export const ResumeTable = ({
  data,
  setData,
  editingRowId,
  setEditingRowId,
  selectedSource,
  selectedRole,
  selectedSpecialization,
}) => (
  <div className="w-full mt-20 overflow-x-auto">
    <table className="w-full text-2xs text-[#313A4E] border-collapse">
      <thead className="text-[#6B6F7B] font-bold mt-3">
        <tr className="flex items-center gap-2 text-left">
          <th className="px-3 w-[14.33%]">Name</th>
          <th className="px-3 w-[12%]">Experience</th>
          <th className="px-3 w-[13%]">Mobile Number</th>
          <th className="px-3 w-1/6">Email ID</th>
          <th className="px-3 w-1/5">Company</th>
          <th className="px-3 w-[11%]">Gender</th>
          <th className="px-3 w-[13%]"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <ResumeTableRow
            key={idx}
            item={item}
            data={data}
            setData={setData}
            editingRowId={editingRowId}
            setEditingRowId={setEditingRowId}
            selectedSource={selectedSource}
            selectedRole={selectedRole}
            selectedSpecialization={selectedSpecialization}
          />
        ))}
      </tbody>
    </table>
  </div>
);

ResumeTable.propTypes = {
  data: PropTypes.array,
  setData: PropTypes.func,
  editingRowId: PropTypes.string,
  setEditingRowId: PropTypes.func,
  selectedSource: PropTypes.string,
  selectedRole: PropTypes.number,
  selectedSpecialization: PropTypes.string,
};

// Table row component
const ResumeTableRow = ({
  item,
  data,
  setData,
  editingRowId,
  setEditingRowId,
  selectedSource,
  selectedRole,
  selectedSpecialization,
}) => {
  const [editedData, setEditedData] = useState({
    ...item,
    phone_number: item.phone_number.startsWith("+91")
      ? item.phone_number.slice(3)
      : item.phone_number,
    gender: item.gender ? item.gender : "",
  });
  const [errors, setErrors] = useState({});

  // Validate fields immediately when component mounts
  useEffect(() => {
    validateFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e, field, subField = null) => {
    const value = e.target.value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
    setEditedData((prev) => {
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
    // Validate the field immediately after changing it
    setTimeout(() => validateFields(), 0);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!editedData.name || editedData.name === "Not Found")
      newErrors.name =
        "Name not parsed. Please fill manually to submit";
    if (
      !editedData.email ||
      editedData.email === "NotFound"
    )
      newErrors.email =
        "Email not parsed. Please fill manually to submit";
    if (
      editedData.email &&
      editedData.email !== "NotFound" &&
      !EMAIL_REGEX.test(editedData.email)
    )
      newErrors.email = "Invalid email address.";
    if (
      !editedData.phone_number ||
      editedData.phone_number === "Not Found"
    )
      newErrors.phone_number =
        "Mobile number not parsed. Please fill manually to submit";
    if (
      !editedData.current_company ||
      editedData.current_company === "Not Found"
    )
      newErrors.current_company =
        "Company not parsed. Please fill manually to submit";
    if (!editedData.gender)
      newErrors.gender =
        "Gender is required. Please fill manually to submit";

    if (
      editedData.years_of_experience.year === 0 &&
      editedData.years_of_experience.month === 0
    ) {
      newErrors.years_of_experience =
        "Experience not parsed. Please fill manually to submit";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const saveEdit = () => {
    if (!validateFields()) return;
    const updatedData = data.map((row) =>
      row.id === item.id
        ? {
            ...editedData,
            phone_number: `+91${editedData.phone_number}`,
          }
        : row
    );
    setData(updatedData);
    setEditingRowId(null);
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    const selectedIData = data.find(
      (row) => row.id === item.id
    );
    let fileBase64 = null;
    if (selectedIData.file) {
      fileBase64 = await fileToBase64(selectedIData.file);
    }
    const encodedData = {
      ...selectedIData,
      source: selectedSource,
      role: selectedRole,
      specialization: selectedSpecialization,
      fileBase64,
    };
    delete encodedData.id;
    delete encodedData.file;

    const uniqueKey = `candidateData-${selectedIData.id}`;

    // Store the encoded data in localStorage (or sessionStorage)
    localStorage.setItem(
      uniqueKey,
      JSON.stringify(encodedData)
    );
    const url = `/client/candidates/schedule-interview?key=${uniqueKey}`;

    // Open in a new tab
    window.open(url, "_blank");
  };

  const inputValue = (key) => {
    return editedData[key] === "Not Found" ||
      editedData[key] === "NotFound"
      ? ""
      : editedData[key];
  };

  const tableDataValues = (key) => {
    return item[key] === "Not Found" ||
      item[key] === "NotFound"
      ? "-"
      : item[key];
  };

  window.removeCandidateFromData = (key) => {
    const updatedKey = key.split("candidateData-")[1];
    const updatedData = data.filter((row) => {
      return row.id !== updatedKey;
    });
    setData(updatedData);
  };

  return (
    <>
      <tr>
        <td colSpan="7">
          <hr className="w-full bg-[#F4F4F4] h-[1px] my-3" />
        </td>
      </tr>
      <tr className="flex items-center gap-x-2 text-left">
        {editingRowId === item.id ? (
          <>
            <td className="px-3 w-[14.33%]">
              <Input
                type="text"
                value={inputValue("name")}
                onChange={(e) => handleChange(e, "name")}
                placeholder="Name"
                className="w-[95%]"
              />
            </td>
            <td className="px-3 w-[12%]">
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={
                    editedData.years_of_experience.year
                  }
                  onChange={(e) =>
                    handleChange(
                      e,
                      "years_of_experience",
                      "year"
                    )
                  }
                  placeholder="Years"
                  className="w-[45%]"
                />
                <Input
                  type="number"
                  value={
                    editedData.years_of_experience.month
                  }
                  onChange={(e) =>
                    handleChange(
                      e,
                      "years_of_experience",
                      "month"
                    )
                  }
                  placeholder="Months"
                  className="w-[45%]"
                />
              </div>
            </td>
            <td className="px-3 w-[13%]">
              <Input
                type="number"
                value={editedData.phone_number}
                onChange={(e) =>
                  handleChange(e, "phone_number")
                }
                placeholder="Mobile Number"
                className="w-[95%]"
              />
            </td>
            <td className="px-3 w-1/6">
              <Input
                type="email"
                value={inputValue("email")}
                onChange={(e) => handleChange(e, "email")}
                placeholder="Email ID"
              />
            </td>
            <td className="px-3 w-1/5">
              <Input
                type="text"
                value={inputValue("current_company")}
                onChange={(e) =>
                  handleChange(e, "current_company")
                }
                placeholder="Company"
              />
            </td>
            <td className="px-3 w-[11%]">
              <select
                value={editedData.gender}
                onChange={(e) => handleChange(e, "gender")}
                className="custom-select w-full px-2 py-1 border text-2xs font-medium bg-white text-[#6B6F7B] rounded"
              >
                <option value="">Select</option>
                {GENDERS.map((gender, idx) => (
                  <option key={idx} value={gender.id}>
                    {gender.name}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-3 flex items-center gap-2 w-[13%]">
              <CloseCircle
                size="20"
                color="#555555"
                variant="Outline"
                className="cursor-pointer"
                onClick={() => {
                  setEditingRowId(null);
                  setEditedData({
                    ...item,
                    phone_number:
                      item.phone_number.startsWith("+91")
                        ? item.phone_number.slice(3)
                        : item.phone_number,
                    gender: item.gender ? item.gender : "",
                  });
                  validateFields();
                }}
              />
              <button
                onClick={saveEdit}
                className="px-3 py-1 rounded-full text-xs font-medium text-white 
                  bg-[#007AFF] transition-all duration-300 ease-in-out
                  hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer flex items-center w-[90px] justify-center"
              >
                Save
              </button>
            </td>
          </>
        ) : (
          <>
            <td className="px-3 w-[14.33%]">
              {tableDataValues("name")}
            </td>
            <td className="px-3 w-[12%]">
              {formatExperience(item.years_of_experience)}
            </td>
            <td className="px-3 w-[13%]">
              {tableDataValues("phone_number")}
            </td>
            <td className="px-3 w-1/6">
              {tableDataValues("email")}
            </td>
            <td className="px-3 w-1/5">
              {tableDataValues("current_company")}
            </td>
            <td className="px-3 w-[11%]">
              {item.gender
                ? GENDERS.find(
                    (gender) => gender.id === item.gender
                  )?.name
                : "Not specified"}
            </td>
            <td className="px-3 flex items-center gap-2 w-[13%]">
              <Edit
                size={20}
                color="#595BD4"
                variant="Outline"
                className="cursor-pointer min-w-4 min-h-4"
                onClick={() => setEditingRowId(item.id)}
              />
              <button
                className="px-3 py-1 rounded-full text-xs font-medium text-white  
                       bg-[#007AFF] transition-all duration-300 ease-in-out
                       hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer flex items-center"
                onClick={handleSubmit}
              >
                <FaCheck className="mr-2" /> Submit
              </button>
            </td>
          </>
        )}
      </tr>
      <tr>
        <td colSpan="7">
          {Object.keys(errors).map((key, idx) => (
            <p
              key={idx}
              className="text-[#F00000] text-[10px] px-2 mt-[2px]"
            >
              {errors[key]}
            </p>
          ))}
        </td>
      </tr>
    </>
  );
};

ResumeTableRow.propTypes = {
  item: PropTypes.object,
  data: PropTypes.array,
  setData: PropTypes.func,
  editingRowId: PropTypes.string,
  setEditingRowId: PropTypes.func,
  selectedSource: PropTypes.string,
  selectedRole: PropTypes.number,
  selectedSpecialization: PropTypes.string,
};

const Input = ({
  value,
  onChange,
  placeholder,
  type,
  className,
}) => {
  return (
    <input
      type={type}
      max={
        type === "number" && placeholder === "Months"
          ? 11
          : undefined
      }
      maxLength={
        type === "number" && placeholder === "Mobile Number"
          ? 10
          : undefined
      }
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded px-2 py-1 ${className}`}
    />
  );
};

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
};

// Upload button component
export const UploadButton = ({
  label,
  onClick,
  disabled,
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="w-1/2 h-[184px] flex items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-50"
  >
    <p className="flex flex-col gap-3 items-center">
      <LogoutCurve
        className="rotate-90"
        color="#171717"
        size={24}
      />
      <span className="text-sm font-medium text-[#6B6F7B]">
        {label}
      </span>
    </p>
  </button>
);

UploadButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
