import type {EditableFormInstance, ProColumns, ProFormInstance} from '@ant-design/pro-components';
import {EditableProTable,} from '@ant-design/pro-components';

import React, {useRef, useState} from 'react';
import {setmealDishes} from "@/pages/Setmeal/data";
import {querydishes} from "@/pages/Setmeal/service";


export default (value: any) => {

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
    const [position] = useState<'top' | 'bottom' | 'hdishIdden'>('bottom');
    const formRef = useRef<ProFormInstance<any>>();
    const editorFormRef = useRef<EditableFormInstance<setmealDishes>>();
    const columns: ProColumns<setmealDishes>[] = [
        {
            title: '菜品',
            width: 150,
            dataIndex: 'dishId',
            valueType: "select",
            request: async () => {//返回的select网络请求
                let r = await querydishes();
                console.log(r);
                let res = [];
                for (let i = 0; i < r.data.length; i++) {
                    let temp = {};
                    temp['label'] = r.data[i].name;
                    temp['value'] = r.data[i].id;
                    res.push(temp)
                }
                return res
            }

        },
        {
            title: '价格',
            dataIndex: 'price',
            valueType: 'digit',
        },
        {
            title: '数量',
            dataIndex: 'copies',
            valueType: 'digit',
        },
        {
            title: '操作',
            valueType: 'option',
            // wdishIdth: 200,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.dishId);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        const tableDataSource = formRef.current?.getFieldValue('table') as setmealDishes[];
                        formRef.current?.setFieldsValue({
                            table: tableDataSource.filter((item) => item.dishId !== record.dishId),
                        });
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (

        <EditableProTable<setmealDishes>
            rowKey="id"
            scroll={{
                x: 500,
            }}
            editableFormRef={editorFormRef}
            headerTitle="套餐菜品"
            maxLength={5}
            name="setmealDishes"
            dataSource={value}
            recordCreatorProps={
                position !== 'hdishIdden'
                    ? {
                        position: position as 'top',
                        record: () => ({id: (Math.random() * 1000000).toFixed(0)}),
                    }
                    : false
            }
            columns={columns}
            editable={{
                type: 'multiple',
                editableKeys,
                onChange: setEditableRowKeys,
                actionRender: (row, config, defaultDom) => {
                    return [
                        defaultDom.save,
                        defaultDom.delete || defaultDom.cancel,
                    ];
                },
            }}
        />
    );
};