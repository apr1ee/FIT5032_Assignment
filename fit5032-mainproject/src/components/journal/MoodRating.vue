<!-- src/components/journal/MoodRating.vue -->
<template>
  <div class="mood-rating-container">
    <div class="mb-4">
      <label class="form-label text-lg font-medium text-gray-900">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <p v-if="description" class="text-sm text-gray-600 mt-1">
        {{ description }}
      </p>
    </div>

    <!-- 评分方式选择 -->
    <div class="mb-6">
      <div class="flex space-x-4">
        <button
          type="button"
          @click="ratingMode = 'emoji'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            ratingMode === 'emoji' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          表情评分
        </button>
        <button
          type="button"
          @click="ratingMode = 'slider'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            ratingMode === 'slider' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          数值评分
        </button>
      </div>
    </div>

    <!-- 表情评分模式 -->
    <div v-if="ratingMode === 'emoji'" class="emoji-rating">
      <div class="grid grid-cols-5 gap-4 mb-4">
        <div
          v-for="(emoji, index) in emojiScale"
          :key="index"
          @click="selectRating(index + 1)"
          :class="[
            'flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-200',
            selectedRating === index + 1
              ? 'bg-blue-100 border-2 border-blue-500 shadow-md transform scale-105'
              : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 hover:shadow-sm'
          ]"
        >
          <div class="text-4xl mb-2">{{ emoji.icon }}</div>
          <span class="text-sm font-medium text-center">{{ emoji.label }}</span>
          <span class="text-xs text-gray-500 mt-1">{{ index + 1 }}</span>
        </div>
      </div>
    </div>

    <!-- 数值评分模式 -->
    <div v-else class="slider-rating">
      <div class="mb-6">
        <div class="flex justify-between text-sm text-gray-500 mb-2">
          <span>很差 (1)</span>
          <span>一般 (5)</span>
          <span>很好 (10)</span>
        </div>
        
        <div class="relative">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            :value="selectedRating"
            @input="selectRating(parseInt($event.target.value))"
            :disabled="disabled"
            :class="[
              'w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            ]"
            :style="sliderStyle"
          />
        </div>
        
        <div class="flex justify-between text-xs text-gray-400 mt-1">
          <span v-for="i in 10" :key="i">{{ i }}</span>
        </div>
      </div>

      <!-- 当前选择显示 -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-2">
          <span class="text-2xl font-bold text-blue-600">{{ selectedRating }}</span>
        </div>
        <p class="text-lg font-medium text-gray-900">{{ getCurrentMoodLabel() }}</p>
      </div>
    </div>

    <!-- 情绪描述输入 -->
    <div v-if="selectedRating && showDescription" class="mt-6">
      <label class="form-label text-sm font-medium text-gray-700">
        描述一下你的感受 (可选)
      </label>
      <textarea
        v-model="moodDescription"
        @input="updateDescription"
        placeholder="比如：今天考试压力很大，但朋友的陪伴让我感觉好一些..."
        class="form-input mt-2 resize-none"
        rows="3"
        :disabled="disabled"
      ></textarea>
    </div>

    <!-- 快速标签选择 -->
    <div v-if="selectedRating && showTags" class="mt-6">
      <label class="form-label text-sm font-medium text-gray-700 mb-3">
        今天主要因为什么？(可选，多选)
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in moodTags"
          :key="tag.value"
          type="button"
          @click="toggleTag(tag.value)"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            selectedTags.includes(tag.value)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          :disabled="disabled"
        >
          {{ tag.label }}
        </button>
      </div>
    </div>

    <!-- 验证错误信息 -->
    <ValidationMessage 
      v-if="showError && errorMessage" 
      :message="errorMessage" 
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import ValidationMessage from '../forms/ValidationMessage.vue'

export default {
  name: 'MoodRating',
  components: {
    ValidationMessage
  },
  props: {
    modelValue: {
      type: Number,
      default: null
    },
    description: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: '今天你的整体情绪如何？'
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showDescription: {
      type: Boolean,
      default: true
    },
    showTags: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'update:description', 'update:tags', 'rating-change'],
  setup(props, { emit }) {
    const ratingMode = ref('emoji')
    const selectedRating = ref(props.modelValue)
    const moodDescription = ref(props.description)
    const selectedTags = ref([...props.tags])
    const errorMessage = ref('')
    const showError = ref(false)

    // 表情评分映射
    const emojiScale = [
      { icon: '😢', label: '很难过', color: '#EF4444' },
      { icon: '😔', label: '有点低落', color: '#F97316' },
      { icon: '😐', label: '还好吧', color: '#EAB308' },
      { icon: '🙂', label: '不错', color: '#22C55E' },
      { icon: '😊', label: '很开心', color: '#3B82F6' }
    ]

    // 扩展的10分制情绪标签
    const moodLabels = {
      1: '极度痛苦', 2: '很痛苦', 3: '痛苦', 4: '有些难过',
      5: '一般', 6: '还可以', 7: '不错', 8: '很好',
      9: '非常好', 10: '极棒'
    }

    // 情绪标签选项
    const moodTags = [
      { value: 'school', label: '学校' },
      { value: 'family', label: '家庭' },
      { value: 'friends', label: '朋友' },
      { value: 'health', label: '身体' },
      { value: 'work', label: '工作' },
      { value: 'relationship', label: '感情' },
      { value: 'future', label: '未来' },
      { value: 'self', label: '自己' },
      { value: 'money', label: '经济' },
      { value: 'other', label: '其他' }
    ]

    // 滑块样式
    const sliderStyle = computed(() => {
      if (!selectedRating.value) return {}
      const percentage = ((selectedRating.value - 1) / 9) * 100
      return {
        background: `linear-gradient(to right, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%)`
      }
    })

    // 获取当前情绪标签
    const getCurrentMoodLabel = () => {
      return moodLabels[selectedRating.value] || '请选择'
    }

    // 选择评分
    const selectRating = (rating) => {
      if (props.disabled) return
      
      selectedRating.value = rating
      emit('update:modelValue', rating)
      emit('rating-change', {
        rating,
        description: moodDescription.value,
        tags: selectedTags.value
      })
      
      // 清除验证错误
      if (rating) {
        errorMessage.value = ''
        showError.value = false
      }
    }

    // 更新描述
    const updateDescription = () => {
      emit('update:description', moodDescription.value)
      emit('rating-change', {
        rating: selectedRating.value,
        description: moodDescription.value,
        tags: selectedTags.value
      })
    }

    // 切换标签选择
    const toggleTag = (tag) => {
      if (props.disabled) return
      
      const index = selectedTags.value.indexOf(tag)
      if (index > -1) {
        selectedTags.value.splice(index, 1)
      } else {
        selectedTags.value.push(tag)
      }
      
      emit('update:tags', [...selectedTags.value])
      emit('rating-change', {
        rating: selectedRating.value,
        description: moodDescription.value,
        tags: selectedTags.value
      })
    }

    // 验证方法
    const validate = () => {
      if (props.required && !selectedRating.value) {
        errorMessage.value = '请选择你的情绪评分'
        showError.value = true
        return false
      }
      
      errorMessage.value = ''
      showError.value = false
      return true
    }

    // 监听外部值变化
    watch(() => props.modelValue, (newValue) => {
      selectedRating.value = newValue
    })

    watch(() => props.description, (newValue) => {
      moodDescription.value = newValue
    })

    watch(() => props.tags, (newValue) => {
      selectedTags.value = [...newValue]
    })

    return {
      ratingMode,
      selectedRating,
      moodDescription,
      selectedTags,
      errorMessage,
      showError,
      emojiScale,
      moodTags,
      sliderStyle,
      getCurrentMoodLabel,
      selectRating,
      updateDescription,
      toggleTag,
      validate
    }
  }
}
</script>

<style scoped>
/* 自定义滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 表情评分动画 */
.emoji-rating > div > div {
  transition: all 0.2s ease;
}

.emoji-rating > div > div:hover {
  transform: translateY(-2px);
}
</style>