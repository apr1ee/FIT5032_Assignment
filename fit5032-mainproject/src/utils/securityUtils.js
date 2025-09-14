// src/utils/securityUtils.js

/**
 * 安全工具类 - 实现BR C.4基础安全功能
 */

// XSS防护：HTML实体编码
export function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe
  
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;")
}

// XSS防护：移除危险标签和属性
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  
  // 移除脚本标签
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // 移除危险的事件处理器
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  
  // 移除javascript:协议链接
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  // 移除data:协议(除了安全的图片)
  sanitized = sanitized.replace(/data:(?!image\/(png|jpg|jpeg|gif|webp))[^;]*;/gi, '')
  
  return sanitized.trim()
}

// 输入验证：检查是否包含恶意内容
export function validateInput(input, options = {}) {
  const {
    maxLength = 5000,
    allowHtml = false,
    checkXSS = true,
    checkSQLInjection = true
  } = options
  
  if (!input || typeof input !== 'string') {
    return { isValid: true, sanitized: input }
  }
  
  let sanitized = input
  const errors = []
  
  // 长度检查
  if (input.length > maxLength) {
    errors.push(`内容长度不能超过${maxLength}个字符`)
    sanitized = input.slice(0, maxLength)
  }
  
  // XSS检查
  if (checkXSS) {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /vbscript:/i
    ]
    
    if (xssPatterns.some(pattern => pattern.test(input))) {
      errors.push('检测到可疑内容，请检查输入')
    }
    
    if (!allowHtml) {
      sanitized = escapeHtml(sanitized)
    } else {
      sanitized = sanitizeInput(sanitized)
    }
  }
  
  // SQL注入检查
  if (checkSQLInjection) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(OR|AND)\s+\d+\s*=\s*\d+/i,
      /['";].*(--)|(\/\*)/i
    ]
    
    if (sqlPatterns.some(pattern => pattern.test(input))) {
      errors.push('检测到可疑的查询内容')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  }
}

// CSRF令牌生成
export function generateCSRFToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// 安全的本地存储操作
export const secureStorage = {
  // 加密存储（简单实现，生产环境应使用更强的加密）
  setItem(key, value) {
    try {
      const encrypted = btoa(JSON.stringify({
        data: value,
        timestamp: Date.now()
      }))
      localStorage.setItem(key, encrypted)
      return true
    } catch (error) {
      console.warn('存储数据失败:', error)
      return false
    }
  },
  
  // 解密获取
  getItem(key) {
    try {
      const encrypted = localStorage.getItem(key)
      if (!encrypted) return null
      
      const decrypted = JSON.parse(atob(encrypted))
      
      // 检查数据是否过期（7天）
      const maxAge = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - decrypted.timestamp > maxAge) {
        localStorage.removeItem(key)
        return null
      }
      
      return decrypted.data
    } catch (error) {
      console.warn('读取数据失败:', error)
      localStorage.removeItem(key)
      return null
    }
  },
  
  removeItem(key) {
    localStorage.removeItem(key)
  },
  
  clear() {
    localStorage.clear()
  }
}

// 密码强度检查
export function checkPasswordStrength(password) {
  if (!password) return { score: 0, feedback: [] }
  
  let score = 0
  const feedback = []
  
  // 长度检查
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('密码长度至少8位')
  }
  
  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('需要包含小写字母')
  }
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('需要包含大写字母')
  }
  
  // 包含数字
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('需要包含数字')
  }
  
  // 包含特殊字符
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1
  } else {
    feedback.push('建议包含特殊字符')
  }
  
  // 避免常见密码
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123']
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    score = Math.max(0, score - 2)
    feedback.push('避免使用常见密码')
  }
  
  const strength = ['很弱', '弱', '一般', '强', '很强'][Math.min(score, 4)]
  
  return { 
    score, 
    strength,
    feedback: feedback.length > 0 ? feedback : ['密码强度良好']
  }
}

// 危机内容检测
export function detectCrisisContent(content) {
  if (!content || typeof content !== 'string') return false
  
  const crisisKeywords = [
    // 中文关键词
    '自杀', '结束生命', '不想活', '想死', '自残', '伤害自己',
    '了结自己', '一了百了', '解脱', '轻生', '寻死',
    // 英文关键词
    'suicide', 'kill myself', 'end my life', 'self harm', 'hurt myself'
  ]
  
  const normalizedContent = content.toLowerCase()
  
  return crisisKeywords.some(keyword => 
    normalizedContent.includes(keyword.toLowerCase())
  )
}

// 用户输入速率限制
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.attempts = new Map()
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }
  
  isAllowed(identifier) {
    const now = Date.now()
    const userAttempts = this.attempts.get(identifier) || []
    
    // 清理过期记录
    const validAttempts = userAttempts.filter(time => now - time < this.windowMs)
    
    if (validAttempts.length >= this.maxAttempts) {
      return false
    }
    
    validAttempts.push(now)
    this.attempts.set(identifier, validAttempts)
    return true
  }
  
  getRemainingTime(identifier) {
    const userAttempts = this.attempts.get(identifier) || []
    if (userAttempts.length < this.maxAttempts) return 0
    
    const oldestAttempt = Math.min(...userAttempts)
    return Math.max(0, this.windowMs - (Date.now() - oldestAttempt))
  }
}

// 内容过滤器
export function filterInappropriateContent(content) {
  if (!content || typeof content !== 'string') return content
  
  // 不当词汇列表（简化版）
  const inappropriateWords = [
    // 可以根据需要添加更多词汇
    '垃圾', '废物', '滚蛋'
  ]
  
  let filtered = content
  inappropriateWords.forEach(word => {
    const regex = new RegExp(word, 'gi')
    filtered = filtered.replace(regex, '*'.repeat(word.length))
  })
  
  return filtered
}

// 会话安全管理
export const sessionSecurity = {
  // 生成会话ID
  generateSessionId() {
    return generateCSRFToken()
  },
  
  // 验证会话有效性
  validateSession(sessionId) {
    // 简单的格式验证
    return sessionId && /^[a-f0-9]{64}$/.test(sessionId)
  },
  
  // 清理会话
  clearSession() {
    secureStorage.removeItem('sessionId')
    secureStorage.removeItem('userToken')
    secureStorage.removeItem('csrfToken')
  }
}

// 导出默认配置
export const securityConfig = {
  maxInputLength: 5000,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  sessionTimeout: 24 * 60 * 60 * 1000, // 24小时
  rateLimitWindow: 60 * 1000, // 1分钟
  maxRequestsPerWindow: 10
}