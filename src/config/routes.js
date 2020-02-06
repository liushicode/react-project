import Home from '$comp/home'
import Category from '$cont/category'
import Product from '$cont/product'
import AddProduct from '$cont/product/add-product'

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
    component: AddProduct,
    exact: true
  }
]
export default routes