// src/components/forms/FormValidator.js

/**
 * 表单验证工具类 - 支持BR B.1要求的多种验证类型
 */

// 验证规则映射
const validationRules = {
  // 必填验证
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return '此字段为必填项'
    }
    return null
  },

  // 邮箱验证
  email: (value) => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return '请输入有效的邮箱地址'
    }
    return null
  },

  // 最小长度验证
  min: (value, minLength) => {
    if (!value) return null
    if (value.length < minLength) {
      return `最少需要${minLength}个字符`
    }
    return null
  },

  // 最大长度验证
  max: (value, maxLength) => {
    if (!value) return null
    if (value.length > maxLength) {
      return `最多允许${maxLength}个字符`
    }
    return null
  },

  // 密码强度验证
  password: (value) => {
    if (!value) return null
    if (value.length < 8) {
      return '密码长度至少8位'
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return '密码必须包含小写字母'
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return '密码必须包含大写字母'
    }
    if (!/(?=.*\d)/.test(value)) {
      return '密码必须包含数字'
    }
    return null
  },

  // 确认密码验证
  confirmPassword: (value, originalPassword) => {
    if (!value) return null
    if (value !== originalPassword) {
      return '两次输入的密码不一致'
    }
    return null
  },

  // 手机号验证（澳洲格式）
  phone: (value) => {
    if (!value) return null
    const phoneRegex = /^(\+61|0)[2-9]\d{8}$/
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return '请输入有效的澳洲手机号'
    }
    return null
  },

  // 年龄验证
  age: (value, minAge = 13, maxAge = 120) => {
    if (!value) return null
    const age = parseInt(value)
    if (isNaN(age)) {
      return '请输入有效的年龄'
    }
    if (age < minAge) {
      return `年龄不能小于${minAge}岁`
    }
    if (age > maxAge) {
      return `年龄不能大于${maxAge}岁`
    }
    return null
  },

  // URL验证
  url: (value) => {
    if (!value) return null
    try {
      new URL(value)
      return null
    } catch {
      return '请输入有效的网址'
    }
  },

  // 数字验证
  numeric: (value) => {
    if (!value) return null
    if (isNaN(Number(value))) {
      return '请输入有效的数字'
    }
    return null
  },

  // 字母验证
  alpha: (value) => {
    if (!value) return null
    const alphaRegex = /^[a-zA-Z\u4e00-\u9fa5]+$/
    if (!alphaRegex.test(value)) {
      return '只能包含字母和中文字符'
    }
    return null
  },

  // 字母数字验证
  alphaNumeric: (value) => {
    if (!value) return null
    const alphaNumRegex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
    if (!alphaNumRegex.test(value)) {
      return '只能包含字母、数字和中文字符'
    }
    return null
  }
}

/**
 * 验证单个输入值
 * @param {*} value - 要验证的值
 * @param {Array} rules - 验证规则数组
 * @returns {string|null} - 错误信息或null
 */
export function validateInput(value, rules = []) {
  for (const rule of rules) {
    let error = null
    
    if (typeof rule === 'string') {
      // 简单规则，如 'required', 'email'
      if (rule.includes(':')) {
        // 带参数的规则，如 'min:8', 'max:50'
        const [ruleName, param] = rule.split(':')
        if (validationRules[ruleName]) {
          error = validationRules[ruleName](value, param)
        }
      } else {
        // 不带参数的规则
        if (validationRules[rule]) {
          error = validationRules[rule](value)
        }
      }
    } else if (typeof rule === 'function') {
      // 自定义验证函数
      error = rule(value)
    } else if (typeof rule === 'object' && rule.validator) {
      // 对象形式的规则
      error = rule.validator(value)
    }
    
    // 如果有错误，立即返回
    if (error) {
      return error
    }
  }
  
  return null
}

/**
 * 验证整个表单
 * @param {Object} formData - 表单数据
 * @param {Object} validationSchema - 验证规则对象
 * @returns {Object} - 包含错误的对象
 */
export function validateForm(formData, validationSchema) {
  const errors = {}
  
  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    const value = formData[fieldName]
    const error = validateInput(value, rules)
    if (error) {
      errors[fieldName] = error
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 心理健康相关的特殊验证规则
 */
export const mentalHealthValidations = {
  // 检测危机关键词
  crisisDetection: (value) => {
    if (!value) return null
    
    const crisisKeywords = [
      '自杀', '结束生命', '不想活', '想死', '自残', '伤害自己'
    ]
    
    const content = value.toLowerCase()
    const hasCrisisContent = crisisKeywords.some(keyword => 
      content.includes(keyword)
    )
    
    if (hasCrisisContent) {
      return {
        type: 'crisis',
        message: '我们注意到您可能正在经历困难，请考虑寻求专业帮助',
        action: 'showCrisisSupport'
      }
    }
    
    return null
  },

  // 情绪评分验证
  moodRating: (value) => {
    if (!value) return null
    const rating = parseInt(value)
    if (isNaN(rating) || rating < 1 || rating > 10) {
      return '情绪评分必须是1-10之间的数字'
    }
    return null
  },

  // 日记内容长度建议
  journalLength: (value) => {
    if (!value) return null
    if (value.length < 10) {
      return '建议写下更多内容，这会帮助你更好地表达情绪'
    }
    if (value.length > 5000) {
      return '内容过长，建议分段记录或精简表达'
    }
    return null
  }
}

/**
 * 实时验证帮助函数
 * @param {Function} callback - 验证结果回调
 * @param {number} delay - 防抖延迟时间
 */
export function createDebounceValidator(callback, delay = 500) {
  let timeoutId = null
  
  return function(value, rules) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      const error = validateInput(value, rules)
      callback(error)
    }, delay)
  }
}