<!-- src/components/forms/ValidationMessage.vue -->
<template>
  <div 
    v-if="message"
    class="validation-message flex items-center mt-2 text-sm text-red-600"
    role="alert"
    :aria-live="live"
  >
    <svg 
      class="w-4 h-4 mr-2 flex-shrink-0" 
      fill="currentColor" 
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path 
        fill-rule="evenodd" 
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
        clip-rule="evenodd" 
      />
    </svg>
    <span>{{ message }}</span>
  </div>
</template>

<script>
export default {
  name: 'ValidationMessage',
  props: {
    message: {
      type: String,
      required: true
    },
    live: {
      type: String,
      default: 'polite',
      validator: (value) => ['polite', 'assertive', 'off'].includes(value)
    }
  }
}
</script>

<style scoped>
.validation-message {
  animation: fadeInDown 0.3s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>