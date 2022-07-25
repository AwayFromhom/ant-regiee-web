export type TableListItem = {
   id: number;
   username : string
   name : string
   // password : string
   phone : string
   sex : string
   idNumber :string
    status :number
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

