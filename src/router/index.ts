import { createRouter, createWebHistory } from 'vue-router'
import EmployeeIndexView from '../views/EmployeeIndexView.vue'
import EmployeeCreateView from '../views/EmployeeCreateView.vue'
import EmployeeDetailsView from '../views/EmployeeDetailsView.vue'
import EmployeeEditView from '../views/EmployeeEditView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'employees',
      component: EmployeeIndexView,
      meta: { title: 'Employees' },
    },
    {
      path: '/employees/new',
      name: 'employee-create',
      component: EmployeeCreateView,
      meta: { title: 'Create employee' },
    },
    {
      path: '/employees/:id',
      name: 'employee-details',
      component: EmployeeDetailsView,
      meta: { title: 'Employee details' },
    },
    {
      path: '/employees/:id/edit',
      name: 'employee-edit',
      component: EmployeeEditView,
      meta: { title: 'Edit employee' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: 'Page not found' },
    },
  ],
  // Back to top
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title ?? 'N/A')} | Purple Cross`
})

export default router