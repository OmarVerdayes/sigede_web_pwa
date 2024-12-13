<template>
  <div class="full-screen">
    <CredentialLoader v-if="isLoading" />
    <div v-else>
      <NavBar />
      <div>
        <div class="content">
          <div class="content-table info-container">
            <div v-if="isLoading" class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i> Cargando...
            </div>
            <div v-else class="row-direction">
              <div>
                <img
                  :src="institutionData.logo"
                  alt="Logo de la institución"
                  class="logo-image"
                />
              </div>
              <div class="row-direction p-info">
                <div>
                  <p>
                    <strong>Nombre:</strong>
                    {{ institutionData.name }}
                  </p>
                  <p>
                    <strong>Direccion:</strong>
                    {{ institutionData.address }}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Email:</strong>
                    {{ institutionData.email_contact }}
                  </p>
                  <p>
                    <strong>Telefono:</strong>
                    {{ institutionData.phoneContact }}
                  </p>
                </div>
              </div>
              <div>
                <button class="btn-actualizar" @click="goToUpdateInstitution()">
                  <i class="fas fa-edit icon"></i>
                  Actualizar
                </button>
              </div>
            </div>
          </div>
          <p class="title">ADMINISTRADORES</p>
          <div class="content-table">
            <div class="search-section">
              <div
                class="search-icon"
                style="border-radius: 10px 0 0 0"
                @click="goToRegisterAdmin()"
              >
                <i class="fas fa-user-plus icon"></i>
              </div>
              <div class="search-container">
                <input
                  type="text"
                  v-model="searchTerm"
                  class="search-input"
                  placeholder="Buscar..."
                />
                <i class="fas fa-magnifying-glass icon"></i>
              </div>
              <div class="search-icon" style="border-radius: 0 10px 0 0">
                <div style="width: 50%" @click="sortByName">
                  <i class="fas fa-arrow-down-a-z icon"></i>
                </div>
                <div style="width: 50%" @click="invertListOrder">
                  <i class="fas fa-up-down icon"></i>
                </div>
              </div>
            </div>

            <div>
              <table class="table">
                <thead>
                  <tr>
                    <th class="name-column">Nombre</th>
                    <th class="status-column">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in filteredAdminis" :key="index">
                    <td>{{ item.name }}</td>
                    <td>
                      <div class="status-container">
                        <div
                          class="edit-icon"
                          @click="gotoUpdateAdmin(item.userAccountId)"
                        >
                          <i class="fas fa-edit icon"></i>
                        </div>
                        <span :class="`status-${item.status.toLowerCase()}`">
                          {{ item.status }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="filteredAdminis.length === 0" class="no-results">
                <i class="fas fa-times-circle"></i> Sin administradores
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAdminsByInstitutionId,
  getInstitutionInfoByinstitutionId,
} from "~/services/ServicesSuperAdmin";
import CredentialLoader from "~/components/loader.vue";

export default {
  components: {
    CredentialLoader,
  },
  name: "AdminsList",
  data() {
    return {
      admins: [],
      searchTerm: "",
      isAscending: true,
      isLoading: true,
      errorMessage: "",
      institutionData: {},
      institutionId: null,
    };
  },
  computed: {
    filteredAdminis() {
      const filtered = this.admins.filter((admins) =>
        admins.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    goToRegisterAdmin() {
      var institutionId = this.institutionId;
      this.$router.push({ path: "./RegisterAdmin", query: { institutionId } });
    },
    gotoUpdateAdmin(userAccountId) {
      var institutionId = this.institutionId;
      this.$router.push({
        path: "./UpdateAdmin",
        query: { userAccountId, institutionId },
      });
    },
    sortByName() {
      //ordena alfabeticamente
      this.isAscending = !this.isAscending;
      this.admins.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (this.isAscending) {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    },
    invertListOrder() {
      //invierte el orden de la lista
      this.admins.reverse();
    },
    goBack() {
      this.$router.push({ name: "OrganizationsList" });
    },
    goToUpdateInstitution() {
      var institutionId = this.institutionId;
      this.$router.push({
        path: "./UpdateInstitution",
        query: { institutionId },
      });
    },
  },

  async mounted() {
    const instId = this.$route.query.institutionId;
    this.institutionId = instId;
    if (instId) {
      try {
        const data = await getAdminsByInstitutionId(instId);
        if (typeof data === "string") {
          this.errorMessage = "Error al cargar los administradores.";
        } else {
          this.admins = data;
        }
        const response = await getInstitutionInfoByinstitutionId(instId);

        if (typeof response === "string") {
          this.errorMessage = "Error al cargar la info de la institucion.";
        } else {
          this.institutionData = response;
        }
      } catch (error) {
        this.errorMessage = "Error al cargar los administradores.";
      } finally {
        this.isLoading = false;
      }
    } else {
      this.goBack();
    }
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  overflow-y: hidden;
}

.full-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #e4e4e4;
}

.content {
  text-align: center;
  justify-content: center;
  padding: 15px;
}

.title {
  margin: 10px 0;
  color: black;
  text-decoration: underline;
  font-size: 35px;
  letter-spacing: 0.15em;
  font-weight: 300;
}

.content-table {
  border-radius: 8px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.search-section {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  width: 100px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #917d62;
  cursor: pointer;
}

.search-container {
  height: 40px;
  display: flex;
  align-items: center;
  background-color: black;
  flex-grow: 1;
  padding: 0 10px;
}

.search-input {
  flex-grow: 1;
  border: none;
  padding: 10px;
  color: white;
  background-color: black;
}

.icon {
  color: white;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px;
  border: none;
}

.table th {
  background-color: #917d62;
}

.table tr {
  color: white;
}

.table td {
  background-color: white;
  color: black;
}

.search-icon div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.name-column {
  width: 66.66%;
  text-align: left;
}

.status-column {
  width: 33.33%;
  text-align: center;
}

.status-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  width: 30px;
  height: 30px;
  background-color: #917d62;
  border-radius: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
}

.edit-icon .icon {
  color: white;
  font-size: 16px;
}

.status-activo {
  background-color: green;
  color: white;
  border-radius: 5px;
  padding: 5px 10px;
  display: inline-block;
  text-align: center;
  width: 80%;
}

.status-inactivo {
  background-color: red;
  color: white;
  border-radius: 5px;
  padding: 5px 10px;
  display: inline-block;
  text-align: center;
  width: 80%;
}

.status-suspendido {
  background-color: rgb(255, 187, 0);
  color: white;
  border-radius: 5px;
  padding: 5px 10px;
  display: inline-block;
  text-align: center;
  width: 80%;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  margin-top: 15px;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  margin-top: 15px;
}

.no-results i {
  margin-right: 10px;
}

.info-container {
  background-color: white;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  font-size: 1.2rem;
}

.logo-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  min-width: 200px;
}

.row-direction {
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
}

.column-direction {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.p-info {
  gap: 20px;
}

.p-info p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  color: rgba(0, 0, 0, 0.685);
  text-align: justify;
}

.p-info strong {
  color: black;
}

.btn-actualizar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  width: 150px;
  padding: 5px;
  text-align: center;
  height: 35px;
  margin-bottom: 5px;
  background-color: #917d62;
}

.icon {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .row-direction {
    flex-direction: column;
    align-items: center;
  }

  .p-info p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  .btn-actualizar {
    width: 160px;
  }

  .info-container {
    padding: 10px;
    font-size: 1rem;
  }
}

@media (max-width: 1050px) and (min-width: 769px) {
  .info-container {
    font-size: 1rem;
  }

  .btn-actualizar {
    width: 120px;
  }
}
</style>
