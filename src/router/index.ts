import { createRouter, createWebHistory } from 'vue-router'
import SelectCourseView from '@/views/SelectCourseView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'course',
      component: SelectCourseView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/course/:courseId',
      name: 'subject',
      component: () => import('@/views/SelectSubjectView.vue')
    },
    {
      path: '/course/:courseId/subject/:subjectId',
      name: 'professor',
      component: () => import('@/views/SelectProfessorView.vue')
    },
    {
      path: '/course/:courseId/subject/:subjectId/professor/:professorId',
      name: 'variant',
      component: () => import('@/views/SelectVariantView.vue')
    },
    {
      path: '/course/:courseId/subject/:subjectId/professor/:professorId/variant/:variantId',
      name: 'document',
      component: () => import('@/views/SelectDocumentView.vue')
    }
  ]
})

export default router
