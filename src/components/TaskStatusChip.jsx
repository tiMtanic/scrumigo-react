import { Chip } from "@heroui/react";
import React from "react";

function TaskStatusChip({ status }) {
  const getStatusProperties = () => {
    switch (status) {
      case "todo":
        return {
          label: "Todo",
          color: "default",
        };
      case "in_progress":
        return {
          label: "In Progress",
          color: "accent",
        };
      case "done":
        return {
          label: "Done",
          color: "success",
        };
    }
  };

  const properties = getStatusProperties();

  return (
    <Chip size="sm" variant="soft" className="px-2" color={properties.color}>
      {properties.label}
    </Chip>
  );
}

export default TaskStatusChip;
