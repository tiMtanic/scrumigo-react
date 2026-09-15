import { Chip } from "@heroui/react";
import React from "react";

function UserStoryRow({ story }) {
  return (
    <div className="flex flex-col gap-3 p-4 transition-colors md:flex-row md:items-start md:justify-between md:p-5">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted">
            US-{story.userStoryNumber}
          </span>
          <h3 className="font-medium">{story.title}</h3>
        </div>
        {story.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted md:max-w-3xl">
            {story.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 md:ml-6">
        <Chip variant="soft" color="accent" size="sm" className="px-4">
          {story.storyPoints ?? 0}{" "}
          {story.storyPoints === 1 ? "Point" : "Points"}
        </Chip>
      </div>
    </div>
  );
}

export default UserStoryRow;
