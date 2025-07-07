import React from 'react';
import { useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon, text, path, isActive = false }) => {
  const navigate = useNavigate();
  
  return (
    <li>
      <button
        onClick={() => navigate(path)}
        className={`
          flex w-full items-center py-2.5 px-4 rounded-xl
          font-medium transition-all duration-300 group
          ${isActive 
            ? 'bg-[#4CAF50]/10 text-[#4CAF50]' 
            : 'text-[#333333] hover:bg-[#4CAF50]/5 hover:text-[#4CAF50]'}
        `}
      >
        <i className={`${icon} mr-3 text-lg transition-transform group-hover:scale-110`}></i>
        <span className="text-sm">{text}</span>
      </button>
    </li>
  );
};

export default SidebarItem;
