<!-- src/components/forms/FormCheckbox.vue -->
<template>
  <div class="form-group">
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          :id="inputId"
          type="checkbox"
          :checked="modelValue"
          :disabled="disabled"
          :required="required"
          :class="checkboxClasses"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </div>
      <div class="ml-3">
        <label 
          :for="inputId" 
          class="text-sm cursor-pointer"
          :class="{ 
            'text-red-600': hasError,
            'text-gray-700': !hasError && !disabled,
            'text-gray-400': disabled
          }"
        >
          {{ label }}
          <span v-if="required" class="text-red-500">*</span>
        </label>
        
        <p v-if="description" class="text-xs text-gray-500 mt-1">
          {{ description }}
        </p>
      </div>
    </div>
    
    <ValidationMessage 
      v-if="hasError" 
      :message="errorMessage" 
    />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import ValidationMessage from './ValidationMessage.vue'
import { validateInput } from './FormValidator.js'

export default {
  name: 'FormCheckbox',
  components: {
    ValidationMessage
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    description: {
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
    validationRules: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'change', 'blur', 'focus'],
  setup(props, { emit }) {
    const inputId = ref(`checkbox-${Math.random().toString(36).substr(2, 9)}`)
    const errorMessage = ref('')
    const hasBeenBlurred = ref(false)

    // 计算是否有错误
    const hasError = computed(() => {
      return errorMessage.value !== '' && (hasBeenBlurred.value || props.modelValue !== false)
    })

    // 计算复选框样式类
    const checkboxClasses = computed(() => {
      return [
        'h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500',
        {
          'border-red-500': hasError.value,
          'cursor-not-allowed opacity-50': props.disabled
        }
      ]
    })

    // 验证输入
    const validateField = (value) => {
      const rules = [...props.validationRules]
      
      // 为必填复选框添加验证
      if (props.required) {
        rules.unshift((val) => {
          if (!val) {
            return '请勾选此项'
          }
          return null
        })
      }

      const error = validateInput(value, rules)
      errorMessage.value = error || ''
      return !error
    }

    // 处理选择变化
    const handleChange = (event) => {
      const checked = event.target.checked
      emit('update:modelValue', checked)
      emit('change', checked)
      
      // 实时验证
      if (hasBeenBlurred.value) {
        validateField(checked)
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

    // 暴露验证方法给父组件
    const validate = () => {
      hasBeenBlurred.value = true
      return validateField(props.modelValue)
    }

    return {
      inputId,
      errorMessage,
      hasError,
      checkboxClasses,
      handleChange,
      handleBlur,
      handleFocus,
      validate
    }
  }
}
</script>