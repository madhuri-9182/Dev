import React, { useEffect, useState } from "react";
import AddButton from "../../shared/AddButton";
import { Pagination } from "@mui/material";
import PropTypes from "prop-types";
import useAllUsers from "../../../hooks/useFetchAllUsers";
import {
  formatDate,
  revertDateFormat,
  getJobLabel,
} from "../../../utils/util";

const JobListing = ({
  handleAddJobClick,
  handleShowJobDetails,
  handleArchiveModalOpen,
  handleChangePage,
  data,
  setFilters,
  filters,
  allJobs,
}) => {
  const { count, results } = data;
  const { data: users } = useAllUsers();

  const [hiringManagers, setHiringManagers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);

  const groupedJobs = allJobs.reduce((acc, job) => {
    if (!acc[job.name]) {
      acc[job.name] = [];
    }
    acc[job.name].push(job.id);
    return acc;
  }, {});

  useEffect(() => {
    if (users) {
      setHiringManagers(users);
      setRecruiters(users);
    }
  }, [users]);

  return (
    <React.Fragment>
      <div className="flex items-center justify-end gap-2 mb-8">
        <AddButton
          onClick={handleAddJobClick}
          label="+ Add Job"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-12">
        <select
          className={`min-w-24 ${filterSelectClassName}`}
          onChange={(e) => {
            const selectedName = e.target.value;
            setFilters({
              ...filters,
              job_ids: selectedName
                ? groupedJobs[selectedName]
                : [],
            });
          }}
        >
          <option value="">All Jobs</option>
          {Object.entries(groupedJobs).map(
            ([name, ids]) => (
              <option key={ids} value={name}>
                {name}
              </option>
            )
          )}
        </select>
        <select
          className={`${filterSelectClassName} min-w-20`}
          onChange={(e) => {
            setFilters({
              ...filters,
              recruiter_ids: [e.target.value],
            });
          }}
        >
          <option value="">User</option>
          {recruiters.map((user, idx) => (
            <option key={idx} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <select
          className={`${filterSelectClassName} min-w-32`}
          onChange={(e) => {
            setFilters({
              ...filters,
              hiring_manager_ids: [e.target.value],
            });
          }}
        >
          <option value="">Hiring Manager</option>
          {hiringManagers.map((user, idx) => (
            <option key={idx} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {/* There is no filter for active and archive for now */}
        <select
          className={`${filterSelectClassName} min-w-20`}
        >
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
        </select>
        <input
          type="date"
          max={new Date().toISOString().split("T")[0]}
          className={`${filterInputClassName} min-w-24`}
          onChange={(e) => {
            setFilters({
              ...filters,
              post_job_date: formatDate(e.target.value),
            });
          }}
          value={revertDateFormat(filters.post_job_date)}
        />
        {/* Reset button */}
        <button
          className="text-xs font-semibold text-[#4A4459] hover:text-[#007AFF] bg-transparent w-24 py-1 flex items-center  "
          onClick={() =>
            setFilters({
              post_job_date: "",
              job_ids: [],
              hiring_manager_ids: [],
              recruiter_ids: [],
            })
          }
        >
          Reset
        </button>
      </div>

      {/* Table */}

      {count ? (
        <>
          <div className="w-full flex flex-col gap-2">
            {results.map((row, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#EBEBEB80] flex justify-between items-center px-7 py-2"
              >
                <div className="flex items-center justify-between gap-3 w-2/3">
                  <p
                    className="text-xs uppercase cursor-pointer w-[30%]"
                    onClick={() => handleAddJobClick(row)}
                  >
                    {getJobLabel(row.name)}
                  </p>
                  <div className="flex gap-4 w-[70%]">
                    <button
                      className="text-xs font-semibold text-[#4A4459] bg-[#E8DEF8] w-20 py-1 flex items-center justify-center rounded-[100px]"
                      onClick={() =>
                        handleShowJobDetails(row)
                      }
                    >
                      View
                    </button>
                    <button className="text-xs font-semibold text-[#4A4459] bg-[#E8DEF8] w-36 py-1 flex items-center justify-center rounded-[100px]">
                      + Add Candidate
                    </button>

                    <button
                      className={`text-xs font-semibold border border-[#79747E] w-24 py-1 flex items-center justify-center rounded-[100px] bg-transparent text-[#65558F] ${
                        row.reason_for_archived &&
                        "invisible"
                      }`}
                      onClick={() =>
                        handleArchiveModalOpen(row.id)
                      }
                    >
                      Archive
                    </button>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <p className="text-xs font-medium">
                    Active Candidates
                  </p>
                  <div className="w-6 h-6 bg-[#979DA3] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                    {row.total_positions}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            count={Math.ceil(count / 10)}
            className="mt-6 flex justify-end"
            onChange={(e, page) => handleChangePage(page)}
            variant="outlined"
            size="small"
            shape="rounded"
          />
        </>
      ) : (
        <p className="text-sm font-semibold uppercase text-center text-[#6B6F7B]">
          No Jobs Found
        </p>
      )}
    </React.Fragment>
  );
};

export default JobListing;

JobListing.propTypes = {
  handleAddJobClick: PropTypes.func,
  handleShowJobDetails: PropTypes.func,
  handleArchiveModalOpen: PropTypes.func,
  handleChangePage: PropTypes.func,
  data: PropTypes.object,
  setFilters: PropTypes.func,
  filters: PropTypes.object,
  allJobs: PropTypes.array,
};

const filterSelectClassName =
  "border border-[#979DA3] text-xs py-1 px-3 custom-select rounded-lg";

const filterInputClassName =
  "border border-[#979DA3] text-xs py-1 px-3 rounded-lg";
