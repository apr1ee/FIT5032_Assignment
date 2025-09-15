<template>
  <footer class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="lg:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-sm">M</span>
            </div>
            <span class="text-xl font-bold">MindCare</span>
          </div>
          <p class="text-gray-300 mb-4 max-w-md">
            为青少年提供安全、支持性的心理健康平台，帮助管理情绪、建立连接，获得专业支持。
          </p>
          <div class="text-sm text-gray-400 space-y-1">
            <p>🌟 如果你正在经历危机，请立即寻求专业帮助</p>
            <p>📞 危机热线：1300-659-467 (Lifeline)</p>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-semibold mb-4">快速链接</h3>
          <ul class="space-y-3 text-gray-300">
            <li>
              <a href="/about" class="group hover:text-white transition-colors flex items-center">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-3 transform transition-transform group-hover:scale-125"></span>
                关于我们
              </a>
            </li>
            <li>
              <a href="/support" class="group hover:text-white transition-colors flex items-center">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-3 transform transition-transform group-hover:scale-125"></span>
                获取支持
              </a>
            </li>
            <li>
              <a href="/privacy" class="group hover:text-white transition-colors flex items-center">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-3 transform transition-transform group-hover:scale-125"></span>
                隐私政策
              </a>
            </li>
            <li>
              <a href="/terms" class="group hover:text-white transition-colors flex items-center">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-3 transform transition-transform group-hover:scale-125"></span>
                服务条款
              </a>
            </li>
            <li>
              <a href="/contact" class="group hover:text-white transition-colors flex items-center">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-3 transform transition-transform group-hover:scale-125"></span>
                联系我们
              </a>
            </li>
          </ul>
        </div>

        <!-- 你可以在此处继续扩展更多列，例如：法律信息、产品、社交媒体等 -->
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800 pt-8 mt-8">
        <div class="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-400 text-sm">
            <p>&copy; 2025 MindCare. 保留所有权利。</p>
            <div class="flex items-center space-x-2">
              <span>使用</span>
              <span class="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">Vue.js 3</span>
              <span>构建</span>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- 无障碍标识 -->
            <div class="flex items-center space-x-2 text-xs text-gray-400">
              <span>符合</span>
              <span class="px-2 py-1 bg-green-700 text-green-100 rounded">WCAG 2.1 AA</span>
              <span>无障碍标准</span>
            </div>

            <!-- 安全标识 -->
            <div class="flex items-center space-x-1 text-xs text-gray-400">
              <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              <span>安全防护</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
/* 仅命名可选：在 <script setup> 中不必显式导出 */
</script>

<!-- 无自定义样式也可以，Tailwind 已处理响应式；保留块占位供后续扩展 -->
<style scoped>
</style>
