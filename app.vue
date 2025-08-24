<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup>
// Bootstrap JavaScript 초기화
onMounted(() => {
  if (typeof window !== 'undefined') {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }
})
</script>
