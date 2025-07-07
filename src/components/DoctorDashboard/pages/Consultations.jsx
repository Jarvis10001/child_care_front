import React from 'react';
import { motion } from 'framer-motion';

const Consultations = () => {
    return (
        <div className="space-y-6">
            {/* Today's Schedule */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-md"
            >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Consultations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-[#4CAF50]/20 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                                    <i className="ri-user-line text-[#4CAF50]"></i>
                                </div>``
                                <div>
                                    <h4 className="font-medium text-gray-800">John Doe</h4>
                                    <p className="text-sm text-gray-500">10:00 AM - 11:00 AM</p>
                                </div>
                            </div>
                            <button className="w-full px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors duration-300">
                                Join Video Call
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Notes and Prescriptions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Notes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-md"
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Notes</h3>
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-gray-800">Patient: John Doe</h4>
                                    <span className="text-sm text-gray-500">Mar 15, 2024</span>
                                </div>
                                <p className="text-sm text-gray-600">Progress notes for the latest consultation session...</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Prescriptions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-md"
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Prescriptions</h3>
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-gray-800">Prescription #123</h4>
                                    <button className="text-[#4CAF50] hover:text-[#45a049]">
                                        <i className="ri-download-line"></i>
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">Patient: John Doe</p>
                                <p className="text-sm text-gray-600">Prescribed medications and therapy instructions...</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Consultations;
