<!-- src/pages/RatingDemoPage.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">评分系统演示</h1>
        <p class="mt-2 text-gray-600">体验我们的情绪评分和社区互动功能</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 情绪评分演示 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">情绪评分组件</h2>
          
          <MoodRating
            v-model="demoMoodRating"
            v-model:description="demoMoodDescription"
            v-model:tags="demoMoodTags"
            label="今天你的整体情绪如何？"
            description="选择最符合你当前感受的评分"
            required
            @rating-change="handleRatingChange"
          />

          <!-- 评分结果显示 -->
          <div v-if="demoMoodRating" class="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 class="font-medium text-blue-900 mb-2">评分结果:</h3>
            <div class="space-y-2 text-sm">
              <p><strong>情绪评分:</strong> {{ demoMoodRating }}/10</p>
              <p v-if="demoMoodDescription"><strong>感受描述:</strong> {{ demoMoodDescription }}</p>
              <p v-if="demoMoodTags.length > 0">
                <strong>相关标签:</strong> 
                <span class="ml-1">
                  <span 
                    v-for="tag in demoMoodTags" 
                    :key="tag"
                    class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-1"
                  >
                    {{ getTagLabel(tag) }}
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- 内容评价演示 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">内容评价组件</h2>
          
          <div class="border border-gray-200 rounded-lg p-4 mb-4">
            <h3 class="font-medium text-gray-900 mb-2">示例日记内容</h3>
            <p class="text-gray-700 text-sm mb-3">
              今天是周一，感觉有点焦虑，担心这周的工作任务太多。但是和朋友聊了聊，心情好了一些。
              希望大家也能找到属于自己的放松方式。
            </p>
            <div class="flex space-x-2 mb-3">
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">#焦虑</span>
              <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">#朋友</span>
            </div>
          </div>

          <ContentRating
            content-id="demo-1"
            :initial-support-count="12"
            :initial-comment-count="3"
            :initial-comments="demoComments"
            :is-initially-supported="false"
            @support-changed="handleSupportChanged"
            @comment-submitted="handleCommentSubmitted"
            @content-reported="handleContentReported"
          />
        </div>
      </div>

      <!-- 日记卡片演示 -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">日记卡片演示</h2>
        
        <div class="grid gap-6">
          <JournalCard
            v-for="entry in demoEntries"
            :key="entry.id"
            :entry="entry"
            :is-owner="entry.id === 1"
            @entry-updated="handleEntryUpdated"
            @entry-reported="handleEntryReported"
          />
        </div>
      </div>

      <!-- 功能说明 -->
      <div class="mt-12 bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">BR C.3 - 评分系统功能说明</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">情绪评分功能</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• 支持1-10分评分或表情评分</li>
              <li>• 可添加情绪描述和相关标签</li>
              <li>• 实时验证和错误提示</li>
              <li>• 支持危机关键词检测</li>
              <li>• 无障碍键盘导航支持</li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-900 mb-2">社区评价功能</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• 点赞/支持功能</li>
              <li>• 匿名或实名评论</li>
              <li>• 评论点赞系统</li>
              <li>• 内容举报机制</li>
              <li>• 危机内容自动检测</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import MoodRating from '../components/journal/MoodRating.vue'
import ContentRating from '../components/journal/ContentRating.vue'
import JournalCard from '../components/journal/JournalCard.vue'

export default {
  name: 'RatingDemoPage',
  components: {
    MoodRating,
    ContentRating,
    JournalCard
  },
  setup() {
    // 情绪评分演示数据
    const demoMoodRating = ref(null)
    const demoMoodDescription = ref('')
    const demoMoodTags = ref([])

    // 演示评论数据
    const demoComments = reactive([
      {
        id: 1,
        content: '我也有类似的感受，和朋友聊天确实很有帮助！加油！',
        username: '小明',
        isAnonymous: false,
        isCounselor: false,
        createdAt: new Date(Date.now() - 3600000), // 1小时前
        likeCount: 2,
        isLiked: false
      },
      {
        id: 2,
        content: '周一综合症很常见，试试深呼吸和听音乐放松一下。你不是一个人在战斗！',
        username: '心理咨询师李老师',
        isAnonymous: false,
        isCounselor: true,
        createdAt: new Date(Date.now() - 1800000), // 30分钟前
        likeCount: 5,
        isLiked: true
      }
    ])

    // 演示日记条目
    const demoEntries = reactive([
      {
        id: 1,
        username: '当前用户',
        isAnonymous: false,
        isCounselor: false,
        createdAt: new Date(),
        moodRating: 6,
        moodDescription: '今天感觉还不错，虽然有些小压力',
        content: '今天终于完成了那个困扰我很久的项目，虽然过程很辛苦，但看到最终结果还是很有成就感的。感谢团队伙伴们的支持，没有大家就没有今天的成果。明天继续加油！',
        tags: ['work', 'friends'],
        supportCount: 8,
        commentCount: 2,
        isSupported: false,
        comments: []
      },
      {
        id: 2,
        username: '匿名用户',
        isAnonymous: true,
        isCounselor: false,
        createdAt: new Date(Date.now() - 7200000), // 2小时前
        moodRating: 4,
        moodDescription: '有点难过，但在慢慢调整',
        content: '最近总是想太多，睡眠也不太好。可能是换季的关系吧，希望能快点适应新的环境和节奏。看到大家的分享，感觉自己不是一个人在面对这些问题，谢谢大家。',
        tags: ['self', 'health'],
        supportCount: 15,
        commentCount: 4,
        isSupported: true,
        comments: []
      }
    ])

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

    const getTagLabel = (tag) => {
      return tagLabels[tag] || tag
    }

    // 事件处理
    const handleRatingChange = (data) => {
      console.log('情绪评分变化:', data)
    }

    const handleSupportChanged = (data) => {
      console.log('支持状态变化:', data)
    }

    const handleCommentSubmitted = (data) => {
      console.log('评论提交:', data)
    }

    const handleContentReported = (data) => {
      console.log('内容举报:', data)
      alert('演示模式：举报功能已记录')
    }

    const handleEntryUpdated = (entry) => {
      const index = demoEntries.findIndex(e => e.id === entry.id)
      if (index !== -1) {
        demoEntries[index] = entry
      }
    }

    const handleEntryReported = (data) => {
      console.log('日记举报:', data)
      alert('演示模式：举报功能已记录')
    }

    return {
      demoMoodRating,
      demoMoodDescription,
      demoMoodTags,
      demoComments,
      demoEntries,
      getTagLabel,
      handleRatingChange,
      handleSupportChanged,
      handleCommentSubmitted,
      handleContentReported,
      handleEntryUpdated,
      handleEntryReported
    }
  }
}
</script>