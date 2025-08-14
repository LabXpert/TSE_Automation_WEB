// src/services/apiService.ts
const API_BASE_URL = 'http://localhost:3001/api';

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Backend'den gelen tipler (backend ile birebir uyumlu)
export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contact_name?: string;
  tax_no?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Personnel {
  id: string;
  name: string;
  surname: string;
  title?: string;
  department?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExperimentType {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Test {
  id: string;
  application_id: string;
  experiment_type_id: string;
  responsible_personnel_id: string;
  unit_price: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Application {
  id: string;
  company_id: string;
  application_no: string;
  application_date: string;
  certification_type: 'özel' | 'belgelendirme';
  test_count: number;
  status?: string;
  total_price?: number;
  created_at?: string;
  updated_at?: string;
  tests?: Test[];
}

// Frontend için dönüştürülmüş tipler
export interface FrontendPersonnel {
  id: string;
  tamAd: string; // name + surname birleşimi
  unvan?: string;
  departman?: string;
}

export interface FrontendExperimentType {
  id: string;
  ad: string;
  aciklama?: string;
  fiyat?: number;
}

export interface FrontendDeney {
  id: string;
  deneyTuru: string;
  sorumluPersonel: string;
  akredite: boolean;
  unitPrice?: number;
}

export interface FrontendDeneyKaydi {
  id: string;
  firmaAdi: string;
  basvuruNo: string;
  basvuruTarihi: string;
  belgelendirmeTuru: 'özel' | 'belgelendirme';
  deneySayisi: number;
  deneyler: FrontendDeney[];
  olusturulma?: string;
}

// Dönüştürme fonksiyonları
export const convertPersonnelToFrontend = (personnel: Personnel[]): FrontendPersonnel[] => {
  return personnel.map(person => ({
    id: person.id,
    tamAd: `${person.name} ${person.surname}`.trim(),
    unvan: person.title,
    departman: person.department
  }));
};

export const convertExperimentTypesToFrontend = (types: ExperimentType[]): FrontendExperimentType[] => {
  return types.map(type => ({
    id: type.id,
    ad: type.name,
    aciklama: type.description,
    fiyat: type.price
  }));
};

export const convertApplicationsToFrontend = async (applications: Application[]): Promise<FrontendDeneyKaydi[]> => {
  const frontendData: FrontendDeneyKaydi[] = [];
  
  for (const app of applications) {
    // Company bilgisini getir
    const companyResult = await companiesApi.getById(app.company_id);
    const companyName = companyResult.success && companyResult.data ? 
      companyResult.data.name : 'Bilinmeyen Firma';

    // Tests varsa frontend formatına çevir (şimdilik basit)
    const deneyler: FrontendDeney[] = app.tests ? app.tests.map(test => ({
      id: test.id,
      deneyTuru: 'Yüklenecek...', // Ayrı endpoint'ten alınacak
      sorumluPersonel: 'Yüklenecek...', // Ayrı endpoint'ten alınacak
      akredite: false, // Varsayılan değer
      unitPrice: test.unit_price
    })) : [];

    frontendData.push({
      id: app.id,
      firmaAdi: companyName,
      basvuruNo: app.application_no,
      basvuruTarihi: app.application_date,
      belgelendirmeTuru: app.certification_type,
      deneySayisi: app.test_count,
      deneyler: deneyler,
      olusturulma: app.created_at
    });
  }

  return frontendData;
};

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
  getAll: (): Promise<ApiResponse<Company[]>> => {
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
  }): Promise<ApiResponse<Company>> => {
    return apiCall('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  // Firma güncelle
  update: (id: string, companyData: Partial<Company>): Promise<ApiResponse<Company>> => {
    return apiCall(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  },

  // Firma sil
  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiCall(`/companies/${id}`, {
      method: 'DELETE',
    });
  },

  // ID'ye göre firma getir
  getById: (id: string): Promise<ApiResponse<Company>> => {
    return apiCall(`/companies/${id}`);
  }
};

// Personnel API
export const personnelApi = {
  // Ham veriyi getir
  getAllRaw: (): Promise<ApiResponse<Personnel[]>> => {
    return apiCall('/personnel');
  },

  // Frontend formatında getir
  getAll: async (): Promise<ApiResponse<FrontendPersonnel[]>> => {
    const result = await personnelApi.getAllRaw();
    if (result.success && result.data) {
      const frontendData = convertPersonnelToFrontend(result.data);
      return { success: true, data: frontendData };
    }
    return { success: false, error: result.error };
  },

  create: (personnelData: {
    name: string;
    surname: string;
    title?: string;
    department?: string;
    email?: string;
    phone?: string;
  }): Promise<ApiResponse<Personnel>> => {
    return apiCall('/personnel', {
      method: 'POST',
      body: JSON.stringify(personnelData),
    });
  },

  update: (id: string, personnelData: Partial<Personnel>): Promise<ApiResponse<Personnel>> => {
    return apiCall(`/personnel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(personnelData),
    });
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiCall(`/personnel/${id}`, {
      method: 'DELETE',
    });
  }
};

// Experiment Types API
export const experimentTypesApi = {
  // Ham veriyi getir
  getAllRaw: (): Promise<ApiResponse<ExperimentType[]>> => {
    return apiCall('/experiment-types');
  },

  // Frontend formatında getir
  getAll: async (): Promise<ApiResponse<FrontendExperimentType[]>> => {
    const result = await experimentTypesApi.getAllRaw();
    if (result.success && result.data) {
      const frontendData = convertExperimentTypesToFrontend(result.data);
      return { success: true, data: frontendData };
    }
    return { success: false, error: result.error };
  },

  create: (typeData: {
    name: string;
    description?: string;
    price?: number;
    duration?: number;
    category?: string;
  }): Promise<ApiResponse<ExperimentType>> => {
    return apiCall('/experiment-types', {
      method: 'POST',
      body: JSON.stringify(typeData),
    });
  },

  update: (id: string, typeData: Partial<ExperimentType>): Promise<ApiResponse<ExperimentType>> => {
    return apiCall(`/experiment-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(typeData),
    });
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiCall(`/experiment-types/${id}`, {
      method: 'DELETE',
    });
  }
};

// Applications API
export const applicationsApi = {
  // Ham veriyi getir
  getAllRaw: (): Promise<ApiResponse<Application[]>> => {
    return apiCall('/applications');
  },

  // Frontend formatında getir
  getAll: async (): Promise<ApiResponse<FrontendDeneyKaydi[]>> => {
    const result = await applicationsApi.getAllRaw();
    if (result.success && result.data) {
      const frontendData = await convertApplicationsToFrontend(result.data);
      return { success: true, data: frontendData };
    }
    return { success: false, error: result.error };
  },

  create: async (applicationData: {
    company_id: string;
    application_no: string;
    application_date: string;
    certification_type: 'özel' | 'belgelendirme';
    test_count: number;
    tests: Array<{
      experiment_type_id: string;
      responsible_personnel_id: string;
      unit_price: number;
    }>;
  }): Promise<ApiResponse<Application>> => {
    return apiCall('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  update: (id: string, applicationData: Partial<Application>): Promise<ApiResponse<Application>> => {
    return apiCall(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    });
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiCall(`/applications/${id}`, {
      method: 'DELETE',
    });
  },

  getById: (id: string): Promise<ApiResponse<Application>> => {
    return apiCall(`/applications/${id}`);
  }
};

// Users API (gelecekte kullanım için)
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