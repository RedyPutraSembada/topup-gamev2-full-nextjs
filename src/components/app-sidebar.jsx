import * as React from "react";
import { ChevronRight } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Data Product",
      url: "#",
      items: [
        {
          title: "Provider Product",
          url: "/admin/provider-product",
        },
        {
          title: "Type Product",
          url: "/admin/type-product",
        },
        {
          title: "Product",
          url: "/admin/product",
        },
        {
          title: "Product In Provider",
          url: "/admin/product-in-provider",
        },
        {
          title: "Voucher",
          url: "/admin/voucher",
        },
      ],
    },
    {
      title: "News",
      url: "#",
      items: [
        {
          title: "Data News",
          url: "/admin/news",
        },
      ],
    },
    {
      title: "Setting Website",
      url: "#",
      items: [
        {
          title: "Data Website",
          url: "/admin/data-website",
        },
        {
          title: "Images Slideshow",
          url: "/admin/images-slideshow",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        <SidebarMenuItem key={"dashboard"}>
          <SidebarMenuButton
            asChild
            // isActive={item.isActive}
          >
            <a href={"/admin"}>Dasboard</a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
