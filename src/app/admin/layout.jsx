import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SetAdmin } from "@/features/admin/dashboard/setadmin"
import { authClient } from "@/utils/auth-client"


export default async function AdminLayout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header
                className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                        Building Your Application
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
  }