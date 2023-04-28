import { Menu } from "@headlessui/react";
import {
  KeyIcon,
  LinkIcon,
  MagnifyingGlassCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, CodeBracketIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { classNames } from "@app/lib/utils";
import { WorkspaceType } from "@app/types/user";

export default function MainTab({
  currentTab,
  owner,
}: {
  currentTab: string;
  owner: WorkspaceType;
}) {
  const tabs = [
    {
      name: "Apps",
      href: `/w/${owner.sId}/a`,
      icon: (
        <CodeBracketIcon
          className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0"
          aria-hidden="true"
        />
      ),
    },
    {
      name: "DataSources",
      href: `/w/${owner.sId}/ds`,
      icon: (
        <MagnifyingGlassCircleIcon
          className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0"
          aria-hidden="true"
        />
      ),
    },
  ] as { name: string; href: string; icon: JSX.Element }[];

  if (owner.role === "builder" || owner.role === "admin") {
    tabs.push({
      name: "API keys",
      href: `/w/${owner.sId}/keys`,
      icon: (
        <KeyIcon
          className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0"
          aria-hidden="true"
        />
      ),
    });
  }

  if (owner.role === "admin") {
    tabs.push({
      name: "Providers",
      href: `/w/${owner.sId}/providers`,
      icon: (
        <LinkIcon
          className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0"
          aria-hidden="true"
        />
      ),
    });
    if (owner.type === "team") {
      tabs.push({
        name: "Workspace",
        href: `/w/${owner.sId}/workspace`,
        icon: (
          <UsersIcon
            className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0"
            aria-hidden="true"
          />
        ),
      });
    }
  }

  let currTab = tabs.find((tab) => tab.name == currentTab);

  return (
    <div className="w-full">
      <div className="flex-cols flex border-b border-gray-200 px-2 sm:hidden">
        <div className="flex flex-1">
          <Menu as="div" className="relative w-full">
            <div>
              <Menu.Button className="flex w-full items-center text-sm font-bold text-gray-700 focus:outline-none">
                <div className="flex flex-initial px-4 py-3">
                  {currTab?.icon}
                  {currTab?.name}
                </div>
                <div className="flex">
                  <ChevronDownIcon className="mt-0.5 h-4 w-4 hover:text-gray-700" />
                </div>
              </Menu.Button>
            </div>
            <Menu.Items className="absolute left-0 z-10 mt-0 w-full origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {tabs.map((tab) => (
                <Menu.Item key={tab.name}>
                  {({ active }) => (
                    <Link
                      href={tab.href}
                      key={tab.name}
                      className={classNames(
                        "flex whitespace-nowrap font-medium",
                        active ? "bg-gray-50" : "",
                        "block px-4 py-3 text-sm text-gray-500"
                      )}
                    >
                      {tab.icon}
                      {tab.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        </div>
        {owner.type === "team" ? (
          <div className="flex flex-initial">
            <Link
              href={`/w/${owner.sId}/u`}
              className={classNames(
                "flex flex items-center whitespace-nowrap border-b-2 px-2 py-3 text-sm",
                "border-transparent font-medium text-violet-600 hover:border-gray-200 hover:text-violet-700"
              )}
            >
              Use
            </Link>
            <div
              className={classNames(
                "flex flex items-center whitespace-nowrap border-b-2 px-2 py-3 text-sm",
                "border-gray-500 font-bold text-gray-700"
              )}
            >
              Build
            </div>
          </div>
        ) : null}
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200 px-4">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <div key={tab.name} className="flex flex-initial">
                <Link
                  href={tab.href}
                  key={tab.name}
                  className={classNames(
                    "flex flex items-center whitespace-nowrap border-b-2 px-4 py-3 text-sm",
                    tab.name == currentTab
                      ? "border-gray-500 font-bold text-gray-700"
                      : "border-transparent font-medium text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  )}
                >
                  {tab.icon}
                  {tab.name}
                </Link>
              </div>
            ))}
            <div className="flex flex-1"></div>
            {owner.type === "team" ? (
              <div className="flex flex-initial">
                <Link
                  href={`/w/${owner.sId}/u`}
                  className={classNames(
                    "flex flex items-center whitespace-nowrap border-b-2 px-2 py-3 text-sm",
                    "border-transparent font-medium text-violet-600 hover:border-gray-200 hover:text-violet-700"
                  )}
                >
                  Use
                </Link>
                <div
                  className={classNames(
                    "flex flex items-center whitespace-nowrap border-b-2 px-2 py-3 text-sm",
                    "border-gray-500 font-bold text-gray-700"
                  )}
                >
                  Build
                </div>
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </div>
  );
}
