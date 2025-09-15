import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMenu } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const SidebarContent = () => {
    const links = [
        { name: "Dashboard", path: "/" },
        { name: "Users", path: "/users" },
        { name: "Folders", path: "/folders" },
    ];

    return (
        <>
            <img src="/logo.png" alt="Zcruit.ai Logo" className="h-28 w-28 object-contain" />
            <p className="text-gray-600 text-center text-sm px-4">
                Your AI Recruiter, On Call.
            </p>

            <nav className="mt-8 flex flex-col space-y-2 w-full px-6">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `rounded-lg px-3 py-2 transition-colors duration-200 
                            ${isActive 
                                ? "bg-gray-200 text-gray-900 font-semibold shadow-sm" 
                                : "text-gray-700 hover:bg-gray-100"}`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </>
    );
};

const Sidebar = ({ sideBarOpen, setSideBarOpen }) => {
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSideBarOpen(true); 
            } else {
                setSideBarOpen(false);
            }
        };

        handleResize(); // run once on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setSideBarOpen]);

    return (
        <>
            <button
                className="absolute top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                onClick={() => setSideBarOpen(!sideBarOpen)}
            >
                {sideBarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            <AnimatePresence>
                {sideBarOpen && (
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3 }}
                        className="fixed md:static top-0 left-0 w-64 h-full bg-white shadow-lg md:shadow-none md:border-r md:border-gray-200 z-40 flex flex-col items-center py-6 space-y-4"
                    >
                        <SidebarContent />
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
