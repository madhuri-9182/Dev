/* eslint-disable no-unused-vars */
import axios from "../../../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { extractErrors } from "./utils";

const BASE_URL = "/api/client";

export const errorToaster = (error) => {
  if (typeof error === "string") {
    toast.error(error, { position: "top-right" });
    return;
  }
  const errors = error.response.data.errors;
  const extractedErrors = extractErrors(errors);
  extractedErrors.forEach((error) => {
    toast.error(error.message, { position: "top-right" });
  });
};

const successToaster = (message) => {
  toast.success(message, { position: "top-right" });
};

// Fetch all candidates with optional search and pagination
export const useEngagements = (filters, org_id) => {
  return useQuery({
    queryKey: ["engagements", filters, filters.offset],
    queryFn: async () => {
      try {
        // Create params object excluding 'all' values and empty values
        const params = {};

        if (filters?.search) params.q = filters.search;
        if (filters?.role && filters.role.length > 0)
          params.job_ids = filters.role.map((role) => role.value).join(",");
        if (filters?.function && filters.function.length > 0)
          params.specializations = filters.function
            .map((func) => func.value)
            .join(",");
        if (filters?.notice && filters.notice.length > 0)
          params.nps = filters.notice.map((notice) => notice.value).join(",");
        
        // Add pagination parameters
        params.offset = filters.offset || 0;

        if (org_id) params.organization_id = org_id;

        const { data } = await axios.get(`${BASE_URL}/engagements/`, { params });
        return data;
      } catch (error) {
        errorToaster(error);
        throw error;
      }
    },
    // Keep previous data while loading new data
    keepPreviousData: true,
  });
};

export const useJobs = (org_id) => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        const params = {};
        if (org_id) params.organization_id = org_id
        const { data } = await axios.get("/api/client/jobs/", { params });
        return data;
      } catch (error) {
        errorToaster(error);
        throw error;
      }
    },
  });
};

// Fetch all candidates with optional search
export const useEngagementTemplates = () => {
  return useQuery({
    queryKey: ["engagementTemplates"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/engagement-templates?offset=0&limit=100`
        );
        return data;
      } catch (error) {
        errorToaster(error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useAddEngagementTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateData) => {
      try {
        const formData = new FormData();

        formData.append("subject", templateData.subject);
        formData.append(
          "template_html_content",
          templateData.template_html_content
        );
        formData.append("template_name", templateData.template_name);

        if (templateData.attachment instanceof File) {
          formData.append("attachment", templateData.attachment);
        }
        const { data } = await axios.post(
          `${BASE_URL}/engagement-templates/`,
          formData
        );

        return { ...templateData, id: data.data.id };
      } catch (error) {
        errorToaster(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["engagementTemplates"] });
      successToaster("Template added successfully");
    },
  });
};

export const useUpdateEngagementTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateData) => {
      try {
        const formData = new FormData();

        formData.append("subject", templateData.subject);
        formData.append(
          "template_html_content",
          templateData.template_html_content
        );
        formData.append("template_name", templateData.template_name);

        if (
          templateData.attachment instanceof File ||
          templateData.attachment === null
        ) {
          formData.append(
            "attachment",
            templateData.attachment === null ? "" : templateData.attachment
          );
        }

        const { data } = await axios.patch(
          `${BASE_URL}/engagement-template/${templateData.id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
      } catch (error) {
        errorToaster(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["engagementTemplates"] });
      successToaster("Template updated successfully");
    },
  });
};

// Fetch engagement statistics
export const useEngagementStats = () => {
  return useQuery({
    queryKey: ["engagementStats"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/stats`);
        return data;
      } catch (error) {
        errorToaster(error);
        throw error;
      }
    },
  });
};

// Add new candidate
export const useAddEngagement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (engagementData) => {
      try {
        const formData = new FormData();

        Object.keys(engagementData).forEach((key) => {
          formData.append(key, engagementData[key]);
        });

        const { data } = await axios.post(
          `${BASE_URL}/engagements/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        return data;
      } catch (error) {
        errorToaster(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["engagements"] });

      successToaster("Engagement added successfully");
    },
  });
};

// Update candidate status
export const useUpdateEngagementStatus = (filters) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ engagementId, payload }) => {
      try {
        const { data } = await axios.patch(
          `${BASE_URL}/engagements/${engagementId}/`,
          payload
        );
        return { status: payload.status, id: engagementId };
      } catch (error) {
        errorToaster(error);

        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["engagements", filters]);

      successToaster(`Engagement status updated`);
    },
  });
};

export const useUpdateEngagementSchedule = () => {
  return useMutation({
    mutationFn: async ({ engagementId, payload }) => {
      try {
        const { data } = await axios.put(
          `${BASE_URL}/engagement-operation/${engagementId}/`,
          payload
        );
        return data;
      } catch (error) {
        errorToaster(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      successToaster(`Engagement operations updated`);
    },
  });
};

// Update candidate week
export const useUpdateCandidateWeek = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ candidateId, week }) => {
      const { data } = await axios.patch(`${BASE_URL}/${candidateId}/week`, {
        week,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
};

// Delete candidate
export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidateId) => {
      const { data } = await axios.delete(`${BASE_URL}/${candidateId}`);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch candidates and stats
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["engagementStats"] });
    },
  });
};

export const useResumeParser = () => {
  return useMutation({
    mutationFn: async (resume) => {
      try {
        const formData = new FormData();
        formData.append("resume", resume);

        const { data } = await axios.post(
          `${BASE_URL}/parse-resume/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (data.data.length) {
          successToaster("Resume parsed successfully");
          return data.data;
        } else throw "Resume parsing failed";
      } catch (error) {
        errorToaster(error);
        throw error;
      }
    },
  });
};

export const useClientUser = () => {
  return useQuery({
    queryKey: ["clientUser"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/client-user/`);
        return data;
      } catch (error) {
        errorToaster(error);
        throw error;
      }
    },
  });
};
