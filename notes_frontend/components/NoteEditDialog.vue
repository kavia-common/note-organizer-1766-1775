<template>
  <div class="fixed inset-0 bg-black/30 z-30 flex items-center justify-center">
    <div class="bg-white rounded shadow-lg p-8 w-[420px] relative">
      <button class="absolute top-3 right-5 text-gray-400 hover:text-black" @click="$emit('close')">✕</button>
      <h2 class="font-bold text-lg mb-4 text-accent">
        {{ noteInternal.id ? "Edit Note" : "New Note" }}
      </h2>
      <form @submit.prevent="onSave">
        <input v-model="noteInternal.title" required maxlength="60" class="input mb-2" placeholder="Title"/>
        <textarea v-model="noteInternal.content" rows="5" class="input mb-2" placeholder="Write your note here..." required />
        <div>
          <label class="block mb-1 text-xs font-semibold text-primary">Tags:</label>
          <div class="flex gap-2 flex-wrap">
            <span v-for="tag in tags" :key="tag.id"
              :class="['px-2 py-1 rounded border cursor-pointer', noteInternal.tags?.includes(tag.id) ? 'bg-accent/20 text-accent border-accent' : 'hover:bg-gray-50']"
              @click="toggleTag(tag.id)">
              #{{ tag.name }}
            </span>
            <button @click.prevent.stop="showTagInput=true" class="text-primary underline text-xs">+ New</button>
          </div>
          <div v-if="showTagInput" class="flex mt-2 gap-2">
            <input v-model="newTagName" class="input flex-1" placeholder="New tag name..." />
            <button @click.prevent="createTag" class="px-3 py-1 bg-secondary text-white rounded">Add</button>
          </div>
        </div>
        <button type="submit" class="mt-6 w-full bg-primary text-white font-bold rounded p-2">{{ noteInternal.id ? "Save Note" : "Create Note" }}</button>
      </form>
      <div v-if="error" class="text-xs text-red-500 mt-2 text-center">{{error}}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { apiCreateNote, apiUpdateNote, apiCreateTag } from "../composables/api";
const props = defineProps({
  note: Object,
  tags: Array
});
const emit = defineEmits(["saved", "close"]);
const noteInternal = ref({
  title: "",
  content: "",
  tags: [],
  ...(props.note || {})
});
const error = ref("");
const showTagInput = ref(false);
const newTagName = ref("");
// Tag toggling
const toggleTag = (tagId) => {
  let arr = noteInternal.value.tags || [];
  if (arr.includes(tagId))
    arr = arr.filter(id => id !== tagId);
  else
    arr = [...arr, tagId];
  noteInternal.value.tags = arr;
};
const createTag = async () => {
  if (!newTagName.value.trim()) return;
  try {
    const tag = await apiCreateTag(newTagName.value.trim());
    noteInternal.value.tags.push(tag.id);
    emit("saved");
    showTagInput.value = false;
    newTagName.value = "";
  } catch {
    error.value = "Failed to add tag.";
  }
};
// Save logic
const onSave = async () => {
  error.value = "";
  try {
    if (noteInternal.value.id)
      await apiUpdateNote(noteInternal.value);
    else
      await apiCreateNote(noteInternal.value);
    emit("saved");
  } catch (e) {
    error.value = "Could not save the note";
  }
};
onMounted(() => {
  if (props.note) {
    noteInternal.value = {
      title: props.note.title,
      content: props.note.content,
      tags: [...(props.note.tags||[])],
      id: props.note.id,
    };
  }
});
</script>
<style scoped>
.input {
  width: 100%;
  padding: 9px;
  border-radius: 5px;
  border: 1px solid #e5e7eb;
  outline: none;
  transition: border .15s;
}
.input:focus {
  border: 1.5px solid #4F46E5;
}
</style>
