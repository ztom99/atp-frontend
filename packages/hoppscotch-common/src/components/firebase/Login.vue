<template>
  <HoppSmartModal
    dialog
    :title="`${t('auth.login_to_hoppscotch')}`"
    styles="sm:max-w-md"
    @close="hideModal"
  >
    <template #body>
      <form class="flex flex-col space-y-2" @submit.prevent="handleLogin">
        <HoppSmartInput
          v-model="form.email"
          type="email"
          placeholder=" "
          :label="t('auth.email')"
          input-styles="floating-input"
          :autofocus="false"
        />
        <HoppSmartInput
          v-model="form.password"
          type="password"
          placeholder=" "
          :label="t('auth.password')"
          input-styles="floating-input"
          :autofocus="false"
        />
        <HoppButtonPrimary
          :loading="loggingIn"
          type="submit"
          :label="`${t('auth.login')}`"
        />
      </form>
    </template>
  </HoppSmartModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useI18n } from "@composables/i18n"
import { useStreamSubscriber } from "@composables/stream"
import { useToast } from "@composables/toast"
import { platform } from "~/platform"
import { Encrypt } from "~/helpers/utils/encryption"

const emit = defineEmits<{
  (e: "hide-modal"): void
}>()

const { subscribeToStream } = useStreamSubscriber()
const t = useI18n()
const toast = useToast()
const form = {
  email: "",
  password: "",
}
const loggingIn = ref(false)

const isValidEmail = (email: string) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  return emailRegex.test(email)
}

const handleLogin = async () => {
  if (!isValidEmail(form.email)) {
    toast.error(t("error.invalid_email_format"))
    return
  }
  loggingIn.value = true
  try {
    await platform.auth.login(form.email, Encrypt(form.password))
    hideModal()
  } catch (e) {
    toast.error(e.message)
  } finally {
    loggingIn.value = false
  }
}

const hideModal = () => {
  toast.clear()
  emit("hide-modal")
}

onMounted(async () => {
  const currentUser$ = platform.auth.getCurrentUserStream()
  subscribeToStream(currentUser$, (user) => {
    if (user) hideModal()
  })
})
</script>
