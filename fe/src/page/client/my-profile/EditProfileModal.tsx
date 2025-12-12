import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { IUser } from '@/types/User';

interface EditProfileModalProps {
  open: boolean;
  user: IUser | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<IUser>) => void;
}

/**
 * Modal chỉnh sửa thông tin cá nhân
 */
const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  user,
  loading,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  // Set initial values khi user thay đổi
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-semibold text-gray-800">Chỉnh sửa thông tin cá nhân</span>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      confirmLoading={loading}
      width={500}
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[
            { required: true, message: 'Vui lòng nhập họ tên' },
            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' },
            { max: 50, message: 'Họ tên không được quá 50 ký tự' },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Nhập họ và tên"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Nhập email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            {
              pattern: /^[0-9]{10}$/,
              message: 'Số điện thoại phải có 10 chữ số',
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined className="text-gray-400" />}
            placeholder="Nhập số điện thoại (10 số)"
            size="large"
            maxLength={10}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
