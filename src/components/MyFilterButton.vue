<script setup>

import { usePhotosStore } from '../stores/photosStore';
const photosStore = usePhotosStore();
const props = defineProps({
  field: {
    type:String, 
    default:''
    },
  isDark: {
    type:Boolean,
    default: false
  }
});
let order = 'asc';
const clickFilterButton = () => {
    photosStore.sortPhotos(props.field, order);
    order = order === 'asc'? 'desc':'asc';
};
</script>

<template>
  <img
    alt="Filter logo"
    :class="[isDark? ['invert']:['']]"
    src="../assets/svg/filter.svg"
    width="15" 
    height="15"
    @click="clickFilterButton()"
  > 
</template>

<style scoped>
</style>