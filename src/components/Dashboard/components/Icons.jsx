import React from 'react';
import { iconProps } from '../config/icons';

const Icons = ({ type, className = "w-5 h-5" }) => {
    const config = iconProps[type] || iconProps.dashboard;
    const { path, ...svgProps } = config;
    
    return (
        <svg className={className} {...svgProps}>
            <path d={path} />
        </svg>
    );
};

export default Icons;
