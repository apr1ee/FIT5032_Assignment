<template>
  <section class="py-4">
    <div class="text-center mb-4">
      <h1 class="fw-bold">Your space to track moods & get support</h1>
      <p class="text-muted">Journal → Insights → Community → Local resources</p>
      <RouterLink class="btn btn-primary btn-lg" to="/auth">Start Now</RouterLink>
    </div>

    <!-- Overview of Functions 栅格：在手机上一列，桌面三列（A.2 响应式） -->
    <div class="row g-3">
      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Write Journal</h5>
            <p class="card-text">Capture your thoughts with a quick mood check-in.</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">View Trends</h5>
            <p class="card-text">See weekly/monthly mood patterns at a glance.</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Explore Resources</h5>
            <p class="card-text">Find nearby low/no-cost support and activities.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
