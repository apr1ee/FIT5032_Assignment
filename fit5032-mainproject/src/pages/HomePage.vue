<template>
  <div class="bg-gradient-to-b from-blue-50 to-white">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          青少年心理健康平台
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-8">
          一个安全、支持性的空间，帮助青少年管理情绪、建立连接，获得专业支持
        </p>
        <div class="space-x-4">
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
            开始我的心理健康之旅
          </button>
          <button class="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
            了解更多
          </button>
        </div>
      </div>
    </section>

    <!-- Features Overview -->
    <section class="container mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
        我们如何帮助你
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center p-6 bg-white rounded-lg shadow-sm">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📝</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">情绪日记</h3>
          <p class="text-gray-600">记录情绪变化，追踪心理健康趋势</p>
        </div>
        
        <div class="text-center p-6 bg-white rounded-lg shadow-sm">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">同伴支持</h3>
          <p class="text-gray-600">在安全的环境中与同龄人分享和交流</p>
        </div>
        
        <div class="text-center p-6 bg-white rounded-lg shadow-sm">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📚</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">心理教育</h3>
          <p class="text-gray-600">学习实用的心理健康知识和技能</p>
        </div>
        
        <div class="text-center p-6 bg-white rounded-lg shadow-sm">
          <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🗺️</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">本地资源</h3>
          <p class="text-gray-600">找到附近的心理健康支持服务</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  setup() {
    return {
      
    }
  }
}
</script>