<template>
  <div class="d-flex align-items-center gap-2">
    <div>
      <button v-for="n in 5" :key="n" type="button"
              class="btn btn-sm" :class="n<=value?'btn-warning':'btn-outline-secondary'"
              @click="$emit('update:modelValue', n)">
        ★
      </button>
    </div>
    <small class="text-muted">{{ hint }}</small>
  </div>
</template>

<script setup>
const props = defineProps({ modelValue: {type:Number, default:0} })
const value = computed(()=>props.modelValue)
const hint  = computed(()=> value.value ? `${value.value}/5` : 'Rate this')
import { computed } from 'vue'
</script>
