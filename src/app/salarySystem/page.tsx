'use client';

import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaUserTie } from "react-icons/fa";

interface Employee {
  id: number;
  target: number;
  weeklySalary: number;
}

interface StatData {
  id: number;
  title: string;
  value: string;
  color: string;
  icon: JSX.Element;
}

const SalarySystem = () => {
  const employeeData: Employee[] = [
    { id: 1, target: 250, weeklySalary: 25 },
    { id: 2, target: 1000, weeklySalary: 130 },
    { id: 3, target: 1500, weeklySalary: 240 },
    { id: 4, target: 5000, weeklySalary: 700 },
    { id: 5, target: 10000, weeklySalary: 3000 },
    { id: 6, target: 20000, weeklySalary: 6000 },
  ];

  // ======= STATES =======
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [earnedSalary, setEarnedSalary] = useState<number>(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // ======= LOAD LOCALSTORAGE DATA =======
  useEffect(() => {
    const savedData = localStorage.getItem("salarySystemData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setTotalInvestment(data.totalInvestment || 0);
      setEarnedSalary(data.earnedSalary || 0);
      setCompletedLevels(data.completedLevels || []);
    }
  }, []);

  // ======= SAVE TO LOCALSTORAGE =======
  useEffect(() => {
    localStorage.setItem(
      "salarySystemData",
      JSON.stringify({
        totalInvestment,
        earnedSalary,
        completedLevels,
      })
    );
  }, [totalInvestment, earnedSalary, completedLevels]);

  // ======= CALCULATE LEVELS AUTOMATICALLY BASED ON INVESTMENT =======
  useEffect(() => {
    let newLevels: number[] = [];
    let newSalary = 0;

    employeeData.forEach((level) => {
      if (totalInvestment >= level.target) {
        newLevels.push(level.id);
        newSalary += level.weeklySalary;
      }
    });

    setCompletedLevels(newLevels);
    setEarnedSalary(newSalary);
  }, [totalInvestment]);

  // ======= STAT CARDS =======
  const statsData: StatData[] = [
    {
      id: 1,
      title: "Total Earning",
      value: `$${totalInvestment.toLocaleString()}`,
      color: "from-green-900 to-emerald-800",
      icon: <FaMoneyBillWave className="text-2xl" />,
    },
    {
      id: 2,
      title: "Total Salary",
      value: `$${earnedSalary.toLocaleString()}`,
      color: "from-blue-700 to-cyan-800",
      icon: <FaUserTie className="text-2xl" />,
    },
  ];

  // ======= UI =======
  return (
    <div
      className="min-h-screen py-4 lg:px-4 px-2 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/21/d7/8d/21d78d607a39c87e1aaa82451b8afcc6.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center my-4 lg:mt-0">
          <h1 className="lg:text-4xl text-2xl mb-3">
            💰{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
              Weekly Salary System
            </span>
          </h1>
          <p className="text-blue-100 lg:text-lg text-sm">
            Track your investment and rewards in real time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 lg:gap-6 mb-4 lg:mb-8">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className={`bg-gradient-to-br ${stat.color} backdrop-blur-lg rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-white/30 hover:transform hover:scale-105 transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-2 lg:mb-4">
                <div className="text-white/80 text-sm lg:text-base">{stat.icon}</div>
                <div className="text-white text-sm lg:text-2xl font-bold mb-1 lg:mb-2">
                  {stat.value}
                </div>
              </div>
              <div className="text-white/70 text-xs lg:text-sm">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="lg:p-6 p-3 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl mb-8">
          {/* Animated Borders */}
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
            style={{
              background:
                "conic-gradient(from 0deg, #10b981, #3b82f6, #8b5cf6, #f59e0b, #10b981)",
              animationDuration: "9000ms",
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>

          {/* Content */}
          <div className="relative z-20">
            <div className="lg:p-6 p-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-white/20 backdrop-blur-sm">
              <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                <FaUserTie className="text-blue-400" />
                Salary & Reward Levels
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 font-semibold">ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Target</th>
                      <th className="text-left py-3 px-4 font-semibold">Reward</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeData.map((employee) => (
                      <tr
                        key={employee.id}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                      >
                        <td className="py-3 px-4">{employee.id}</td>
                        <td className="py-3 px-4 text-green-400 font-medium">
                          ${employee.target.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-blue-300 font-medium">
                          ${employee.weeklySalary.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 ">
                          {completedLevels.includes(employee.id) ? (
                            <span className="text-green-400 font-semibold">✅ Completed</span>
                          ) : (
                            <span className="text-yellow-400 font-semibold ">⏳ Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySystem;
