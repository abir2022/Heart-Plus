/**
 * Heart+ API Utility
 * Connects the React frontend to the Cloudflare backend.
 */

const API_BASE_URL = "https://heart-plus-backend.abirislam2020.workers.dev/api";

export const api = {
  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error("Invalid credentials");
    return response.json();
  },

  // Public Search for Patients
  publicSearch: async (reportId, mobile) => {
    const response = await fetch(`${API_BASE_URL}/public/search?reportId=${reportId}&mobile=${mobile}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Report not found");
    }
    return response.json();
  },

  // Approve Report (Doctor Only)
  approveReport: async (reportId) => {
    const response = await fetch(`${API_BASE_URL}/approve-report`, {
      method: 'POST',
      body: JSON.stringify({ reportId })
    });
    return response.json();
  },

  // Fetch recent reports
  getReports: async () => {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) throw new Error("Failed to fetch reports");
    return response.json();
  },

  // Search patient by mobile
  searchPatient: async (mobile) => {
    const response = await fetch(`${API_BASE_URL}/patients/search?mobile=${mobile}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Search failed");
    return response.json();
  },

  // Upload ECG
  uploadECG: async (file, mobile, userId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mobile", mobile);
    formData.append("userId", userId);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Upload failed");
    return response.json();
  },

  // Get report detail
  getReportDetail: async (id) => {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`);
    if (!response.ok) throw new Error("Report not found");
    return response.json();
  },

  // Save prescription
  savePrescription: async (data) => {
    const response = await fetch(`${API_BASE_URL}/prescriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save prescription");
    return response.json();
  },
};
