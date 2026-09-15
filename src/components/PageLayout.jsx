import { Typography } from "@heroui/react";
import React from "react";

function PageLayout({ children, pageTitle }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 max-w-7xl">
      {pageTitle && <Typography type="h2">{pageTitle}</Typography>}
      <div className="">{children}</div>
    </div>
  );
}

export default PageLayout;
