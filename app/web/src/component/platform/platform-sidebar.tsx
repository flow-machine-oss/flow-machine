"use client";

import {
  CreateOrganization,
  OrganizationProfile,
  UserProfile,
  useAuth,
  useOrganizationList,
  useUser,
} from "@clerk/nextjs";
import {
  BotIcon,
  Building2Icon,
  ChevronsUpDownIcon,
  FileTextIcon,
  FolderGitIcon,
  HandCoinsIcon,
  InboxIcon,
  KanbanSquareIcon,
  KeyRoundIcon,
  ListTodoIcon,
  LogOutIcon,
  type LucideIcon,
  PlusIcon,
  SettingsIcon,
  SquareMousePointerIcon,
  UserRoundPenIcon,
  WorkflowIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/component/ui/avatar";
import { Dialog, DialogContent } from "@/component/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/component/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/component/ui/sidebar";
import { useIsMobile } from "@/hook/use-mobile";

type NavigationItem = {
  title: string;
  href: string;
  Icon: LucideIcon;
};

export function PlatformSidebar() {
  const isMobile = useIsMobile();
  const [isOrganizationProfileOpen, setIsOrganizationProfileOpen] =
    useState(false);
  const [isCreateOrganizationOpen, setIsCreateOrganizationOpen] =
    useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  const { orgId } = useAuth();
  const { user } = useUser();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  const organizations =
    userMemberships.data?.map(
      (userMembership) => userMembership.organization,
    ) ?? [];
  const activeOrganization = organizations.find(
    (organization) => organization.id === orgId,
  );

  const fallbackInitials =
    (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "");

  const handleOrganizationProfileOpenToggle = () => {
    setIsOrganizationProfileOpen((prev) => !prev);
  };
  const handleCreateOrganizationOpenToggle = () => {
    setIsCreateOrganizationOpen((prev) => !prev);
  };
  const handleUserProfileOpenToggle = () => {
    setIsUserProfileOpen((prev) => !prev);
  };

  return (
    <>
      <Sidebar className="py-1.5 pr-0 pl-1" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={(props) => (
                    <SidebarMenuButton
                      {...props}
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      size="lg"
                    >
                      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <Building2Icon className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {activeOrganization?.name}
                        </span>
                      </div>
                      <ChevronsUpDownIcon className="ml-auto" />
                    </SidebarMenuButton>
                  )}
                />
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  align="start"
                  side={isMobile ? "bottom" : "right"}
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                      Organizations
                    </DropdownMenuLabel>
                    {organizations.map((organization, index) => (
                      <DropdownMenuItem
                        key={organization.name}
                        onClick={() => setActive?.({ organization })}
                      >
                        <div className="flex size-6 items-center justify-center rounded-md border">
                          <Building2Icon className="size-3" />
                        </div>
                        {organization.name}
                        <DropdownMenuShortcut>
                          ⌘{index + 1}
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 p-2"
                      onClick={handleOrganizationProfileOpenToggle}
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                        <SettingsIcon className="size-4" />
                      </div>
                      <div className="text-muted-foreground font-medium">
                        Settings
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 p-2"
                      onClick={handleCreateOrganizationOpenToggle}
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                        <PlusIcon className="size-4" />
                      </div>
                      <div className="text-muted-foreground font-medium">
                        Add organization
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Personal</SidebarGroupLabel>
            <SidebarMenu>
              {getPersonalNavigationItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={(props) => (
                      <Link href={item.href} {...props}>
                        <item.Icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {getPlatformNavigationItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={(props) => (
                      <Link href={item.href} {...props}>
                        <item.Icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Integration</SidebarGroupLabel>
            <SidebarMenu>
              {getIntegrationNavigationItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={(props) => (
                      <Link href={item.href} {...props}>
                        <item.Icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarMenu>
              {getSupportNavigationItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={(props) => (
                      <Link href={item.href} {...props}>
                        <item.Icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={(props) => (
                    <SidebarMenuButton
                      {...props}
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      size="lg"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user?.imageUrl}
                          alt={user?.fullName ?? "Unammed"}
                        />
                        <AvatarFallback className="rounded-lg">
                          {fallbackInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user?.fullName}
                        </span>
                        <span className="truncate text-xs">
                          {user?.primaryEmailAddress?.emailAddress}
                        </span>
                      </div>
                      <ChevronsUpDownIcon className="ml-auto size-4" />
                    </SidebarMenuButton>
                  )}
                />
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={user?.imageUrl}
                            alt={user?.fullName ?? "Unammed"}
                          />
                          <AvatarFallback className="rounded-lg">
                            {fallbackInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {user?.fullName}
                          </span>
                          <span className="text-muted-foreground truncate text-xs">
                            {user?.primaryEmailAddress?.emailAddress}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="gap-2 p-2"
                      onClick={handleUserProfileOpenToggle}
                    >
                      <SettingsIcon />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 p-2"
                    render={(props) => (
                      <Link {...props} href="/sign-out">
                        <LogOutIcon />
                        Log out
                      </Link>
                    )}
                  ></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <Dialog
        onOpenChange={handleOrganizationProfileOpenToggle}
        open={isOrganizationProfileOpen}
      >
        <DialogContent className="!max-w-fit bg-transparent p-0 ring-0">
          <OrganizationProfile
            afterLeaveOrganizationUrl="/platform"
            routing="hash"
          />
        </DialogContent>
      </Dialog>
      <Dialog
        onOpenChange={handleCreateOrganizationOpenToggle}
        open={isCreateOrganizationOpen}
      >
        <DialogContent className="!max-w-fit bg-transparent p-0 ring-0">
          <CreateOrganization
            afterCreateOrganizationUrl="/platform"
            skipInvitationScreen
            routing="hash"
          />
        </DialogContent>
      </Dialog>
      <Dialog
        onOpenChange={handleUserProfileOpenToggle}
        open={isUserProfileOpen}
      >
        <DialogContent className="!max-w-fit bg-transparent p-0 ring-0">
          <UserProfile routing="virtual" />
        </DialogContent>
      </Dialog>
    </>
  );
}

function getPersonalNavigationItems() {
  return [
    { title: "Inbox", href: "/platform/inbox", Icon: InboxIcon },
  ] as const satisfies NavigationItem[];
}

function getPlatformNavigationItems() {
  return [
    {
      title: "Project",
      href: "/platform/project",
      Icon: KanbanSquareIcon,
    },
    {
      title: "Issue",
      href: "/platform/issue",
      Icon: ListTodoIcon,
    },
    { title: "Workflow", href: "/platform/workflow", Icon: WorkflowIcon },
    {
      title: "Execution",
      href: "/platform/execution",
      Icon: SquareMousePointerIcon,
    },
    { title: "Document", href: "/platform/document", Icon: FileTextIcon },
  ] as const satisfies NavigationItem[];
}

function getIntegrationNavigationItems() {
  return [
    { title: "AI Agent", href: "/platform/ai-agent", Icon: BotIcon },
    {
      title: "Git Repository",
      href: "/platform/git-repository",
      Icon: FolderGitIcon,
    },
    { title: "Credential", href: "/platform/credential", Icon: KeyRoundIcon },
  ] as const satisfies NavigationItem[];
}

function getSupportNavigationItems() {
  return [
    { title: "Billing", href: "/platform/billing", Icon: HandCoinsIcon },
    {
      title: "Feedback",
      href: "/platform/feedback",
      Icon: UserRoundPenIcon,
    },
  ] as const satisfies NavigationItem[];
}
