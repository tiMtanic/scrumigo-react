import { Chip } from "@heroui/react";
import React from "react";

function BoardColumnHeader({ icon: Icon, label, count, color = "default" }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-default/50 px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <Chip size="sm" variant="soft" color={color} className="px-2">
        {count}
      </Chip>
    </div>
  );
}

export default BoardColumnHeader;
