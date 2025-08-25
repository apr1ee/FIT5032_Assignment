<template>
  <section class="row justify-content-center">
    <div class="col-12 col-lg-10">
      <header class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="mb-0">My Journals</h2>
        <div class="d-flex gap-2">
          <RouterLink class="btn btn-outline-primary" to="/journal">Write New</RouterLink>
          <button class="btn btn-outline-danger" @click="clearAll" :disabled="journals.length===0">Clear All</button>
        </div>
      </header>

      <!-- 搜索与过滤 -->
      <div class="row g-2 mb-3">
        <div class="col-12 col-md-6">
          <input class="form-control" v-model.trim="q" placeholder="Search text…" />
        </div>
        <div class="col-12 col-md-6">
          <input class="form-control" v-model.trim="tag" placeholder="Filter by tag (e.g., exam)" />
        </div>
      </div>

      <div v-if="filtered.length === 0" class="alert alert-secondary">
        No entries yet. <RouterLink to="/journal">Write your first journal</RouterLink>.
      </div>

      <div class="row g-3">
        <div v-for="item in filtered" :key="item.id" class="col-12 col-md-6 col-xl-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title mb-1">Mood: {{ item.mood }}/5</h5>
                <span class="badge text-bg-light">{{ new Date(item.createdAt).toLocaleString() }}</span>
              </div>
              <p class="card-text mt-2">{{ item.text }}</p>
              <div class="d-flex flex-wrap gap-1">
                <span v-for="t in item.tags" :key="t" class="badge text-bg-secondary">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { loadJournals, saveJournals } from '../utils/journalStore'

const journals = ref(loadJournals())
const q = ref('')
const tag = ref('')

const filtered = computed(() => {
  return journals.value.filter(j => {
    const hitText = q.value ? j.text.toLowerCase().includes(q.value.toLowerCase()) : true
    const hitTag = tag.value ? j.tags.some(t => t.toLowerCase().includes(tag.value.toLowerCase())) : true
    return hitText && hitTag
  })
})

function clearAll() {
  if (!confirm('Delete all local journals?')) return
  journals.value = []
  saveJournals([])
}
</script>
