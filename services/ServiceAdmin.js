import axios from "axios";
import BASEURL from "~/utils/properties";
import capturistsDb from "~/utils/pouchdb";
import PouchDB from 'pouchdb';


//---------------------------------------------------Modificaciones para solano-------------------
export const getAllCapturitsByInstitutionId = async (institutionId) => {
  try {
    // Intenta obtener datos del backend
    const response = await axios.get(
      `${BASEURL}api/users/capturists/${institutionId}`
    );
    console.log(response.data)
    const capturists = response.data;

    // Guarda los datos en PouchDB
    await capturistsDb.bulkDocs(
      capturists.map((item) => ({
        _id: String(item.userAccountId), // Asegúrate de usar un campo único como _id
        ...item,
      }))
    );

    return capturists;
  } catch (e) {
    console.warn("Error al obtener datos del backend, usando datos locales.");

    // Si falla la petición, intenta obtener datos locales de PouchDB
    try {
      const allDocs = await capturistsDb.allDocs({ include_docs: true });
      console.log("Datos cargados desde CouchDB:", allDocs.rows);
      return allDocs.rows.map((row) => row.doc);
    } catch (e) {
      console.error("Error al obtener datos de CouchDB:", e);
      return []; // En caso de error en CouchDB, retorna un array vacío
    }
  }
};
/*
export const registerCapturist = async (data) => {
  try {
    // Intenta registrar en el backend
    const response = await axios.post(`${BASEURL}api/capturists/register`, data);
    return response.data;
  } catch (e) {
    console.warn("No hay conexión, guardando en CouchDB.");

    // Generar un ID único para el capturist
    const capturistId = `capturist_${new Date().toISOString()}`;

    // Guardar en CouchDB
    await capturistsDb.put({
      _id: capturistId,
      ...data,
      synced: false, // Marca como no sincronizado
    });

    // Aquí agregamos el capturist localmente para que se vea de inmediato en la lista
    // Si ya tienes una referencia de la lista de capturists en tu componente, puedes actualizarla aquí
    // Esto podría ser un estado en un componente Vue o un store global
    const newCapturist = {
      _id: capturistId,
      ...data,
      synced: false,
    };

    // Si tienes una variable que almacena los capturists (por ejemplo, `capturists`), la actualizas así:
    capturists.value.push(newCapturist); // Asumiendo que capturists es un ref en tu componente Vue

    return "Capturist guardado localmente. Será enviado cuando haya conexión.";
  }
};
*/

export const registerCapturist = async (data) => {
  try {
    // Intentar registrar en el backend
    const response = await axios.post(`${BASEURL}api/capturists/register`, data);
    return response.data;
  } catch (e) {
    console.warn("No hay conexión, guardando en CouchDB.");
    const capturistId = `capturist_${new Date().toISOString()}`;
    
    await capturistsDb.put({
      _id: capturistId,
      ...data,
      synced: false,
    });
    
    return { message: "offline", capturistId };
  }
};




export const syncPendingCapturists = async () => {
  try {
    const allDocs = await capturistsDb.allDocs({ include_docs: true });
    const unsyncedDocs = allDocs.rows
      .map((row) => row.doc)
      .filter((doc) => !doc.synced);

    if (unsyncedDocs.length === 0) {
      console.log("No hay capturists pendientes de sincronización.");
    } else {
      // Usando Promise.all para sincronizar en paralelo
      const syncPromises = unsyncedDocs.map(async (doc) => {
        try {
          const response = await axios.post(`${BASEURL}api/capturists/register`, doc);

          if (response.status === 200) {
            console.log(`Documento ${doc._id} sincronizado con éxito.`);
          }
        } catch (e) {
          console.warn(`Error al sincronizar documento ${doc._id}:`, e.message);
        }
      });

      // Espera a que todos los documentos se sincronicen
      await Promise.all(syncPromises);
      console.log("Sincronización completada.");
    }

    // Eliminar todos los documentos locales en la base de datos
    const allDocsToDelete = await capturistsDb.allDocs({ include_docs: true });
    const deletePromises = allDocsToDelete.rows.map((row) =>
      capturistsDb.remove({ _id: row.id, _rev: row.value.rev })
    );

    await Promise.all(deletePromises);
    console.log("Todos los documentos locales han sido eliminados.");
  } catch (e) {
    console.error("Error al sincronizar capturists:", e.message);
  }
};


//------------------------------------------------------------------------------------------------



export const getOneCapturist = async (userAccountId, institutionId) => {
  try {
    const response = await axios.get(
      `${BASEURL}api/capturists/get-capturist/${userAccountId}/${institutionId}`
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};
export const updateCapturist = async (data) => {
  try {
    const response = await axios.put(
      `${BASEURL}api/capturists/update-basic-data`,
      data
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const getForm = async () => {
  try {
    const institutionId = parseInt(localStorage.getItem("institutionId"));
    const response = await axios.get(
      `${BASEURL}api/user-info/get-institution-form/${institutionId}`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const registerClientForm = async (data, institutionId) => {
  try {
    const response = await axios.post(
      `${BASEURL}api/user-info/create-forms?institutionId=${institutionId}`,
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    return "Ocurrio un error en la peticion";
  }
};

export const updateClientForm = async (data) => {
  try {
    await axios.put(`${BASEURL}api/user-info/update-forms`, data);
  } catch (error) {
    console.error(error);
  }
};

export const getInstitutionDocument = async () => {
  try {
    const { $axios } = useNuxtApp();
    const institutionId = parseInt(localStorage.getItem("institutionId"));
    const response = await $axios.get(`api/institutions/${institutionId}/docs`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const uploadDocument = async (formData) => {
  try {
    const { $axios } = useNuxtApp();
    const institutionId = parseInt(localStorage.getItem("institutionId"));
    const response = await $axios.put(
      `api/institutions/${institutionId}/patch/docs`,
      formData
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};
