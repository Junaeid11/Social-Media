"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiHome,
  FiSettings,
  FiUserPlus,
  FiUser,
  FiBell,
  FiMenu,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "@/redux/auth/authSlice";
import { fetchUsers } from "@/redux/users/usersSlice";
import { IoRocketOutline } from "react-icons/io5";
import Search from "./Search";
import Notification from "./Notification";
import { useLoading } from "@/components/LoadingProvider";
import { useRouter } from "next/navigation";
import ProfileMenu from "./ProfileMenu";
import Link from "next/link";
import logo from "./../../../components/logo2.png";
import Image from "next/image";

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showLoadingFor } = useLoading();
  const [isClient, setIsClient] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoverNav, setHoverNav] = useState(null);

  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);

  // Custom navigation function to show loading state
  const handleNavigation = (path) => {
    showLoadingFor(500); // Show loading for 500ms
    router.push(path);
  };

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchUsers());
    if (isLoggedIn) {
      dispatch(fetchUserDetails());
    }

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoggedIn, dispatch]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {isLoggedIn && (
        <div className="h-16 relative z-30">
          <motion.header
            className={`h-16 backdrop-blur-lg border-b border-gray-100 transition-all duration-300 flex items-center justify-between px-4 md:px-6 fixed w-full top-0 ${
              scrolled ? "bg-white/90 shadow-md" : "bg-white/45 shadow-sm"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Left Section - Logo & Nav Links */}
            <div className="flex items-center">
              <div
                onClick={() => handleNavigation("/")}
                className="flex items-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="relative"
                >
                  <Image src={logo} width={50} height={200} alt="LOLfeed" />
                  <motion.div
                    className="absolute inset-0 bg-indigo-400/20 rounded-lg blur-md"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 0.4, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                </motion.div>
                <span className="font-bold text-lg bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-red-600 transition-all duration-500">
                  LOLfeed
                </span>
              </div>

              <nav className="hidden lg:flex ml-4 space-x-2">
                {/* Example Nav Item */}
                {[
                  {
                    name: "Home",
                    icon: (
                      <FiHome className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600" />
                    ),
                    color: "indigo",
                    path: "/",
                    key: "home",
                  },
                  {
                    name: "Profile",
                    icon: (
                      <FiUser className="w-5 h-5 text-green-500 group-hover:text-green-600" />
                    ),
                    color: "green",
                    path: `/profile/${userDetails?._id}`,
                    key: "profile",
                  },
                  {
                    name: "Connections",
                    icon: (
                      <FiUserPlus className="w-5 h-5 text-pink-500 group-hover:text-pink-600" />
                    ),
                    color: "pink",
                    path: "/friends",
                    key: "connections",
                  },
                  {
                    name: "Explore",
                    icon: (
                      <IoRocketOutline className="w-5 h-5 text-purple-500 group-hover:text-purple-600" />
                    ),
                    color: "purple",
                    path: "/explore",
                    key: "explore",
                  },
                ].map(({ name, icon, color, path, key }) => (
                  <div
                    key={key}
                    onClick={() => handleNavigation(path)}
                    onMouseEnter={() => setHoverNav(key)}
                    onMouseLeave={() => setHoverNav(null)}
                    className={`relative flex items-center space-x-2 text-gray-700 hover:text-${color}-600 
        transition-all duration-300 ease-in-out py-2 px-3 rounded-full hover:bg-${color}-50 
        group cursor-pointer`}
                  >
                    <motion.div
                      whileHover={{ y: -3, scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      {icon}
                    </motion.div>
                    <span className="font-medium ml-2 transition-all duration-300">
                      {name}
                    </span>

                    {hoverNav === key && (
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${color}-500 rounded-full`}
                        initial={{ width: 0, left: "50%", right: "50%" }}
                        animate={{ width: "100%", left: 0, right: 0 }}
                        exit={{ width: 0, left: "50%", right: "50%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Middle Section - Search */}
            <Search />

            {/* Right Section - User & Actions */}
            <div className="flex items-center space-x-1 md:space-x-3">
              {/* Notifications */}
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  onClick={() => handleNavigation("/settings")}
                  className="hidden md:flex p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <FiSettings className="w-5 h-5 text-gray-700" />
                </div>
              </motion.div>
              <Notification />

              {/* Settings */}
        

              {/* Mobile Search Trigger */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowMobileSearch(true)}
              >
                <FiSearch className="w-5 h-5 text-gray-700" />
              </motion.button>

              {/* User Profile */}
              <ProfileMenu userDetails={userDetails} />

              {/* Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden"
                onClick={toggleSidebar}
              >
                <FiMenu className="w-5 h-5 text-gray-700" />
              </motion.button>
            </div>
          </motion.header>

          {/* Mobile Search Overlay */}
          <AnimatePresence>
            {showMobileSearch && (
              <Search
                isMobile={true}
                onClose={() => setShowMobileSearch(false)}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default Header;
