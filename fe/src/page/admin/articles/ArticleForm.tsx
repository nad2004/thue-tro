import { useEffect } from "react";
import { Form, Input, Select, Button, Modal, Spin, Checkbox } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { Article, CreateArticlePayload } from "@/types/Article";

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
  initialValues 
}) => {
  const [form] = Form.useForm();
  
  // Hooks lấy danh mục và thẻ
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  // Đồng bộ dữ liệu vào form khi mở Edit
  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        slug: initialValues.slug,
        summary: initialValues.summary,
        categoryId: initialValues.categoryId, 
        tagIds: initialValues.tagIds || [],   
        status: initialValues.status,
        content: initialValues.content
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title={initialValues ? "Cập nhật bài viết" : "Thêm bài viết mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      maskClosable={false}
      destroyOnClose
      style={{ top: 20 }}
    >
      <Spin spinning={loading}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onSubmit}
          initialValues={{ status: 'Draft' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              name="title" 
              label="Tiêu đề" 
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Nhập tiêu đề bài viết..." />
            </Form.Item>

            <Form.Item 
              name="slug" 
              label="Slug (URL)" 
              rules={[{ required: true, message: "Vui lòng nhập slug" }]}
            >
              <Input placeholder="tieu-de-bai-viet" />
            </Form.Item>
          </div>

          <Form.Item 
            name="summary" 
            label="Mô tả ngắn" 
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={2} placeholder="Sapo / Tóm tắt nội dung..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="categoryId" 
              label="Danh mục" 
              rules={[{ required: true, message: "Chọn danh mục" }]}
            >
              <Select 
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

            <Form.Item name="status" label="Trạng thái">
              <Select>
                <Select.Option value="Draft">Nháp (Draft)</Select.Option>
                <Select.Option value="Published">Công khai (Published)</Select.Option>
                <Select.Option value="Archived">Lưu trữ (Archived)</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="tagIds" label="Thẻ (Tags)">
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-3 gap-2">
                {tags.map((tag) => (
                  <Checkbox key={tag.id} value={tag.id}>
                    {tag.tagName}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item 
            name="content" 
            label="Nội dung chi tiết" 
            rules={[{ required: true, message: "Nội dung không được để trống" }]}
          >
            <ReactQuill theme="snow" style={{ height: 250, marginBottom: 50 }} />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-8 border-t pt-4">
            <Button onClick={onCancel} disabled={loading}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {initialValues ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ArticleForm;