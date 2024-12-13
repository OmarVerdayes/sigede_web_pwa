import axios from "axios";
import BASEURL from "~/utils/properties";

export const getAllCredentialByInstitutionIdAndName = async (data) => {
  try {
    const response = await axios.post(
      `${BASEURL}api/credentials/get-all-by-institution`,
      data
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const getFormByInstitutionId = async (institutionId) => {
  try {
    const response = await axios.get(
      `${BASEURL}api/user-info/get-institution-form/${institutionId}`
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const registerCredential = async (data) => {
  try {
    const response = await axios.post(
      `${BASEURL}api/credentials/new-credential`,
      data
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};
export const getCapturistIdByEmail = async (email) => {
  try {
    const response = await axios.get(
      `${BASEURL}api/capturists/get-capturistId/${email}`
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const getCredentialWithFields = async (id) => {
  try {
    const response = await axios.get(`${BASEURL}api/credentials/${id}`);
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateCredential = async (id, data) => {
  try {
    await axios.put(`${BASEURL}api/credentials/${id}`, data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const dowloadCredential = async (id) => {
  try {
    const data = {
      institutionId: parseInt(localStorage.getItem("institutionId")),
      credentialId: id,
    };

    const response = await axios.post(
      `${BASEURL}api/download-credential/`,
      data,
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};
