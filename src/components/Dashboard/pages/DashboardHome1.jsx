import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';

const DashboardHome1 = () => {
    useEffect(() => {
        // Initialize chart
        const chart = new Chart(document.getElementById('order-chart'), {
            type: 'line',
            data: {
                labels: generateNDays(7),
                datasets: [
                    {
                        label: 'Active',
                        data: generateRandomData(7),
                        borderWidth: 1,
                        fill: true,
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgb(59 130 246 / .05)',
                        tension: .2
                    },
                    {
                        label: 'Completed',
                        data: generateRandomData(7),
                        borderWidth: 1,
                        fill: true,
                        pointBackgroundColor: 'rgb(16, 185, 129)',
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgb(16 185 129 / .05)',
                        tension: .2
                    },
                    {
                        label: 'Canceled',
                        data: generateRandomData(7),
                        borderWidth: 1,
                        fill: true,
                        pointBackgroundColor: 'rgb(244, 63, 94)',
                        borderColor: 'rgb(244, 63, 94)',
                        backgroundColor: 'rgb(244 63 94 / .05)',
                        tension: .2
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <div className="p-6 bg-[#f6f8fc]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Stats Cards */}
                <div className="bg-white rounded-xl p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <i className="ri-user-line text-blue-500 text-2xl"></i>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-gray-600 text-sm">Total Children</h2>
                            <p className="text-2xl font-semibold text-gray-800">2</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <i className="ri-calendar-check-line text-green-500 text-2xl"></i>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-gray-600 text-sm">Appointments</h2>
                            <p className="text-2xl font-semibold text-gray-800">5</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <i className="ri-medicine-bottle-line text-purple-500 text-2xl"></i>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-gray-600 text-sm">Vaccinations Due</h2>
                            <p className="text-2xl font-semibold text-gray-800">3</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <i className="ri-flag-line text-yellow-500 text-2xl"></i>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-gray-600 text-sm">Milestones</h2>
                            <p className="text-2xl font-semibold text-gray-800">8</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Growth Progress</h3>
                        <select className="text-sm border-gray-200 rounded-lg">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                    </div>
                    <canvas id="order-chart"></canvas>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">Recent Activities</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <i className="ri-notification-line text-blue-500"></i>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-800">New appointment scheduled</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper functions
function generateNDays(n) {
    const data = [];
    for(let i=0; i<n; i++) {
        const date = new Date();
        date.setDate(date.getDate()-i);
        data.push(date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric'
        }));
    }
    return data;
}

function generateRandomData(n) {
    return Array.from({length: n}, () => Math.round(Math.random() * 10));
}

export default DashboardHome1;
