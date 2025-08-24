// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // GitHub Pages 배포를 위한 설정
  ssr: false,
  compatibilityDate: '2025-08-24',
  
  css: [
    'bootstrap/dist/css/bootstrap.min.css'
  ],
  
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/psy-test/' : '/',
    head: {
      title: '심리테스트 - 당신의 성향을 알아보세요',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '심리테스트로 당신의 성향을 알아보세요' }
      ]
    }
  },
  
  nitro: {
    static: true
  },
  
  vite: {
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
    build: {
      rollupOptions: {
        external: ['@oxc-parser/binding-linux-x64-gnu']
      }
    }
  },
  
  experimental: {
    payloadExtraction: false
  }
})
