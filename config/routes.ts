export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    name: '员工管理',
    icon: 'TeamOutlined',
    path: '/employee',
    component: './EmployeeTableList',
  },
  {
    name: '分类管理',
    icon: 'AppstoreOutlined',
    path: '/czategory',
    component: './CategoryManagement',
  },
  {
    name: '菜品管理',
    icon: 'FileTextOutlined',
    path: '/dish',
    component: './Dish',
  },
  {
    name: '套餐管理',
    icon: 'RedEnvelopeOutlined',
    path: '/setmeal',
    component: './Setmeal',
  },
  {
    component: './404',
  },
];
