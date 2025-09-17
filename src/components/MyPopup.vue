<script setup>
import { onMounted } from 'vue';
const props = defineProps({
  text: {
    type:String, 
    default:'Станадртный попап'},
  type: {
    type:String, 
    default:'info'
    },
  modelValue: {
    type:Boolean,
    default:false
  }
});
const emits = defineEmits(['close']);


onMounted(() => { 
  
  setTimeout(function() {
    emits('close');
  },5000); 

});

</script>

<template>
  <div
    class="bg-panel shadow-lg rounded-b-lg p-4 min-w-[300px] border-t-4"
    :style="{'border-color': `var(--${props.type})`}"
  >
    <div class="flex justify-between items-center">
      <h3 class="font-bold text-text">
        Уведомление
      </h3>
      <button 
        class="text-text hover:cursor-pointer"
        @click="emits('close')"
      >
        &times;
      </button>
    </div>
    <p class="mt-2 text-text">
      {{ props.text }}
    </p>
  </div>
</template>

<style scoped>
</style>