<!-- src/components/common/SecureForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" :class="formClasses">
    <!-- CSRF Token 隐藏字段 -->
    <input type="hidden" name="_token" :value="csrfToken" />
    
    <!-- 蜜罐字段 (防机器人) -->
    <input 
      type="text" 
      name="website" 
      v-model="honeypot"
      style="position: absolute; left: -9999px; visibility: hidden;"
      tabindex="-1"
      autocomplete="off"
    />
    
    <!-- 表单内容插槽 -->
    <slot 
      :csrf-token="csrfToken"
      :is-submitting="isSubmitting"
      :submit-error="submitError"
      :validation-errors="validationErrors"
    />
    
    <!-- 安全提示 -->
    <div v-if="showSecurityNotice" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
        </svg>
        <div>
          <p class="text-sm text-green-800 font-medium">安全保护</p>
          <p class="text-xs text-green-700 mt-1">
            此表单受到XSS攻击防护、CSRF令牌验证和输入内容过滤保护。
          </p>
        </div>
      </div>
    </div>

    <!-- 速率限制提示 -->
    <div v-if="rateLimitWarning" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <div>
          <p class="text-sm text-yellow-800 font-medium">提交频率限制</p>
          <p class="text-xs text-yellow-700 mt-1">
            请稍后再试，剩余等待时间：{{ Math.ceil(remainingTime / 1000) }}秒
          </p>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { 
  generateCSRFToken, 
  validateInput, 
  RateLimiter,
  detectCrisisContent,
  filterInappropriateContent 
} from '../../utils/securityUtils.js'

export default {
  name: 'SecureForm',
  props: {
    formId: {
      type: String,
      required: true
    },
    maxSubmissions: {
      type: Number,
      default: 5
    },
    rateLimitWindow: {
      type: Number,
      default: 60000 // 1分钟
    },
    enableContentFilter: {
      type: Boolean,
      default: true
    },
    enableCrisisDetection: {
      type: Boolean,
      default: true
    },
    showSecurityNotice: {
      type: Boolean,
      default: false
    },
    formClasses: {
      type: String,
      default: 'space-y-6'
    }
  },
  emits: ['submit', 'security-violation', 'crisis-detected'],
  setup(props, { emit }) {
    const csrfToken = ref('')
    const honeypot = ref('')
    const isSubmitting = ref(false)
    const submitError = ref('')
    const validationErrors = ref({})
    const rateLimitWarning = ref(false)
    const remainingTime = ref(0)
    
    // 速率限制器
    const rateLimiter = new RateLimiter(props.maxSubmissions, props.rateLimitWindow)
    let rateLimitTimer = null

    // 获取用户标识符
    const getUserIdentifier = () => {
      // 可以基于IP、用户ID或设备指纹
      return `form_${props.formId}_${navigator.userAgent.slice(0, 50)}`
    }

    // 初始化安全措施
    onMounted(() => {
      csrfToken.value = generateCSRFToken()
    })

    // 清理定时器
    onBeforeUnmount(() => {
      if (rateLimitTimer) {
        clearInterval(rateLimitTimer)
      }
    })

    // 验证表单数据安全性
    const validateFormSecurity = (formData) => {
      const violations = []
      const sanitizedData = {}
      
      // 检查蜜罐字段
      if (honeypot.value) {
        violations.push({ type: 'bot_detected', message: '检测到机器人行为' })
        return { isValid: false, violations, sanitizedData }
      }
      
      // 验证CSRF令牌
      const submittedToken = formData._token || formData.get('_token')
      if (submittedToken !== csrfToken.value) {
        violations.push({ type: 'csrf_mismatch', message: 'CSRF令牌验证失败' })
        return { isValid: false, violations, sanitizedData }
      }
      
      // 验证每个字段
      for (const [key, value] of Object.entries(formData)) {
        if (key.startsWith('_') || key === 'website') continue // 跳过系统字段
        
        // 输入验证和净化
        const validation = validateInput(value, {
          maxLength: 5000,
          allowHtml: false,
          checkXSS: true,
          checkSQLInjection: true
        })
        
        if (!validation.isValid) {
          violations.push({ 
            field: key, 
            type: 'input_validation',
            message: validation.errors.join(', ')
          })
          continue
        }
        
        let cleanValue = validation.sanitized
        
        // 内容过滤
        if (props.enableContentFilter) {
          cleanValue = filterInappropriateContent(cleanValue)
        }
        
        // 危机内容检测
        if (props.enableCrisisDetection && detectCrisisContent(cleanValue)) {
          emit('crisis-detected', { field: key, content: cleanValue })
          // 不阻止提交，但发出警告
        }
        
        sanitizedData[key] = cleanValue
      }
      
      return {
        isValid: violations.length === 0,
        violations,
        sanitizedData
      }
    }

    // 处理表单提交
    const handleSubmit = async (event) => {
      // 重置状态
      submitError.value = ''
      validationErrors.value = {}
      
      // 速率限制检查
      const userIdentifier = getUserIdentifier()
      if (!rateLimiter.isAllowed(userIdentifier)) {
        const remaining = rateLimiter.getRemainingTime(userIdentifier)
        remainingTime.value = remaining
        rateLimitWarning.value = true
        
        // 开始倒计时
        rateLimitTimer = setInterval(() => {
          remainingTime.value = rateLimiter.getRemainingTime(userIdentifier)
          if (remainingTime.value <= 0) {
            rateLimitWarning.value = false
            clearInterval(rateLimitTimer)
          }
        }, 1000)
        
        return
      }
      
      // 获取表单数据
      const formData = new FormData(event.target)
      const formObject = Object.fromEntries(formData.entries())
      formObject._token = csrfToken.value // 确保包含CSRF令牌
      
      // 安全验证
      const securityCheck = validateFormSecurity(formObject)
      
      if (!securityCheck.isValid) {
        emit('security-violation', {
          violations: securityCheck.violations,
          timestamp: new Date(),
          userAgent: navigator.userAgent
        })
        
        submitError.value = '表单验证失败，请检查输入内容'
        
        // 记录安全违规（生产环境应发送到服务器）
        console.warn('安全违规检测:', securityCheck.violations)
        return
      }
      
      // 标记提交状态
      isSubmitting.value = true
      
      try {
        // 发出提交事件，传递净化后的数据
        await emit('submit', {
          data: securityCheck.sanitizedData,
          csrfToken: csrfToken.value,
          timestamp: Date.now()
        })
        
        // 重新生成CSRF令牌用于下次提交
        csrfToken.value = generateCSRFToken()
        
      } catch (error) {
        submitError.value = error.message || '提交失败，请重试'
        console.error('表单提交错误:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      csrfToken,
      honeypot,
      isSubmitting,
      submitError,
      validationErrors,
      rateLimitWarning,
      remainingTime,
      handleSubmit
    }
  }
}
</script>