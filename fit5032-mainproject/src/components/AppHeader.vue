<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top">
  <div class="container">
    <RouterLink class="navbar-brand fw-semibold" to="/">Youth Wellbeing</RouterLink>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav me-auto">
        <li class="nav-item"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
        <li class="nav-item"><RouterLink class="nav-link" to="/journal">Journal</RouterLink></li>
        <li class="nav-item"><RouterLink class="nav-link" to="/journals">My Journals</RouterLink></li>
      </ul>

      <form class="d-none d-md-flex me-3" role="search">
        <input class="form-control" type="search" placeholder="Search…" aria-label="Search" />
      </form>
      <RouterLink class="btn btn-primary" to="/auth">Login / Sign up</RouterLink>
    </div>
  </div>
</nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
