import React from "react";
import {} from "./SideNavIcons";
import { useTranslation } from "react-i18next";

export default function useSideNavItems() {
  const { t } = useTranslation();

  return [
    { id: 1, icon: "<CustomerIcon />", text: t("customer") },
    // { id: 2, icon: <BudgetsIcon />, text: t("budgets") },
    // { id: 3, icon: <ProductsIcon />, text: t("products") },
    // { id: 4, icon: <ContributorsIcon />, text: t("contributors") },
  ];
}
