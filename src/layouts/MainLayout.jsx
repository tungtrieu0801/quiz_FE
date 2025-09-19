import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({ children }) {
    return (
        <div className="bg-gray-900">
            <Header />
            <main><Outlet /></main>
            <Footer />
        </div>
    )
}