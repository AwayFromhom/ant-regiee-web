export type TableListItem = {

  id: number

  name: string

  //套餐分类id
  categoryId: number

  //套餐价格
  price: string

  //商品码
  code: string

  //图片
  image: string

  //描述信息
  description: string

  //0 停售 1 起售
  status: int

  //顺序
  sort: number

  createTime: Date
  updateTime: Date
  createUser: string
  updateUser: string
  setmealDishes: setmealDishes[]
};

export type setmealDishes = {
  id: React.Key;
  dishId: number;
  //菜品名称 （冗余字段）
  name: string
  //菜品原价
  price: string
  //份数
  copies: number
  //排序
  sort: number
}


export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
