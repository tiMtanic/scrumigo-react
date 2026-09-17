import React from "react";
import StoryCard from "./StoryCard";

function MobileStoriesPanel({ userStories, onStoryClick }) {
  return (
    <div className="flex flex-col gap-3 pt-3">
      {userStories.map((story) => (
        <StoryCard
          key={story._id}
          story={story}
          onClick={() => onStoryClick(story._id)}
        />
      ))}
    </div>
  );
}

export default MobileStoriesPanel;
