import { NavLink } from "react-router-dom";
import { buttonVariants } from "@heroui/react";
import { LayoutDashboard, Columns3, Timer, NotebookText } from "lucide-react";

function MainMenuContent({ onNavigate }) {
  const menuItems = [
    {
      text: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      text: "Sprint Board",
      path: "/board",
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

  return (
    <nav className="flex flex-col gap-1 p-2">
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
    </nav>
  );
}

export default MainMenuContent;
