export type TableListItem = {
  id: number
  name: string
  //菜品分类id
  categoryId: number
  categoryName: string
  //菜品价格
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
  flavors: flavors[]
};

interface flavors {
  name: string
  value: string
}


interface Option {
  value: string | number;
  label: string;
  children?: Option[];
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

export type Result = {
  msg: string;
  code: number;
  data: any;
}