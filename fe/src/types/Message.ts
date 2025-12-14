export interface Message {
  _id: string;
  conversationID: string;
  senderID: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  content: string;
  type: 'Text' | 'Image';
  isRead: boolean;
  createdAt: Date;
}