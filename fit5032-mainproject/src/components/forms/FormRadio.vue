<!-- src/components/forms/FormRadio.vue -->
<template>
  <div class="form-group">
    <fieldset>
      <legend 
        v-if="label" 
        class="form-label"
        :class="{ 'text-red-600': hasError }"
      >
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </legend>
      
      <div class="space-y-3">
        <div 
          v-for="option in options" 
          :key="getOptionValue(option)"
          class="flex items-start"
        >
          <div class="flex items-center h-5">
            <input
              :id="`${inputId}-${getOptionValue(option)}`"
              :name="inputId"
              type="radio"
              :value="getOptionValue(option)"
              :checked="modelValue === getOptionValue(option)"
              :disabled="disabled || isOptionDisabled(option)"
              :class="radioClasses"
              @change="handleChange"
              @blur="handleBlur"
              @focus="handleFocus"
            />
          </div>
          <div class="ml-3">
            <label 
              :for="`${inputId}-${getOptionValue(option)}`" 
              class="text-sm cursor-pointer"
              :class="{ 
                'text-gray-700': !hasError && !disabled && !isOptionDisabled(option),
                'text-red-600': hasError,
                'text-gray-400': disabled || isOptionDisabled(option)
              }"
            >
              {{ getOptionLabel(option) }}
            </label>
            
            <p 
              v-if="getOptionDescription(option)" 
              class="text-xs text-gray-500 mt-1"
            >
              {{ getOptionDescription(option) }}
            </p>
          </div>
        </div>
      </div>
    </fieldset>
    
    <ValidationMessage 
      v-if="hasError" 
      :message="errorMessage" 
    />
    
    <p v-if="hint && !hasError" class="text-sm text-gray-500 mt-2">
      {{ hint }}
    </p>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import ValidationMessage from './ValidationMessage.vue'
import { validateInput } from './FormValidator.js'

export default {
  name: 'FormRadio',
  components: {
    ValidationMessage
  },
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    optionValue: {
      type: String,
      default: 'value'
    },
    optionLabel: {
      type: String,
      default: 'label'
    },
    optionDescription: {
      type: String,
      default: 'description'
    },
    optionDisabled: {
      type: String,
      default: 'disabled'
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
    },
    hint: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change', 'blur', 'focus'],
  setup(props, { emit }) {
    const inputId = ref(`radio-${Math.random().toString(36).substr(2, 9)}`)
    const errorMessage = ref('')
    const hasBeenBlurred = ref(false)

    // 计算是否有错误
    const hasError = computed(() => {
      return errorMessage.value !== '' && (hasBeenBlurred.value || props.modelValue !== '')
    })

    // 计算单选框样式类
    const radioClasses = computed(() => {
      return [
        'h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500',
        {
          'border-red-500': hasError.value,
          'cursor-not-allowed opacity-50': props.disabled
        }
      ]
    })

    // 获取选项值
    const getOptionValue = (option) => {
      return typeof option === 'object' ? option[props.optionValue] : option
    }

    // 获取选项标签
    const getOptionLabel = (option) => {
      return typeof option === 'object' ? option[props.optionLabel] : option
    }

    // 获取选项描述
    const getOptionDescription = (option) => {
      return typeof option === 'object' ? option[props.optionDescription] : ''
    }

    // 检查选项是否禁用
    const isOptionDisabled = (option) => {
      return typeof option === 'object' ? option[props.optionDisabled] : false
    }

    // 验证输入
    const validateField = (value) => {
      const rules = [...props.validationRules]
      
      if (props.required) {
        rules.unshift('required')
      }

      const error = validateInput(value, rules)
      errorMessage.value = error || ''
      return !error
    }

    // 处理选择变化
    const handleChange = (event) => {
      const value = event.target.value
      emit('update:modelValue', value)
      emit('change', value)
      
      // 实时验证
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

    // 暴露验证方法给父组件
    const validate = () => {
      hasBeenBlurred.value = true
      return validateField(props.modelValue)
    }

    return {
      inputId,
      errorMessage,
      hasError,
      radioClasses,
      getOptionValue,
      getOptionLabel,
      getOptionDescription,
      isOptionDisabled,
      handleChange,
      handleBlur,
      handleFocus,
      validate
    }
  }
}
</script>