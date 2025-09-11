<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top">
  <div class="container">
    <RouterLink class="navbar-brand fw-semibold" to="/">Youth Wellbeing</RouterLink>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="navbar-end gap-2">
  <form class="d-none d-md-flex me-2" role="search">
    <input class="form-control" type="search" placeholder="Search…" />
  </form>

  <template v-if="user">
    <div class="dropdown">
      <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
        {{ user.email }} <span class="badge bg-secondary ms-1">{{ user.role }}</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><RouterLink class="dropdown-item" to="/journals">My Journals</RouterLink></li>
        <li v-if="user.role==='admin'"><RouterLink class="dropdown-item" to="/admin">Admin</RouterLink></li>
        <li><hr class="dropdown-divider" /></li>
        <li><button class="dropdown-item" @click="onLogout">Logout</button></li>
      </ul>
    </div>
  </template>
  <template v-else>
    <RouterLink class="btn btn-primary" to="/auth">Login / Sign up</RouterLink>
  </template>
</div>

  </div>
</nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { currentUser, logout } from '../utils/authStore'
import { ref } from 'vue'
const user = ref(currentUser())
function onLogout(){ logout(); location.href='/' }
</script>

