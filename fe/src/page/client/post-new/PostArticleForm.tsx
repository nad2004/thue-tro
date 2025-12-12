import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Card,
  Checkbox,
  Typography,
  message,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import {
  UploadCloud,
  FileText,
  MapPin,
  DollarSign,
  Maximize,
  CheckSquare,
  Image as ImageIcon,
  Send,
  Home as HomeIcon,
  Sparkles,
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { CreateArticlePayload } from '@/types/Article';
import { Category } from '@/types/Category';
import { Tag } from '@/types/Tag';

const { Title, Text } = Typography;

interface PostArticleFormProps {
  categories: Category[];
  tags: Tag[];
  onSubmit: (values: CreateArticlePayload) => void;
  isSubmitting: boolean;
}

const PostArticleForm: React.FC<PostArticleFormProps> = ({
  categories,
  tags,
  onSubmit,
  isSubmitting,
}) => {
  const [form] = Form.useForm();

  // State quản lý file upload
  const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [content, setContent] = useState('');

  // Xử lý submit
  const handleFinish = (values: any) => {
    // 1. Validate ảnh
    if (thumbnailList.length === 0) {
      message.error('Vui lòng chọn ảnh đại diện!');
      return;
    }
    if (imageList.length === 0) {
      message.error('Vui lòng chọn ít nhất 1 ảnh chi tiết!');
      return;
    }

    // 2. Lấy File object gốc - FIX TYPE
    const thumbnailFile = thumbnailList[0].originFileObj as File;
    const imageFiles = imageList
      .map((f) => f.originFileObj as File)
      .filter((f): f is File => f !== undefined);

    // 3. Tạo Payload chuẩn
    const payload: CreateArticlePayload = {
      title: values.title,
      content: content,
      summary: values.address,
      price: Number(values.price),
      area: Number(values.area),
      categoryID: values.categoryId,
      tags: values.tags || [],
      thumbnail: thumbnailFile,
      images: imageFiles,
      status: 'Pending',
    };

    onSubmit(payload);
  };

  // Config Upload
  const uploadProps: UploadProps = {
    beforeUpload: (file: RcFile) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được upload file ảnh!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Ảnh phải nhỏ hơn 5MB!');
      }
      return false; // Chặn auto upload
    },
    listType: 'picture-card',
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center text-gray-400 hover:text-orange-500 transition-colors">
      <UploadCloud size={28} />
      <div className="mt-2 text-xs font-medium">Tải ảnh lên</div>
    </div>
  );

  // Quill modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-linear-to-r from-orange-500 to-pink-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div>
            <Title level={2} className="text-white! mb-0!">
              Đăng tin cho thuê
            </Title>
            <Text className="text-white/90">
              Chia sẻ thông tin phòng trọ của bạn với hàng ngàn người tìm nhà
            </Text>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          {[
            { icon: HomeIcon, text: 'Miễn phí đăng tin' },
            { icon: Sparkles, text: 'Tiếp cận nhiều khách hàng' },
            { icon: CheckSquare, text: 'Duyệt tin nhanh chóng' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <item.icon size={16} />
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark="optional"
        className="pb-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* === CỘT TRÁI (Thông tin chính) === */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. THÔNG TIN CƠ BẢN */}
            <Card
              className="shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl"
              title={
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText size={18} className="text-orange-600" />
                  </div>
                  <span className="font-semibold">Thông tin cơ bản</span>
                </div>
              }
            >
              <Form.Item
                name="title"
                label={<span className="font-semibold text-gray-700">Tiêu đề tin đăng</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập tiêu đề' },
                  { min: 20, message: 'Tiêu đề phải có ít nhất 20 ký tự' },
                ]}
              >
                <Input
                  size="large"
                  placeholder="VD: Phòng trọ cao cấp gần ĐH Bách Khoa, có gác, WC riêng..."
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-gray-700">Mô tả chi tiết</span>}
                required
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    style={{ height: 250 }}
                    className="mb-12"
                    placeholder="Mô tả chi tiết về phòng trọ: Nội thất, tiện ích, quy định, giao thông..."
                  />
                </div>
              </Form.Item>
            </Card>

            {/* 2. HÌNH ẢNH */}
            <Card
              className="shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl"
              title={
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ImageIcon size={18} className="text-blue-600" />
                  </div>
                  <span className="font-semibold">Hình ảnh</span>
                </div>
              }
            >
              <div className="space-y-6">
                {/* Thumbnail */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-3">
                    Ảnh đại diện <span className="text-red-500">*</span>
                  </label>
                  <Upload
                    {...uploadProps}
                    fileList={thumbnailList}
                    onChange={({ fileList }) => setThumbnailList(fileList.slice(-1))}
                    maxCount={1}
                    className="upload-thumbnail"
                  >
                    {thumbnailList.length < 1 && uploadButton}
                  </Upload>
                  <Text type="secondary" className="text-xs block mt-2">
                    Ảnh này sẽ hiển thị làm ảnh bìa cho tin đăng của bạn
                  </Text>
                </div>

                {/* Images */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-3">
                    Ảnh chi tiết <span className="text-red-500">*</span> (Tối đa 10 ảnh)
                  </label>
                  <Upload
                    {...uploadProps}
                    multiple
                    fileList={imageList}
                    onChange={({ fileList }) => setImageList(fileList.slice(0, 10))}
                    maxCount={10}
                    className="upload-images"
                  >
                    {imageList.length < 10 && uploadButton}
                  </Upload>
                  <Text type="secondary" className="text-xs block mt-2">
                    Thêm nhiều ảnh sẽ giúp tin của bạn thu hút hơn ({imageList.length}/10)
                  </Text>
                </div>
              </div>
            </Card>
          </div>

          {/* === CỘT PHẢI (Thông số & Phân loại) === */}
          <div className="space-y-6">
            {/* 3. CHI TIẾT & GIÁ */}
            <Card
              className="shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl"
              title={
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign size={18} className="text-green-600" />
                  </div>
                  <span className="font-semibold">Chi tiết</span>
                </div>
              }
            >
              <Form.Item
                name="price"
                label={<span className="font-semibold text-gray-700">Giá thuê (VNĐ/tháng)</span>}
                rules={[{ required: true, message: 'Nhập giá thuê' }]}
              >
                <InputNumber<number>
                  style={{ width: '100%' }}
                  size="large"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                  placeholder="3,500,000"
                  min={0}
                  prefix={<DollarSign size={16} className="text-gray-400" />}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="area"
                label={<span className="font-semibold text-gray-700">Diện tích (m²)</span>}
                rules={[{ required: true, message: 'Nhập diện tích' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="25"
                  min={5}
                  max={500}
                  prefix={<Maximize size={16} className="text-gray-400" />}
                  className="rounded-lg"
                />
              </Form.Item>
            </Card>

            {/* 4. ĐỊA CHỈ & DANH MỤC */}
            <Card
              className="shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl"
              title={
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin size={18} className="text-purple-600" />
                  </div>
                  <span className="font-semibold">Vị trí</span>
                </div>
              }
            >
              <Form.Item
                name="categoryId"
                label={<span className="font-semibold text-gray-700">Khu vực</span>}
                rules={[{ required: true, message: 'Chọn khu vực' }]}
              >
                <Select
                  size="large"
                  placeholder="Chọn quận/huyện"
                  showSearch
                  optionFilterProp="children"
                  className="rounded-lg"
                >
                  {categories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="address"
                label={<span className="font-semibold text-gray-700">Địa chỉ cụ thể</span>}
                rules={[
                  { required: true, message: 'Nhập địa chỉ nhà' },
                  { min: 10, message: 'Địa chỉ quá ngắn' },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Số 10, Ngõ 5, Đường Xuân Thủy, Cầu Giấy, Hà Nội"
                  className="rounded-lg"
                />
              </Form.Item>
            </Card>

            {/* 5. TIỆN ÍCH */}
            <Card
              className="shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-xl"
              title={
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <CheckSquare size={18} className="text-pink-600" />
                  </div>
                  <span className="font-semibold">Tiện ích</span>
                </div>
              }
            >
              <Form.Item name="tags">
                <Checkbox.Group className="flex flex-col gap-3">
                  {tags.map((tag) => (
                    <Checkbox
                      key={tag.id}
                      value={tag.id}
                      className="hover:text-orange-600 transition-colors"
                    >
                      <span className="font-medium text-gray-700">#{tag.tagName}</span>
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            </Card>

            {/* ACTION BUTTON */}
            <div className="mt-2 bottom-6 z-50">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isSubmitting}
                icon={<Send size={18} />}
                className="bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-none h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
              >
                {isSubmitting ? 'Đang đăng tin...' : 'Đăng tin ngay'}
              </Button>
              <Text type="secondary" className="text-xs text-center block mt-3">
                Tin của bạn sẽ được kiểm duyệt trong vòng 24h
              </Text>
            </div>
          </div>
        </div>
      </Form>

      {/* Custom CSS */}
      <style>{`
        .upload-thumbnail .ant-upload-list-item,
        .upload-images .ant-upload-list-item {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .ant-upload-list-picture-card-container {
          width: 100%;
        }
        
        .ant-card-head {
          border-bottom: 1px solid #f0f0f0;
        }
        
        .ql-container {
          font-size: 15px;
        }
        
        .ql-editor {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
};

export default PostArticleForm;
