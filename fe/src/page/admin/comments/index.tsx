import React, { useState } from "react";
import { Card, Input, Button, List, Avatar, Popconfirm, Empty, Typography } from "antd";
import { DeleteOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useCommentsByArticle, useDeleteComment } from "@/hooks/useComments";

// 1. Định nghĩa kiểu dữ liệu cho Comment (Dựa trên cách bạn dùng trong JSX cũ)
// Nếu bạn đã có model Comment.ts, hãy import nó vào thay vì khai báo cục bộ
interface CommentUser {
  _id: string;
  fullName: string;
  avatarUrl?: string;
}

export interface CommentItem {
  _id: string;
  userID?: CommentUser | null; // Có thể null nếu là khách
  guestName?: string;
  content?: string;      // Backend thường trả về 'content'
  commentText?: string;  // Fallback nếu API trả về 'commentText' (theo code cũ của bạn)
  createdAt: string;
}

const CommentsPage: React.FC = () => {
  // 2. State
  const [articleId, setArticleId] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");

  // 3. Hooks
  // Hook này trả về data là mảng CommentItem
  const { data: comments = [], isLoading } = useCommentsByArticle(searchId);
  const deleteComment = useDeleteComment();

  // 4. Handlers
  const handleSearch = () => {
    if (!articleId.trim()) return;
    setSearchId(articleId.trim());
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card 
        title={<span className="text-lg font-bold">Quản lý Bình luận theo Bài viết</span>} 
        className="shadow-sm"
      >
        {/* --- Search Bar --- */}
        <div className="flex gap-2 mb-6 max-w-md">
          <Input
            placeholder="Nhập ID bài viết (Article ID)..."
            value={articleId}
            onChange={(e) => setArticleId(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined className="text-gray-400" />}
            allowClear
          />
          <Button type="primary" onClick={handleSearch} disabled={!articleId}>
            Xem bình luận
          </Button>
        </div>

        {/* --- Comments List --- */}
        <div className="bg-white rounded-md">
          {!searchId ? (
            <Empty description="Vui lòng nhập ID bài viết để xem bình luận" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              loading={isLoading}
              itemLayout="horizontal"
              dataSource={comments as CommentItem[]} // Ép kiểu nếu API trả về any
              locale={{ emptyText: "Bài viết này chưa có bình luận nào." }}
              renderItem={(item) => (
                <List.Item
                  className="hover:bg-gray-50 transition-colors px-4 rounded-md"
                  actions={[
                    <Popconfirm
                      title="Xóa bình luận này?"
                      description="Hành động này không thể hoàn tác."
                      onConfirm={() => deleteComment.mutate(item._id)}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger type="text" icon={<DeleteOutlined />} size="small">
                        Xóa
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} src={item.userID?.avatarUrl} />}
                    title={
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-700">
                          {item.userID ? item.userID.fullName : (item.guestName || "Khách vãng lai")}
                        </span>
                        <span className="text-xs text-gray-400 font-normal ml-2">
                          {new Date(item.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    }
                    description={
                      <Typography.Text className="text-gray-700 block mt-1">
                        {item.content || item.commentText}
                      </Typography.Text>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default CommentsPage;