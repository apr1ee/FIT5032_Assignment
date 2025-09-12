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
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            class="form-range"
            v-model.number="form.mood"
            aria-describedby="moodHelp"
          />
          <div id="moodHelp" class="small text-muted">
            Current mood: <strong>{{ form.mood }}</strong>
          </div>
        </div>

        <!-- Text -->
        <div class="mb-3">
          <label class="form-label" for="journalText">What’s on your mind?</label>
          <textarea
            id="journalText"
            class="form-control"
            rows="6"
            v-model.trim="form.text"
            placeholder="Write a few sentences (max 1000 chars)…"
            maxlength="1000"
            required
            aria-describedby="textHelp"
          ></textarea>
          <div id="textHelp" class="form-text">{{ form.text.length }} / 1000 characters</div>
        </div>

        <!-- Tags (comma separated) -->
        <div class="mb-3">
          <label class="form-label" for="journalTags">Tags (comma separated)</label>
          <input
            id="journalTags"
            class="form-control"
            v-model.trim="form.tags"
            placeholder="exam, sleep, friendship"
            maxlength="120"
            pattern="^[^<>]*$"
            title="Tags must not contain < or >"
            aria-describedby="tagsHelp"
          />
          <div id="tagsHelp" class="form-text">Example: exam, sleep, friendship (max 120 chars)</div>
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
import { escapeHTML } from '../utils/sanitize'   // ✅ 移到 <script setup> 内

const router = useRouter()

// 业务常量（便于后续统一修改）
const TEXT_MIN = 5
const TEXT_MAX = 1000
const TAGS_MAX = 120
const MOOD_MIN = 1
const MOOD_MAX = 5

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

/** 简单标签净化：拆分 -> 去空白 -> 过滤空串 -> 去除尖括号 */
function normalizeTags(raw) {
  return raw
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => t.replace(/[<>]/g, ''))
}

function saveEntry() {
  // —— 基本校验（双层：HTML 属性 + 代码校验）——
  if (typeof form.mood !== 'number' || form.mood < MOOD_MIN || form.mood > MOOD_MAX) {
    alert(`Mood must be between ${MOOD_MIN} and ${MOOD_MAX}.`)
    return
  }
  if (!form.text || form.text.length < TEXT_MIN) {
    alert(`Journal text is too short (min ${TEXT_MIN} chars).`)
    return
  }
  if (form.text.length > TEXT_MAX) {
    alert(`Journal text is too long (max ${TEXT_MAX} chars).`)
    return
  }
  if (form.tags && form.tags.length > TAGS_MAX) {
    alert(`Tags field is too long (max ${TAGS_MAX} chars).`)
    return
  }
  if (/[<>]/.test(form.tags)) {
    alert('Tags must not contain < or > characters.')
    return
  }

  // —— 输出编码（防 XSS）：对正文做 HTML 转义 —— 
  const safeText = escapeHTML(form.text)

  // —— 标签清洗 —— 
  const cleanTags = normalizeTags(form.tags)

  // —— 持久化 —— 
  const list = loadJournals()
  const entry = {
    id: Date.now(),
    mood: form.mood,
    text: safeText,                  // ✅ 已转义
    tags: cleanTags,
    createdAt: new Date().toISOString(),
  }
  list.unshift(entry)
  saveJournals(list)

  clearDraft()
  alert('Saved locally ✅')
  router.push('/journals')
}
</script>
