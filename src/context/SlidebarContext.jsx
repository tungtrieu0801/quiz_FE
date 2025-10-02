import { createContext, useEffect, useState } from "react"

const SidebarContext = createContext();

export const SlidebarProvider = ({ children }) => {
    const [isExpanded, setIsExpaned] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [activeItem, setActiveItem] = useState<string | null> (null);

    // useEffect(() => {
    //     window.addEventListener()
    // }) 

    const toggleSidebar = () => {
        setIsExpaned((prev) => !prev)
    }

    return (
        <SidebarContext.Provider
            value={{
                isExpanded: isExpanded,
                isHovered,
                activeItem,
                toggleSidebar,
                setIsHovered,
                setActiveItem,
            }}>
            {children}
        </SidebarContext.Provider>
    );
}