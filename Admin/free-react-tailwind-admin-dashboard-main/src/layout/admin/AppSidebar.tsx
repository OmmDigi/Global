import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { TbSchool } from "react-icons/tb";
import { FaUniversity } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";
import { MdOutlineInventory } from "react-icons/md";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { PiOfficeChairDuotone } from "react-icons/pi";
import { GrHostMaintenance } from "react-icons/gr";
import { TbReport } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";

import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
} from "../../icons";
import { useSidebar } from "../../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  id: number;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    id: number;
  }[];
};

// const numbers = [4,5,6];

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    id: 1,
    icon: <GridIcon />,
    path: "/home",
  },

  {
    name: "Courses",
    id: 5,
    icon: <TbSchool />,
    path: "/courses",
    subItems: [
      { name: "Create Fees Head", id: 5.1, path: "/feeHead", pro: false },
      { name: "Create Session", id: 5.2, path: "/session", pro: false },
      { name: "Create Courses", id: 5.3, path: "/courses", pro: false },
      { name: "Create Batch", id: 5.4, path: "/batch", pro: false },
    ],
  },
  {
    name: "Admission",
    id: 6,
    icon: <FaUniversity />,
    path: "/admissionAdmin",
  },
  {
    name: "Create Employee",
    id: 7,
    icon: <MdWorkOutline />,
    path: "/create-employee",
  },
  {
    name: "Attendance & Payslip",
    id: 11,
    icon: <PiOfficeChairDuotone />,
    subItems: [
      { name: "Attendance", id: 5.1, path: "/stuff-attandance", pro: false },
      // {name: "Advance Loan/Payment",id: 5.1,path: "/advance-payment", pro: false,},
      { name: "Payslip", id: 5.1, path: "/stuff-payslip", pro: false },
    ],
  },
  {
    name: "Teacher Class Status",
    id: 12,
    icon: <PiOfficeChairDuotone />,
    path: "/teacher-assigned-class",
  },

  {
    name: "Manage Holidays",
    id: 2,
    icon: <ListIcon />,
    path: "/manageHolidays",
  },
  {
    name: "Leave Apply",
    id: 3,
    icon: <ListIcon />,
    path: "/createLeave",
  },
  {
    name: "Manage Leave",
    id: 4,
    icon: <ListIcon />,
    path: "/manageLeave",
  },
  {
    name: "Stock Manage",
    id: 8,
    icon: <MdOutlineInventory />,
    path: "/inventory-manage",
    subItems: [
      {
        name: "Stock Details",
        id: 5.1,
        path: "/inventory-manage",
        pro: false,
      },
      { name: "Vendor Manage", id: 5.1, path: "/vendorManage", pro: false },
    ],
  },
  {
    name: "Purchase Record",
    id: 9,
    icon: <BiPurchaseTagAlt />,
    path: "/purchase-record",
  },
  {
    name: "AMC Record",
    id: 10,
    icon: <GrHostMaintenance />,
    path: "/amc-record",
  },
  {
    name: "Admin Access",
    id: 15,
    icon: <TbReport />,
    subItems: [
      // {
      //   name: "Admin Report",
      //   id: 5.1,
      //   path: "/admin-report",
      //   pro: false,
      // },
      {
        name: "Fees Update",
        id: 5.1,
        path: "/fees-update",
        pro: false,
      },
    ],
  },
  {
    name: "Report",
    id: 13,
    icon: <TbReport />,
    path: "/report",
  },
  {
    name: "Settings",
    id: 14,
    icon: <IoSettingsOutline />,
    path: "/settings",
  },
];

const othersItems: NavItem[] = [
  // {
  //   icon: <UserCircleIcon />,
  //   id: 12,
  //   name: "User Profile",
  //   path: "/profile",
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const permission = localStorage.getItem("permissions");
  const numbers = permission?.split(",")?.map(Number);
  const filteredNavItems = navItems.filter((item) =>
    numbers?.includes(item.id)
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? filteredNavItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    }, []);

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
        }`}
      >
        <div>
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className=" rounded-full items-center"
                src="/images/logo/global-logo.png"
                alt="Logo"
                width={80}
                height={80}
              />
            </>
          ) : (
            <img
              src="/images/logo/global-logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? "" : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
