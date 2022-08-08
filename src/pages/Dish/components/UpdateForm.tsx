import React from 'react';
import {Modal} from 'antd';
import {
    ProFormMoney,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
    ProFormUploadButton,
    StepsForm,
} from '@ant-design/pro-form';
import type {TableListItem} from '../data';
import {queryCategory} from "@/pages/Dish/service";
import {ProForm, ProFormDependency, ProFormList} from "@ant-design/pro-components";

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

function getRequest() {
    return async () => {//返回的select网络请求
        let r = await queryCategory();
        console.log(r);
        let res = [];
        for (let i = 0; i < r.data.length; i++) {
            let temp = {};
            temp['label'] = r.data[i].name;
            temp['value'] = r.data[i].id;
            res.push(temp)
        }
        return res
    };
}
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
              title="修改菜品信息"
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
                categoryId: props.values.categoryId,
                price: props.values.price,
            }}
            title="基本信息"
        >

            <ProFormText
                width="md"
                name="name"
                label="菜品名称"
                placeholder="请输入菜品"
                rules={[
                    {
                        required: true,
                        message: '请输入正确的菜品名称！',
                        max: 10,
                    }
                ]}
            />

            <ProFormSelect
                width="md"
                request={getRequest()}
                name="categoryId"
                label="菜品分类"
                rules={[
                    {
                        required: true,
                        message: '选择菜品分类！',
                    }
                ]}
            />

            <ProFormMoney width="md" label="菜品价格" name="price" rules={[{required: true, message: '输入菜品价格！',}]}/>

            <ProFormUploadButton
                label="菜品图片"
                name="image"
                width="lg"
                max={1}
                fieldProps={
                    {name: 'file'}
                }
                action="/api/file/addphoto"
            />

        </StepsForm.StepForm>
        <StepsForm.StepForm
            initialValues={{
                flavors: props.values.flavors,
            }}
            title="口味做法配置"
        >
            <ProFormList
                // name='{['default', 'users']}'
                name='flavors'
                label="口味做法配置"
                alwaysShowItemLabel
                copyIconProps={false}
                max={4}
            >
                <ProForm.Group key="group">
                    <ProFormSelect
                        options={[
                            {
                                value: '甜味',
                                label: '甜味',
                            },
                            {
                                value: '温度',
                                label: '温度',
                            }, {
                                value: '忌口',
                                label: '忌口',
                            }, {
                                value: '辣度',
                                label: '辣度',
                            },
                        ]}
                        width="xs"
                        name="name"
                        placeholder="口味名"

                        rules={[
                            {
                                required: true,
                                message: '选择口味！',
                            }
                        ]}
                    />
                    <ProFormDependency name={['name']}>
                        {({name}) => {
                            let option: any[];

                            const option1 = [
                                {label: '无糖', value: '无糖'},
                                {label: '少糖', value: '少糖'},
                                {label: '中糖', value: '中糖'},
                                {label: '多糖', value: '多糖'},
                            ];
                            const option2 = [
                                {label: '正常冰', value: '正常冰'},
                                {label: '少冰', value: '少冰'},
                                {label: '常温', value: '常温'},
                                {label: '热', value: '热'},
                            ];
                            const option3 = [
                                {label: '不要蒜', value: '不要蒜'},
                                {label: '不要香菜', value: '不要香菜'},
                                {label: '不要葱', value: '不要葱'},
                                {label: '不吃辣', value: '不吃辣'},
                            ];
                            const option4 = [
                                {label: '不辣', value: '不辣'},
                                {label: '微辣', value: '微辣'},
                                {label: '中辣', value: '中辣'},
                                {label: '特辣', value: '特辣'},
                            ];

                            switch (name) {
                                case '甜味':
                                    option = [];
                                    option = option1;
                                    break;
                                case '温度':
                                    option = [];
                                    option = option2;
                                    break;
                                case '忌口':
                                    option = [];
                                    option = option3;
                                    break;
                                case '辣度':
                                    option = [];
                                    option = option4;
                                    break;
                                default:
                                    option = [];
                            }
                            return (
                                <ProFormSelect.SearchSelect
                                    width="md"
                                    name="value"
                                    placeholder="口味"
                                    fieldProps={{
                                        labelInValue: false,
                                        style: {
                                            minWidth: 140,
                                            autoClearSearchValue: true,//选中后清空搜索框
                                            //使用onChange onBlur
                                            onChange: (options: any) => {
                                                return options //必须要return一个值出去 表单项才会展示值在输入框上
                                            },
                                            // onBlur
                                        },
                                    }}
                                    options={option}
                                    rules={[
                                        {
                                            required: true,
                                            message: '选择口味信息！',
                                        }
                                    ]}
                                />
                            );
                        }}
                    </ProFormDependency>

                </ProForm.Group>
            </ProFormList>
        </StepsForm.StepForm>
        <StepsForm.StepForm
            initialValues={{
                status: props.values.status,
                id: props.values.id,
                description: props.values.description,
            }}
            title="属性信息"
        >
            <ProFormText
                name="description"
                label="商品描述"
            />

            <input type="hidden" name="id"/>

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
