<!-- src/components/forms/FormInput.vue -->
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
    
    <input
      :id="inputId"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :maxlength="maxLength"
      :minlength="minLength"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    
    <ValidationMessage 
      v-if="hasError" 
      :message="errorMessage" 
    />
    
    <p v-if="hint && !hasError" class="text-sm text-gray-500 mt-1">
      {{ hint }}
    </p>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import ValidationMessage from './ValidationMessage.vue'
import { validateInput } from './FormValidator.js'

export default {
  name: 'FormInput',
  components: {
    ValidationMessage
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'email', 'password', 'tel', 'url', 'number'].includes(value)
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
    validationRules: {
      type: Array,
      default: () => []
    },
    hint: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  setup(props, { emit }) {
    const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)
    const errorMessage = ref('')
    const isFocused = ref(false)
    const hasBeenBlurred = ref(false)

    // 计算是否有错误
    const hasError = computed(() => {
      return errorMessage.value !== '' && (hasBeenBlurred.value || props.modelValue !== '')
    })

    // 计算输入框样式类
    const inputClasses = computed(() => {
      return [
        'form-input',
        {
          'border-red-500 focus:border-red-500 focus:ring-red-500': hasError.value,
          'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !hasError.value,
          'bg-gray-100 cursor-not-allowed': props.disabled,
          'bg-gray-50': props.readonly
        }
      ]
    })

    // 验证输入
    const validateField = (value) => {
      const rules = [...props.validationRules]
      
      // 添加基础验证规则
      if (props.required) {
        rules.unshift('required')
      }
      if (props.type === 'email') {
        rules.push('email')
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
      
      // 实时验证（仅在已经失焦后）
      if (hasBeenBlurred.value) {
        validateField(value)
      }
    }

    // 处理失焦事件
    const handleBlur = (event) => {
      isFocused.value = false
      hasBeenBlurred.value = true
      validateField(props.modelValue)
      emit('blur', event)
    }

    // 处理聚焦事件
    const handleFocus = (event) => {
      isFocused.value = true
      emit('focus', event)
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
      inputClasses,
      handleInput,
      handleBlur,
      handleFocus,
      validate
    }
  }
}
</script>