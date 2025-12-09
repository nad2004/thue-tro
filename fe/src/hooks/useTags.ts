import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { TagService } from "@/services/Tag.service";
import { QueryParams } from "@/types/api";

export const useTags = (params: QueryParams = {}) => {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: () => TagService.getAll(params),
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TagService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      message.success("Tạo thẻ thành công");
    },
    onError: (e: any) => message.error(e.response?.data?.message || "Lỗi tạo thẻ"),
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TagService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      message.success("Xóa thẻ thành công");
    },
    onError: (e: any) => message.error(e.response?.data?.message || "Lỗi xóa thẻ"),
  });
};