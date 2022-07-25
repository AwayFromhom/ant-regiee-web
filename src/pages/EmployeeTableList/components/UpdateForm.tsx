import React from 'react';
import {Modal} from 'antd';
import {ProFormRadio, ProFormText, StepsForm,} from '@ant-design/pro-form';
import type {TableListItem} from '../data';

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
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{
              padding: '32px 40px 48px',
            }}
            destroyOnClose
            title="修改员工信息"
            visible={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          name: props.values.name,
            phone: props.values.phone,
        }}
        title="基本信息"
      >
        <ProFormText
          name="name"
          label="员工姓名"
          width="md"
          rules={[
            {
              required: true,
              message: '请输入员工姓名！',
            },
          ]}
        />
        <ProFormText
          name="phone"
          width="md"
          label="电话"
          placeholder="请输入至少五个字符"
          rules={[
            {
              required: true,
              message: '请输入正确的联系电话！',
              min: 11, max: 11,
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
          initialValues={{
              sex: props.values.sex,
              idNumber: props.values.idNumber,
          }}
        title="详细信息"
      >

        <ProFormRadio.Group
          name="sex"
          label="性别"
          options={[
            {
              value: '1',
              label: '男',
            },
            {
              value: '2',
              label: '女',
            },
          ]}
        />

          <ProFormText
              name="idNumber"
              width="md"
              label="身份证"
              placeholder="请输入身份证"
              rules={[
                  {
                      required: true,
                      message: '请输入16位身份证信息！',
                      min: 16, max: 18,
                  },
              ]}
          />
      </StepsForm.StepForm>
      <StepsForm.StepForm
          initialValues={{
              status: props.values.status,
              id: props.values.id,
          }}
        title="设定账号状态"
      >
          <input type="hidden" name="id" />

          <ProFormRadio.Group
              name="status"
              label="状态"
              options={[
                  {
                      value: 1,
                      label: '启用',
                  },
                  {
                      value: 0,
                      label: '禁用',
                  },
              ]}
          />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
