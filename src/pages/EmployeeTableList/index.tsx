import {UserAddOutlined} from '@ant-design/icons';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {ModalForm, ProFormRadio, ProFormText} from '@ant-design/pro-form';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type {FormValueType} from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {addemployee, removeRule, rule, updateRule} from './service';
import type {TableListItem, TableListPagination} from './data';

/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');

  try {
    const msg = await addemployee({ ...fields });
    console.log(msg);
    if (msg.code === 1) {
      hide();
      message.success('添加成功');
      return  true;
    }
    else {
      hide();
      message.error(msg.msg);
      return false;
    }
  }catch (error) {
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

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
  const hide = message.loading('正在修改员工信息');

  try {
    const msg = await updateRule({
      ...currentRow,
      ...fields,
    });
    console.log(msg);
    if (msg.code === 1) {
      hide();
      message.success('修改成功');
      return  true;
    }
    else {
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
      return  true;
    }
    else {
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
      valueType: 'index',
    },
    {
      title: '账号',
      dataIndex: 'username',
      tip: '账号是唯一的 key',
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
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',

    },
    {
      title: '电话',
      dataIndex: 'phone',
      valueType: 'text',

    },  {
      title: '性别',
      dataIndex: 'sex',
      search : false,
      valueEnum: {
        1: {
          text: '男',
          status: 'man',
        },
        2: {
          text: '女',
          status: 'women',
        }
      }
    },
    {
      title: '身份证号',
      dataIndex: 'idNumber',
      valueType: 'text',search : false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,search : false,
      valueEnum: {
        0: {
          text: '已停用',
          status: 'Default',
        },
        1: {
          text: '启用',
          status: 'Processing',
        }
      },
    },
    {
      title: '创建时间',
      // sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',search : false,
      // renderFormItem: (item, { defaultRender, ...rest }, form) => {
      //   const status = form.getFieldValue('status');
      //
      //   if (`${status}` === '0') {
      //     return false;
      //   }
      //
      //   if (`${status}` === '3') {
      //     return <Input {...rest} placeholder="请输入异常原因！" />;
      //   }
      //
      //   return defaultRender(item);
      // },
    },
    // {
    //   title: '修改时间',
    //   sorter: true,
    //   dataIndex: 'updateTime',
    //   valueType: 'dateTime',search : false,
    //
    // },
    // {
    //   title: '创建人',
    //   dataIndex: 'createUser',
    //   valueType: 'textarea',search : false,
    // },    {
    //   title: '修改人',
    //   dataIndex: 'updateUser',
    //   valueType: 'textarea',search : false,
    // },

    {
      title: '操作',
      dataIndex: 'status',
     valueType: 'option',

      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改信息
        </a>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="员工表格"
        actionRef={actionRef}
        rowKey="id"
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
            <UserAddOutlined />添加员工
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
      <ModalForm
        title="添加员工"
        width="400px"
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
        <ProFormText width="md" name="username" label="账号" placeholder="请输入账号"
                     rules={[{ required: true,message: '账号为必填项', },]}/>
        <ProFormText width="md" name="name" label="姓名" placeholder="请输入员工姓名"
                     rules={[{ required: true,message: '员工姓名为必填项', },]}/>
        <ProFormText width="md" name="phone" label="手机号" placeholder="请输入手机号"
                     rules={[{ required: true,message: '手机号为必填项', },]}/>
        <ProFormRadio.Group
            name="sex"
            label="性别"
            options={[
              {
                label: '男',
                value: '1',
              },
              {
                label: '女',
                value: '2',
              }
            ]}
            rules={[{ required: true,message: '性别为必填项', },]}
        />
        <ProFormText width="md" name="idNumber" label="身份证" placeholder="请输入身份证"
                     rules={[{ required: true,message: '身份证为必填项', },]}/>


      </ModalForm>
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

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.username && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.username}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.username,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
