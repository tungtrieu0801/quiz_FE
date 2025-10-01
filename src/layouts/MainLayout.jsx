import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({ children }) {
    return (
        <div className="">
            <Header />
            <main><Outlet /></main>
            <Footer />
        </div>
    )
}