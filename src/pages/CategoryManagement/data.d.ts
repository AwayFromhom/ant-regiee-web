export type TableListItem = {
   id :number
  //分类名称
  name:string
    //类型 1 菜品分类 2 套餐分类
    type:number
  //顺序
  sort :number
  createTime : Date
  updateTime: Date
  createUser:string
  updateUser: string
};

export type Result = {

  msg: string;
  code: number;
  data: any;
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
