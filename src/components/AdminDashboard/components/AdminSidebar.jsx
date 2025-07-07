import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../Dashboard/context/SidebarContext';

const menuItems = [
    {
        title: 'Dashboard',
        icon: 'ri-dashboard-line',
        path: '/admin'
    },
    {
        title: 'Doctor Management',
        icon: 'ri-user-star-line',
        items: [
            { text: "All Doctors", path: '/doctors' }, // This will navigate to /admin/doctors
            { text: "Add Doctor", path: '/doctors/add' }, // This will navigate to /admin/doctors/add
            { text: "Verifications", path: '/doctors/verify' }
        ]
    },
    // {
    //     title: 'User Management',
    //     icon: 'ri-team-line',
    //     items: [
    //         { text: "All Users", path: '/users/list' },
    //         { text: "User Reports", path: '/users/reports' }
    //     ]
    // },
    // {
    //     title: 'Appointments',
    //     icon: 'ri-calendar-check-line',
    //     items: [
    //         { text: "All Appointments", path: '/appointments/all' },
    //         { text: "Reports", path: '/appointments/reports' }
    //     ]
    // }
];

const AdminSidebar = () => {
    const { isOpen, setIsOpen } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <div className={`fixed left-0 top-0 w-64 h-screen flex flex-col bg-bg-white shadow-xl z-50 transition-all duration-500 ease-in-out ${
                !isOpen ? '-translate-x-full' : 'translate-x-0'
            }`}>
                {/* Fixed Header */}
                <div className="flex-shrink-0 p-4 border-b border-b-neutral-100">
                    <Link to="/admin" className="flex items-center group">
                        <div className="p-2 rounded-xl bg-primary-50 group-hover:bg-primary-100 transition-all duration-300">
                            <img src="/assets/logo.svg" className="h-8 w-8" alt="Logo" />
                        </div>
                        <h2 className="ml-3 font-bold text-xl text-text-primary">
                            ADMIN <span className="bg-primary-500 text-text-light px-2 rounded-md">PANEL</span>
                        </h2>
                    </Link>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:bg-neutral-100
                    [&::-webkit-scrollbar-thumb]:bg-neutral-300
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400
                ">
                    <ul className="space-y-2">
                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-4 py-2">Management</span>
                        
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

                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-4 py-2 mt-6">System</span>
                        
                        <SidebarItem 
                            icon="ri-settings-line" 
                            text="Settings" 
                            path="/admin/settings" 
                        />
                        
                        <SidebarItem 
                            icon="ri-logout-box-line" 
                            text="Logout" 
                            path="/logout" 
                        />
                    </ul>
                </div>
            </div>

            {/* Backdrop */}
            <div className={`fixed inset-0 bg-neutral-900/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500 ${
                !isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`} onClick={() => setIsOpen(false)} />
        </>
    );
};

const SidebarItem = ({ icon, text, path }) => (
    <li className="group">
        <Link to={path} className="flex font-medium items-center py-2.5 px-4 text-text-primary rounded-xl transition-all duration-300
            hover:bg-primary-50 hover:text-primary-600 hover:translate-x-1
            active:bg-primary-100 active:text-primary-700
            group"
        >
            <i className={`${icon} mr-3 text-lg transition-transform duration-300 group-hover:scale-110`}></i>
            <span className="text-sm">{text}</span>
        </Link>
    </li>
);

const SidebarDropdown = ({ icon, text, items }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [height, setHeight] = React.useState('0px');
    const contentRef = React.useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if any of the dropdown items matches the current path
    const isActive = React.useMemo(() => {
        return items.some(item => {
            const itemPath = item.path.startsWith('/') 
                ? `/admin${item.path}` 
                : `/admin/${item.path}`;
            return location.pathname.startsWith(itemPath);
        });
    }, [items, location.pathname]);

    // Set the dropdown open if any of its items is active
    React.useEffect(() => {
        if (isActive && !isOpen) {
            setIsOpen(true);
        }
    }, [isActive, isOpen]);

    React.useEffect(() => {
        setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }, [isOpen]);

    const handleItemClick = (path) => {
        const absolutePath = path.startsWith('/') 
            ? `/admin${path}` 
            : `/admin/${path}`;
        navigate(absolutePath);
    };

    return (
        <li className="mb-1">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex w-full items-center py-2.5 px-4 rounded-xl
                    text-text-primary font-medium transition-all duration-300
                    hover:bg-primary-50 hover:text-primary-600
                    ${isOpen || isActive ? 'bg-primary-50 text-primary-600' : ''}
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
                    {items.map((item, index) => {
                        const itemPath = item.path.startsWith('/') 
                            ? `/admin${item.path}` 
                            : `/admin/${item.path}`;
                        const isItemActive = location.pathname === itemPath || 
                            (itemPath !== '/admin/doctors' && location.pathname.startsWith(itemPath));
                            
                        return (
                            <li key={index} className="mb-1 last:mb-2">
                                <button 
                                    onClick={() => handleItemClick(item.path)}
                                    className={`
                                        w-full flex items-center py-2 px-4 rounded-xl
                                        text-sm transition-all duration-300
                                        hover:bg-primary-50 hover:text-primary-600 hover:translate-x-1
                                        group
                                        ${isItemActive 
                                            ? 'bg-primary-50 text-primary-600' 
                                            : 'text-text-secondary'}
                                    `}
                                >
                                    <span className={`
                                        w-2 h-2 rounded-full mr-3
                                        transition-all duration-300
                                        ${isItemActive 
                                            ? 'bg-primary-500' 
                                            : 'bg-primary-200 group-hover:bg-primary-500'}
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

export default AdminSidebar;
