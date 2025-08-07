<template>
  <header class="flex items-center justify-between px-6 py-4 shadow-sm" :style="{background: 'var(--color-primary)', color: '#fff'}">
    <div class="font-bold text-lg">Notes App</div>
    <div class="flex items-center gap-4">
      <input
        v-model="searchText"
        class="rounded px-2 py-1 text-black outline-none"
        placeholder="Search notes..."
        @keyup.enter="doSearch"
        @input="doSearch"
        style="min-width: 180px"
      />
      <button
        class="flex items-center gap-2 px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition text-white"
        @click="$emit('open-profile')"
        :title="user ? 'Profile' : 'Sign in'"
      >
        <span class="inline-block w-6 h-6 rounded-full overflow-hidden bg-accent text-white flex items-center justify-center">
          <UserIcon />
        </span>
        <span class="hidden md:inline">{{ user?.email || 'Sign in' }}</span>
      </button>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref } from "vue";
import UserIcon from "./icons/UserIcon.vue";
defineProps({
  user: { type: Object, required: false },
  // on-search is a function(query: string)
});
const emit = defineEmits(['on-search', 'open-profile']);
const searchText = ref("");
const doSearch = () => {
  emit('on-search', searchText.value);
};
</script>
