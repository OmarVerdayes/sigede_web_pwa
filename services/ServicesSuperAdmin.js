export const getAllInstitutions = async () => {
  const { $axios } = useNuxtApp();
  try {
    const response = await $axios.get("api/institutions/get-all");
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const getAllAdmins = async () => {
  const { $axios } = useNuxtApp();
  try {
    const response = await $axios.get("api/users/admins");
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const registerOrgatization = async (data) => {
  const { $axios } = useNuxtApp();
  try {
    const response = await $axios.post(
      "api/institutions/post-institution",
      data
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const getAdminsByInstitutionId = async (institutionId) => {
  const { $axios } = useNuxtApp();
  try {
    const response = await $axios.get(`api/users/admins/${institutionId}`);
    return response;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const getInstitutionInfoByinstitutionId = async (institutionId) => {
  const { $axios } = useNuxtApp();
  try {
    const response = await $axios.get(`api/institutions/${institutionId}`);
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const updateInstitution = async (data) => {
  const { $axios } = useNuxtApp();
  try {
    const response = await $axios.put(`api/institutions/update`, data);
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const getOneAdmin = async (userAccountId, institutionId) => {
  const { $axios } = useNuxtApp();

  try {
    const response = await $axios.get(
      `api/admin/get-admin/${userAccountId}/${institutionId}`
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};
export const updateAdmin = async (data) => {
  const { $axios } = useNuxtApp();

  try {
    const response = await $axios.put(`api/admin/update-basic-data`, data);
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const registerAdmin = async (data) => {
  const { $axios } = useNuxtApp();
  try {
    const response = await $axios.post("api/admin/register", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};
