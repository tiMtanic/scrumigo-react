import { Button, Drawer, useOverlayState } from "@heroui/react";
import { Menu } from "lucide-react";
import MainMenuContent from "./MainMenuContent";

export default function AppHeader() {
  const menuState = useOverlayState();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* <Logo /> */}
            <p className="font-bold">SCRUMiGO</p>
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
                <Drawer.Body>
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
