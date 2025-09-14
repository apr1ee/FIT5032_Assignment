<!-- src/components/forms/FormTextarea.vue -->
<template>
  <div class="form-group">
    <label 
      v-if="label" 
      :for="inputId" 
      class="form-label"
      :class="{ 'text-red-600': hasError }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <textarea
        :id="inputId"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxLength"
        :minlength="minLength"
        :rows="rows"
        :class="textareaClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      ></textarea>
      
      <!-- 字符计数 -->
      <div v-if="maxLength" class="absolute bottom-2 right-2 text-xs text-gray-400">
        {{ currentLength }}/{{ maxLength }}
      </div>
    </div>
    
    <!-- 危机检测警告 -->
    <div v-if="crisisDetected" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <div>
          <p class="text-sm font-medium text-red-800">需要支持？</p>
          <p class="text-sm text-red-700 mt-1">
            如果你正在经历困难时刻，请记住你并不孤单。
          </p>
          <button 
            class="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
            @click="showCrisisSupport"
          >
            获取专业帮助
          </button>
        </div>
      </div>
    </div>
    
    <ValidationMessage 
      v-if="hasError && !crisisDetected" 
      :message="errorMessage" 
    />
    
    <p v-if="hint && !hasError && !crisisDetected" class="text-sm text-gray-500 mt-1">
      {{ hint }}
    </p>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import ValidationMessage from './ValidationMessage.vue'
import { validateInput, mentalHealthValidations } from './FormValidator.js'

export default {
  name: 'FormTextarea',
  components: {
    ValidationMessage
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: null
    },
    minLength: {
      type: Number,
      default: null
    },
    rows: {
      type: Number,
      default: 4
    },
    validationRules: {
      type: Array,
      default: () => []
    },
    hint: {
      type: String,
      default: ''
    },
    enableCrisisDetection: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'blur', 'focus', 'crisis-detected'],
  setup(props, { emit }) {
    const inputId = ref(`textarea-${Math.random().toString(36).substr(2, 9)}`)
    const errorMessage = ref('')
    const hasBeenBlurred = ref(false)
    const crisisDetected = ref(false)

    // 当前字符长度
    const currentLength = computed(() => {
      return props.modelValue ? props.modelValue.length : 0
    })

    // 计算是否有错误
    const hasError = computed(() => {
      return errorMessage.value !== '' && (hasBeenBlurred.value || props.modelValue !== '')
    })

    // 计算文本域样式类
    const textareaClasses = computed(() => {
      return [
        'form-input resize-none',
        {
          'border-red-500 focus:border-red-500 focus:ring-red-500': hasError.value,
          'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !hasError.value,
          'bg-gray-100 cursor-not-allowed': props.disabled,
          'bg-gray-50': props.readonly,
          'pb-8': props.maxLength // 为字符计数留出空间
        }
      ]
    })

    // 危机检测
    const checkForCrisis = (value) => {
      if (!props.enableCrisisDetection || !value) {
        crisisDetected.value = false
        return
      }

      const crisisResult = mentalHealthValidations.crisisDetection(value)
      if (crisisResult && crisisResult.type === 'crisis') {
        crisisDetected.value = true
        emit('crisis-detected', value)
      } else {
        crisisDetected.value = false
      }
    }

    // 验证输入
    const validateField = (value) => {
      const rules = [...props.validationRules]
      
      // 添加基础验证规则
      if (props.required) {
        rules.unshift('required')
      }
      if (props.minLength) {
        rules.push(`min:${props.minLength}`)
      }
      if (props.maxLength) {
        rules.push(`max:${props.maxLength}`)
      }

      const error = validateInput(value, rules)
      errorMessage.value = error || ''
      return !error
    }

    // 处理输入事件
    const handleInput = (event) => {
      const value = event.target.value
      emit('update:modelValue', value)
      
      // 危机检测
      checkForCrisis(value)
      
      // 实时验证（仅在已经失焦后）
      if (hasBeenBlurred.value) {
        validateField(value)
      }
    }

    // 处理失焦事件
    const handleBlur = (event) => {
      hasBeenBlurred.value = true
      validateField(props.modelValue)
      emit('blur', event)
    }

    // 处理聚焦事件
    const handleFocus = (event) => {
      emit('focus', event)
    }

    // 显示危机支持
    const showCrisisSupport = () => {
      // 这里可以触发模态框或跳转到支持页面
      emit('crisis-detected', props.modelValue)
    }

    // 暴露验证方法给父组件
    const validate = () => {
      hasBeenBlurred.value = true
      return validateField(props.modelValue)
    }

    return {
      inputId,
      errorMessage,
      hasError,
      textareaClasses,
      currentLength,
      crisisDetected,
      handleInput,
      handleBlur,
      handleFocus,
      showCrisisSupport,
      validate
    }
  }
}
</script>