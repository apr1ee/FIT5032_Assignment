<!-- src/components/journal/JournalCard.vue -->
<template>
  <article class="journal-card bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <!-- 头部信息 -->
    <header class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <!-- 用户头像 -->
        <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
          <span class="text-white font-medium text-sm">
            {{ entry.isAnonymous ? '匿' : getInitials(entry.username) }}
          </span>
        </div>
        
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="font-medium text-gray-900">
              {{ entry.isAnonymous ? '匿名用户' : entry.username }}
            </h3>
            <span v-if="entry.isCounselor" class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
              志愿咨询师
            </span>
          </div>
          <time class="text-sm text-gray-500">
            {{ formatDate(entry.createdAt) }}
          </time>
        </div>
      </div>

      <!-- 情绪评分显示 -->
      <div class="flex items-center space-x-2">
        <div class="flex items-center justify-center w-8 h-8 rounded-full" :style="{ backgroundColor: getMoodColor(entry.moodRating) + '20' }">
          <span class="text-sm font-bold" :style="{ color: getMoodColor(entry.moodRating) }">
            {{ entry.moodRating }}
          </span>
        </div>
        <span class="text-xs text-gray-500">{{ getMoodLabel(entry.moodRating) }}</span>
      </div>
    </header>

    <!-- 日记内容 -->
    <div class="mb-4">
      <div class="prose prose-sm max-w-none">
        <p class="text-gray-800 leading-relaxed">
          {{ isExpanded ? entry.content : truncatedContent }}
        </p>
      </div>
      
      <!-- 展开/收起按钮 -->
      <button
        v-if="needsTruncation"
        @click="toggleExpanded"
        class="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 focus:outline-none"
      >
        {{ isExpanded ? '收起' : '展开全文' }}
      </button>
    </div>

    <!-- 标签 -->
    <div v-if="entry.tags && entry.tags.length > 0" class="mb-4">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in entry.tags"
          :key="tag"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          #{{ getTagLabel(tag) }}
        </span>
      </div>
    </div>

    <!-- 情绪描述 -->
    <div v-if="entry.moodDescription" class="mb-4 p-3 bg-gray-50 rounded-lg">
      <p class="text-sm text-gray-700 italic">
        "{{ entry.moodDescription }}"
      </p>
    </div>

    <!-- 互动区域 -->
    <footer>
      <ContentRating
        :content-id="entry.id"
        :initial-support-count="entry.supportCount || 0"
        :initial-comment-count="entry.commentCount || 0"
        :initial-comments="entry.comments || []"
        :is-initially-supported="entry.isSupported || false"
        :show-report-button="!isOwner"
        @support-changed="handleSupportChanged"
        @comment-submitted="handleCommentSubmitted"
        @content-reported="handleContentReported"
      />
    </footer>

    <!-- 危机支持横幅 -->
    <div v-if="hasCrisisContent" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <div>
          <p class="text-sm font-medium text-red-800">如果你正在经历困难</p>
          <p class="text-sm text-red-700 mt-1">
            记住你并不孤单，专业帮助随时可得。
          </p>
          <div class="mt-2 space-x-2">
            <button class="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
              获取支持
            </button>
            <span class="text-sm text-red-700">紧急热线: 13 11 14</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { ref, computed } from 'vue'
import ContentRating from './ContentRating.vue'

export default {
  name: 'JournalCard',
  components: {
    ContentRating
  },
  props: {
    entry: {
      type: Object,
      required: true
    },
    isOwner: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 200
    }
  },
  emits: ['entry-updated', 'entry-reported'],
  setup(props, { emit }) {
    const isExpanded = ref(false)

    // 标签映射
    const tagLabels = {
      school: '学校',
      family: '家庭', 
      friends: '朋友',
      health: '身体',
      work: '工作',
      relationship: '感情',
      future: '未来',
      self: '自己',
      money: '经济',
      other: '其他'
    }

    // 情绪标签
    const moodLabels = {
      1: '极度痛苦', 2: '很痛苦', 3: '痛苦', 4: '有些难过',
      5: '一般', 6: '还可以', 7: '不错', 8: '很好',
      9: '非常好', 10: '极棒'
    }

    // 检测是否需要截断
    const needsTruncation = computed(() => {
      return props.entry.content && props.entry.content.length > props.maxLength
    })

    // 截断后的内容
    const truncatedContent = computed(() => {
      if (!needsTruncation.value) return props.entry.content
      return props.entry.content.slice(0, props.maxLength) + '...'
    })

    // 检测危机内容
    const hasCrisisContent = computed(() => {
      if (!props.entry.content) return false
      const crisisKeywords = ['自杀', '结束生命', '不想活', '想死', '自残', '伤害自己']
      const content = props.entry.content.toLowerCase()
      return crisisKeywords.some(keyword => content.includes(keyword))
    })

    // 获取用户名首字母
    const getInitials = (username) => {
      if (!username) return '?'
      return username.charAt(0).toUpperCase()
    }

    // 获取标签标签
    const getTagLabel = (tag) => {
      return tagLabels[tag] || tag
    }

    // 获取情绪标签
    const getMoodLabel = (rating) => {
      return moodLabels[rating] || '未知'
    }

    // 获取情绪颜色
    const getMoodColor = (rating) => {
      const colors = {
        1: '#EF4444', 2: '#F97316', 3: '#F59E0B', 4: '#EAB308',
        5: '#84CC16', 6: '#22C55E', 7: '#10B981', 8: '#14B8A6',
        9: '#06B6D4', 10: '#3B82F6'
      }
      return colors[rating] || '#6B7280'
    }

    // 格式化日期
    const formatDate = (date) => {
      const now = new Date()
      const entryDate = new Date(date)
      const diff = now - entryDate
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (hours < 1) return '刚刚'
      if (hours < 24) return `${hours}小时前`
      if (days < 7) return `${days}天前`
      return entryDate.toLocaleDateString('zh-CN')
    }

    // 切换展开状态
    const toggleExpanded = () => {
      isExpanded.value = !isExpanded.value
    }

    // 处理支持状态变化
    const handleSupportChanged = (data) => {
      emit('entry-updated', {
        ...props.entry,
        supportCount: data.supportCount,
        isSupported: data.isSupported
      })
    }

    // 处理评论提交
    const handleCommentSubmitted = (data) => {
      const updatedEntry = { ...props.entry }
      if (!updatedEntry.comments) updatedEntry.comments = []
      updatedEntry.comments.unshift(data.comment)
      updatedEntry.commentCount = (updatedEntry.commentCount || 0) + 1
      
      emit('entry-updated', updatedEntry)
    }

    // 处理内容举报
    const handleContentReported = (data) => {
      emit('entry-reported', {
        entryId: data.contentId,
        reason: data.reason
      })
    }

    return {
      isExpanded,
      needsTruncation,
      truncatedContent,
      hasCrisisContent,
      getInitials,
      getTagLabel,
      getMoodLabel,
      getMoodColor,
      formatDate,
      toggleExpanded,
      handleSupportChanged,
      handleCommentSubmitted,
      handleContentReported
    }
  }
}
</script>

<style scoped>
.journal-card {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.prose p {
  margin-bottom: 0;
}
</style>