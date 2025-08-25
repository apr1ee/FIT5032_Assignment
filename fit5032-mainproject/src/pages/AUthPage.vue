<template>
  <section class="row justify-content-center">
    <div class="col-12 col-md-6 col-lg-5">
      <h2 class="mb-3">Login / Sign up</h2>

      <!-- 实时错误区域（屏幕阅读器友好） -->
      <div class="visually-hidden" aria-live="polite">
        <ul>
          <li v-for="(msg, idx) in errorList" :key="idx">{{ msg }}</li>
        </ul>
      </div>

      <form @submit.prevent="onSubmit" novalidate>
        <!-- Email -->
        <div class="mb-3">
          <label class="form-label" for="email">Email</label>
          <input
            id="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': touched.email && errors.email }"
            v-model.trim="form.email"
            placeholder="you@example.com"
            @blur="touched.email = true"
            aria-describedby="emailHelp emailErr"
            aria-invalid="true"
          />
          <div id="emailHelp" class="form-text">We'll never share your email.</div>
          <div id="emailErr" class="invalid-feedback" v-if="touched.email && errors.email">
            {{ errors.email }}
          </div>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <input
            id="password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': touched.password && errors.password }"
            v-model.trim="form.password"
            placeholder="••••••••"
            @blur="touched.password = true"
            aria-describedby="pwdErr"
            aria-invalid="true"
          />
          <div id="pwdErr" class="invalid-feedback" v-if="touched.password && errors.password">
            {{ errors.password }}
          </div>
          <div class="form-text">At least 8 characters.</div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn btn-primary w-100"
          :disabled="hasErrors"
        >
          Continue
        </button>
      </form>

      <div class="text-center mt-3">
        <button class="btn btn-outline-secondary w-100" type="button">
          Continue with Google
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed } from 'vue'

// 表单数据
const form = reactive({
  email: '',
  password: '',
})

// 触碰标记：只在用户操作过之后才显示错误（更友好）
const touched = reactive({
  email: false,
  password: false,
})

// 验证规则
const validate = () => {
  const errs = {}

  // 必填 + 邮箱格式
  if (!form.email) {
    errs.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = 'Please enter a valid email address.'
  }

  // 必填 + 长度
  if (!form.password) {
    errs.password = 'Password is required.'
  } else if (form.password.length < 8) {
    errs.password = 'Password must be at least 8 characters.'
  }

  return errs
}

// 计算属性：当前错误和是否可提交
const errors = computed(() => validate())
const hasErrors = computed(() => Object.keys(errors.value).length > 0)
const errorList = computed(() => Object.values(errors.value))

const onSubmit = () => {
  // 提交时强制触发错误显示
  touched.email = true
  touched.password = true

  if (hasErrors.value) return
  // 这里先放成功占位，下一步接入实际认证或跳转
  alert('Form is valid ✅ (next step: connect auth or redirect)')
}
</script>
