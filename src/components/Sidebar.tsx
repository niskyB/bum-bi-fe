"use client";
import {
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import logoPath from "../assets/images/logo.jpg";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  {
    name: "Thống Kê",
    href: "/",
    icon: ChartBarIcon,
  },
  {
    name: "Đơn Hàng",
    href: "/order",
    icon: ClipboardDocumentCheckIcon,
  },

  {
    name: "Kho",
    href: "/inventory",
    icon: BuildingStorefrontIcon,
  },
];

export function SideBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative h-screen max-w-72 flex grow flex-col gap-y-6 overflow-y-auto bg-gray-900 px-6 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-r dark:before:border-white/10 dark:before:bg-black/10">
      <div className="relative flex h-32 shrink-0 self-center items-center pt-6">
        <Image
          alt="Your Company"
          src={logoPath}
          className="h-28 w-auto rounded-full"
        />
      </div>
      <nav className="relative flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-3">
              {navigation.map((item) => {
                const isActive = mounted
                  ? item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                  : false;
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        isActive
                          ? "bg-white/5 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white",
                        "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className="size-6 shrink-0"
                      />
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
