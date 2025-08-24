<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-body p-5">
            <!-- 로딩 상태 -->
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">로딩 중...</span>
              </div>
              <p class="mt-3">질문을 불러오는 중...</p>
            </div>
            
            <!-- 질문 내용 -->
            <div v-else-if="currentQuestion">
              <!-- 진행률 표시 -->
              <div class="progress mb-4" style="height: 10px;">
                <div 
                  class="progress-bar" 
                  :style="{ width: progress + '%' }"
                  role="progressbar"
                ></div>
              </div>
              <div class="text-center mb-3">
                <small class="text-muted">질문 {{ questionId }} / 10</small>
              </div>
              
              <h2 class="text-center mb-4">{{ currentQuestion.question }}</h2>
              
              <!-- 선택지 -->
              <div class="options-container">
                <div 
                  v-for="option in currentQuestion.options" 
                  :key="option.id"
                  class="option-item mb-3"
                >
                  <button 
                    @click="selectOption(option)"
                    class="btn btn-outline-primary w-100 text-start p-3"
                    :class="{ 'btn-primary': selectedOption === option.score }"
                  >
                    {{ option.text }}
                  </button>
                </div>
              </div>
              
              <!-- 네비게이션 버튼 -->
              <div class="d-flex justify-content-between mt-4">
                <button 
                  v-if="questionId > 1" 
                  @click="previousQuestion"
                  class="btn btn-secondary"
                >
                  이전
                </button>
                <div></div>
              </div>
            </div>
            
            <!-- 오류 상태 -->
            <div v-else class="text-center">
              <p class="text-danger">질문을 불러올 수 없습니다.</p>
              <button @click="goHome" class="btn btn-primary">홈으로 돌아가기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const questionId = parseInt(route.params.id)
const selectedOption = ref(null)
const loading = ref(true)

// 질문 데이터
const questions = ref([])

// JSON 파일에서 질문 데이터 불러오기
onMounted(async () => {
  try {
    loading.value = true
    
    // Nuxt runtimeConfig를 사용하여 baseURL 가져오기
    const config = useRuntimeConfig()
    const baseURL = config.public.baseURL || ''
    const questionsPath = `${baseURL}/questions.json`
    
    console.log('Loading questions from:', questionsPath)
    
    const response = await fetch(questionsPath)
    if (!response.ok) {
      throw new Error(`질문 데이터를 불러올 수 없습니다. (${response.status}: ${response.statusText})`)
    }
    questions.value = await response.json()
    
    // 유효한 질문 ID인지 확인 (1-10번 질문)
    if (questionId < 1 || questionId > 10) {
      router.push('/')
      return
    }
  } catch (error) {
    console.error('질문 데이터를 불러오는데 실패했습니다:', error)
  } finally {
    loading.value = false
  }
})

const currentQuestion = computed(() => {
  if (!questions.value.length) return null
  return questions.value.find(q => q.id === questionId)
})

const progress = computed(() => {
  if (!questions.value.length) return 0
  return (questionId / questions.value.length) * 100
})

// 선택지 선택
const selectOption = (option) => {
  selectedOption.value = option.score
  
  // 점수 저장 (현재 JSON 구조에 맞게 수정)
  if (!scores.value) scores.value = {}
  scores.value[questionId] = option // option 객체 전체를 저장
  
  // 첫 번째 질문(성별)은 다음 질문으로 이동
  if (questionId === 1) {
    setTimeout(() => {
      router.push(`/question/${questionId + 1}`)
    }, 800)
    return
  }
  
  // 2-10번 질문은 score 객체를 그대로 저장
  if (questionId >= 2 && questionId <= 10) {
    setTimeout(() => {
      if (questionId < 10) {
        // 다음 질문으로 이동
        router.push(`/question/${questionId + 1}`)
      } else {
        // 마지막 질문이면 결과 페이지로 이동
        router.push('/result')
      }
    }, 800)
    return
  }
}

// 이전 질문
const previousQuestion = () => {
  if (questionId > 1) {
    router.push(`/question/${questionId - 1}`)
    selectedOption.value = scores.value?.[questionId - 1] || null
  }
}

// 홈으로 돌아가기
const goHome = () => {
  router.push('/')
}

// 점수 상태 관리
const scores = useState('scores', () => ({}))

// 페이지 이동 시 점수 복원
onMounted(() => {
  if (scores.value[questionId]) {
    selectedOption.value = scores.value[questionId]
  }
})
</script>

<style scoped>
.option-item button {
  border-radius: 10px;
  transition: all 0.3s ease;
}

.option-item button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.progress {
  border-radius: 10px;
}

.progress-bar {
  background: linear-gradient(90deg, #007bff, #28a745);
}
</style>