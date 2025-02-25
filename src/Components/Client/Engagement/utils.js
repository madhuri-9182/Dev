import { NOTICE_PERIOD } from "./constants";

export const findEngagementActiveStep = (operations) => {
  const activeStep = Math.max(
    ...operations
      .filter((operation) => {
        if (operation.delivery_status === "SUC") return operation;
      })
      .map((operation) => operation.week),
    0
  );

  return activeStep || 0;
};

export const findAllSteps = (noticePeriod) => {
  return new Array(NOTICE_PERIOD.find((p) => p.value === noticePeriod)?.weeks)
    .fill(1)
    .map((_, i) => `Weeks ${i + 1}`);
};

export const extractSubjectAndContent = (content) => {
  if (!content) return { subject: "", content: "" };

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const firstHeading = doc.querySelector("h1, h2, h3, h4, h5, h6");
  const firstSeparator = doc.querySelector("hr");
  const subject = firstHeading ? firstHeading.textContent.trim() : "";

  if (firstHeading) {
    firstHeading.remove();
  }

  if (firstSeparator) {
    firstSeparator.remove();
  }

  const remainingContent = doc.body.innerHTML.trim();

  return {
    subject,
    content: remainingContent,
  };
};

export const joinContentAndSubject = (subject, content) => {
  return `<h3>${subject}</h3>\n<hr/> ${content}`;
};

// errors:{
//   "candidate_email": [
//       "engagement with this candidate email already exists."
//   ]
// }

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const extractErrors = (errors) => {
  if (!errors) return [];
  return Object.keys(errors).map((key) => ({
    message: capitalizeFirstLetter(errors[key][0]),
    path: key,
  }));
};

export const getScheduledEventsPerWeekInitialValue = (engagement) => {
  const weeks = NOTICE_PERIOD.find(
    (period) => period.value === engagement.notice_period
  ).weeks;
  return new Array(weeks).fill(null).map((_, idx) => ({
    week: idx + 1,
    slots: [null, null],
  }));
};
