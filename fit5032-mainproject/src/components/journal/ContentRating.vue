<!-- src/components/journal/ContentRating.vue -->
<template>
  <div class="content-rating">
    <!-- 点赞/支持按钮 -->
    <div class="flex items-center space-x-6">
      <!-- 爱心支持 -->
      <button
        @click="toggleSupport"
        :disabled="disabled"
        :class="[
          'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200',
          isSupported 
            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
            : 'text-gray-600 hover:text-red-500 hover:bg-red-50',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]"
      >
        <svg 
          :class="[
            'w-5 h-5 transition-all duration-200',
            isSupported ? 'fill-current' : 'stroke-current fill-none'
          ]"
          viewBox="0 0 24 24" 
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="font-medium">{{ supportCount }}</span>
        <span class="text-sm">支持</span>
      </button>

      <!-- 温暖回复 -->
      <button
        @click="toggleComment"
        :disabled="disabled"
        :class="[
          'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200',
          showComments 
            ? 'text-blue-500 bg-blue-50' 
            : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="font-medium">{{ commentCount }}</span>
        <span class="text-sm">回复</span>
      </button>

      <!-- 举报按钮 -->
      <button
        v-if="showReportButton"
        @click="showReportModal = true"
        :disabled="disabled"
        class="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.732L13.732 4.268c-.77-1.064-2.694-1.064-3.464 0L3.34 16.268C2.558 17.333 3.52 19 5.06 19z" />
        </svg>
        <span>举报</span>
      </button>
    </div>

    <!-- 评论区域 -->
    <div v-if="showComments" class="mt-4 space-y-4">
      <!-- 评论列表 -->
      <div v-if="comments.length > 0" class="space-y-3">
        <div 
          v-for="comment in displayedComments" 
          :key="comment.id"
          class="bg-gray-50 rounded-lg p-3"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <span class="font-medium text-sm text-gray-900">
                  {{ comment.isAnonymous ? '匿名用户' : comment.username }}
                </span>
                <span v-if="comment.isCounselor" class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  志愿咨询师
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatTime(comment.createdAt) }}
                </span>
              </div>
              <p class="text-sm text-gray-700">{{ comment.content }}</p>
            </div>
            
            <!-- 评论点赞 -->
            <button
              @click="toggleCommentLike(comment.id)"
              :class="[
                'ml-2 flex items-center space-x-1 text-xs',
                comment.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              ]"
            >
              <svg 
                :class="['w-3 h-3', comment.isLiked ? 'fill-current' : 'stroke-current fill-none']"
                viewBox="0 0 24 24" 
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{{ comment.likeCount }}</span>
            </button>
          </div>
        </div>
        
        <!-- 加载更多评论 -->
        <button
          v-if="comments.length > 3 && displayedComments.length < comments.length"
          @click="loadMoreComments"
          class="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          查看更多评论 ({{ comments.length - displayedComments.length }})
        </button>
      </div>

      <!-- 添加评论 -->
      <div class="border-t border-gray-200 pt-3">
        <div class="flex space-x-3">
          <div class="flex-1">
            <textarea
              v-model="newComment"
              placeholder="写下温暖的话语支持TA..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
              rows="2"
              :maxlength="200"
              :disabled="disabled"
            ></textarea>
            <div class="flex justify-between items-center mt-2">
              <span class="text-xs text-gray-500">{{ newComment.length }}/200</span>
              <div class="flex items-center space-x-2">
                <label class="flex items-center text-xs text-gray-600">
                  <input 
                    v-model="commentAnonymously" 
                    type="checkbox" 
                    class="mr-1 w-3 h-3"
                  >
                  匿名回复
                </label>
                <button
                  @click="submitComment"
                  :disabled="!newComment.trim() || disabled"
                  class="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 举报模态框 -->
    <div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">举报内容</h3>
        <div class="space-y-3 mb-4">
          <label class="flex items-center">
            <input v-model="reportReason" type="radio" value="inappropriate" class="mr-2">
            <span class="text-sm">不当内容</span>
          </label>
          <label class="flex items-center">
            <input v-model="reportReason" type="radio" value="harassment" class="mr-2">
            <span class="text-sm">骚扰他人</span>
          </label>
          <label class="flex items-center">
            <input v-model="reportReason" type="radio" value="spam" class="mr-2">
            <span class="text-sm">垃圾信息</span>
          </label>
          <label class="flex items-center">
            <input v-model="reportReason" type="radio" value="other" class="mr-2">
            <span class="text-sm">其他原因</span>
          </label>
        </div>
        <div class="flex space-x-3">
          <button
            @click="showReportModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="submitReport"
            :disabled="!reportReason"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            确认举报
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ContentRating',
  props: {
    contentId: {
      type: [String, Number],
      required: true
    },
    initialSupportCount: {
      type: Number,
      default: 0
    },
    initialCommentCount: {
      type: Number,  
      default: 0
    },
    initialComments: {
      type: Array,
      default: () => []
    },
    isInitiallySupported: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showReportButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['support-changed', 'comment-submitted', 'content-reported'],
  setup(props, { emit }) {
    // 状态管理
    const isSupported = ref(props.isInitiallySupported)
    const supportCount = ref(props.initialSupportCount)
    const commentCount = ref(props.initialCommentCount)
    const comments = ref([...props.initialComments])
    const showComments = ref(false)
    const newComment = ref('')
    const commentAnonymously = ref(false)
    const showReportModal = ref(false)
    const reportReason = ref('')
    const commentsDisplayLimit = ref(3)

    // 显示的评论列表
    const displayedComments = computed(() => {
      return comments.value.slice(0, commentsDisplayLimit.value)
    })

    // 切换支持状态
    const toggleSupport = () => {
      if (props.disabled) return
      
      isSupported.value = !isSupported.value
      supportCount.value += isSupported.value ? 1 : -1
      
      emit('support-changed', {
        contentId: props.contentId,
        isSupported: isSupported.value,
        supportCount: supportCount.value
      })
    }

    // 切换评论显示
    const toggleComment = () => {
      showComments.value = !showComments.value
    }

    // 提交评论
    const submitComment = () => {
      if (!newComment.value.trim() || props.disabled) return
      
      const comment = {
        id: Date.now(), // 实际应用中应使用服务器生成的ID
        content: newComment.value.trim(),
        isAnonymous: commentAnonymously.value,
        username: commentAnonymously.value ? null : '当前用户', // 实际应从用户状态获取
        isCounselor: false, // 实际应从用户角色判断
        createdAt: new Date(),
        likeCount: 0,
        isLiked: false
      }
      
      comments.value.unshift(comment)
      commentCount.value++
      newComment.value = ''
      
      emit('comment-submitted', {
        contentId: props.contentId,
        comment: comment
      })
    }

    // 切换评论点赞
    const toggleCommentLike = (commentId) => {
      const comment = comments.value.find(c => c.id === commentId)
      if (comment) {
        comment.isLiked = !comment.isLiked
        comment.likeCount += comment.isLiked ? 1 : -1
      }
    }

    // 加载更多评论
    const loadMoreComments = () => {
      commentsDisplayLimit.value = Math.min(
        commentsDisplayLimit.value + 5, 
        comments.value.length
      )
    }

    // 提交举报
    const submitReport = () => {
      if (!reportReason.value) return
      
      emit('content-reported', {
        contentId: props.contentId,
        reason: reportReason.value
      })
      
      showReportModal.value = false
      reportReason.value = ''
      
      // 显示成功提示
      alert('举报已提交，我们会尽快处理。感谢你帮助维护社区环境！')
    }

    // 格式化时间
    const formatTime = (date) => {
      const now = new Date()
      const diff = now - new Date(date)
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 7) return `${days}天前`
      return new Date(date).toLocaleDateString()
    }

    return {
      isSupported,
      supportCount,
      commentCount,
      comments,
      displayedComments,
      showComments,
      newComment,
      commentAnonymously,
      showReportModal,
      reportReason,
      toggleSupport,
      toggleComment,
      submitComment,
      toggleCommentLike,
      loadMoreComments,
      submitReport,
      formatTime
    }
  }
}
</script>