"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { BillMenuGroup } from "./bill-group";
import PlanningMenuGroup from "./planning-group";

const GroupContainer = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-lg font-semibold text-black pb-4 h-[unset]">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>{children}</SidebarGroupContent>
    </SidebarGroup>
  );
};

export default function Menu() {
  return (
    <>
      <GroupContainer label="Bill">
        <BillMenuGroup />
      </GroupContainer>

      <GroupContainer label="Planning">
        <PlanningMenuGroup />
      </GroupContainer>
    </>
  );
}
