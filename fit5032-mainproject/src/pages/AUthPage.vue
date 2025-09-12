<template>
  <section class="row justify-content-center py-4">
    <div class="col-12 col-md-6 col-lg-5">
      <h2 class="mb-3">{{ mode==='login' ? 'Login' : 'Register' }}</h2>

      <div v-if="flash" class="alert alert-danger py-2">{{ flash }}</div>

      <form @submit.prevent="onSubmit" novalidate>
        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            :class="{ 'is-invalid': t.email && err.email }"
            v-model.trim="f.email"
            placeholder="you@example.com"
            @blur="t.email = true"
          />
          <div class="invalid-feedback" v-if="t.email && err.email">{{ err.email }}</div>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            :class="{ 'is-invalid': t.pwd && err.password }"
            v-model.trim="f.password"
            placeholder="••••••••"
            @blur="t.pwd = true"
          />
          <div class="invalid-feedback" v-if="t.pwd && err.password">{{ err.password }}</div>
          <div class="form-text">At least 8 characters.</div>
        </div>

        <!-- Role (only when registering) -->
        <div class="mb-3" v-if="mode==='register'">
          <label class="form-label">Role</label>
          <select class="form-select" v-model="f.role">
            <option value="user">User</option>
            <option value="admin">Admin (demo)</option>
          </select>
          <div class="form-text">Demo only (no real server auth).</div>
        </div>

        <button class="btn btn-primary w-100" :disabled="hasErrors">{{ cta }}</button>
      </form>

      <div class="text-center mt-3">
        <button class="btn btn-link" @click="toggle">{{ toggleText }}</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { login, register } from '../utils/authStore'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 用 ref，保证模板能响应切换
const mode = ref('login') // 'login' | 'register'

// 表单与触摸状态
const f = reactive({ email: '', password: '', role: 'user' })
const t = reactive({ email: false, pwd: false })

// 校验
const err = computed(() => {
  const e = {}
  if (!f.email) e.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email.'
  if (!f.password) e.password = 'Password is required.'
  else if (f.password.length < 8) e.password = 'Password must be at least 8 characters.'
  return e
})
const hasErrors  = computed(() => Object.keys(err.value).length > 0)
const cta        = computed(() => (mode.value === 'login' ? 'Login' : 'Create account'))
const toggleText = computed(() => (mode.value === 'login' ? 'Need an account? Register' : 'Have an account? Login'))

let flash = ''
function toggle() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  flash = ''
  f.password = ''       // 切换时清口令
  t.email = false; t.pwd = false
}

async function onSubmit() {
  t.email = true; t.pwd = true
  if (hasErrors.value) return
  try {
    if (mode.value === 'login') {
      await login({ email: f.email, password: f.password })
    } else {
      await register({ email: f.email, password: f.password, role: f.role })
    }
    router.push(route.query.r || '/')
  } catch (e) {
    flash = e.message || 'Operation failed.'
    f.password = ''     // 失败后清口令
  }
}
</script>
