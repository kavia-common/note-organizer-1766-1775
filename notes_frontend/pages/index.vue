<template>
  <div class="flex flex-col gap-4">
    <!-- Create Note Button -->
    <button @click="showCreate=true" class="bg-accent text-white py-2 px-6 rounded w-max font-semibold hover:bg-accent/90">+ New Note</button>
    <!-- Notes List -->
    <div v-if="notes.length===0" class="text-gray-500 text-center py-10">No notes found.</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="note in notes" :key="note.id" class="rounded border p-4 bg-white shadow-sm flex flex-col hover:shadow-md transition group">
        <div class="flex-1 cursor-pointer" @click="openNote(note)">
          <h3 class="font-bold text-accent text-lg mb-1 truncate">{{note.title}}</h3>
          <div class="text-xs text-gray-400 mb-2">{{formatDate(note.updated_at)}}</div>
          <div class="text-gray-800 mb-1 line-clamp-2" v-html="note.content"></div>
          <div class="mt-2 flex flex-wrap gap-1">
            <span v-for="tag in note.tagsList" :key="tag" class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{{tag}}</span>
          </div>
        </div>
        <div class="flex gap-2 pt-3">
          <button @click.stop="editNote(note)" class="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary/80">Edit</button>
          <button @click.stop="deleteNote(note.id)" class="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400">Delete</button>
        </div>
      </div>
    </div>
    <!-- Edit/Create Note Dialog -->
    <NoteEditDialog v-if="showEdit" :note="editTarget" :tags="tags"
      @saved="onEdited" @close="closeEditDialog"/>
    <NoteEditDialog v-if="showCreate" :tags="tags"
      @saved="onCreated" @close="showCreate=false"/>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import NoteEditDialog from "../components/NoteEditDialog.vue";
const props = defineProps({
  notes: Array,
  tags: Array,
  user: Object,
  activeTag: Object,
});
const notes = ref([]);
const tags = ref([]);
const showEdit = ref(false);
const showCreate = ref(false);
const editTarget = ref(null);
watch(
  () => props.notes,
  (n) => {
    const tagsMap = Object.fromEntries((props.tags || []).map(t=>[t.id, t.name]));
    notes.value = (n || []).map(note => ({
      ...note,
      tagsList: (note.tags||[]).map((id: any) => tagsMap[id] || id)
    }));
  },
  { immediate: true }
);
watch(
  () => props.tags,
  (t) => { tags.value = t || []; },
  { immediate: true }
);
const formatDate = ts => {
  if (!ts) return "";
  const date = new Date(ts);
  return date.toLocaleString();
};
const openNote = (note) => {
  editTarget.value = note;
  showEdit.value = true;
};
const editNote = openNote;
const closeEditDialog = () => {
  showEdit.value = false;
  editTarget.value = null;
};
const onEdited = () => {
  showEdit.value = false;
  editTarget.value = null;
  emit("refresh-notes");
};
const onCreated = () => {
  showCreate.value = false;
  emit("refresh-notes");
};
const deleteNote = async (id) => {
  if (window.confirm("Delete this note?")) {
    const { apiDeleteNote } = await import("../composables/api");
    await apiDeleteNote(id);
    emit("refresh-notes");
  }
};
const emit = defineEmits(["refresh-notes"]);
</script>
