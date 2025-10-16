import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import AppHeader from "./AppHeader";

export default function MainLayout() {
  return (
    <div className="bg-white min-h-screen">
      <AppHeader />

      <main className="mt-16 max-w-screen-lg mx-auto px-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
