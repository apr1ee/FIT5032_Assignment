<template>
  <section class="row justify-content-center">
    <div class="col-12 col-lg-8">
      <header class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="mb-0">Write Journal</h2>
        <RouterLink class="btn btn-outline-secondary" to="/journals">My Journals</RouterLink>
      </header>

      <div class="alert alert-info py-2">
        Your draft is auto-saved locally. It won't be uploaded anywhere.
      </div>

      <form @submit.prevent="saveEntry" novalidate>
        <!-- Mood -->
        <div class="mb-3">
          <label class="form-label">Mood (1–5)</label>
          <input type="range" min="1" max="5" class="form-range" v-model.number="form.mood" />
          <div class="small text-muted">Current mood: <strong>{{ form.mood }}</strong></div>
        </div>

        <!-- Text -->
        <div class="mb-3">
          <label class="form-label">What’s on your mind?</label>
          <textarea
            class="form-control"
            rows="6"
            v-model.trim="form.text"
            placeholder="Write a few sentences..."
          ></textarea>
          <div class="form-text">{{ form.text.length }} characters</div>
        </div>

        <!-- Tags (comma separated) -->
        <div class="mb-3">
          <label class="form-label">Tags (comma separated)</label>
          <input class="form-control" v-model.trim="form.tags" placeholder="exam, sleep, friendship" />
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary">Save</button>
          <button type="button" class="btn btn-outline-secondary" @click="resetDraft">Clear draft</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { loadJournals, saveJournals, loadDraft, saveDraft, clearDraft } from '../utils/journalStore'

const router = useRouter()

// 初始草稿（支持刷新后保留）
const form = reactive(loadDraft())

// 自动保存草稿
watch(form, (val) => saveDraft(val), { deep: true })

function resetDraft() {
  form.mood = 3
  form.text = ''
  form.tags = ''
  clearDraft()
}

function saveEntry() {
  const list = loadJournals()
  const entry = {
    id: Date.now(),
    mood: form.mood,
    text: form.text,
    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    createdAt: new Date().toISOString(),
  }
  list.unshift(entry)
  saveJournals(list)
  clearDraft()
  alert('Saved locally ✅')
  router.push('/journals')
}
</script>
