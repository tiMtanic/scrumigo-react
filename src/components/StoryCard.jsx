import { Card, Chip } from "@heroui/react";
import React from "react";

function StoryCard({ story, onClick }) {
  return (
    <Card
      className="h-full cursor-pointer transition-colors hover:bg-default/30"
      onClick={onClick}
    >
      <Card.Content>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted">
            US-{story.userStoryNumber}
          </span>
          {story.storyPoints != null && (
            <Chip size="sm" variant="soft" color="accent" className="px-2">
              {story.storyPoints} pts
            </Chip>
          )}
        </div>
        <p className="font-medium">{story.title}</p>
        {story.description && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
            {story.description}
          </p>
        )}
      </Card.Content>
    </Card>
  );
}

export default StoryCard;
