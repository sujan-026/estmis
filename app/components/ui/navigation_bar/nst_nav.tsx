import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp, FaBars, FaHome } from "react-icons/fa";
import { PiStudentBold, PiLadder } from "react-icons/pi";
import { GrCertificate, GrUpdate } from "react-icons/gr";
import { FcStatistics } from "react-icons/fc";
import { useUser } from "../../../context/usercontext";

const HorizontalNavbarNST: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  const toggleMenu = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleSubmenu = (menu: string) => {
    setOpenMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      ref={menuRef}
      className={`fixed top-20 bg-blue-600 text-white shadow-md transition-all duration-500 ${
        isExpanded ? "w-screen" : "w-12"
      } right-0`}
    >
      <div className="flex justify-between items-center px-4">
        {/* Menu Toggle Icon */}
        {isExpanded && (
          <ul
            className={`flex items-center  transition-all ${
              isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Home */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              {/* <Link href="/admission/adm_home"> */}
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded">
                <FaHome className="text-sm" />
                <span className="text-sm">Home</span>
              </div>
            </li>

            {/* Profile */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Profile")}
              >
                <GrCertificate className="text-sm" />
                <span className="text-sm">Profile</span>
                {openMenu === "Profile" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "Profile" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Personal",
                      href: "/mis_non_teaching_staff/profile",
                    },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="hover:bg-gray-200 px-4 py-2 whitespace-nowrap"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        )}
        <button
          onClick={toggleMenu}
          className="text-xl pt-2 pb-2 focus:outline-none"
        >
          <FaBars />
        </button>
      </div>
    </nav>
  );
};

export default HorizontalNavbarNST;
