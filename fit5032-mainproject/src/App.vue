<template>
  <AppHeader />
  <main class="container my-4">
    <router-view />
  </main>
  <AppFooter />
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<style>
/* 可放一些全局微调样式 */
</style>
