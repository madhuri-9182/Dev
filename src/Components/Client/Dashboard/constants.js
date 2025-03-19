export const ALL_TASKS = [
  {
    label: "Total Interviews",
    key: "total_candidates",
    path: "/client/candidates",
    state: {
      status: 'SCH'
    }
  },
  {
    label: "Pending Schedule",
    key: "pending_schedule",
    path: "/client/candidates",
    state: {
      status: 'NSCH'
    }
  },
  {
    label: "Selects",
    key: "selects",
    path: "/client/candidates",
    state: {
      status: 'REC'
    }
  },
  {
    label: "Joined",
    key: "joined",
  },
  {
    label: "",
    key: "",
  },
  {
    label: "",
    key: "",
  },
];

export const MY_JOBS = [
  {
    label: "My Jobs",
    key: "total_jobs",
    path: "/client/jobs"
  },
  {
    label: "Total Candidates",
    key: "total_candidates",
    path: "/client/candidates"
  },
  {
    label: "Selected Candidates",
    key: "selects",
    path: "/client/candidates",
    state: {
      status: 'REC'
    }
  },
  {
    label: "Rejected Candidates",
    key: "rejects",
    path: "/client/candidates",
    state: {
      status: 'NREC'
    }
  },
];

export const ANALYTICS = [
  {
    label: "Companies with More Selects",
  },
  {
    label: "Diversity Ratio",
  },
  {
    label: "Role Wise Company Selects",
  },
  {
    label: "Interview Decline",
  },
];
