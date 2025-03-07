"use client"

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"

import { BillMenuGroup } from "./bill-group"

const GroupContainer = ({ label, children }: { label: string; children: React.ReactNode }) => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="h-[unset] pb-4 text-lg font-semibold">{label}</SidebarGroupLabel>
            <SidebarGroupContent>{children}</SidebarGroupContent>
        </SidebarGroup>
    )
}

export default function Menu() {
    const t = useTranslations("sidebar")
    return (
        <GroupContainer label={t("Money")}>
            <BillMenuGroup />
        </GroupContainer>
    )
}
