<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white shadow rounded-lg p-8 w-[320px] relative">
      <button class="absolute top-3 right-5 text-gray-400 hover:text-black" @click="$emit('close')">✕</button>
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 rounded-full overflow-hidden bg-accent flex items-center justify-center mb-3">
          <UserIcon class="text-white text-3xl" />
        </div>
        <div class="text-lg font-semibold mb-2">{{user?.email}}</div>
        <div class="text-xs text-gray-500 mb-3">Account</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import UserIcon from "./icons/UserIcon.vue";
defineProps({ user: { type: Object } });
</script>
