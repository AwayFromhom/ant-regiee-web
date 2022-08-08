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
import {querysetmealCategory} from "@/pages/Setmeal/service";
import Newdemo from "@/pages/Setmeal/components/demo/Newdemo";

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


/**
 * 查询所有套餐分类
 */
function getRequest() {
    return async () => {//返回的select网络请求
        let r = await querysetmealCategory();
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
                    flavors: props.values.setmealDishes,
                }}
                title="口味做法配置"
            >
                <Newdemo values={props.values.setmealDishes}/>

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
