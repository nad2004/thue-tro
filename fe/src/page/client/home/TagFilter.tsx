import React from 'react';
import { Tag as AntTag, Spin } from 'antd';
import { Tag as TagIcon } from 'lucide-react';
import { Tag } from '@/types/Tag';

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  loading?: boolean;
}

const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onTagToggle,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <TagIcon size={16} className="text-gray-400" />
        <Spin size="small" />
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
        <TagIcon size={16} className="text-gray-400" />
        <span>Lọc theo thẻ:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);

          return (
            <AntTag
              key={tag.id}
              color={isSelected ? 'orange' : 'default'}
              className={`
                cursor-pointer px-3 py-1.5 text-sm rounded-full border transition-all
                ${
                  isSelected
                    ? 'border-orange-400 shadow-sm'
                    : 'border-gray-200 hover:border-orange-300'
                }
              `}
              onClick={() => onTagToggle(tag.id)}
            >
              #{tag.tagName}
            </AntTag>
          );
        })}
      </div>

      {selectedTags.length > 0 && (
        <div className="text-xs text-gray-500">Đã chọn {selectedTags.length} thẻ</div>
      )}
    </div>
  );
};

export default TagFilter;
