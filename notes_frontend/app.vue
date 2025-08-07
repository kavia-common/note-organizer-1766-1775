<template>
  <div class="app-container flex h-screen bg-gray-50 font-sans text-gray-900">
    <Sidebar
      :tags="tags"
      :active-tag="activeTag"
      @select-tag="onSelectTag"
      @logout="logout"
      :user="user"
      class="sidebar"
    />
    <div class="flex flex-col flex-1 min-w-0">
      <Header
        :on-search="onSearch"
        :user="user"
        @open-profile="showProfile = true"
        class="header"
      />
      <main class="flex-1 w-full overflow-y-auto p-4">
        <NuxtPage
          :key="$route.fullPath"
          :user="user"
          :notes="filteredNotes"
          :tags="tags"
          :active-tag="activeTag"
          @refresh-notes="fetchAllNotes"
          @refresh-tags="fetchAllTags"
        />
      </main>
    </div>
    <!-- User Profile Dialog -->
    <ProfileDialog v-if="showProfile" :user="user" @close="showProfile = false" />
    <!-- Auth modal (login/register) -->
    <AuthDialog
      v-if="!user && showAuth"
      @signed-in="onSignedIn"
      @close="showAuth = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";
import AuthDialog from "./components/AuthDialog.vue";
import ProfileDialog from "./components/ProfileDialog.vue";
import { apiLogout, apiGetMe, apiGetNotes, apiGetTags } from "./composables/api";

const router = useRouter();

const user = ref(null);
const tags = ref([]);
const notes = ref([]);
const filteredNotes = ref([]);
const activeTag = ref(null);
const showAuth = ref(false);
const showProfile = ref(false);

const onSignedIn = async (u) => {
  user.value = u;
  showAuth.value = false;
  await fetchAllNotes();
  await fetchAllTags();
};
const logout = async () => {
  await apiLogout();
  user.value = null;
  router.push("/");
  showAuth.value = true;
};

const onSelectTag = (tag) => {
  activeTag.value = tag;
  filterNotes();
};
const onSearch = (query) => {
  filterNotes(query);
};

async function fetchAllNotes() {
  if (!user.value) return;
  notes.value = await apiGetNotes();
  filterNotes();
}
async function fetchAllTags() {
  if (!user.value) return;
  tags.value = await apiGetTags();
}

function filterNotes(searchQuery: string = "") {
  let _notes = notes.value || [];
  if (activeTag.value) {
    _notes = _notes.filter((note) => note.tags?.includes(activeTag.value.id));
  }
  if (searchQuery) {
    _notes = _notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  filteredNotes.value = _notes;
}

onMounted(async () => {
  const currentUser = await apiGetMe();
  if (!currentUser) {
    showAuth.value = true;
    return;
  }
  user.value = currentUser;
  await fetchAllTags();
  await fetchAllNotes();
});
</script>

<style scoped>
.app-container {
  --color-accent: #10B981;
  --color-primary: #4F46E5;
  --color-secondary: #F59E42;
  background: #f9fafb;
}
.sidebar {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
}
.header {
  background: var(--color-primary);
}
@media (max-width: 900px) {
  .sidebar {
    width: 70px;
    min-width: 70px;
  }
}
</style>
