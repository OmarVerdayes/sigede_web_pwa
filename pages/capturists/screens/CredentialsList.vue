<template>
  <div class="full-screen">
    <CredentialLoader v-if="isLoadingGeneral" />
    <div v-else>
      <NavBar />
      <div>
        <div class="content">
          <p class="title">CREDENCIALES</p>
          <div class="content-table">
            <div class="search-section">
              <div
                class="search-icon"
                style="border-radius: 10px 0 0 0"
                @click="goRegister"
              >
                <i class="fas fa-user-plus icon"></i>
              </div>
              <div class="search-container">
                <input
                  type="text"
                  v-model="searchTerm"
                  class="search-input"
                  placeholder="Buscar..."
                  @keyup="filterList"
                />
                <i class="fas fa-magnifying-glass icon" @click="filterList"></i>
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
            <div v-if="isLoading" class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i> Cargando...
            </div>
            <div v-else>
              <div>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th class="name-column">Nombre del usuario</th>
                      <th class="status-column">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in lista" :key="index">
                      <td>
                        <img
                          :src="item.userPhoto"
                          alt="userPhoto"
                          class="imagen"
                        />
                      </td>
                      <td>{{ item.fullname }}</td>
                      <td>
                        <div class="status-container">
                          <div
                            class="edit-icon"
                            @click="goToEdit(item.credentialId)"
                          >
                            <i class="fas fa-edit icon"></i>
                          </div>
                          <span :class="getStatusClass(item.expirationDate)">
                            {{ getStatusText(item.expirationDate) }}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="lista.length === 0" class="no-results">
                  <i class="fas fa-times-circle"></i> Sin resultados
                </div>
                <div class="pagination">
                  <button
                    :disabled="currentPage === 0"
                    @click="changePage(currentPage - 1)"
                  >
                    Anterior
                  </button>
                  <span>Página {{ currentPage + 1 }} de {{ totalPages }}</span>
                  <button
                    :disabled="
                      currentPage === totalPages - 1 || totalPages === 0
                    "
                    @click="changePage(currentPage + 1)"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllCredentialByInstitutionIdAndName } from "~/services/ServicesCapturist";
import CredentialLoader from "~/components/loader.vue";

export default {
  components: {
    CredentialLoader,
  },
  name: "CredentialsList",
  data() {
    return {
      lista: [],
      searchTerm: "",
      currentPage: 0,
      totalPages: 0,
      isAscending: true,
      isLoading: true,
      isLoadingGeneral: false,
    };
  },
  watch: {
    currentPage() {
      this.fetchUsers();
    },
    searchTerm() {
      this.currentPage = 0;
      this.fetchUsers();
    },
  },
  methods: {
    goRegister() {
      this.$router.push("./RegisterCredencial");
    },
    goToEdit(credentialId) {
      if (credentialId) {
        this.$router.push({
          path: "./EditCredential",
          query: { id: credentialId },
        });
      } else {
        console.error("ID is undefined!");
      }
    },
    sortByName() {
      this.isAscending = !this.isAscending;
      this.lista.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return this.isAscending
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    },
    invertListOrder() {
      this.lista.reverse();
    },
    changePage(page) {
      this.currentPage = page;
    },
    getStatusClass(expirationDate) {
      const currentDate = new Date();
      const expDate = new Date(expirationDate);
      return expDate > currentDate ? "status-activo" : "status-inactivo";
    },
    getStatusText(expirationDate) {
      const currentDate = new Date();
      const expDate = new Date(expirationDate);
      return expDate > currentDate ? "Activo" : "Inactivo";
    },
    async fetchUsers() {
      this.isLoading = true;
      try {
        var instId = parseInt(localStorage.getItem("institutionId"));

        const sendData = {
          institutionId: instId,
          fullname: this.searchTerm,
          page: this.currentPage,
          size: 50,
        };
        const data = await getAllCredentialByInstitutionIdAndName(sendData);
        this.lista = data.data.content;
        this.totalPages = data.data.totalPages;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error("Error al cargar los usuarios:", error);
      }
    },
  },
  async mounted() {
    this.isLoadingGeneral = true;
    this.fetchUsers();
    this.isLoadingGeneral = false;
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

.imagen-column {
  width: 15%;
  text-align: center;
}

.name-column {
  width: 60%;
  text-align: left;
}

.status-column {
  width: 25%;
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

.imagen {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 0.5rem;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.pagination button {
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: #917d62;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  flex-shrink: 0;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination span {
  padding: 0.5rem;
  font-size: 1rem;
  text-align: center;
  white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .pagination button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  .pagination span {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .pagination button {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }

  .pagination span {
    font-size: 0.8rem;
  }
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

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  margin-top: 15px;
}
</style>
