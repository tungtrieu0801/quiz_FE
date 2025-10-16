import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import AppHeader from "./AppHeader";

export default function MainLayout() {
  return (
    <div className="bg-white min-h-screen">
      <AppHeader />

      <main className="mt-10 mx-auto">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
