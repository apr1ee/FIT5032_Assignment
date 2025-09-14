<!-- src/components/forms/FormSelect.vue -->
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
    
    <select
      :id="inputId"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>
      
      <template v-if="optionGroups">
        <optgroup 
          v-for="group in optionGroups" 
          :key="group.label" 
          :label="group.label"
        >
          <option 
            v-for="option in group.options" 
            :key="getOptionValue(option)"
            :value="getOptionValue(option)"
          >
            {{ getOptionLabel(option) }}
          </option>
        </optgroup>
      </template>
      
      <template v-else>
        <option 
          v-for="option in options" 
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </template>
    </select>
    
    <!-- 下拉箭头图标 -->
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg 
        class="w-4 h-4 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    
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
  name: 'FormSelect',
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
    placeholder: {
      type: String,
      default: '请选择...'
    },
    options: {
      type: Array,
      default: () => []
    },
    optionGroups: {
      type: Array,
      default: null
    },
    optionValue: {
      type: String,
      default: 'value'
    },
    optionLabel: {
      type: String,
      default: 'label'
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
    const inputId = ref(`select-${Math.random().toString(36).substr(2, 9)}`)
    const errorMessage = ref('')
    const hasBeenBlurred = ref(false)

    // 计算是否有错误
    const hasError = computed(() => {
      return errorMessage.value !== '' && (hasBeenBlurred.value || props.modelValue !== '')
    })

    // 计算选择框样式类
    const selectClasses = computed(() => {
      return [
        'form-input appearance-none bg-white pr-10 relative',
        {
          'border-red-500 focus:border-red-500 focus:ring-red-500': hasError.value,
          'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !hasError.value,
          'bg-gray-100 cursor-not-allowed': props.disabled
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
      selectClasses,
      getOptionValue,
      getOptionLabel,
      handleChange,
      handleBlur,
      handleFocus,
      validate
    }
  }
}
</script>

<style scoped>
/* 确保下拉框在相对定位的容器中 */
.form-group {
  position: relative;
}
</style>