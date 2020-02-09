import Home from '$comp/home'
import Category from '$cont/category'
import Product from '$cont/product'
import ProductForm from '$cont/product/product-form'
import Role from '$cont/role'
import User from '$cont/user'

const routes = [
  {
    path:'/',
    component: Home,
    exact:true
  },
  {
    path:'/category',
    component: Category,
    exact:true
  },
  {
    path: '/product',
    component: Product,
    exact: true
  },
  {
    path: '/product/add',
    component: ProductForm,
    exact: true
  },
  {
    path: '/product/update/:id',
    component: ProductForm,
    exact: true
  },
  {
    path: '/role',
    component: Role,
    exact: true
  },
  {
    path: '/user',
    component: User,
    exact: true
  }
]
export default routes