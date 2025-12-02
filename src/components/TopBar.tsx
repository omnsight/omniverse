import { Navbar, IconButton } from "@material-tailwind/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useAppStore } from '../store/useAppStore';
import type { ReactNode } from "react";

interface TopBarProps {
  children?: ReactNode;
}

export const TopBar = ({ children }: TopBarProps) => {
  const { theme, toggleTheme } = useAppStore();

  return (
    <Navbar 
      fullWidth 
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between rounded-none border-b border-slate-800 bg-slate-900 px-4 py-0 shadow-none"
    >
      <div className="flex-1">
        {children}
      </div>

      <div className="flex items-center gap-2 pl-4">
        <IconButton variant="text" onClick={toggleTheme} className="text-slate-400 hover:text-yellow-400">
           {theme === "dark" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        </IconButton>
      </div>
    </Navbar>
  );
};