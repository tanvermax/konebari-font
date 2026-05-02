import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,

  UserPenIcon,
} from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { UserRound } from "lucide-react"
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api"
import { useAppDispatch } from "@/redux/hook"
import { Link } from "react-router"

// import UserIcon from "../ui/userIcon";
export interface IUser {
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

interface UserMenuProps {
  userData: IUser
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UserMenu({ userData }: UserMenuProps) {
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const handlelogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());

  }
  // console.log(userData)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <div className="relative">
            <Avatar>
              <AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" />
              <AvatarFallback> <UserRound /></AvatarFallback>
            </Avatar>
            <span className="absolute -end-1.5 -top-1.5">
              <span className="sr-only">Verified</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  className="fill-background"
                  d="M3.046 8.277A4.402 4.402 0 0 1 8.303 3.03a4.4 4.4 0 0 1 7.411 0 4.397 4.397 0 0 1 5.19 3.068c.207.713.23 1.466.067 2.19a4.4 4.4 0 0 1 0 7.415 4.403 4.403 0 0 1-3.06 5.187 4.398 4.398 0 0 1-2.186.072 4.398 4.398 0 0 1-7.422 0 4.398 4.398 0 0 1-5.257-5.248 4.4 4.4 0 0 1 0-7.437Z"
                />
                <path
                  className="fill-primary"
                  d="M4.674 8.954a3.602 3.602 0 0 1 4.301-4.293 3.6 3.6 0 0 1 6.064 0 3.598 3.598 0 0 1 4.3 4.302 3.6 3.6 0 0 1 0 6.067 3.6 3.6 0 0 1-4.29 4.302 3.6 3.6 0 0 1-6.074 0 3.598 3.598 0 0 1-4.3-4.293 3.6 3.6 0 0 1 0-6.085Z"
                />
                <path
                  className="fill-background"
                  d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
                />
              </svg>
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {userData.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {userData.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {/* {
              userData.role === "ADMIN" ? (<> */}
            {/* <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
                <Link to={"admin/add-product"}>Amin Panel</Link> */}
            {/* </>) : ""
            }
            { */}
            {/* userData.role === "USER" ? (<> */}
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <Link to={"admin/users"}>Dashboard</Link>
            {/* </>) : ""
            } */}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
            <span>favorite</span>
          </DropdownMenuItem>
          <Link to={"ordertrack"}> <DropdownMenuItem>
            <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Orders History</span>
          </DropdownMenuItem></Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>

          <DropdownMenuItem>
            <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Account Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>

          <Button onClick={handlelogout}>
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />logout</Button>
          {/* <span>Logout</span> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
