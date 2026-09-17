import React from "react";
import { Button, Card, Typography } from "@heroui/react";
import { ArrowLeft, House, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70dvh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl">
        <Card.Content className="flex flex-col items-center gap-6 p-8 text-center md:p-10">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-default/50">
            <SearchX className="size-8 text-muted" />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted">
              Error 404
            </p>
            <Typography type="h2">Page not found</Typography>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              The page you are looking for does not exist or may have been
              moved.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="secondary" onPress={() => navigate(-1)}>
              <ArrowLeft className="size-4" />
              Go back
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}

export default NotFoundPage;
