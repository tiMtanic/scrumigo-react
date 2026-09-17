import { Button, Drawer, useOverlayState } from "@heroui/react";
import { Menu } from "lucide-react";
import MainMenuContent from "./MainMenuContent";
import scrumigoLogoSmall from "../assets/scrumigo_logo_small.png";

export default function AppHeader() {
  const menuState = useOverlayState();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 items-center justify-between pr-6 pl-3">
        <div className="flex items-center gap-4">
          <div className="flex h-10 items-center">
            <img
              src={scrumigoLogoSmall}
              alt="SCRUMiGO"
              className="block max-h-full max-w-full object-contain"
            />
          </div>
        </div>
        <Drawer state={menuState}>
          <Button
            className="md:hidden"
            variant="ghost"
            onPress={menuState.open}
            aria-label="Toggle menu"
          >
            <Menu />
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content placement="left">
              <Drawer.Dialog>
                <Drawer.CloseTrigger />
                <Drawer.Header>
                  <Drawer.Heading>Navigation</Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body className="flex min-h-0 flex-1 flex-col p-0">
                  <MainMenuContent onNavigate={menuState.close} />
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </header>
    </nav>
  );
}
