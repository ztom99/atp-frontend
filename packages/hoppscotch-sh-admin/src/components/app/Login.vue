<template>
  <div v-if="nonAdminUser" class="text-center">
    {{ t('state.non_admin_logged_in') }}
    <span @click="logout()" class="text-red-500 cursor-pointer underline">{{
      t('state.sign_out')
    }}</span>
    {{ t('state.login_as_admin') }}
  </div>

  <div v-else-if="fetching" class="flex justify-center py-6">
    <HoppSmartSpinner />
  </div>

  <div v-else-if="error">
    <p class="text-xl">{{ t('state.error') }}</p>
  </div>

  <div v-else class="flex flex-1 flex-col">
    <div
      class="p-6 bg-primaryLight rounded-lg border border-primaryDark shadow"
    >
      <form
        class="flex flex-col space-y-4"
        @submit.prevent="handleLogin"
      >
        <HoppSmartInput
          v-model="form.email"
          type="email"
          placeholder=" "
          input-styles="floating-input"
          label="Email"
          :autofocus="false"
        />
        <HoppSmartInput
          v-model="form.password"
          type="password"
          placeholder=" "
          label="Password"
          input-styles="floating-input"
          :autofocus="false"
        />
        <HoppButtonPrimary
          :loading="loggingIn"
          type="submit"
          label="Login"
          class="btn-green"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from '~/composables/i18n';
import { useToast } from '~/composables/toast';
import { auth } from '~/helpers/auth';
import {Encrypt} from "@hoppscotch/common/helpers/utils/encryption";

const t = useI18n();
const toast = useToast();
const loggingIn = ref(false)
const form = {
  email: "",
  password: "",
}
const fetching = ref(false);
const error = ref(false);
const nonAdminUser = ref(false);

onMounted(async () => {
  const user = auth.getCurrentUser();
  if (user && !user.isAdmin) {
    nonAdminUser.value = true;
  }
});

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
    await auth.login(form.email, Encrypt(form.password))
  } catch (e) {
    toast.error(e.message)
  } finally {
    loggingIn.value = false
  }
}

const logout = async () => {
  try {
    await auth.signOutUser();
    window.location.reload();
    toast.success(t('state.logged_out'));
  } catch (e) {
    console.error(e);
    toast.error(t('state.error'));
  }
};
</script>

<style scoped>
.btn-green {
  background-color: green;
  color: white;
}
</style>
