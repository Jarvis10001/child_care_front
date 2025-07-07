import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../Dashboard/context/SidebarContext';

const menuItems = [
    {
        title: 'Dashboard',
        icon: 'ri-dashboard-line',
        path: '/doctor/dashboard'
    },
    {
        title: 'Appointments',
        icon: 'ri-calendar-line',
        items: [
            { text: "Pending Requests", path: '/doctor/appointments' },
            { text: "Today's Schedule", path: '/doctor/appointments/today' },
            { text: 'Upcoming', path: '/doctor/appointments/upcoming' },
            { text: 'Past Appointments', path: '/doctor/appointments/history' }
        ]
    },
    {
        title: 'Patients',
        icon: 'ri-user-heart-line',
        items: [
            { text: 'Patient Records', path: '/doctor/patients/records' },
            { text: 'Case History', path: '/doctor/patients/cases' },
            { text: 'Progress Reports', path: '/doctor/patients/progress' }
        ]
    },
    {
        title: 'Consultations',
        icon: 'ri-video-chat-line',
        items: [
            { text: 'Video Calls', path: '/doctor/consultations/video' },
            { text: 'Prescriptions', path: '/doctor/consultations/prescriptions' },
            { text: 'Notes', path: '/doctor/consultations/notes' }
        ]
    }
];

const DoctorSidebar = () => {
    const { isOpen, setIsOpen } = useSidebar();
    const navigate = useNavigate();

    return (
        <>
            <div className={`fixed left-0 top-0 w-64 h-screen flex flex-col bg-white shadow-lg z-50 transition-all duration-500 ease-in-out ${
                !isOpen ? '-translate-x-full' : 'translate-x-0'
            }`}>
                {/* Fixed Header */}
                <div className="flex-shrink-0 p-4 border-b border-b-[#F8F9F4]">
                    <Link to="/doctor" className="flex items-center group">
                        <div className="p-2 rounded-xl bg-[#4CAF50]/10 group-hover:bg-[#4CAF50]/20 transition-colors duration-300">
                            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 w-8" alt="Logo" />
                        </div>
                        <h2 className="ml-3 font-bold text-xl text-[#333333]">
                            DOCTOR <span className="bg-[#4CAF50] text-white px-2 rounded-md">PORTAL</span>
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
                        <span className="text-[#6C757D] font-bold">MAIN</span>
                    
                        {menuItems.map((item, index) => (
                            item.items ? (
                                <SidebarDropdown 
                                    key={index}
                                    icon={item.icon}
                                    text={item.title}
                                    items={item.items}
                                />
                            ) : (
                                <SidebarItem 
                                    key={index}
                                    icon={item.icon}
                                    text={item.title}
                                    path={item.path}
                                />
                            )
                        ))}

                        <span className="text-gray-400 font-bold mt-4">PROFESSIONAL</span>
                        
                        <SidebarDropdown 
                            icon="ri-hospital-line"
                            text="Clinical Tools"
                            items={[
                                { text: "Growth Charts", path: "/tools/growth-charts" },
                                { text: "Development Screening", path: "/tools/screening" },
                                { text: "Assessment Forms", path: "/tools/assessment" }
                            ]}
                        />

                        <SidebarDropdown 
                            icon="ri-file-list-3-line"
                            text="Reports"
                            items={[
                                { text: "Patient Statistics", path: "/reports/statistics" },
                                { text: "Consultation Reports", path: "/reports/consultations" },
                                { text: "Treatment Outcomes", path: "/reports/outcomes" }
                            ]}
                        />

                        {/* Settings & Logout Section */}
                        <div className="mt-8 pt-6 border-t border-[#F8F9F4]">
                            <SidebarItem icon="ri-settings-line" text="Settings" path="/doctor/settings" />
                            <SidebarItem icon="ri-logout-box-line" text="Logout" path="/logout" />
                        </div>
                    </ul>
                </div>
            </div>
            <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500 ${
                !isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`} onClick={() => setIsOpen(false)}></div>
        </>
    );
};

const SidebarItem = ({ icon, text, path }) => {
    const location = useLocation();
    const navigate = useNavigate();
    // Fix exact path matching to support nested routes
    const isActive = location.pathname === path || 
                    (path !== '/doctor/dashboard' && location.pathname.startsWith(`${path}/`)) ||
                    (path === '/doctor/dashboard' && location.pathname === '/doctor');
    
    return (
        <li className={`mb-1 ${isActive ? 'active' : ''}`}>
            <button 
                onClick={() => navigate(path)}
                className={`w-full flex font-medium items-center py-2.5 px-4 rounded-xl transition-all duration-300
                    hover:bg-[#4CAF50]/10 hover:text-[#4CAF50] hover:translate-x-1
                    ${isActive ? 'bg-[#4CAF50]/10 text-[#4CAF50] translate-x-1' : 'text-[#333333]'}`}
            >
                <i className={`${icon} mr-3 text-lg transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}></i>
                <span className="text-sm">{text}</span>
            </button>
        </li>
    );
};

const SidebarDropdown = ({ icon, text, items }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [height, setHeight] = React.useState('0px');
    const contentRef = React.useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if any child route is active
    const isActive = items.some(item => 
        location.pathname === item.path || 
        location.pathname.startsWith(`${item.path}/`)
    );
    
    React.useEffect(() => {
        // Auto expand if a child is active
        if (isActive && !isOpen) {
            setIsOpen(true);
        }
        
        setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }, [isOpen, isActive]);

    const handleItemClick = (path) => {
        navigate(path);
    };

    return (
        <li className={`mb-1 ${isActive ? 'active' : ''}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex w-full items-center py-2.5 px-4 rounded-xl
                    font-medium transition-all duration-300
                    ${isOpen || isActive ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'text-[#333333] hover:bg-[#4CAF50]/10 hover:text-[#4CAF50]'}
                `}
            >
                <i className={`${icon} mr-3 text-lg transition-transform ${(isOpen || isActive) ? 'scale-110' : ''}`}></i>
                <span className="text-sm">{text}</span>
                <i className={`ri-arrow-right-s-line ml-auto transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}></i>
            </button>
            <div 
                ref={contentRef}
                style={{ height }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
            >
                <ul className="pl-4 pt-2 pb-1">
                    {items.map((item, index) => {
                        const isItemActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                        return (
                            <li key={index} className="mb-1 last:mb-2">
                                <button 
                                    onClick={() => handleItemClick(item.path)}
                                    className={`
                                        w-full flex items-center py-2 px-4 rounded-xl
                                        text-sm transition-all duration-300
                                        ${isItemActive 
                                            ? 'bg-[#4CAF50]/5 text-[#4CAF50] translate-x-1' 
                                            : 'text-[#6C757D] hover:bg-[#4CAF50]/5 hover:text-[#4CAF50] hover:translate-x-1'}
                                    `}
                                >
                                    <span className={`
                                        w-2 h-2 rounded-full mr-3
                                        transition-all duration-300
                                        ${isItemActive ? 'bg-[#4CAF50]' : 'bg-[#4CAF50]/30'}
                                    `}></span>
                                    {item.text}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </li>
    );
};

export default DoctorSidebar;
