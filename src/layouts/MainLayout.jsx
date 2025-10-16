import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import AppHeader from "./AppHeader";

export default function MainLayout({ children }) {
    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-screen-xl mx-auto px-0">
                <AppHeader />
                <main className="mt-16">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}