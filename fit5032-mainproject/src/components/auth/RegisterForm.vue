<!-- src/components/auth/RegisterForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">创建账户</h2>
      <p class="mt-2 text-gray-600">开始你的心理健康之旅</p>
    </div>

    <!-- 用户名输入 -->
    <FormInput
      ref="usernameRef"
      v-model="formData.username"
      type="text"
      label="用户名"
      placeholder="请输入用户名"
      required
      :validation-rules="['required', 'min:3', 'max:20', 'alphaNumeric']"
      :disabled="isLoading"
      hint="3-20个字符，只能包含字母、数字和中文"
    />

    <!-- 邮箱输入 -->
    <FormInput
      ref="emailRef"
      v-model="formData.email"
      type="email"
      label="邮箱地址"
      placeholder="请输入邮箱地址"
      required
      :validation-rules="['required', 'email']"
      :disabled="isLoading"
    />

    <!-- 密码输入 -->
    <FormInput
      ref="passwordRef"
      v-model="formData.password"
      type="password"
      label="密码"
      placeholder="请输入密码"
      required
      :validation-rules="['required', 'password']"
      :disabled="isLoading"
      hint="至少8位，包含大小写字母和数字"
    />

    <!-- 确认密码 -->
    <FormInput
      ref="confirmPasswordRef"
      v-model="formData.confirmPassword"
      type="password"
      label="确认密码"
      placeholder="请再次输入密码"
      required
      :validation-rules="[confirmPasswordRule]"
      :disabled="isLoading"
    />

    <!-- 年龄输入 -->
    <FormInput
      ref="ageRef"
      v-model="formData.age"
      type="number"
      label="年龄"
      placeholder="请输入年龄"
      required
      :validation-rules="[ageRule]"
      :disabled="isLoading"
      hint="必须年满13岁才能注册"
    />

    <!-- 角色选择 -->
    <RoleSelector 
      v-model="formData.role"
      :disabled="isLoading"
      @role-change="handleRoleChange"
    />

    <!-- 志愿咨询师额外信息 -->
    <div v-if="formData.role === 'counselor'" class="space-y-4 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-medium text-blue-900">志愿咨询师信息</h3>
      
      <FormInput
        ref="qualificationRef"
        v-model="formData.qualification"
        type="text"
        label="专业资质"
        placeholder="例如：心理学学士、心理咨询师证书等"
        required
        :validation-rules="['required', 'min:5']"
        :disabled="isLoading"
      />
      
      <FormTextarea
        ref="experienceRef"
        v-model="formData.experience"
        label="相关经验"
        placeholder="请简要描述你的相关经验和动机"
        required
        :validation-rules="['required', 'min:50']"
        :disabled="isLoading"
        :rows="3"
      />
    </div>

    <!-- 隐私政策和服务条款 -->
    <div class="space-y-3">
      <FormCheckbox
        ref="termsRef"
        v-model="formData.agreeToTerms"
        label="我同意服务条款和隐私政策"
        required
        :disabled="isLoading"
      />
      
      <FormCheckbox
        v-model="formData.agreeToEmails"
        label="我同意接收平台相关的重要通知邮件"
        description="你可以随时在设置中取消订阅"
        :disabled="isLoading"
      />
    </div>

    <!-- 错误提示 -->
    <div v-if="submitError" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">注册失败</h3>
          <p class="text-sm text-red-700 mt-1">{{ submitError }}</p>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <button
      type="submit"
      :disabled="isLoading || !isFormValid"
      class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-colors"
    >
      <span v-if="!isLoading">创建账户</span>
      <div v-else class="flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        创建中...
      </div>
    </button>

    <!-- 外部认证分割线 -->
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">或者使用</span>
      </div>
    </div>

    <!-- 外部认证按钮 -->
    <ExternalAuthButtons 
      mode="register"
      @google-login="handleGoogleRegister"
      @apple-login="handleAppleRegister"
      :disabled="isLoading"
    />

    <!-- 登录链接 -->
    <div class="text-center">
      <span class="text-gray-600">已经有账户？</span>
      <router-link 
        to="/auth/login" 
        class="ml-1 text-blue-600 hover:text-blue-700 hover:underline font-medium"
      >
        立即登录
      </router-link>
    </div>
  </form>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '../forms/FormInput.vue'
import FormTextarea from '../forms/FormTextarea.vue'
import FormCheckbox from '../forms/FormCheckbox.vue'
import ExternalAuthButtons from './ExternalAuthButtons.vue'
import RoleSelector from './RoleSelector.vue'

export default {
  name: 'RegisterForm',
  components: {
    FormInput,
    FormTextarea,
    FormCheckbox,
    ExternalAuthButtons,
    RoleSelector
  },
  emits: ['register-success', 'register-error'],
  setup(props, { emit }) {
    const router = useRouter()
    
    // 表单数据
    const formData = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      role: 'user',
      qualification: '',
      experience: '',
      agreeToTerms: false,
      agreeToEmails: true
    })

    // 状态管理
    const isLoading = ref(false)
    const submitError = ref('')

    // refs
    const usernameRef = ref(null)
    const emailRef = ref(null)
    const passwordRef = ref(null)
    const confirmPasswordRef = ref(null)
    const ageRef = ref(null)
    const qualificationRef = ref(null)
    const experienceRef = ref(null)
    const termsRef = ref(null)

    // 自定义验证规则
    const confirmPasswordRule = (value) => {
      if (!value) return '请确认密码'
      if (value !== formData.password) return '两次输入的密码不一致'
      return null
    }

    const ageRule = (value) => {
      if (!value) return '请输入年龄'
      const age = parseInt(value)
      if (isNaN(age)) return '请输入有效的年龄'
      if (age < 13) return '必须年满13岁才能注册'
      if (age > 120) return '请输入有效的年龄'
      return null
    }

    // 表单验证状态
    const isFormValid = computed(() => {
      const basicValid = formData.username && 
                        formData.email && 
                        formData.password && 
                        formData.confirmPassword &&
                        formData.age &&
                        formData.agreeToTerms &&
                        formData.password === formData.confirmPassword

      // 如果是咨询师角色，需要额外验证
      if (formData.role === 'counselor') {
        return basicValid && formData.qualification && formData.experience
      }

      return basicValid
    })

    // 角色变化处理
    const handleRoleChange = (newRole) => {
      if (newRole !== 'counselor') {
        formData.qualification = ''
        formData.experience = ''
      }
    }

    // 验证整个表单
    const validateForm = () => {
      const refs = [usernameRef, emailRef, passwordRef, confirmPasswordRef, ageRef, termsRef]
      
      if (formData.role === 'counselor') {
        refs.push(qualificationRef, experienceRef)
      }

      let isValid = true
      refs.forEach(ref => {
        if (ref.value && !ref.value.validate()) {
          isValid = false
        }
      })

      return isValid
    }

    // 处理表单提交
    const handleSubmit = async () => {
      submitError.value = ''
      
      // 验证表单
      if (!validateForm()) {
        return
      }

      isLoading.value = true

      try {
        // 这里将来会集成Firebase Auth
        await simulateRegister(formData)
        
        // 注册成功
        emit('register-success', {
          username: formData.username,
          email: formData.email,
          role: formData.role
        })
        
        // 跳转到登录页或直接登录
        router.push('/auth/login?message=register-success')
        
      } catch (error) {
        submitError.value = error.message || '注册失败，请稍后重试'
        emit('register-error', error)
      } finally {
        isLoading.value = false
      }
    }

    // 模拟注册函数
    const simulateRegister = async (userData) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟邮箱重复检查
          if (userData.email === 'test@example.com') {
            reject(new Error('该邮箱已被注册'))
          } else {
            resolve({ success: true })
          }
        }, 2000)
      })
    }

    // 外部认证注册
    const handleGoogleRegister = async () => {
      isLoading.value = true
      try {
        console.log('Google注册')
        emit('register-success', { provider: 'google' })
      } catch (error) {
        submitError.value = 'Google注册失败'
        emit('register-error', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleAppleRegister = async () => {
      isLoading.value = true
      try {
        console.log('Apple注册')
        emit('register-success', { provider: 'apple' })
      } catch (error) {
        submitError.value = 'Apple注册失败'
        emit('register-error', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      formData,
      isLoading,
      submitError,
      isFormValid,
      confirmPasswordRule,
      ageRule,
      usernameRef,
      emailRef,
      passwordRef,
      confirmPasswordRef,
      ageRef,
      qualificationRef,
      experienceRef,
      termsRef,
      handleRoleChange,
      handleSubmit,
      handleGoogleRegister,
      handleAppleRegister
    }
  }
}
</script>