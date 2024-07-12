<template>
  <main
    class="flex h-screen flex-col justify-center items-center flex-1 flex-shrink-0"
  >
    <div class="flex flex-col justify-center text-center px-4">
      <div class="flex justify-center items-center py-6">
        <img src="/logo.svg" alt="hoppscotch-logo" class="w-20" />
      </div>
      <div class="flex flex-col items-center">
        <h1 class="text-2xl text-secondaryDark">Login to Admin Dashboard</h1>
      </div>
      <div class="flex my-6 custom-login">
        <AppLogin />
      </div>
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  layout: empty
</route>

<style scoped>
  /deep/ .custom-login input {
    background-color: white !important;
    border-color: white !important;
    color: black !important; /* Ensuring the text color is black */
  }
</style>
