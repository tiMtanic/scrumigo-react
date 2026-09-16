import React from "react";

function SprintPreview({ sprint }) {
  if (!sprint) {
    return null;
  }

  return (
    <div className="rounded-xl border border-separator p-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted">
          Sprint-{sprint.sprintNumber}
        </span>
        <span className="font-medium">
          {sprint.name}
        </span>
        {sprint.goal && (
          <p className="mt-1 text-sm text-muted">
            {sprint.goal}
          </p>
        )}
      </div>
    </div>
  );
}

export default SprintPreview;
