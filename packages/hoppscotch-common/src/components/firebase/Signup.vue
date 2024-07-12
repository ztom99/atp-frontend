<template>
  <HoppSmartModal
    dialog
    :title="`${t('auth.sign_up_atp')}`"
    styles="sm:max-w-md"
    @close="hideModal"
  >
    <template #body>
      <form
        class="flex flex-col space-y-2"
        @submit.prevent="signInWithEmail"
      >
        <HoppSmartInput
          v-model="form.email"
          type="email"
          placeholder=""
          :label="t('auth.email')"
          input-styles="floating-input"
          :autofocus="false"
        />
        <HoppSmartInput
          v-model="form.password"
          placeholder=" "
          type="password"
          :label="t('auth.password')"
          input-styles="floating-input"
          :autofocus="false"
        />
        <HoppSmartInput
          v-model="form.confirmPassword"
          placeholder=" "
          type="password"
          :label="t('auth.confirmPassword')"
          input-styles="floating-input"
          :autofocus="false"
        />
        <p class="text-tiny text-secondaryLight">
          the password must be 6-12 characters long, including numbers and letters
        </p>
        <HoppButtonPrimary
          :loading="signingInWithEmail"
          type="submit"
          :label="`${t('auth.send_magic_link')}`"
        />
      </form>
      <div v-if="mode === 'email-sent'" class="flex flex-col px-4">
        <div class="flex max-w-md flex-col items-center justify-center">
          <icon-lucide-inbox class="h-6 w-6 text-accent" />
          <h3 class="my-2 text-center text-lg">
            {{ t("auth.we_sent_magic_link") }}
          </h3>
          <p class="text-center">
            {{
              t("auth.we_sent_magic_link_description", { email: form.email })
            }}
          </p>
        </div>
      </div>
    </template>
  </HoppSmartModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useI18n } from "@composables/i18n"
import { useStreamSubscriber } from "@composables/stream"
import { useToast } from "@composables/toast"
import { platform } from "~/platform"
import { useService } from "dioc/vue"
import { PersistenceService } from "~/services/persistence"
import { Encrypt } from "~/helpers/utils/encryption"

const emit = defineEmits<{
  (e: "hide-modal"): void
}>()

const { subscribeToStream } = useStreamSubscriber()
const t = useI18n()
const toast = useToast()

const persistenceService = useService(PersistenceService)

const form = {
  email: "",
  password: "",
  confirmPassword: "",
}

const signingInWithEmail = ref(false)
const mode = ref("sign-in")

onMounted(async () => {
  const currentUser$ = platform.auth.getCurrentUserStream()

  subscribeToStream(currentUser$, (user) => {
    if (user) hideModal()
  })
})

const isValidEmail = (email: string) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  return emailRegex.test(email)
}
const validatePassword = (password: string) => {
  // 简单的密码验证逻辑，密码为6-12个字符，包含数字和字母
  const lengthRequirement = password.length >= 6 && password.length <= 12
  const letterAndNumberRequirement = /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
  return lengthRequirement && letterAndNumberRequirement
}
const signInWithEmail = async () => {
  if (!isValidEmail(form.email)) {
    toast.error(`${t('error.invalid_email_format')}`)
    return
  }
  if (!validatePassword(form.password)){
    toast.error('Password is invalid, Please re-enter')
    return
  }
  if (form.password !== form.confirmPassword) {
    toast.error('Password is different, Please re-enter')
    return
  }

  signingInWithEmail.value = true
  await platform.auth
    .signup(form.email, Encrypt(form.password),  Encrypt(form.confirmPassword))
    .then(() => {
      mode.value = "email-sent"
      persistenceService.setLocalConfig("emailForSignIn", form.email)
    })
    .catch((e) => {
      // console.error(e)
      toast.error(e.message)
      signingInWithEmail.value = false
    })
    .finally(() => {
      signingInWithEmail.value = false
    })
}

const hideModal = () => {
  mode.value = "sign-in"
  toast.clear()

  emit("hide-modal")
}
</script>
