import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Avatar, Button, buttonVariants, useTheme } from "@heroui/react";
import { Columns3, Moon, NotebookText, Sun, Timer } from "lucide-react";
import { AuthContext } from "../context/auth.context";

function MainMenuContent({ onNavigate }) {
  const { name, surname, logout } = useContext(AuthContext);
  const { resolvedTheme, setTheme } = useTheme("system");

  const menuItems = [
    {
      text: "Sprint Board",
      path: "/",
      icon: Columns3,
    },
    {
      text: "Sprints",
      path: "/sprints",
      icon: Timer,
    },
    {
      text: "User Stories",
      path: "/userStories",
      icon: NotebookText,
    },
  ];

  const initials =
    `${name?.charAt(0) ?? ""}${surname?.charAt(0) ?? ""}`.toUpperCase();

  const handleLogout = () => {
    onNavigate?.();
    logout();
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="flex min-h-0 w-full flex-1 flex-col p-2">
      <div className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              buttonVariants({
                variant: isActive ? "secondary" : "ghost",
                fullWidth: true,
                className: [
                  "justify-start gap-3",
                  isActive ? "font-medium" : "text-muted hover:text-foreground",
                ].join(" "),
              })
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`size-5 ${
                    isActive ? "text-foreground" : "text-muted"
                  }`}
                />
                <span>{item.text}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="mt-auto border-t border-separator pt-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-10 shrink-0" variant="soft" color="accent">
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {name} {surname}
            </p>
            <button
              type="button"
              className="cursor-pointer text-xs text-muted hover:text-foreground hover:underline"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={
              resolvedTheme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            onPress={toggleTheme}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default MainMenuContent;
