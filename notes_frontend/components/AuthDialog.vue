<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white rounded shadow p-8 w-[340px]">
      <h2 v-if="mode==='login'" class="text-xl font-bold mb-2 text-primary">Sign In</h2>
      <h2 v-else class="text-xl font-bold mb-2 text-primary">Register</h2>
      <form @submit.prevent="onSubmit">
        <input v-model="email" class="input mb-2" placeholder="Email" type="email" required />
        <input v-model="password" class="input mb-3" placeholder="Password" type="password" required minlength="6"/>
        <button type="submit" class="w-full bg-accent text-white font-bold rounded p-2 mb-2">
          {{ mode==='login' ? 'Login' : 'Register' }}
        </button>
      </form>
      <div class="text-xs text-gray-700 text-center mt-3">
        <span v-if="mode==='login'">
          No account?
          <a href="#" @click.prevent="mode='register'" class="text-primary underline">Register</a>
        </span>
        <span v-else>
          Already have an account?
          <a href="#" @click.prevent="mode='login'" class="text-primary underline">Sign in</a>
        </span>
      </div>
      <div v-if="error" class="text-xs text-red-500 mt-2 text-center">{{error}}</div>
      <button class="absolute top-3 right-5 text-gray-400 hover:text-black" @click="$emit('close')">✕</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { apiLogin, apiRegister } from "../composables/api";
const emit = defineEmits(["signed-in", "close"]);
const mode = ref("login");
const email = ref("");
const password = ref("");
const error = ref("");

const onSubmit = async () => {
  error.value = "";
  try {
    const user = mode.value === "login"
      ? await apiLogin(email.value, password.value)
      : await apiRegister(email.value, password.value);
    if (user) emit("signed-in", user);
    else error.value = "Invalid credentials.";
  } catch (e: any) {
    error.value = e?.message || "Auth failed";
  }
};
</script>
<style scoped>
.input {
  width: 100%;
  padding: 9px;
  margin-bottom: 4px;
  border-radius: 5px;
  border: 1px solid #e5e7eb;
  outline: none;
  transition: border .15s;
}
.input:focus {
  border: 1.5px solid #10B981;
}
</style>
