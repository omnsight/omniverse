import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useAuth } from "react-oidc-context";
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";

export const Sidebar = () => {
  const auth = useAuth();
  const { user } = useAppStore();
  const navigate = useNavigate();

  return (
    <Card className="h-screen w-64 rounded-none border-r border-slate-800 bg-slate-950 p-4 shadow-xl">
      <div className="mb-6 flex items-center gap-4 p-2 text-white">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
           {/* Logo placeholder */}
           <GlobeAltIcon className="h-6 w-6 text-white"/>
        </div>
        <Typography variant="h6" color="white">
          OmnSight
        </Typography>
      </div>

      <List className="min-w-0 text-slate-300">
        <ListItem 
          onClick={() => navigate("/geovision")} 
          className="hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white"
        >
          <ListItemPrefix>
            <GlobeAltIcon className="h-5 w-5" />
          </ListItemPrefix>
          Geovision
        </ListItem>

        <ListItem 
          onClick={() => navigate("/admin")}
          className="hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white"
        >
          <ListItemPrefix>
            <ShieldCheckIcon className="h-5 w-5"/>
          </ListItemPrefix>
          Admin Panel
        </ListItem>
      </List>

      {/* Bottom User Section */}
      <div className="mt-auto">
        {user ? (
          <Menu placement="top-start" offset={10}>
            <MenuHandler>
              <ListItem className="group hover:bg-slate-800 hover:text-white">
                <ListItemPrefix>
                  <Avatar 
                    src="https://docs.material-tailwind.com/img/face-2.jpg" 
                    alt="avatar" 
                    size="sm" 
                    className="border border-slate-600"
                  />
                </ListItemPrefix>
                <div className="mr-auto overflow-hidden">
                  <Typography variant="small" className="font-medium text-white truncate">
                    {user.name || "User"}
                  </Typography>
                  <Typography variant="small" className="text-[10px] text-slate-500 truncate">
                    View Profile
                  </Typography>
                </div>
              </ListItem>
            </MenuHandler>
            
            <MenuList className="border-slate-700 bg-slate-800 text-slate-300">
              <MenuItem className="flex items-center gap-2 hover:bg-slate-700 hover:text-white">
                <UserCircleIcon className="h-5 w-5"/> Profile
              </MenuItem>
              <MenuItem className="flex items-center gap-2 hover:bg-slate-700 hover:text-white">
                <Cog6ToothIcon className="h-5 w-5"/> Settings
              </MenuItem>
              <hr className="my-2 border-slate-700" />
              <MenuItem 
                onClick={() => auth.signoutRedirect()}
                className="flex items-center gap-2 text-red-400 hover:bg-slate-700 hover:text-red-300"
              >
                <ArrowRightEndOnRectangleIcon className="h-5 w-5"/> Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <List className="min-w-0 text-slate-300">
            <ListItem 
              onClick={() => auth.signinRedirect()} 
              className="hover:bg-blue-600 hover:text-white"
            >
              <ListItemPrefix>
                <ArrowLeftEndOnRectangleIcon className="h-5 w-5"/>
              </ListItemPrefix>
              Log In
            </ListItem>
          </List>
        )}
      </div>
    </Card>
  );
};