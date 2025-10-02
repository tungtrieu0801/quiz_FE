import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import AppHeader from "./AppHeader";

export default function MainLayout({ children }) {
    return (
        <div className="">
            <AppHeader />
            <main><Outlet /></main>
            <Footer />
        </div>
    )
}