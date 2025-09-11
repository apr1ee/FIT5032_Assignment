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
  <hr class="my-5"/>
<div class="card">
  <div class="card-body">
    <h5 class="card-title mb-2">Mindfulness Starter Video</h5>
    <p class="text-muted">A short breathing exercise to reduce anxiety.</p>

    <div class="mb-2">
      <RatingStars v-model="my" />
      <button class="btn btn-primary btn-sm ms-2" @click="submit">Submit rating</button>
    </div>

    <div class="small text-muted">Average: {{ avg.avg }} ({{ avg.count }} ratings)</div>
  </div>
</div>

</section>
</template>

<script setup>
import RatingStars from '../components/RatingStars.vue'
import { ref, computed } from 'vue'
import { rate, getAverage } from '../utils/ratingsStore'
const RID = 'resource:mindfulness-101'
const my = ref(0)
const avg = computed(()=> getAverage(RID))
function submit(){ if(my.value>0){ rate(RID, my.value); my.value=0 } }
</script>

