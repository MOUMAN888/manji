import React, { useState, useEffect } from 'react';
import { Modal, Input, message, Button } from 'antd';
import { createCategory } from '../../../../api/categoryApi';


interface CategoryModelProps {
    isOpen: boolean; // 控制弹窗显示/隐藏
    userId: number | undefined; // 父组件传的用户ID
    onClose: () => void; // 关闭弹窗的回调
    onSuccess?: () => void; // 创建成功后的回调（可选，比如刷新列表）
}

const CategoryModel: React.FC<CategoryModelProps> = ({ isOpen, userId, onClose, onSuccess }) => {
    const [messageApi] = message.useMessage();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [categoryName, setCategoryName] = useState(''); // 分类名称输入框状态
    // 弹窗关闭时重置输入框
    useEffect(() => {
        if (!isOpen) {
            setCategoryName('');
        }
    }, [isOpen]);

    const handleOk = async () => {
        // 1. 输入校验
        if (!categoryName.trim()) {
            messageApi.warning('分类名称不能为空！');
            return;
        }
        if (!userId) {
            messageApi.error('用户ID不能为空！');
            return;
        }

        try {
            setConfirmLoading(true);
            // 2. 调用接口：传递 userId 和 name（categoryName）
            await createCategory({
                userId,
                name: categoryName.trim()
            });
            messageApi.success('分类创建成功！');
            // 3. 通知父组件（比如刷新分类列表）
            onSuccess?.();
            // 4. 关闭弹窗
            onClose();
        } catch (error) {
            console.error('创建分类失败：', error);
            messageApi.error('分类创建失败，请重试！');
        } finally {
            setConfirmLoading(false);
        }
    };
    const footer: React.ReactNode = (
        <>
            <Button
                onClick={() => onClose()}
                styles={{ root: {  color: '#fff', backgroundColor: '#2C2C2C' } }}
            >
                取消
            </Button>
            <Button
                type="primary"
                styles={{ root: {color: '#fff', backgroundColor: '#557475' } }}
                onClick={() => handleOk()}
            >
                提交
            </Button>
        </>
    );


    return (
        <>
            <Modal
                title="新增分类"
                open={isOpen}
                onOk={handleOk}
                footer={footer}
                confirmLoading={confirmLoading}
                onCancel={onClose} // 取消按钮直接调用父组件的关闭方法
                destroyOnClose={true} // 弹窗关闭时销毁内部DOM，避免状态残留
                okText="确认"
                cancelText="取消"
            >
                <Input
                    placeholder="请输入分类名称"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    maxLength={50} // 限制输入长度
                    autoFocus // 弹窗打开时自动聚焦输入框
                />
            </Modal>
        </>
    );
};

export default CategoryModel;