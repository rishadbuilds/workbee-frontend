import {
    Bell,
    BriefcaseBusiness,
    CreditCard,
    LayoutDashboard,
    Lock,
    LogOut,
    Mail,
    MessagesSquare,
    User,
    Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import type { IUser } from "workbee-common";
import { AppRoutes } from "@/constants/routes/app-routes";
import { IconLiveView } from "@tabler/icons-react";

interface ProfileDropDownMenuProps {
    user: IUser;
    onLogout: () => void;
}

const ProfileDropDownMenu = ({ user, onLogout }: ProfileDropDownMenuProps) => {
    // console.log("user:", user);
    // console.log("prof imgage", user?.profileImage);
    const getInitials = (name: string) => {
        if (!name) return "U";
        const names = name.split(" ");
        return names.length > 1
            ? `${names[0][0]}${names[1][0]}`.toUpperCase()
            : names[0][0].toUpperCase();
    };

    const userName = user?.name || "User";
    const userEmail = user?.email || "user@example.com";
    const profilePic = user?.profileImage || "";

    const navigate = useNavigate()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded-full hover:cursor-pointer hover:bg-gray-900 transition">
                    <Avatar className="h-8 w-8 border-gray-800">
                        <AvatarImage
                            src={profilePic}
                            alt={userName}
                            className="h-full w-full object-cover"
                        />

                        <AvatarFallback className="text-sm">
                            {getInitials(userName)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3 pb-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage alt={userName} src={profilePic} />
                            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                            <p className="font-medium text-sm leading-none">{userName}</p>
                            <p className="text-muted-foreground text-xs leading-none">
                                {userEmail}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate(AppRoutes.USER.DASHBOARD.DASH)}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        My Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(AppRoutes.USER.DASHBOARD.PROFILE_SETTINGS)}>
                        <User />
                        Profile Settings
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem  onClick={() => navigate(AppRoutes.USER.DASHBOARD.PROFILE_SETTINGS)}>
                        <Mail />
                        Email Preferences
                    </DropdownMenuItem>
                    <DropdownMenuItem  onClick={() => navigate(AppRoutes.USER.DASHBOARD.PROFILE_SETTINGS)}>
                        <Lock />
                        Privacy & Security
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Messages & Works</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate(AppRoutes.USER.DASHBOARD.MESSAGES)}>
                        <MessagesSquare />
                        My Messages
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(AppRoutes.USER.DASHBOARD.MY_WORKS)}>
                        <BriefcaseBusiness />
                        My Works
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(AppRoutes.USER.DASHBOARD.ACTIVE_WORKS)}>
                        <IconLiveView />
                        Live Works
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuLabel>Payment</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate(AppRoutes.USER.DASHBOARD.WALLET)}>
                        <CreditCard />
                        Payments
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(AppRoutes.USER.DASHBOARD.WALLET)}>
                        <Users />
                        Wallet
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={onLogout}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileDropDownMenu;