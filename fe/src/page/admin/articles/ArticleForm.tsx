import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Spin,
  InputNumber,
  Upload,
  Typography,
  Divider,
  message,
} from 'antd';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload/interface';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  FileText,
  DollarSign,
  Maximize,
  Tag,
  Layers,
} from 'lucide-react';

import { useCategories } from '@/hooks/useCategories';
import { useTags } from '@/hooks/useTags';
import { Article, CreateArticlePayload } from '@/types/Article';

const { Title, Text } = Typography;

interface ArticleFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateArticlePayload) => Promise<void>;
  loading?: boolean;
  initialValues?: Article | null;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  // State quản lý danh sách file upload
  const [thumbnailFileList, setThumbnailFileList] = useState<UploadFile[]>([]);
  const [imagesFileList, setImagesFileList] = useState<UploadFile[]>([]);

  // State cho modal xem trước ảnh
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // --- XỬ LÝ INITIAL VALUES (Khi mở form sửa) ---
  useEffect(() => {
    if (visible && initialValues) {
      // 1. Map các trường text cơ bản
      form.setFieldsValue({
        title: initialValues.title,
        summary: initialValues.summary,
        price: initialValues.price,
        area: initialValues.area,
        categoryID: initialValues.categoryID?.id,
        tags: initialValues.tags.map((t) => t.id),
        status: initialValues.status,
        content: initialValues.content,
      });

      // 2. Xử lý hiển thị ảnh cũ (Thumbnail)
      if (initialValues.thumbnail) {
        setThumbnailFileList([
          {
            uid: '-1',
            name: 'thumbnail.png',
            status: 'done',
            url: initialValues.thumbnail,
          },
        ]);
      } else {
        setThumbnailFileList([]);
      }

      // 3. Xử lý hiển thị ảnh cũ (Images chi tiết)
      if (initialValues.images && initialValues.images.length > 0) {
        const fileList: UploadFile[] = initialValues.images.map((url, index) => ({
          uid: `-${index + 2}`,
          name: `image-${index}.png`,
          status: 'done',
          url: url,
        }));
        setImagesFileList(fileList);
      } else {
        setImagesFileList([]);
      }
    } else {
      // Reset form khi tạo mới
      form.resetFields();
      setThumbnailFileList([]);
      setImagesFileList([]);
    }
  }, [visible, initialValues, form]);

  // --- HÀM XỬ LÝ SUBMIT FORM ---
  const handleFinish = (values: any) => {
    // SỬA LỖI TYPE PREDICATE: Lọc và ép kiểu RcFile
    const thumbnailFile = thumbnailFileList[0]?.originFileObj;

    const newImageFiles = imagesFileList
      .map((f) => f.originFileObj)
      .filter((f): f is RcFile => f !== undefined);

    const payload: CreateArticlePayload = {
      ...values,
      // Đảm bảo kiểu số
      price: Number(values.price),
      area: Number(values.area),
      // Gán file nếu có upload mới
      thumbnail: thumbnailFile,
      images: newImageFiles.length > 0 ? newImageFiles : undefined,
    };

    onSubmit(payload);
  };

  // --- XỬ LÝ PREVIEW ẢNH ---
  const handleCancelPreview = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const uploadProps: UploadProps = {
    beforeUpload: () => false, // Chặn auto upload
    onPreview: handlePreview,
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-500 transition-colors">
      <UploadCloud size={24} strokeWidth={1.5} />
      <div className="mt-2 text-sm font-medium">Tải ảnh</div>
    </div>
  );

  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg text-gray-800">
            <FileText size={20} />
            <span>{initialValues ? 'Cập nhật tin đăng' : 'Thêm tin đăng mới'}</span>
          </div>
        }
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={1000}
        maskClosable={false}
        destroyOnClose
        style={{ top: 20 }}
        closeIcon={<X size={20} />}
      >
        <Spin spinning={loading} tip="Đang xử lý...">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ status: 'Draft' }}
            className="mt-6"
            requiredMark="optional"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* === CỘT 1: Thông tin chính === */}
              <div className="lg:col-span-2 space-y-4">
                <Form.Item
                  name="title"
                  label={<span className="font-semibold">Tiêu đề tin đăng</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                  <Input size="large" placeholder="VD: Cho thuê phòng trọ cao cấp..." />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="price"
                    label={
                      <div className="flex items-center gap-1 font-semibold">
                        <DollarSign size={16} className="text-green-600" /> Giá thuê (VNĐ)
                      </div>
                    }
                    rules={[{ required: true, message: 'Nhập giá thuê' }]}
                  >
                    <InputNumber<number>
                      style={{ width: '100%' }}
                      size="large"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      placeholder="VD: 3,500,000"
                      min={0}
                    />
                  </Form.Item>

                  <Form.Item
                    name="area"
                    label={
                      <div className="flex items-center gap-1 font-semibold">
                        <Maximize size={16} className="text-blue-600" /> Diện tích (m²)
                      </div>
                    }
                    rules={[{ required: true, message: 'Nhập diện tích' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="VD: 25"
                      min={0}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  name="summary"
                  label={<span className="font-semibold">Địa chỉ / Mô tả ngắn</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="VD: Số 10 ngõ 5, đường Xuân Thủy, Cầu Giấy..."
                    showCount
                    maxLength={200}
                  />
                </Form.Item>
              </div>

              {/* === CỘT 2: Phân loại & Trạng thái === */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100 h-fit">
                <Title level={5} className="flex items-center gap-2 mb-4 text-gray-700!">
                  <Layers size={18} /> Thiết lập tin
                </Title>

                <Form.Item
                  name="categoryID"
                  label="Danh mục"
                  rules={[{ required: true, message: 'Chọn danh mục' }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn danh mục"
                    showSearch
                    optionFilterProp="children"
                    allowClear
                  >
                    {categories.map((cat) => (
                      <Select.Option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="tags"
                  label={
                    <div className="flex items-center gap-1">
                      <Tag size={16} /> Tiện ích
                    </div>
                  }
                >
                  <Select
                    mode="multiple"
                    size="large"
                    placeholder="Chọn tiện ích"
                    allowClear
                    optionFilterProp="children"
                  >
                    {tags.map((tag) => (
                      <Select.Option key={tag.id} value={tag.id}>
                        {tag.tagName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="status" label="Trạng thái">
                  <Select size="large">
                    <Select.Option value="Draft">Bản nháp</Select.Option>
                    <Select.Option value="Pending">Chờ duyệt</Select.Option>
                    <Select.Option value="Published">Công khai</Select.Option>
                    <Select.Option value="Hidden">Đã ẩn</Select.Option>
                    <Select.Option value="Rented">Đã thuê</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <Divider className="my-6!">
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <ImageIcon size={18} /> Hình ảnh & Nội dung chi tiết
              </div>
            </Divider>

            {/* === PHẦN UPLOAD ẢNH === */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              <div className="md:col-span-2">
                <Form.Item label={<span className="font-semibold">Ảnh đại diện</span>} required>
                  <Upload
                    {...uploadProps}
                    name="thumbnail"
                    listType="picture-card"
                    className="avatar-uploader"
                    fileList={thumbnailFileList}
                    onChange={({ fileList }) => {
                      setThumbnailFileList(fileList.slice(-1));
                    }}
                    maxCount={1}
                  >
                    {thumbnailFileList.length < 1 ? uploadButton : null}
                  </Upload>
                  <Text type="secondary" className="text-xs">
                    Ảnh bìa (Bắt buộc)
                  </Text>
                </Form.Item>
              </div>

              <div className="md:col-span-3">
                <Form.Item label={<span className="font-semibold">Ảnh chi tiết</span>}>
                  <Upload
                    {...uploadProps}
                    name="images"
                    listType="picture-card"
                    multiple
                    fileList={imagesFileList}
                    onChange={({ fileList }) => setImagesFileList(fileList)}
                    maxCount={10}
                  >
                    {imagesFileList.length < 10 ? uploadButton : null}
                  </Upload>
                  <Text type="secondary" className="text-xs">
                    Tối đa 10 ảnh (Giữ Ctrl chọn nhiều)
                  </Text>
                </Form.Item>
              </div>
            </div>

            <Form.Item
              name="content"
              label={<span className="font-semibold">Nội dung mô tả chi tiết</span>}
              rules={[{ required: true, message: 'Nội dung không được để trống' }]}
            >
              <ReactQuill
                theme="snow"
                style={{ height: 250 }}
                className="mb-12"
                placeholder="Mô tả chi tiết..."
              />
            </Form.Item>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button size="large" onClick={onCancel} disabled={loading} icon={<X size={18} />}>
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <UploadCloud size={18} />
                {initialValues ? 'Lưu thay đổi' : 'Đăng tin ngay'}
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancelPreview}
        width={700}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ArticleForm;
