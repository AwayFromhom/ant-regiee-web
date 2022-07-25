import {AppstoreAddOutlined} from '@ant-design/icons';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {ModalForm, ProFormSelect, ProFormText,} from '@ant-design/pro-form';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type {FormValueType} from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {addRule, removeRule, rule, updateRule} from './service';
import type {TableListItem, TableListPagination} from './data';

/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');

  try {
    const msg = await addRule({ ...fields });
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
      title: '分类名称',
      dataIndex: 'name',
      tip: '分类名称是唯一的 key',
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
      title: '分类类型',
      dataIndex: 'type',
      hideInForm: true,
      valueEnum: {
        1: {
          text: '菜品分类',
          // status: 'Processing',
        },
        2: {
          text: '套餐分类',
          // status: 'Success',
        }

      },
    },
    {
      title: '上次修改时间',

      dataIndex: 'updateTime',
      valueType: 'dateTime',
    search : false,
    },
    {
      title: '排序',
      sorter: true,
      dataIndex: 'sort',
      valueType: 'text'
      ,search : false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          配置
        </a>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="菜品分类管理"
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
            <AppstoreAddOutlined />添加分類
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
        title="添加分類"
        width="500px"
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
        <ProFormSelect
            name="type"
            label="类型"
            valueEnum={{
              1: '菜品分类',
              2: '套餐分类',
            }}
            placeholder='请选择分类'

            rules={[{ required: true, message: '请选择分类!' }]}
        />
        <ProFormText name="name" label="菜品名称" placeholder="请输入菜品名称" rules={[{ required: true, message: '请输入菜品名称!' }]} />

        <ProFormText name="sort" label="排序" placeholder="请输入排序" rules={[{ required: true, message: '请输入排序!' }]} />


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
