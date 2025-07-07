import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import SidebarItem from './SidebarItem';

const Sidebar = () => {
    const { isOpen, setIsOpen } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <div className={`fixed left-0 top-0 w-64 h-screen flex flex-col bg-white shadow-lg z-50 transition-all duration-500 ease-in-out ${
                !isOpen ? '-translate-x-full' : 'translate-x-0'
            }`}>
                {/* Fixed Header */}
                <div className="flex-shrink-0 p-4 border-b border-b-[#F8F9F4]">
                    <Link to="/" className="flex items-center group">
                        <div className="p-2 rounded-xl bg-[#4CAF50]/10 group-hover:bg-[#4CAF50]/20 transition-colors duration-300">
                            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 w-8" alt="Logo" />
                        </div>
                        <h2 className="ml-3 font-bold text-xl text-[#333333]">
                            CHILD <span className="bg-[#4CAF50] text-white px-2 rounded-md">CARE</span>
                        </h2>
                    </Link>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
                ">
                    <ul className="space-y-2">
                        <span className="text-gray-400 font-bold">CORE</span>
                    
                        <SidebarItem 
                            icon="ri-dashboard-line" 
                            text="Dashboard" 
                            path="/dashboard" 
                            isActive={location.pathname === "/dashboard" || location.pathname === "/dashboard/"}
                        />
                    
                        {/* <SidebarDropdown 
                            icon="ri-user-smile-line"
                            text="Child Profile"
                            items={[
                                { text: "View/Edit Details", path: "/dashboard/child/registration" },
                                { text: "Add Child", path: "/child/add" }
                            ]}
                            currentPath={location.pathname}
                        /> */}
                    
                        <SidebarDropdown 
                            icon="ri-flag-line"
                            text="Milestone Tracking"
                            items={[
                                // { text: "Checklist", path: "/dashboard/milestones/checklist" },
                                // { text: "Timeline", path: "/dashboard/milestones/timeline" },
                                { text: "WHO Guidelines", path: "/dashboard/milestones/who-guidelines" }
                            ]}
                            currentPath={location.pathname}
                        />

                        <SidebarDropdown 
                            icon="ri-heart-pulse-line"
                            text="Health Metrics"
                            items={[
                                // { text: "Growth Charts", path: "/dashboard/health/growth" },
                                { text: "Vaccinations", path: "/dashboard/health/vaccinations" },
                                // { text: "Custom Forms", path: "/dashboard/health/forms" }
                            ]}
                            currentPath={location.pathname}
                        />

                        <span className="text-gray-400 font-bold mt-4">SERVICES</span>
                    
                        <SidebarDropdown 
                            icon="ri-video-chat-line"
                            text="Video Consultations"
                            items={[
                                { text: "Schedule", path: "/dashboard/consultations/schedule" },
                                { text: "My Appointments", path: "/dashboard/consultations/history" },
                                { text: "Prescriptions", path: "/dashboard/consultations/prescriptions" }
                            ]}
                            currentPath={location.pathname}
                        />

                        <SidebarDropdown 
                            icon="ri-service-line"
                            text="Support Services"
                            items={[
                                { text: "Specialized Services", path: "/dashboard/support/disability" },
                                { text: "Online Therapy", path: "/dashboard/support/therapy/online" },
                                { text: "Surgery Assistance", path: "/dashboard/support/surgery" },
                                { text: "School Enrollment", path: "/dashboard/support/school" },
                                { text: "Government Schemes", path: "/dashboard/support/government" }
                            ]}
                            currentPath={location.pathname}
                        />

                        {/* <SidebarDropdown 
                            icon="ri-map-pin-line"
                            text="Local Resources"
                            items={[
                                { text: "ASHA Workers", path: "/dashboard/resources/asha" },
                                { text: "Healthcare Centers", path: "/dashboard/resources/healthcare" },
                                { text: "Therapy Clinics", path: "/dashboard/resources/clinics" },
                                { text: "Schools", path: "/dashboard/resources/schools" }
                            ]}
                            currentPath={location.pathname}
                        />

                        <span className="text-gray-400 font-bold mt-4">TOOLS</span> */}
                    
                        {/* <SidebarDropdown 
                            icon="ri-file-chart-line"
                            text="Reports & Analytics"
                            items={[
                                { text: "Progress Reports", path: "/dashboard/reports/progress" },
                                { text: "Growth Charts", path: "/dashboard/reports/growth" },
                                { text: "Regional Data", path: "/dashboard/reports/regional" }
                            ]}
                            currentPath={location.pathname}
                        /> */}

                        {/* <SidebarDropdown 
                            icon="ri-settings-line"
                            text="Settings"
                            items={[
                                { text: "Notifications", path: "/dashboard/settings" },
                                { text: "Data Sharing", path: "/dashboard/settings" },
                                { text: "Offline Mode", path: "/dashboard/settings" }
                            ]}
                            currentPath={location.pathname}
                        /> */}
                    </ul>
                </div>
            </div>

            <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500 ${
                !isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`} onClick={() => setIsOpen(false)}></div>
        </>
    );
};

const SidebarDropdown = ({ icon, text, items, currentPath }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [height, setHeight] = React.useState('0px');
    const contentRef = React.useRef(null);
    const navigate = useNavigate();
    
    // Check if any child route is active
    const isActive = React.useMemo(() => {
        return items.some(item => currentPath === item.path);
    }, [items, currentPath]);
    
    // Automatically open the dropdown if a child route is active
    React.useEffect(() => {
        if (isActive && !isOpen) {
            setIsOpen(true);
        }
    }, [isActive, isOpen]);

    React.useEffect(() => {
        setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }, [isOpen]);
    
    const handleItemClick = (path) => {
        navigate(path, { replace: true });
        // Don't close the dropdown when clicking an item
    };
    
    return (
        <li className="mb-1 group">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex w-full items-center py-2.5 px-4 rounded-xl
                    text-[#333333] font-medium transition-all duration-300
                    hover:bg-[#4CAF50]/10 hover:text-[#4CAF50]
                    ${(isOpen || isActive) ? 'bg-[#4CAF50]/5 text-[#4CAF50]' : ''}
                `}
            >
                <i className={`${icon} mr-3 text-lg transition-transform group-hover:scale-110`}></i>
                <span className="text-sm">{text}</span>
                <i className={`ri-arrow-right-s-line ml-auto transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}></i>
            </button>
            <div 
                ref={contentRef}
                style={{ height }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
            >
                <ul className="pl-4 pt-2 pb-1">
                    {items.map((item, index) => (
                        <li key={index} className="mb-1 last:mb-2">
                            <button 
                                onClick={() => handleItemClick(item.path)}
                                className={`
                                    w-full flex items-center py-2 px-4 rounded-xl
                                    text-sm transition-all duration-300
                                    hover:bg-[#4CAF50]/5 hover:text-[#4CAF50] hover:translate-x-1
                                    group
                                    ${currentPath === item.path 
                                        ? 'bg-[#4CAF50]/10 text-[#4CAF50] translate-x-1' 
                                        : 'text-[#6C757D]'}
                                `}
                            >
                                <span className={`
                                    w-2 h-2 rounded-full mr-3
                                    transition-all duration-300
                                    ${currentPath === item.path 
                                        ? 'bg-[#4CAF50]' 
                                        : 'bg-[#4CAF50]/30 group-hover:bg-[#4CAF50]'}
                                `}></span>
                                {item.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </li>
    );
};

export default Sidebar;
