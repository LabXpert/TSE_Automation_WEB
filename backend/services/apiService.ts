// src/services/apiService.ts
const API_BASE_URL = 'http://localhost:3001/api';

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic API call function
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API call failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu' 
    };
  }
}

// Companies API
export const companiesApi = {
  // Tüm firmaları getir
  getAll: (): Promise<ApiResponse<any[]>> => {
    return apiCall('/companies');
  },

  // Yeni firma ekle
  create: (companyData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    contact_name?: string;
    tax_no?: string;
  }): Promise<ApiResponse<any>> => {
    return apiCall('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }
};

// Personnel API
export const personnelApi = {
  getAll: (): Promise<ApiResponse<any[]>> => {
    return apiCall('/personnel');
  }
};

// Experiment Types API
export const experimentTypesApi = {
  getAll: (): Promise<ApiResponse<any[]>> => {
    return apiCall('/experiment-types');
  }
};

// Applications API
export const applicationsApi = {
  getAll: (): Promise<ApiResponse<any[]>> => {
    return apiCall('/applications');
  },

  create: (applicationData: {
    company_id: number;
    application_no: string;
    application_date: string;
    certification_type: string;
    test_count: number;
    tests: Array<{
      experiment_type_id: number;
      responsible_personnel_id: number;
      unit_price: number;
    }>;
  }): Promise<ApiResponse<any>> => {
    return apiCall('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }
};

// Users API
export const usersApi = {
  getAll: (): Promise<ApiResponse<any[]>> => {
    return apiCall('/users');
  }
};

// Main API object
export const api = {
  companies: companiesApi,
  personnel: personnelApi,
  experimentTypes: experimentTypesApi,
  applications: applicationsApi,
  users: usersApi,
};

export default api;