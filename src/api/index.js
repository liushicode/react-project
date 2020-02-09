
import axiosInstance from './request'
export const reqLogin = (username,password) => {
  return axiosInstance({
    url: '/login',
    method:'POST',
    data: {
      username,
      password
    }
  })
}
export const reqGetCategoryList = () => {
  return axiosInstance({
    url: '/category/get',
    method:'GET'
  })
}

export const reqAddCategory = (categoryName) => {
  return axiosInstance({
    url: '/category/add',
    method: 'POST',
    data: {
      categoryName
    }
  })
}

export const reqUpdateCategory = (categoryId,categoryName) => {
  return axiosInstance({
    url: '/category/update',
    method: 'POST',
    data: {
      categoryId,
      categoryName
    }
  })
}

export const reqDeleteCategory = (categoryId) => {
  return axiosInstance({
    url: '/category/delete',
    method: 'POST',
    data: {
      categoryId,
    }
  })
}
//请求商品列表
export const reqGetProductList = (pageNum,pageSize) => {
  return axiosInstance({
    url: '/product/list',
    method: 'GET',
    params: {
      pageNum,
      pageSize
    }
  })
}
// 请求获取单个商品数据
export const reqGetProduct = productId => {
  return axiosInstance({
    method: 'GET',
    url: '/product/get',
    params: {
      productId
    }
  });
};
//添加商品功能
export const reqAddProduct = ({categoryId,name,price,desc,datail}) => {
  return axiosInstance({
    url: '/product/add',
    method: 'POST',
    data: {
      categoryId, name, price, desc, datail
    }
  })
}
//修改商品功能
export const reqUpdateProduct = ({ name, desc, price, detail, categoryId, productId }) => {
  return axiosInstance({
    url: '/product/update',
    method: 'POST',
    data: {
      name,
      desc,
      price,
      detail,
      categoryId,
      productId
    }
  });
};
//搜索商品
export const reqSearchProduct = ({pageNum, pageSize,searchType,searchValue}) => {
  return axiosInstance({
    url: '/product/search',
    method: 'GET',
    params: {//get请求用params
      pageNum,
      pageSize,
      [searchType]:searchValue
    }
  })
}
//更新商品状态数据
export const reqUpdateProductStatus = (productId, status) => {
  return axiosInstance({
    url: '/product/update/status',
    method: 'POST',
    data: {
      productId,
      status
    }
  });
};

//获取角色列表数据
export const reqGetRoleList = () => {
  return axiosInstance({
    url: '/role/get',
    method: 'GET',
  });
};
//创建角色
export const reqAddRole = (name) => {
  return axiosInstance({
    url: '/role/add',
    method: 'post',
    data: {
      name
    }
  });
};
//请求更新角色权限
export const reqUpdateRole = ({
  roleId,
  authName,
  menus
}) => {
  return axiosInstance({
    url: '/role/update',
    method: 'POST',
    data: {
      roleId,
      authName,
      menus
    }
  });
};
