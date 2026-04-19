import React from "react";
import { Tag, TagType, TagState } from "../tag/GameCardTag.1.0.0";
import { layout } from "../../tokens/design-tokens";

export interface TagConfig {
  label: string;
  type?: TagType;
  state?: TagState;
}

export interface TagRowProps {
  tags: TagConfig[];
  className?: string;
  style?: React.CSSProperties;
}

export const TagRow: React.FC<TagRowProps> = ({ tags, className, style }) => {
  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: layout.gap8,
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {tags.map((tag, i) => (
        <Tag key={i} type={tag.type} state={tag.state}>
          {tag.label}
        </Tag>
      ))}
    </div>
  );
};

export default TagRow;
