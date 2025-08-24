<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <h1 class="display-4 mb-4">심리테스트</h1>
        <p class="lead mb-5">당신의 성향을 알아보세요!</p>
        
        <div class="card shadow">
          <div class="card-body p-5">
            <h3 class="mb-4">테스트 시작하기</h3>
            <p class="mb-4">간단한 질문에 답하고 당신의 성향을 알아보세요.</p>
            
            <NuxtLink to="/question/1" class="btn btn-primary btn-lg">
              테스트 시작
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: '심리테스트 - 당신의 성향을 알아보세요',
  meta: [
    { name: 'description', content: '심리테스트로 당신의 성향을 알아보세요' }
  ]
})
</script>

<style scoped>
.card {
  border: none;
  border-radius: 15px;
}

.btn-lg {
  padding: 12px 30px;
  font-size: 1.1rem;
}
</style>
