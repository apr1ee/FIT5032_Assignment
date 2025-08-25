<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold" to="/">Youth Wellbeing</RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
          <!-- 后续会加：Learn / Journal / Resources 等 -->
        </ul>

        <!-- 全局搜索占位（BR A.2 响应式，下步再接行为） -->
        <form class="d-flex me-3" role="search">
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
