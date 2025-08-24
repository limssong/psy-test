<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-body p-5 text-center">
            <h1 class="display-4 mb-4">테스트 결과</h1>
            
            <div class="result-content mb-5">
              <div class="score-box mb-4" :class="resultType">
                <h2 class="mb-3">{{ resultTitle }}</h2>
                <div class="score-percentage mb-3">
                  {{ tetoScore }}% 테토 / {{ egenScore }}% 에겐
                </div>
                <p class="lead">{{ resultDescription }}</p>
              </div>
              
              <div class="result-image mb-4">
                <img 
                  :src="resultImage" 
                  :alt="resultTitle"
                  class="img-fluid"
                  style="max-width: 300px;"
                >
              </div>
            </div>
            
            <div class="action-buttons">
              <button @click="restartTest" class="btn btn-primary btn-lg me-3">
                다시 테스트하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const scores = useState('scores', () => ({}))

// 점수 계산 (현재 JSON 구조에 맞게 수정)
const tetoScore = computed(() => {
  let tetoTotal = 0
  let egenTotal = 0
  
  // 첫 번째 질문(성별)은 제외하고 2-10번 질문의 점수만 계산
  Object.entries(scores.value).forEach(([questionId, answer]) => {
    if (parseInt(questionId) > 1 && answer && answer.score && answer.score.teto !== undefined) {
      tetoTotal += answer.score.teto
      egenTotal += answer.score.egen
    }
  })
  
  const total = tetoTotal + egenTotal
  return total > 0 ? Math.round((tetoTotal / total) * 100) : 50
})

const egenScore = computed(() => 100 - tetoScore.value)

// 성별 확인 (첫 번째 질문에서)
const gender = computed(() => {
  const firstAnswer = scores.value[1]
  
  if (firstAnswer && firstAnswer.type === 'male') return 'male'
  if (firstAnswer && firstAnswer.type === 'female') return 'female'
  return null
})

// 결과 타입 결정 (성별 + 테토/에겐 조합, 70% 기준)
const resultType = computed(() => {
  if (!gender.value) return 'unknown'

  
  if (gender.value === 'male') {
    if (tetoScore.value >= 70) return 'teto-male'
    else if (egenScore.value >= 70) return 'egen-male'
    else return 'mid-male'
  } else {
    if (tetoScore.value >= 70) return 'teto-female'
    else if (egenScore.value >= 70) return 'egen-female'
    else return 'mid-female'
  }
})

// 결과 정보
const resultTitle = computed(() => {
  switch (resultType.value) {
    case 'teto-male': return '테토남'
    case 'egen-male': return '에겐남'
    case 'mid-male': return '균형남'
    case 'teto-female': return '테토녀'
    case 'egen-female': return '에겐녀'
    case 'mid-female': return '균형녀'
    default: return '결과를 확인할 수 없습니다'
  }
})

const resultDescription = computed(() => {
  switch (resultType.value) {
    case 'teto-male': 
      return '당신은 체계적이고 계획적인 남성입니다. 논리적 사고와 체계적인 접근을 선호하며, 안정성과 일관성을 중요하게 여깁니다. 리더십이 강하고 목표 지향적인 성향을 가지고 있습니다.'
    case 'egen-male': 
      return '당신은 창의적이고 자유로운 남성입니다. 새로운 아이디어와 혁신적인 접근을 선호하며, 유연성과 변화를 중요하게 여깁니다. 예술적 감각과 직관이 뛰어납니다.'
    case 'mid-male': 
      return '당신은 균형잡힌 남성입니다. 체계적이면서도 창의적이며, 상황에 따라 적절한 접근 방식을 선택할 수 있습니다. 테토와 에겐의 장점을 모두 가지고 있어 다양한 환경에서 잘 적응합니다.'
    case 'teto-female': 
      return '당신은 체계적이고 계획적인 여성입니다. 논리적 사고와 체계적인 접근을 선호하며, 안정성과 일관성을 중요하게 여깁니다. 꼼꼼하고 책임감이 강합니다.'
    case 'egen-female': 
      return '당신은 창의적이고 자유로운 여성입니다. 새로운 아이디어와 혁신적인 접근을 선호하며, 유연성과 변화를 중요하게 여깁니다. 감성적이고 공감 능력이 뛰어납니다.'
    case 'mid-female': 
      return '당신은 균형잡힌 여성입니다. 체계적이면서도 창의적이며, 상황에 따라 적절한 접근 방식을 선택할 수 있습니다. 테토와 에겐의 장점을 모두 가지고 있어 다양한 환경에서 잘 적응합니다.'
    default: 
      return '결과를 확인할 수 없습니다. 테스트를 다시 진행해주세요.'
  }
})

const resultImage = computed(() => {
  // Nuxt runtimeConfig를 사용하여 baseURL 가져오기
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL || ''
  
  // 랜덤 이미지 선택 함수
  const getRandomImage = (basePath, count) => {
    const randomIndex = Math.floor(Math.random() * count) + 1
    return `${baseURL}${basePath}${randomIndex}.png`
  }
  
  switch (resultType.value) {
    case 'teto-male': 
      return getRandomImage('/images/man-teto', 2) // man-teto1.png 또는 man-teto2.png
    case 'egen-male': 
      return getRandomImage('/images/man-egen', 2) // man-egen1.png 또는 man-egen2.png
    case 'mid-male': 
      return getRandomImage('/images/man-mid', 2) // man-mid1.png 또는 man-mid2.png
    case 'teto-female': 
      return getRandomImage('/images/woman-teto', 3) // woman-teto1.png, woman-teto2.png, woman-teto3.png 중 하나
    case 'egen-female': 
      return getRandomImage('/images/woman-egen', 3) // woman-egen1.png, woman-egen2.png, woman-egen3.png 중 하나
    case 'mid-female': 
      return getRandomImage('/images/woman-mid', 4) // woman-mid1.png, woman-mid2.png, woman-mid3.png, woman-mid4.png 중 하나
    default: 
      return `${baseURL}/images/man-mid1.png`
  }
})

// 중간값일 때의 이미지도 랜덤하게 선택
const midImage = computed(() => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL || ''
  
  if (resultType.value === 'teto-male' || resultType.value === 'egen-male') {
    // 남자 중간값
    const randomIndex = Math.floor(Math.random() * 2) + 1
    return `${baseURL}/images/man-mid${randomIndex}.png`
  } else if (resultType.value === 'teto-female' || resultType.value === 'egen-female') {
    // 여자 중간값
    const randomIndex = Math.floor(Math.random() * 4) + 1
    return `${baseURL}/images/woman-mid${randomIndex}.png`
  }
  return `${baseURL}/images/man-mid1.png`
})

// 다시 테스트하기
const restartTest = () => {
  // 점수 초기화
  scores.value = {}
  router.push('/question/1')
}

// 홈으로 돌아가기
const goHome = () => {
  // 점수 초기화
  scores.value = {}
  router.push('/')
}

useHead({
  title: '테스트 결과 - 심리테스트',
  meta: [
    { name: 'description', content: '심리테스트 결과를 확인하세요' }
  ]
})
</script>

<style scoped>
.score-box {
  padding: 30px;
  border-radius: 15px;
  border: 3px solid;
}

.score-box.teto-male {
  background-color: #e3f2fd;
  border-color: #2196f3;
}

.score-box.egen-male {
  background-color: #f3e5f5;
  border-color: #9c27b0;
}

.score-box.mid-male {
  background-color: #e8f5e8;
  border-color: #4caf50;
}

.score-box.teto-female {
  background-color: #fce4ec;
  border-color: #e91e63;
}

.score-box.egen-female {
  background-color: #fff3e0;
  border-color: #ff9800;
}

.score-box.mid-female {
  background-color: #f1f8e9;
  border-color: #8bc34a;
}

.score-box.unknown {
  background-color: #f5f5f5;
  border-color: #9e9e9e;
}

.score-percentage {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

.result-image img {
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.action-buttons .btn {
  padding: 12px 30px;
  font-size: 1.1rem;
}
</style>
