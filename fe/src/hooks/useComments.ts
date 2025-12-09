import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { CommentService } from "@/services/Comment.service";

export const useCommentsByArticle = (articleId: string) => {
  return useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => CommentService.getByArticle(articleId),
    enabled: !!articleId,
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: CommentService.delete,
    onSuccess: () => {
      // Vì comment gắn liền với article, tốt nhất là invalidate cả list comment của article đó
      // Nhưng nếu không có articleId ở đây, ta invalidate toàn bộ key "comments"
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      message.success("Đã xóa bình luận");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Lỗi xóa bình luận");
    },
  });
};