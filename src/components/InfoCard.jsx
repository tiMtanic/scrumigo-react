import { Card } from "@heroui/react";
import React from "react";

function InfoCard({ icon: Icon, label, value, description}) {
  return (
    <Card variant="secondary">
      <Card.Content className="flex flex-row items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-default">
          <Icon className="size-5 text-muted" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">{label}</p>
          <p className="mt-0.5 truncate font-semibold">{value}</p>
          {description && (
            <p className="truncate text-xs text-muted">{description}</p>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}

export default InfoCard;
