import React, { useState } from 'react'
import Sidebar from '../components/SideBar';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
const Layout = () => {
    const [sideBarOpen, setSideBarOpen] = useState(false);
    return (
        <div className="flex min-h-screen">
            <Sidebar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
            <main className="flex-1 p-4 m-4">
                <Outlet />
            </main>
            <ToastContainer />
        </div>
    );
}

export default Layout
