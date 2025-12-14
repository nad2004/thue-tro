// Dùng Map để lưu trữ vì hiệu năng tốt hơn Object khi thêm/xóa liên tục
const userSocketMap = new Map();

export const addUser = (userId, socketId) => {
  userSocketMap.set(userId, socketId);
};

export const removeUser = (socketId) => {
  for (const [userId, id] of userSocketMap.entries()) {
    if (id === socketId) {
      userSocketMap.delete(userId);
      return userId; 
    }
  }
};

export const getSocketId = (userId) => {
  return userSocketMap.get(userId);
};

export const getOnlineUsers = () => {
  return Array.from(userSocketMap.keys());
};