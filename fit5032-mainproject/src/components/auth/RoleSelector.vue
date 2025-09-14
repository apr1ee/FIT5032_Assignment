<!-- src/components/auth/RoleSelector.vue -->
<template>
  <FormRadio
    v-model="selectedRole"
    label="选择你的角色"
    :options="roleOptions"
    required
    :disabled="disabled"
    hint="选择最符合你情况的角色，注册后可以在设置中修改"
    @change="handleRoleChange"
  />
</template>

<script>
import { ref, computed } from 'vue'
import FormRadio from '../forms/FormRadio.vue'

export default {
  name: 'RoleSelector',
  components: {
    FormRadio
  },
  props: {
    modelValue: {
      type: String,
      default: 'user'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'role-change'],
  setup(props, { emit }) {
    
    const selectedRole = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    // 角色选项配置
    const roleOptions = [
      {
        value: 'user',
        label: '用户',
        description: '寻求心理健康支持和资源的青少年用户'
      },
      {
        value: 'counselor', 
        label: '志愿咨询师',
        description: '具备相关资质，愿意为其他用户提供支持的志愿者'
      }
    ]

    const handleRoleChange = (value) => {
      emit('role-change', value)
    }

    return {
      selectedRole,
      roleOptions,
      handleRoleChange
    }
  }
}
</script>