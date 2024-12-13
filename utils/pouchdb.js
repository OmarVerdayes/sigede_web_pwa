import PouchDB from "pouchdb";

// Configura la base de datos local
const capturistsDb = new PouchDB("capturists");

// Exporta la base de datos para usarla en otros componentes
export default capturistsDb;
