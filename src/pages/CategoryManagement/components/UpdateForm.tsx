import React from 'react';
import {ProForm, ProFormSelect, ProFormText,} from '@ant-design/pro-form';
import type {TableListItem} from '../data';
import {Modal} from "antd";

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<TableListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    return (
      <Modal
          width={640}
          bodyStyle={{
              padding: '32px 40px 48px',
          }}
          destroyOnClose
          title="修改员工信息"
          visible={props.updateModalVisible}
          onCancel={() => {
              props.onCancel();
          }}
          footer={
              [] // 设置footer为空，去掉 取消 确定默认按钮
          }
      >
      <ProForm
          initialValues={{
              type: props.values.type,
              id: props.values.id,
              name: props.values.name,
              sort: props.values.sort,
          }}
          onFinish={props.onSubmit}

      >
          <input type="hidden" name="id"/>
          <ProFormSelect
              options={[
                  {
                      value: 1,
                      label: '菜品分类',
                  },
                  {
                      value: 2,
                      label: '套餐分类',
                  },
              ]}
              width="md"
              name="type"
              label="类型"/>
          <ProFormText
              name="name"
              label="分类名称"
              width="md"
              rules={[
                  {
                      required: true,
                      message: '请输入分类名称！',
                  },
              ]}
          />

          <ProFormText
              name="sort"
              label="排序"
              width="md"
              rules={[
                  {
                      required: true,
                      message: '请输入排序！',
                  },
              ]}
          />


      </ProForm>



      </Modal>
  );
};

export default UpdateForm;
