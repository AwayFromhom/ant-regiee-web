import {UploadOutlined} from '@ant-design/icons';
import {Button, Upload} from 'antd';
import React from 'react';


const Uploader: React.FC = () => (
    <>
        <Upload
            action="/api/upload/adddish"
            listType="picture"
        >
            <Button icon={<UploadOutlined/>}>上传图片</Button>
        </Upload>
        <br/>
        <br/>
    </>
);

export default Uploader;