import React, { useState, useEffect } from "react";
import vaccineData from '../../../data/vaccineSchedule.json';

const Vaccination = () => {
    const [checkedItems, setCheckedItems] = useState({});
    const [organizedData, setOrganizedData] = useState([]);

    useEffect(() => {
        // Organize vaccine data by age
        const groupedByAge = vaccineData.reduce((acc, item) => {
            if (!item.AGEADMINISTERED || item.ISO_3_CODE === "Exported: 2025-12-2 11:14 UTC") return acc;
            
            const ageKey = item.AGEADMINISTERED;
            if (!acc[ageKey]) {
                acc[ageKey] = {
                    age: translateAge(ageKey),
                    vaccines: []
                };
            }

            // Check if vaccine already exists for this age
            const existingVaccine = acc[ageKey].vaccines.find(
                v => v.name === item.VACCINEDESCRIPTIONSHORT
            );

            if (!existingVaccine) {
                acc[ageKey].vaccines.push({
                    name: item.VACCINEDESCRIPTIONSHORT,
                    description: item.VACCINE_DESCRIPTION,
                    disease: item.DISEASEDESCRIPTION,
                    comment: item.SOURCECOMMENT
                });
            }

            return acc;
        }, {});

        // Convert to array and sort by age
        const sortedData = Object.values(groupedByAge).sort((a, b) => 
            getAgeOrder(a.age) - getAgeOrder(b.age)
        );

        setOrganizedData(sortedData);
    }, []);

    const translateAge = (ageCode) => {
        const translations = {
            'B': 'At Birth',
            'W6': '6 Weeks',
            'W10': '10 Weeks',
            'W14': '14 Weeks',
            'M9': '9 Months',
            'M9-M12': '9-12 Months',
            'M16-M24': '16-24 Months',
            'Y5-Y6': '5-6 Years'
        };
        return translations[ageCode] || ageCode;
    };

    const getAgeOrder = (age) => {
        const orderMap = {
            'At Birth': 0,
            '6 Weeks': 1,
            '10 Weeks': 2,
            '14 Weeks': 3,
            '9 Months': 4,
            '9-12 Months': 5,
            '16-24 Months': 6,
            '5-6 Years': 7
        };
        return orderMap[age] ?? 999;
    };

    const handleCheck = (age, vaccineName) => {
        setCheckedItems(prev => ({
            ...prev,
            [`${age}-${vaccineName}`]: !prev[`${age}-${vaccineName}`]
        }));
    };

    const handleGroupCheck = (age, vaccines) => {
        const allChecked = vaccines.every(v => checkedItems[`${age}-${v.name}`]);
        const newState = !allChecked;
        
        const updates = {};
        vaccines.forEach(vaccine => {
            updates[`${age}-${vaccine.name}`] = newState;
        });

        setCheckedItems(prev => ({
            ...prev,
            ...updates
        }));
    };

    const isGroupChecked = (age, vaccines) => {
        return vaccines.every(v => checkedItems[`${age}-${v.name}`]);
    };

    return (
        <section className="min-h-screen bg-[#f6f8fc]">
            <div className="py-8">
                <div className="container mx-auto flex flex-col items-start md:flex-row my-6">
                    {/* Left Side Panel */}
                    <div className="flex flex-col w-full sticky md:top-36 lg:w-1/3 mt-2 md:mt-12 px-8">
                        <p className="ml-2 text-[#4CAF50] uppercase tracking-wider font-semibold">Vaccination Schedule</p>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-[#333333]">
                            Child Vaccination Timeline
                        </h1>
                        <p className="text-sm md:text-base text-[#6C757D] mb-8 leading-relaxed">
                            Follow this comprehensive vaccination schedule to ensure your child's complete immunization protection.
                        </p>
                        <a href="#" className="group relative inline-flex items-center px-8 py-3 overflow-hidden text-[#4CAF50] border border-[#4CAF50] rounded-xl hover:bg-[#4CAF50] hover:text-white transition-all duration-300">
                            <span className="relative">Download Schedule →</span>
                        </a>
                    </div>

                    {/* Timeline Section */}
                    <div className="ml-0 md:ml-12 lg:w-2/3 sticky">
                        <div className="container mx-auto w-full h-full">
                            <div className="relative wrap overflow-hidden p-10 h-full">
                                {/* Timeline lines */}
                                <div className="absolute h-full border-2 border-[#4CAF50]/20" style={{ right: '50%' }}></div>
                                <div className="absolute h-full border-2 border-[#4CAF50]/20" style={{ left: '50%' }}></div>
                                
                                {organizedData.map((item, index) => (
                                    <div key={item.age} 
                                        className={`mb-12 flex justify-between ${
                                            index % 2 === 0 ? 'flex-row-reverse items-center w-full' : 
                                            'items-center w-full'
                                        }`}>
                                        <div className="order-1 w-5/12">
                                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-[#4CAF50]/20 transition-all duration-300">
                                                <p className="text-sm font-semibold text-[#4CAF50] mb-4">{item.age}</p>
                                                {item.vaccines.map((vaccine, vIndex) => (
                                                    <div key={vIndex} className="mb-4 last:mb-0">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-bold text-[#333333]">{vaccine.name}</h4>
                                                            <div 
                                                                onClick={() => handleCheck(item.age, vaccine.name)}
                                                                className={`ml-4 w-6 h-6 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center ${
                                                                    checkedItems[`${item.age}-${vaccine.name}`]
                                                                        ? 'bg-[#4CAF50] shadow-lg shadow-[#4CAF50]/20'
                                                                        : 'bg-gray-50 border-2 border-[#4CAF50]/30'
                                                                }`}
                                                            >
                                                                {checkedItems[`${item.age}-${vaccine.name}`] && (
                                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-[#6C757D] mt-1">{vaccine.disease}</p>
                                                        {vaccine.comment && (
                                                            <p className="text-xs text-[#4CAF50]/70 mt-1">{vaccine.comment}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Center Checkbox */}
                                        <div 
                                            onClick={() => handleGroupCheck(item.age, item.vaccines)}
                                            className={`z-20 flex items-center justify-center order-1 w-10 h-10 rounded-full cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 ${
                                                isGroupChecked(item.age, item.vaccines)
                                                    ? 'bg-[#4CAF50] shadow-lg shadow-[#4CAF50]/20' 
                                                    : 'bg-white border-2 border-[#4CAF50]/30 hover:border-[#4CAF50]'
                                            }`}
                                        >
                                            {isGroupChecked(item.age, item.vaccines) && (
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                                </svg>
                                            )}
                                        </div>

                                        <div className="order-1 w-5/12"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Add the image at the bottom */}
                            <img 
                                className="mx-auto -mt-36 md:-mt-36" 
                                src="https://user-images.githubusercontent.com/54521023/116968861-ef21a000-acd2-11eb-95ac-a34b5b490265.png"
                                alt="Timeline decoration"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Vaccination;

