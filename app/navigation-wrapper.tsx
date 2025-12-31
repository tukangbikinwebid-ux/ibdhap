"use client";

import { usePathname } from "next/navigation";
import BottomNavigation from "./components/BottomNavigation";

export default function NavigationWrapper() {
  const pathname = usePathname();

  const hiddenPaths = ["/auth/login", "/auth/register", "/login", "/register"];

  const shouldHideNavigation = hiddenPaths.includes(pathname);

  if (shouldHideNavigation) {
    return null;
  }

  return <BottomNavigation />;
}