<template>
  <aside class="h-full flex flex-col p-3">
    <div class="flex items-center gap-3 mb-5">
      <LogoIcon class="w-8 h-8 text-primary"/>
      <span class="font-bold text-lg text-primary hidden md:inline">Notes</span>
    </div>
    <nav class="flex-1 flex flex-col gap-2">
      <div>
        <h3 class="mb-2 text-accent text-xs font-semibold">Tags</h3>
        <ul>
          <li
            v-for="tag in tags"
            :key="tag.id"
            :class="['tag-item px-2 py-1 rounded cursor-pointer', activeTag && activeTag.id === tag.id ? 'bg-accent/20 text-accent font-bold' : 'hover:bg-gray-100']"
            @click="$emit('select-tag', tag)"
          >
            #{{ tag.name }}
          </li>
          <li
            :class="['tag-item px-2 py-1 rounded cursor-pointer', !activeTag ? 'bg-primary text-white font-bold' : 'hover:bg-primary/20']"
            @click="$emit('select-tag', null)"
          >
            All Notes
          </li>
        </ul>
      </div>
      <div class="mt-6">
        <button
          v-if="user"
          @click="$emit('logout')"
          class="w-full py-2 rounded bg-secondary text-white hover:bg-secondary/70"
        >
          Logout
        </button>
      </div>
    </nav>
    <div class="flex items-center mt-auto pt-3 border-t border-gray-100 gap-2 text-xs text-gray-500">
      <UserIcon class="w-5 h-5 text-accent"/>
      <span>{{ user?.email || "Not logged in" }}</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import LogoIcon from "./icons/LogoIcon.vue";
import UserIcon from "./icons/UserIcon.vue";
defineProps({
  tags: { type: Array, required: true },
  activeTag: { type: Object, required: false },
  user: { type: Object, required: false }
});
</script>

<style scoped>
.tag-item {
  transition: all 0.12s;
}
</style>
