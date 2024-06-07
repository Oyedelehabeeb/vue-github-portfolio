<script>
import { watchEffect, ref, computed } from 'vue'
import ModalComponent from '../components/TheModal.vue'
import Loading from '../components/TheLoading.vue'

export default {
  name: 'GithubRepos',
  components: {
    ModalComponent,
    Loading
  },

  setup() {
    const repositories = ref([])
    const username = 'oyedelehabeeb'
    const none = ref('None')
    const per_page = ref(6)
    const page = ref(1)
    const isModalVisible = ref(false)
    const selectedRepository = ref(null)
    const newRepositoryName = ref('')
    const isLoading = ref(true)
    const token = import.meta.env.VITE_GITHUB_TOKEN
    const searchQuery = ref('')

    function openModal(repository) {
      selectedRepository.value = repository
      isModalVisible.value = true
    }

    function nextPage() {
      page.value++
    }

    function previousPage() {
      if (page.value > 1) {
        page.value--
      }
    }

    watchEffect(function () {
      async function getFetchData() {
        isLoading.value = true

        try {
          const res = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=${per_page.value}&page=${page.value}`
          )
          const data = await res.json()
          console.log(data)
          repositories.value = data
        } catch (err) {
          console.error('Error fetching repositories:', err)
        } finally {
          isLoading.value = false
        }
      }

      watchEffect(() => {
        getFetchData()
      })
    })

    async function createRepository() {
      if (newRepositoryName.value.trim() === '') {
        alert('Repository name cannot be empty.')
        return
      }

      try {
        const res = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newRepositoryName.value, private: false })
        })

        const responseData = await res.json()

        if (!res.ok) {
          console.error('Error response from GitHub:', responseData)
          throw new Error('Error creating repository')
        }

        repositories.value.push(responseData)
        newRepositoryName.value = ''
      } catch (err) {
        console.error('Error creating repository:', err)
      }
    }

    const filteredRepositories = computed(function () {
      return repositories.value.filter((repository) =>
        repository.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const sortingRepositories = computed(function () {
      return repositories.value.slice().sort((a, b) => a.localCompare(b))
    })

    return {
      repositories,
      none,
      isModalVisible,
      selectedRepository,
      openModal,
      nextPage,
      previousPage,
      page,
      newRepositoryName,
      createRepository,
      isLoading,
      sortingRepositories,
      searchQuery,
      filteredRepositories
    }
  }
}
</script>

<template>
  <Loading v-show="isLoading" />

  <div v-show="!isLoading && repositories.length > 0">
    <h1>Oyedele Habeeb Github Repositories</h1>
    <div>
      <form @submit.prevent="createRepository()">
        <input
          type="text"
          v-model="newRepositoryName"
          @keyup.enter="createRepository"
          placeholder="Enter repository name"
        />
        <button>Create Repository</button>
      </form>
      <br />

      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search repositories"
        class="search-input"
      />
    </div>

    <ul>
      <li
        v-for="repository in filteredRepositories"
        :key="repository.id"
        @click="openModal(repository)"
      >
        <div class="logo-name">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            class="github-logo"
          />

          <a class="repo-name" :target="_blank">
            {{ repository.name }}
          </a>
        </div>

        <div>ID: {{ repository.id }}</div>
        <div v-if="repository.language === null">Language: {{ none }}</div>
        <div v-else>Language: {{ repository.language }}</div>

        <div>Visibility: {{ repository.visibility }}</div>
      </li>
    </ul>

    <div class="button">
      <button class="page" @click="previousPage" :disabled="page === 1">Previous Page</button>
      <button class="page" @click="nextPage">Next Page</button>
    </div>

    <ModalComponent
      :show="isModalVisible"
      :repository="selectedRepository"
      @close="isModalVisible = false"
    />
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
}

h1 {
  text-align: center;
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  cursor: pointer;
}

button:hover {
  background-color: #218c74;
}

form {
  margin-inline-start: 510px;
  display: flex;
  align-items: center;
  gap: 20px;
}

form input {
  height: 25px;
  padding: 0px 10px;
}
form button {
  height: 25px;
}

.search-input {
  margin-inline-start: 600px;
  height: 25px;
  margin-block-end: 20px;
  padding: 0px 10px;
}

ul {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

li {
  width: 400px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

li .logo-name {
  margin-block-end: 20px;
}

li div {
  display: flex;
  gap: 100px;
  align-items: center;
}

a {
  text-decoration: none;
  color: #42b983;
}

a:hover {
  text-decoration: underline;
}

.repository-item {
  display: flex;
  align-items: center;
}

.github-logo {
  width: 24px;
  height: 24px;
}

.button {
  display: flex;
  gap: 20px;
  align-items: center;
  width: 220px;
  justify-content: center;
  margin-inline-start: 550px;
}
</style>
