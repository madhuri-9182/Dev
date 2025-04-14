import { Fragment, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  getJobLabel,
  getSpecialization,
} from "../../../utils/util";
import PropTypes from "prop-types";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { IoCheckmark } from "react-icons/io5";
import useAuth from "../../../hooks/useAuth";
import { ROLES } from "../../Constants/constants";
import JobViewModal from "../../Agency/components/JobViewModal";

export const FilterListbox = ({
  value,
  onChange,
  options,
  placeholder,
  displayValue,
  multiple = false,
}) => {
  const filteredOptions = useMemo(() => {
    if (
      !multiple ||
      !Array.isArray(value) ||
      !value.length
    ) {
      return options;
    }

    // For job_ids that might be nested arrays
    if (
      options.some(
        (option) =>
          option.value && Array.isArray(option.value)
      )
    ) {
      return options.filter((option) => {
        if (!option.value) return true;

        // Check if this job option's ID array has any overlap with selected IDs
        const optionIds = Array.isArray(option.value)
          ? option.value
          : [option.value];
        return !optionIds.some((id) =>
          value.flat().includes(id)
        );
      });
    }

    // For normal IDs (recruiters, managers)
    return options.filter((option) => {
      const optionValue =
        option.value !== undefined
          ? option.value
          : option.id !== undefined
          ? option.id
          : option;
      return !value.includes(optionValue);
    });
  }, [options, value, multiple]);

  return (
    <Listbox
      value={value}
      onChange={onChange}
      multiple={multiple}
    >
      <div className="relative">
        <ListboxButton
          className={`relative custom-select w-full rounded-lg border border-[#979DA3] py-1 px-3 text-left text-2xs text-[#49454F] shadow-sm focus:outline-none`}
        >
          <span className="block truncate">
            {displayValue || placeholder}
          </span>
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-2xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const optionValue =
                  option.value !== undefined
                    ? option.value
                    : option.id !== undefined
                    ? option.id
                    : option;
                const optionLabel =
                  option.label || option.name || option;

                // Check if this option is selected
                const isSelected = multiple
                  ? Array.isArray(value) &&
                    value.includes(optionValue)
                  : value === optionValue;

                return (
                  <ListboxOption
                    key={
                      typeof optionValue === "object"
                        ? JSON.stringify(optionValue)
                        : optionValue
                    }
                    value={optionValue}
                    className={({ active }) =>
                      `${
                        active
                          ? "bg-[#007AFF] text-white"
                          : "text-gray-900"
                      }
                      relative cursor-pointer select-none py-1 px-3`
                    }
                  >
                    {({ active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            isSelected
                              ? "font-medium"
                              : "font-normal"
                          }`}
                        >
                          {getJobLabel(optionLabel)}
                        </span>
                        {isSelected && (
                          <span
                            className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                              active
                                ? "text-white"
                                : "text-[#007AFF]"
                            }`}
                          >
                            <IoCheckmark
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                );
              })
            ) : (
              <ListboxOption className="text-gray-900 py-2 px-3">
                No options available
              </ListboxOption>
            )}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
};

FilterListbox.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  displayValue: PropTypes.string,
  multiple: PropTypes.bool,
};

export const FilterTags = ({
  jobFilters,
  recruiterFilters,
  managerFilters,
  groupedJobs,
  recruiters,
  hiringManagers,
  onRemoveJobFilter,
  onRemoveRecruiterFilter,
  onRemoveManagerFilter,
}) => {
  const hasFilters =
    jobFilters.length > 0 ||
    recruiterFilters.length > 0 ||
    managerFilters.length > 0;

  if (!hasFilters) return null;

  const getJobName = (jobId) => {
    for (const [name, ids] of Object.entries(groupedJobs)) {
      if (ids.includes(jobId) || ids.includes(jobId[0])) {
        return getJobLabel(name);
      }
    }
    return jobId;
  };

  const getRecruiterName = (recruiterId) => {
    const recruiter = recruiters.find(
      (r) => r.id === recruiterId
    );
    return recruiter ? recruiter.name : recruiterId;
  };

  const getManagerName = (managerId) => {
    const manager = hiringManagers.find(
      (m) => m.id === managerId
    );
    return manager ? manager.name : managerId;
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      {jobFilters.length > 0 && (
        <div className="flex items-center">
          <span className="text-2xs font-semibold mr-2">
            Jobs:
          </span>
          <div className="flex flex-wrap gap-2">
            {jobFilters.map((jobId) => (
              <span
                key={jobId}
                className="inline-flex items-center gap-1 bg-[#E8DEF8] text-[#4A4459] text-2xs px-2 py-1 rounded-lg"
              >
                {getJobName(jobId)}
                <button
                  onClick={() => onRemoveJobFilter(jobId)}
                  className="text-[#4A4459] hover:text-[#007AFF] focus:outline-none"
                >
                  <IoClose className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {recruiterFilters.length > 0 && (
        <div className="flex items-center">
          <span className="text-2xs font-semibold mr-2">
            Recruiters:
          </span>
          <div className="flex flex-wrap gap-2">
            {recruiterFilters.map((recruiterId) => (
              <span
                key={recruiterId}
                className="inline-flex items-center gap-1 bg-[#E8DEF8] text-[#4A4459] text-2xs px-2 py-1 rounded-lg"
              >
                {getRecruiterName(recruiterId)}
                <button
                  onClick={() =>
                    onRemoveRecruiterFilter(recruiterId)
                  }
                  className="text-[#4A4459] hover:text-[#007AFF] focus:outline-none"
                >
                  <IoClose className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {managerFilters.length > 0 && (
        <div className="flex items-center">
          <span className="text-2xs font-semibold mr-2">
            Hiring Managers:
          </span>
          <div className="flex flex-wrap gap-2">
            {managerFilters.map((managerId) => (
              <span
                key={managerId}
                className="inline-flex items-center gap-1 bg-[#E8DEF8] text-[#4A4459] text-2xs px-2 py-1 rounded-lg"
              >
                {getManagerName(managerId)}
                <button
                  onClick={() =>
                    onRemoveManagerFilter(managerId)
                  }
                  className="text-[#4A4459] hover:text-[#007AFF] focus:outline-none"
                >
                  <IoClose className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

FilterTags.propTypes = {
  jobFilters: PropTypes.array.isRequired,
  recruiterFilters: PropTypes.array.isRequired,
  managerFilters: PropTypes.array.isRequired,
  groupedJobs: PropTypes.object.isRequired,
  recruiters: PropTypes.array.isRequired,
  hiringManagers: PropTypes.array.isRequired,
  onRemoveJobFilter: PropTypes.func.isRequired,
  onRemoveRecruiterFilter: PropTypes.func.isRequired,
  onRemoveManagerFilter: PropTypes.func.isRequired,
};

export const JobCard = ({
  job,
  onView,
  onArchive,
  onAddCandidate,
  onEdit,
}) => {
  const { auth } = useAuth();
  const isAgency = ROLES.AGENCY.includes(auth?.role);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const handleViewJob = () => {
    if (isAgency) {
      setViewModalOpen(true);
    } else if (onView) {
      onView(job);
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-[#EBEBEB80] flex justify-between items-center px-7 py-2">
        <div className="flex items-center justify-between gap-3 w-3/4">
          <div className="w-1/2">
            <span
              className={`${
                isAgency
                  ? ""
                  : "hover:underline hover:font-semibold cursor-pointer"
              } text-2xs uppercase `}
              onClick={() => {
                if (isAgency) return;
                onEdit && onEdit(job);
              }}
            >
              {getJobLabel(job.name)} (
              {getSpecialization(job.specialization)})
            </span>
          </div>
          <div className="flex gap-4 w-1/2">
            <button
              className="text-2xs font-semibold w-20 py-1 tertiary-button"
              onClick={handleViewJob}
            >
              View
            </button>
            <button
              className="text-2xs font-semibold w-36 py-1 tertiary-button"
              onClick={() =>
                onAddCandidate && onAddCandidate(job)
              }
            >
              + Add Candidate
            </button>
            {!isAgency && onArchive && (
              <button
                className={`text-2xs font-semibold border border-[#79747E] w-24 py-1 flex items-center justify-center rounded-[100px] bg-transparent text-[#65558F] hover:bg-gray-100 ${
                  job.reason_for_archived ? "invisible" : ""
                }`}
                onClick={() => onArchive(job.id)}
              >
                Archive
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-end items-center gap-2">
          <p className="text-2xs font-medium">
            Active Candidates
          </p>
          <div className="w-6 h-6 bg-[#9a9a9a] text-white text-default font-semibold rounded-full flex items-center justify-center">
            {job.active_candidates}
          </div>
        </div>
      </div>

      {/* Job View Modal for Agency Users */}
      {isAgency && (
        <JobViewModal
          job={job}
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />
      )}
    </>
  );
};

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
  onView: PropTypes.func,
  onArchive: PropTypes.func,
  onAddCandidate: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
};

export default JobCard;

JobCard.propTypes = {
  job: PropTypes.object,
  onView: PropTypes.func,
  onArchive: PropTypes.func,
  onAddCandidate: PropTypes.func,
  onEdit: PropTypes.func,
};
