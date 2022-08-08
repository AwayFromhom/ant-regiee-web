import {PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, Image, Input, message} from 'antd';
import React, {useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
    ModalForm,
    ProFormMoney,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProFormUploadButton
} from '@ant-design/pro-form';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';

import UpdateForm from './components/UpdateForm';
import {addsetmeal, querysetmealCategory, removeRule, rule, updateRule} from './service';
import type {TableListItem, TableListPagination} from './data';

import Newdemo1 from "@/pages/Setmeal/components/demo/Newdemo1";


/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
    const hide = message.loading('正在添加');
    //处理数据

    if (fields.image) {
        fields.image = fields.image[0]?.response?.data;
    }


    console.log(fields)

    try {
        const msg = await addsetmeal({...fields});
        console.log(msg);
        if (msg.code === 1) {
            hide();
            message.success('添加成功');
            return true;
        } else {
            hide();
            message.error(msg.msg);
            return false;
        }
    } catch (error) {
        hide();
        message.error('添加失败请重试！');
        return false;
    }

};

/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: TableListItem, currentRow?: TableListItem) => {
    const hide = message.loading('正在修改员工信息');

    if (fields.image) {
        fields.image = fields.image[0]?.response?.data;
    }

    try {
        const msg = await updateRule({
            ...currentRow,
            ...fields,
        });
        console.log(msg);
        if (msg.code === 1) {
            hide();
            message.success('修改成功');
            return true;
        } else {
            hide();
            message.error(msg.msg);
            return false;
        }
    } catch (error) {
        hide();
        message.error('修改失败请重试！');
        return false;
    }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
        console.log(selectedRows.map((row) => row.id))
        const msg = await removeRule(selectedRows.map((row) => row.id));
        console.log(msg);
        if (msg.code === 1) {
            hide();
            message.success('删除成功');
            return true;
        } else {
            hide();
            message.error(msg.msg);
            return false;
        }
    } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
    }
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


const TableList: React.FC = () => {
    /** 新建窗口的弹窗 */
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    /** 分布更新窗口的弹窗 */

    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<TableListItem>();
    const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
    /** 国际化配置 */


    const columns: ProColumns<TableListItem>[] = [
        {
            title: '序号',
            dataIndex: 'key',
            valueType: 'index', search: false,
        },
        {
            title: '套餐名称',
            dataIndex: 'name',
            tip: '套餐名称是唯一的 key',
            render: (dom, entity) => {
                return (
                    <a
                        onClick={() => {
                            setCurrentRow(entity);
                            setShowDetail(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '图片',
            dataIndex: 'image',
            valueType: 'text',
            search: false,
            render: (image) => (
                <>
                    <Image
                        width={200}
                        src={'/api/file/downloaddish/' + image}/>
                </>
            )

        }, {
            title: '套餐分类',
            dataIndex: 'categoryName',
            valueType: 'text',
            // search: false,
        },
        {
            title: '售价',
            dataIndex: 'price',
            valueType: 'text', search: false,
        },
        {
            title: '售卖状态',
            dataIndex: 'status',
            hideInForm: true,
            valueEnum: {
                0: {
                    text: '停售',
                    status: 'Default',
                },
                1: {
                    text: '起售',
                    status: 'Processing',
                }
            },
        },
        {
            title: '最后操作时间',
            sorter: true,
            dataIndex: 'updateTime',
            valueType: 'dateTime', search: false,
            renderFormItem: (item, {defaultRender, ...rest}, form) => {
                const status = form.getFieldValue('status');

                if (`${status}` === '0') {
                    return false;
                }

                if (`${status}` === '3') {
                    return <Input {...rest} placeholder="请输入异常原因！"/>;
                }

                return defaultRender(item);
            },
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) =>
                <a
                    key="config"
                    onClick={() => {
                        handleUpdateModalVisible(true);
                        setCurrentRow(record);
                    }}
                >
                    配置
                </a>
        },
    ];


    return (
        <PageContainer>
            <ProTable<TableListItem, TableListPagination>
                headerTitle="套餐管理"
                actionRef={actionRef}
                rowKey="key"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            handleModalVisible(true);
                        }}
                    >
                        <PlusOutlined/> 添加套餐
                    </Button>,
                ]}
                request={rule}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
            />
            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            已选择{' '}
                            <a
                                style={{
                                    fontWeight: 600,
                                }}
                            >
                                {selectedRowsState.length}
                            </a>{' '}
                            项 &nbsp;&nbsp;
                        </div>
                    }
                >
                    <Button
                        onClick={async () => {
                            await handleRemove(selectedRowsState);
                            setSelectedRows([]);
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        批量删除
                    </Button>
                    <Button type="primary">批量审批</Button>
                </FooterToolbar>
            )}

            <UpdateForm
                onSubmit={async (value) => {
                    const success = await handleUpdate(value, currentRow);

                    if (success) {
                        handleUpdateModalVisible(false);
                        setCurrentRow(undefined);

                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
                onCancel={() => {
                    handleUpdateModalVisible(false);
                    setCurrentRow(undefined);
                }}
                updateModalVisible={updateModalVisible}
                values={currentRow || {}}
            />


            <ModalForm
                title="添加套餐信息"
                width="600px"
                visible={createModalVisible}
                onVisibleChange={handleModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as TableListItem);
                    if (success) {
                        handleModalVisible(false);
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
            >
                <ProFormText
                    width="md"
                    name="name"
                    label="套餐名称"
                    placeholder="请输入套餐"
                    rules={[
                        {
                            required: true,
                            message: '请输入正确的套餐名称！',
                            max: 10,
                        }
                    ]}
                />

                <ProFormSelect
                    width="md"
                    request={getRequest()}
                    name="categoryId"
                    label="套餐分类"
                    rules={[
                        {
                            required: true,
                            message: '选择套餐分类！',
                        }
                    ]}
                />

                <ProFormMoney width="md" label="套餐价格" name="price"
                              rules={[
                                  {
                                      required: true,
                                      message: '输入套餐价格！',
                                  }
                              ]}/>

                {/*<ProFormList*/}
                {/*    // name='{['default', 'users']}'*/}
                {/*    name='flavors'*/}
                {/*    label="口味做法配置"*/}
                {/*    alwaysShowItemLabel*/}
                {/*    copyIconProps={false}*/}
                {/*    max={4}*/}
                {/*>*/}
                {/*  <ProForm.Group key="group">*/}
                {/*    <ProFormSelect*/}
                {/*        options={[*/}
                {/*          {*/}
                {/*            value: '甜味',*/}
                {/*            label: '甜味',*/}
                {/*          },*/}
                {/*          {*/}
                {/*            value: '温度',*/}
                {/*            label: '温度',*/}
                {/*          }, {*/}
                {/*            value: '忌口',*/}
                {/*            label: '忌口',*/}
                {/*          }, {*/}
                {/*            value: '辣度',*/}
                {/*            label: '辣度',*/}
                {/*          },*/}
                {/*        ]}*/}
                {/*        width="xs"*/}
                {/*        name="name"*/}
                {/*        placeholder="口味名"*/}

                {/*        rules={[*/}
                {/*          {*/}
                {/*            required: true,*/}
                {/*            message: '选择口味！',*/}
                {/*          }*/}
                {/*        ]}*/}
                {/*    />*/}
                {/*    <ProFormDependency name={['name']}>*/}
                {/*      {({name}) => {*/}
                {/*        let option: any[];*/}

                {/*        const option1 = [*/}
                {/*          {label: '无糖', value: '无糖'},*/}
                {/*          {label: '少糖', value: '少糖'},*/}
                {/*          {label: '中糖', value: '中糖'},*/}
                {/*          {label: '多糖', value: '多糖'},*/}
                {/*        ];*/}
                {/*        const option2 = [*/}
                {/*          {label: '正常冰', value: '正常冰'},*/}
                {/*          {label: '少冰', value: '少冰'},*/}
                {/*          {label: '常温', value: '常温'},*/}
                {/*          {label: '热', value: '热'},*/}
                {/*        ];*/}
                {/*        const option3 = [*/}
                {/*          {label: '不要蒜', value: '不要蒜'},*/}
                {/*          {label: '不要香菜', value: '不要香菜'},*/}
                {/*          {label: '不要葱', value: '不要葱'},*/}
                {/*          {label: '不吃辣', value: '不吃辣'},*/}
                {/*        ];*/}
                {/*        const option4 = [*/}
                {/*          {label: '不辣', value: '不辣'},*/}
                {/*          {label: '微辣', value: '微辣'},*/}
                {/*          {label: '中辣', value: '中辣'},*/}
                {/*          {label: '特辣', value: '特辣'},*/}
                {/*        ];*/}

                {/*        switch (name) {*/}
                {/*          case '甜味':*/}
                {/*            option = [];*/}
                {/*            option = option1;*/}
                {/*            break;*/}
                {/*          case '温度':*/}
                {/*            option = [];*/}
                {/*            option = option2;*/}
                {/*            break;*/}
                {/*          case '忌口':*/}
                {/*            option = [];*/}
                {/*            option = option3;*/}
                {/*            break;*/}
                {/*          case '辣度':*/}
                {/*            option = [];*/}
                {/*            option = option4;*/}
                {/*            break;*/}
                {/*          default:*/}
                {/*            option = [];*/}
                {/*        }*/}
                {/*        return (*/}
                {/*            <ProFormSelect.SearchSelect*/}
                {/*                width="md"*/}
                {/*                name="value"*/}
                {/*                placeholder="口味"*/}
                {/*                fieldProps={{*/}
                {/*                  labelInValue: false,*/}
                {/*                  style: {*/}
                {/*                    minWidth: 140,*/}
                {/*                    autoClearSearchValue: true,//选中后清空搜索框*/}
                {/*                    //使用onChange onBlur*/}
                {/*                    onChange: (options: any) => {*/}
                {/*                      return options //必须要return一个值出去 表单项才会展示值在输入框上*/}
                {/*                    },*/}
                {/*                    // onBlur*/}
                {/*                  },*/}
                {/*                }}*/}
                {/*                options={option}*/}
                {/*                rules={[*/}
                {/*                  {*/}
                {/*                    required: true,*/}
                {/*                    message: '选择口味信息！',*/}
                {/*                  }*/}
                {/*                ]}*/}
                {/*            />*/}
                {/*        );*/}
                {/*      }}*/}
                {/*    </ProFormDependency>*/}

                {/*  </ProForm.Group>*/}
                {/*</ProFormList>*/}
                {/*<Newdemo />*/}


                <Newdemo1/>


                <ProFormUploadButton
                    label="套餐图片"
                    name="image"
                    width="lg"
                    max={1}
                    fieldProps={
                        {name: 'file'}
                    }
                    action="/api/file/addphoto"
                />

                <ProFormTextArea
                    name="description"
                    label="套餐描述"
                    placeholder="请输入套餐描述"
                    rules={[
                        {
                            required: true,
                            message: '请输入套餐描述！',
                            min: 5, max: 50,
                        }
                    ]}
                />


            </ModalForm>

            <Drawer
                width={600}
                visible={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow?.name && (
                    <ProDescriptions<TableListItem>
                        column={2}
                        title={currentRow?.name}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.name,
                        }}
                        columns={columns as ProDescriptionsItemProps<TableListItem>[]}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

export default TableList;
