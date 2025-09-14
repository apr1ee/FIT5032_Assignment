<!-- src/pages/journal/SecureJournalCompose.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">写下你的感受</h1>
        <p class="mt-2 text-gray-600">记录情绪，分享经历，获得支持</p>
      </div>

      <!-- 安全日记表单 -->
      <div class="bg-white shadow-sm rounded-lg p-8">
        <SecureForm
          form-id="journal-compose"
          :max-submissions="3"
          :rate-limit-window="300000"
          :enable-content-filter="true"
          :enable-crisis-detection="true"
          :show-security-notice="true"
          @submit="handleJournalSubmit"
          @security-violation="handleSecurityViolation"
          @crisis-detected="handleCrisisDetection"
        >
          <template #default="{ csrfToken, isSubmitting, submitError }">
            <!-- 情绪评分 -->
            <div class="mb-8">
              <MoodRating
                ref="moodRatingRef"
                v-model="journalData.moodRating"
                v-model:description="journalData.moodDescription"
                v-model:tags="journalData.moodTags"
                required
                :disabled="isSubmitting"
                @rating-change="handleMoodChange"
              />
            </div>

            <!-- 日记标题 -->
            <FormInput
              ref="titleRef"
              v-model="journalData.title"
              label="标题 (可选)"
              placeholder="给你的日记起个标题..."
              :max-length="100"
              :validation-rules="['max:100']"
              :disabled="isSubmitting"
              hint="简短的标题帮助你更好地回顾日记"
            />

            <!-- 日记内容 -->
            <FormTextarea
              ref="contentRef"
              v-model="journalData.content"
              label="今天发生了什么？"
              placeholder="写下你的想法、感受或今天的经历..."
              required
              :rows="8"
              :max-length="2000"
              :validation-rules="['required', 'min:10', 'max:2000']"
              :enable-crisis-detection="true"
              :disabled="isSubmitting"
              hint="真诚地表达你的感受，这里是安全的空间"
              @crisis-detected="handleTextCrisis"
            />

            <!-- 隐私设置 -->
            <div class="mb-6">
              <label class="form-label">分享设置</label>
              <FormRadio
                v-model="journalData.privacy"
                :options="privacyOptions"
                :disabled="isSubmitting"
              />
            </div>

            <!-- 危机支持显示 -->
            <div v-if="showCrisisSupport" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-start">
                <svg class="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-1">
                  <h3 class="font-medium text-red-900">我们关心你的安全</h3>
                  <p class="text-red-800 text-sm mt-1">
                    如果你正在经历困难时刻，请知道你并不孤单。专业帮助随时可得。
                  </p>
                  <div class="mt-3 flex flex-wrap gap-3">
                    <button 
                      type="button"
                      @click="showCrisisResources"
                      class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      获取专业帮助
                    </button>
                    <div class="flex items-center text-sm text-red-800">
                      <span class="font-medium mr-2">紧急热线:</span>
                      <a href="tel:131114" class="underline hover:no-underline">13 11 14</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 安全提醒 -->
            <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 class="font-medium text-blue-900 mb-2">安全提醒</h3>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• 你的内容会经过自动安全检查，保护社区环境</li>
                <li>• 选择"半匿名"可以在社区分享时保护隐私</li>
                <li>• 我们会检测可能的危机内容并提供相应支持</li>
                <li>• 所有数据传输都经过加密保护</li>
              </ul>
            </div>

            <!-- 提交错误显示 -->
            <div v-if="submitError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-800 text-sm">{{ submitError }}</p>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-between items-center">
              <button
                type="button"
                @click="saveDraft"
                :disabled="isSubmitting"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
              >
                保存草稿
              </button>

              <div class="space-x-3">
                <router-link
                  to="/journal"
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  取消
                </router-link>
                <button
                  type="submit"
                  :disabled="!isFormValid || isSubmitting"
                  class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <span v-if="!isSubmitting">发布日记</span>
                  <div v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    发布中...
                  </div>
                </button>
              </div>
            </div>
          </template>
        </SecureForm>
      </div>

      <!-- 安全功能说明 -->
      <div class="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">BR C.4 - 安全功能演示</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-gray-800 mb-2">XSS防护</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• HTML标签自动转义</li>
              <li>• 危险脚本内容过滤</li>
              <li>• 事件处理器移除</li>
              <li>• JavaScript协议链接阻止</li>
            </ul>
          </div>
          <div>
            <h3 class="font-medium text-gray-800 mb-2">CSRF防护</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• 自动生成CSRF令牌</li>
              <li>• 表单提交时验证令牌</li>
              <li>• 蜜罐字段防机器人</li>
              <li>• 提交频率限制</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 危机资源模态框 -->
    <div v-if="showCrisisModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">专业支持资源</h3>
        
        <div class="space-y-4">
          <div class="p-3 border border-red-200 rounded bg-red-50">
            <h4 class="font-medium text-red-900">紧急情况</h4>
            <p class="text-sm text-red-800 mt-1">如果有立即危险，请拨打000或前往最近的医院</p>
          </div>
          
          <div class="space-y-3">
            <div>
              <h4 class="font-medium text-gray-900">Lifeline</h4>
              <p class="text-sm text-gray-600">24小时危机支持热线</p>
              <p class="font-medium text-blue-600">13 11 14</p>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-900">Beyond Blue</h4>
              <p class="text-sm text-gray-600">焦虑、抑郁支持</p>
              <p class="font-medium text-blue-600">1300 22 4636</p>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-900">Headspace</h4>
              <p class="text-sm text-gray-600">青少年心理健康支持</p>
              <p class="font-medium text-blue-600">1800 650 890</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex space-x-3">
          <button
            @click="showCrisisModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            关闭
          </button>
          <button
            @click="continueWithCounseling"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            联系在线咨询
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import SecureForm from '../../components/common/SecureForm.vue'
import MoodRating from '../../components/journal/MoodRating.vue'
import FormInput from '../../components/forms/FormInput.vue'
import FormTextarea from '../../components/forms/FormTextarea.vue'
import FormRadio from '../../components/forms/FormRadio.vue'
import { secureStorage } from '../../utils/securityUtils.js'

export default {
  name: 'SecureJournalCompose',
  components: {
    SecureForm,
    MoodRating,
    FormInput,
    FormTextarea,
    FormRadio
  },
  setup() {
    const router = useRouter()
    
    // 表单数据
    const journalData = reactive({
      title: '',
      content: '',
      moodRating: null,
      moodDescription: '',
      moodTags: [],
      privacy: 'private'
    })

    // 状态管理
    const showCrisisSupport = ref(false)
    const showCrisisModal = ref(false)
    
    // 隐私选项
    const privacyOptions = [
      { value: 'private', label: '私密', description: '只有你能看到' },
      { value: 'anonymous', label: '半匿名', description: '在社区匿名分享' },
      { value: 'public', label: '公开', description: '使用用户名公开分享' }
    ]

    // 表单验证状态
    const isFormValid = computed(() => {
      return journalData.moodRating && 
             journalData.content && 
             journalData.content.length >= 10 &&
             journalData.privacy
    })

    // 处理情绪变化
    const handleMoodChange = (data) => {
      console.log('情绪数据变化:', data)
    }

    // 处理文本危机检测
    const handleTextCrisis = (content) => {
      showCrisisSupport.value = true
      console.log('检测到危机内容:', content)
    }

    // 显示危机资源
    const showCrisisResources = () => {
      showCrisisModal.value = true
    }

    // 继续咨询服务
    const continueWithCounseling = () => {
      showCrisisModal.value = false
      // 这里可以跳转到咨询页面或启动聊天
      console.log('启动在线咨询服务')
    }

    // 保存草稿
    const saveDraft = () => {
      try {
        secureStorage.setItem('journal_draft', journalData)
        alert('草稿已保存！')
      } catch (error) {
        console.error('保存草稿失败:', error)
      }
    }

    // 处理表单提交
    const handleJournalSubmit = async (formPayload) => {
      try {
        console.log('安全提交的日记数据:', formPayload)
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 清除草稿
        secureStorage.removeItem('journal_draft')
        
        // 成功提示
        alert('日记发布成功！')
        
        // 跳转到日记列表
        router.push('/journal')
        
      } catch (error) {
        throw new Error('发布失败，请重试')
      }
    }

    // 处理安全违规
    const handleSecurityViolation = (violation) => {
      console.warn('安全违规检测:', violation)
      
      // 在生产环境中，这里应该发送到服务器记录
      if (violation.violations.some(v => v.type === 'bot_detected')) {
        alert('检测到异常行为，请确认你是真实用户')
      }
    }

    // 处理危机检测
    const handleCrisisDetection = (data) => {
      showCrisisSupport.value = true
      console.log('表单级危机检测:', data)
    }

    return {
      journalData,
      privacyOptions,
      showCrisisSupport,
      showCrisisModal,
      isFormValid,
      handleMoodChange,
      handleTextCrisis,
      showCrisisResources,
      continueWithCounseling,
      saveDraft,
      handleJournalSubmit,
      handleSecurityViolation,
      handleCrisisDetection
    }
  }
}
</script>