<template>
  <footer class="border-top py-4 mt-5">
    <div class="container small d-flex flex-column flex-md-row justify-content-between gap-2">
      <div class="text-muted">© {{ new Date().getFullYear() }} Youth Wellbeing NFP</div>
      <div class="d-flex gap-3">
        <RouterLink class="link-secondary" to="/">About</RouterLink>
        <RouterLink class="link-secondary" to="/">Privacy</RouterLink>
        <RouterLink class="link-secondary" to="/">Help / Crisis</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
