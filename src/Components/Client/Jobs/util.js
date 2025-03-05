export const extractUniquePersonnel = (jobs) => {
  if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
    return {
      hiringManagers: [],
      recruiters: [],
    };
  }

  const hiringManagerIds = new Set();
  const recruiterIds = new Set();
  const hiringManagers = [];
  const recruiters = [];

  jobs.forEach((job) => {
    // Extract hiring managers
    if (
      job.hiring_manager &&
      job.hiring_manager.id &&
      job.hiring_manager.name
    ) {
      const { id, name } = job.hiring_manager;
      if (!hiringManagerIds.has(id)) {
        hiringManagerIds.add(id);
        hiringManagers.push({ id, name });
      }
    }

    // Extract recruiters
    if (job.clients && Array.isArray(job.clients)) {
      job.clients.forEach((client) => {
        if (client && client.id && client.name) {
          if (!recruiterIds.has(client.id)) {
            recruiterIds.add(client.id);
            recruiters.push({
              id: client.id,
              name: client.name,
            });
          }
        }
      });
    }
  });

  return { hiringManagers, recruiters };
};
