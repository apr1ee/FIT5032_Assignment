<template>
  <section class="section">
  <div class="text-center mb-5">
    <div class="kicker mb-2">Youth Mental Health & Wellbeing</div>
    <h1 class="fw-bold mb-2">Your space to track moods & get support</h1>
    <p class="text-muted mb-4">Journal → Insights → Community → Local resources</p>
    <div class="d-flex gap-2 justify-content-center">
      <RouterLink class="btn btn-primary btn-lg px-4" to="/journal">Write Journal</RouterLink>
      <RouterLink class="btn btn-outline-primary btn-lg px-4" to="/journals">My Journals</RouterLink>
    </div>
  </div>

  <!-- 三个功能卡：手机1列 / 平板2列 / 桌面3列 -->
  <div class="row g-4">
    <div class="col-12 col-md-6 col-xl-4">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">Write Journal</h5>
          <p class="text-muted">Quick mood check-in, then safe, private writing.</p>
          <RouterLink class="stretched-link" to="/journal"></RouterLink>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6 col-xl-4">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">View Trends</h5>
          <p class="text-muted">Weekly/monthly mood patterns at a glance.</p>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6 col-xl-4">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">Explore Resources</h5>
          <p class="text-muted">Find nearby low/no-cost support and activities.</p>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
