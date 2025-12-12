export interface ITag {
  id: string;
  tagName: string;
  tagSlug: string;
}

export interface CreateTagPayload {
  tagName: string;
  tagSlug: string;
}

export class Tag implements ITag {
  id: string;
  tagName: string;
  tagSlug: string;

  constructor(data: any) {
    this.id = data?.id || data?._id || '';
    // Backend trả về tagName hoặc name
    this.tagName = data?.tagName || data?.name || '';
    // Backend trả về tagSlug hoặc slug
    this.tagSlug = data?.tagSlug || data?.slug || '';
  }

  toApiPayload(): CreateTagPayload {
    return {
      tagName: this.tagName,
      tagSlug: this.tagSlug,
    };
  }
}
