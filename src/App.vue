<script setup>
import { usePhotosStore } from './stores/photosStore';
import { ref, computed, onMounted} from 'vue';
import MyPopup from './components/MyPopup.vue';
import MyFilterButton from './components/MyFilterButton.vue';

const photosStore = usePhotosStore();
const scrollContainer = ref(null);
let isValidInput = ref(true);
let isDark = ref(false);
let isError = ref(photosStore.isError);
let searchInput = ref(localStorage.getItem('albumsId')||''); 
let isPopupOpen = ref(false);


const searchValueUrl = computed(() => {
  if (searchInput.value.length==0){
    return '';
  }
  else {
    const idArray = searchInput.value.split(" ");
    let res = '?';
    for (let id of idArray){
      res = res+`&albumId=${id}`;
    }
    return res;
  }
});


const validateInput = ()=>{
  const regexp = /^\s*\d+(?:\s+\d+)*\s*$/;
  return regexp.test(searchInput.value)||searchInput.value.length==0;
};

const handleScroll = ()=>{
  const container = scrollContainer.value;
  
  if (!container) return;

  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
    loadMore();
  }
};

const loadMore =() => {
  photosStore.fetchPhotos();
};
const toggleMode =() => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark');
};

const search = () => {
  if (scrollContainer.value) scrollContainer.value.scrollTop = 0;
  isValidInput.value = validateInput();
  if (isValidInput.value){
    localStorage.setItem('albumsId',searchInput.value);
    photosStore.searchPhotos(searchValueUrl.value);
  }
  else {
    isPopupOpen.value = true;
 }
};

const onPopupClose = () => {
  isPopupOpen.value = false;
};


const sortArray = (array, field, direction) => {
  return [...array].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    return direction === 'asc' 
      ? valueA - valueB
      : valueB - valueA;
  });
}


onMounted(() => {
  search();
});
</script>

<template>
  <div class="min-h-screen max-h-screen bg-background">
    <header 
      class="text-text text-3xl font-bold font-mono bold flex justify-center items-center h-16 bg-background font-myfont"
      alt="Заголовок страницы Альбомы"
      >
      <span class="text-text">Альбомы</span>
      <button
        class="right-5 fixed flex w-10 h-10 rounded-full items-center justify-center "
        alt="Кнопка переключения свтелого или темного режима"
        @click="toggleMode"
      >
        <img
          alt="Moon logo"
          aria-hidden="true"
          :class="[isDark? ['opacity-0', 'rotate-90']:['opacity-85', 'rotate-0'], 'transition-all', 'absolute', 'duration-200', 'w-6', 'h-6']"
          src="./assets/svg/moon.svg" 
          width="15" 
          height="15"
        >  
        <img
          alt="Sun logo"
          aria-hidden="true"
          :class="['invert', isDark? ['opacity-95', 'rotate-0']:['opacity-0', 'rotate-90'], 'w-6', 'h-6', 'absolute', 'transition-all', 'duration-200']"
          src="./assets/svg/sun.svg" 
          width="20" 
          height="20"
        >  
      </button>
    </header>
    <div class="flex items-center justify-start flex-col overflow-hidden max-h-[90vh] h-full w-full bg-background">
      <div class="items-start w-full flex flex-col py-3">
        <div class="items-center justify-center w-full flex flex-row">
          <input
            type="search"
            v-model="searchInput"
            placeholder="Введите ID альбомов через пробел"
            class=" text-text w-96 cursor-text bg-panel border border-border rounded-md px-2 mr-2 focus:outline-none focus:ring-2 focus:ring-accent  focus:border-transparent transition duration-200"
          >
          <button
            :disabled="!photosStore.loading"
            class="bg-accent hover:bg-accent-hover text-white font-semibold mt-1 py-1 px-4 rounded-lg shadow-md transition duration-200 ease-in-out active:outline-none active:ring-2 active:ring-accent active:ring-offset-2 active:ring-offset-background"
            @click="search" 
          >
            Поиск
          </button>
        </div>
        <transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <my-popup
            v-if="isPopupOpen"
            class="fixed top-0 right-0 transform -translate-x-1/12 z-50"
            :text="'Неправильный ввод!'"
            :type="'danger'"
            :model-value="isPopupOpen"
            @close="onPopupClose"
          />
        </transition>
      </div>
      <div
        v-if="photosStore.loading"
        class="flex justify-center items-center"
      >
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      </div>
      <my-popup
        v-if="isError"
        class="fixed top-0 right-0 transform -translate-x-1/12 z-50"
        :text="'Ошибка запроса данных'"
        :type="'danger'"
      />
      <div
        ref="scrollContainer"
        class="max-w-[600px] max-h-[600px] overflow-x-hidden overflow-y-auto  border border-border rounded scrollbar dark:scrollbardark"
        v-if="!photosStore.loading"
        @scroll="handleScroll"
      >
        <table
          class="w-full table-fixed text-text bg-panel"
          @scroll="handleScroll"
        >
          <thead>
            <tr class="bg-panel">
              <th
                class="truncate w-14 sticky top-0 bg-panel shadow-[0_-1px_0_0_var(--color-border)_inset] py-1 px-2 z-10"
                scope="col"
              >
                <div class="flex flex-row items-center">
                  <span> ID </span>
                  <my-filter-button
                    :field="'id'"
                    :is-dark="isDark"
                  />
                </div>
              </th>
              <th
                class="truncate w-26 sticky top-0 bg-panel shadow-[0_-1px_0_0_var(--color-border)_inset] py-1 px-2 z-10"
                scope="col"
              >
                <div class="flex flex-row items-center">
                  <span>  Альбом </span>
                  <my-filter-button 
                      :field="'albumId'"
                      :is-dark="isDark"
                    />
                </div>
              </th>
              <th
                class="truncate sticky top-0 bg-panel shadow-[0_-1px_0_0_var(--color-border)_inset] py-1 px-2 z-10"
                scope="col"
              >
               <div class="flex flex-row items-center">
                  <span>  Название </span>
                  <my-filter-button 
                    :field="'title'"
                    :is-dark="isDark"
                  /> 
                </div>
              </th>
              <th
                class="truncate sticky top-0 bg-panel shadow-[0_-1px_0_0_var(--color-border)_inset] py-1 px-2 z-10"
                scope="col"
              >
                Ссылка
              </th>
              <th
                class="truncate sticky top-0 bg-panel shadow-[0_-1px_0_0_var(--color-border)_inset] py-1 px-2 z-10"
                scope="col"
              >
                Миниатюра
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="photo in photosStore.photosOut"
              :key="photo.id"
              class="row text-text-secondary "
            >
              <td
                scope="row"
                class="text-text-secondary border-b border-border rounded px-2 py-1"
              >
                {{ photo.id }}
              </td>
              <td class="border-b border-border rounded px-2 py-1">
                {{ photo.albumId }}
              </td>
              <td
                :title="photo.title"
                class="truncate max-w-[150px] border-b border-border rounded px-2 py-1"
              >
                {{ photo.title }}
              </td>
              <td class="truncate max-w-[150px] border-b border-border rounded px-2 py-1">
                {{ photo.url }}
              </td>
              <td class="truncate max-w-[150px] border-b border-border rounded px-2 py-1">
                {{ photo.thumbnailUrl }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
