<script>
export default {
  props: {
    show: Boolean,
    repository: Object
  },

  methods: {
    editRepository() {
      this.$emit('editRepository', this.repository)
    },

    closeModal() {
      this.$emit('close')
    },

    deleteRepository() {
      this.$emit('deleteRepository', this.repository)
    }
  }
}
</script>

<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>{{ repository.name }}</h2>
      <p><strong>Description:</strong> {{ repository.description || 'None' }}</p>
      <p>ID: {{ repository.id }}</p>
      <p>Language: {{ repository.language || 'None' }}</p>
      <p>Visibility: {{ repository.visibility }}</p>
      <button @click="editRepository">Edit Repository</button>
      <!-- <button @click="deleteRepository">Delete Repository</button> -->
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
