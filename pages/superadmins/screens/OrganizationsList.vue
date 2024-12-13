<template>
  <div class="full-screen">
    <NavBar />

    <div>
      <div class="content">
        <p class="title">ORGANIZACIONES</p>
        <div class="content-table">
          <div class="search-section">
            <div
              class="search-icon"
              style="border-radius: 10px 0 0 0"
              @click="goToRegisterOrganization()"
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
          <div v-if="isLoading" class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i> Cargando...
          </div>
          <div v-else>
            <div v-if="filteredInstitutions.length === 0" class="no-results">
              <i class="fas fa-times-circle"></i> Sin resultados
            </div>
            <div class="grid-container">
              <div
                v-for="(institution, index) in filteredInstitutions"
                :key="index"
                class="card"
                @click="goInstitution(institution.institutionId)"
              >
                <p>
                  {{ institution.name }}
                </p>
                <img
                  :src="institution.logo"
                  alt="Logo de la institución"
                  class="card-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllInstitutions } from "~/services/ServicesSuperAdmin";

export default {
  name: "OrganizationsList",
  data() {
    return {
      institutions: [],
      searchTerm: "",
      isAscending: true,
      isLoading: true,
      errorMessage: "",
    };
  },
  computed: {
    filteredInstitutions() {
      //filtra por nombre
      const filtered = this.institutions.filter((institution) =>
        institution.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      return filtered;
    },
  },
  methods: {
    goToRegisterOrganization() {
      this.$router.push("./RegisterClient");
    },
    sortByName() {
      //ordena alfabeticamente
      this.isAscending = !this.isAscending;
      this.institutions.sort((a, b) => {
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
      this.institutions.reverse();
    },
    goInstitution(institutionId) {
      this.$router.push({
        path: "./OrganizationDetails",
        query: { institutionId },
      });
    },
  },

  async mounted() {
    try {
      const response = await getAllInstitutions();
      if (typeof response === "string") {
        this.errorMessage = "Error al cargar las instituciones.";
      } else {
        this.institutions = response;
      }
    } catch (error) {
      this.errorMessage = "Error al cargar las instituciones.";
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.full-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #e4e4e4;
  overflow-y: auto;
}

.content {
  text-align: center;
  justify-content: center;
  padding: 15px;
  overflow-y: auto;
  max-height: calc(100vh - 60px);
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

.search-icon div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-icon .icon {
  color: white;
  font-size: 16px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  max-width: 390px;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 290px;
  text-align: center;
  cursor: pointer;
}

.card-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  max-height: 75%;
}

.card p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
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
