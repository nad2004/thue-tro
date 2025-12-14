
export interface IConversation {
  _id: string;
  buyerID: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  ownerID: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  lastMessageSnippet: string;
  lastMessageTime: Date;
  unreadCount: number;
}