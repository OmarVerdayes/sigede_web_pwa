<template>
  <div class="full-screen">
    <CredentialLoader v-if="isLoading" />

    <div v-else>
      <NavBar />

      <div>
        <div class="content">
          <p class="title">CAPTURISTAS</p>
          <div class="content-table">
            <div class="search-section">
              <div
                class="search-icon"
                style="border-radius: 10px 0 0 0"
                @click="goToRegisterCapturist"
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
              <div>
                <table class="table">
                  <thead>
                    <tr>
                      <th class="name-column">Nombre</th>
                      <th class="status-column">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in filteredCapturist" :key="index">
                      <td>{{ item.name }}</td>
                      <td>
                        <div class="status-container">
                          <div
                            class="edit-icon"
                            @click="editCapturist(item)"
                          >
                            <i class="fas fa-edit icon"></i>
                          </div>
                          <span :class="`status-${item.status}`">
                            {{ item.status }}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="filteredCapturist.length === 0" class="no-results">
                  <i class="fas fa-times-circle"></i> Sin resultados
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
import { getAllCapturitsByInstitutionId } from "~/services/ServiceAdmin";
import CredentialLoader from "~/components/loader.vue";

export default {
  components: {
    CredentialLoader,
  },
  name: "CapturistList",
  data() {
    return {
      capturist: [],
      searchTerm: "",
      isAscending: true,
      isLoading: true,
      errorMessage: "",
    };
  },
  computed: {
    filteredCapturist() {
      //filtra por nombre
      const filtered = this.capturist.filter((capturist) =>
        capturist.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    sortByName() {
      //ordena alfabeticamente
      this.isAscending = !this.isAscending;
      this.capturist.sort((a, b) => {
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
      this.capturist.reverse();
    },
    goToRegisterCapturist() {
      this.$router.push("./RegisterCapturist");
    },
    editCapturist(data) {
      this.$router.push({
        path: "./ManagerCapturist",
        query: { ...data },
      });
    },
  },
  async mounted() {
    try {
      var institutionId = parseInt(localStorage.getItem("institutionId"));
      const data = await getAllCapturitsByInstitutionId(institutionId);
      if (typeof data === "string") {
        this.errorMessage = "Error al cargar los capturistas.";
      } else {
        this.capturist = data;
      }
    } catch (error) {
      this.errorMessage = "Error al cargar los capturistas.";
    } finally {
      this.isLoading = false;
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
</style>
