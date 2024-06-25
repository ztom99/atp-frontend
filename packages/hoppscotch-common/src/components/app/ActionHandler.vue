<template>
  <AppShortcuts :show="showShortcuts" @close="showShortcuts = false" />
  <AppShare :show="showShare" @hide-modal="showShare = false" />
  <FirebaseLogin v-if="showLogin" @hide-modal="showLogin = false" />
  <FirebaseSignup v-if="showSignup" @hide-modal="showSignup = false" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { defineActionHandler } from "~/helpers/actions"

const showShortcuts = ref(false)
const showShare = ref(false)
const showLogin = ref(false)
const showSignup = ref(false)

defineActionHandler("flyouts.keybinds.toggle", () => {
  showShortcuts.value = !showShortcuts.value
})

defineActionHandler("modals.share.toggle", () => {
  showShare.value = !showShare.value
})

defineActionHandler("modals.login.toggle", () => {
  showLogin.value = !showLogin.value
})

defineActionHandler("modals.signup.toggle", () => {
  showSignup.value = !showSignup.value
})
</script>
