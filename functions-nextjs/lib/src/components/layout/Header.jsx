"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/components/layout/Header.tsx
const react_1 = __importDefault(require("react"));
const image_1 = __importDefault(require("next/image"));
const Header = ({ setIsSidebarOpen }) => {
    return (<header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center lg:rounded-none lg:shadow-none lg:p-6">
      <div className="flex items-center">
        <button onClick={() => setIsSidebarOpen(true)} // Open sidebar on click
     className=" text-gray-600 mr-4 focus:outline-none" aria-label="Toggle sidebar">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">Financial Dashboard</h1>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm sm:text-base hidden sm:block">Welcome, User!</span>
        <image_1.default src="https://placehold.co/40x40/E0E7FF/4338CA?text=U" alt="User Avatar" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-indigo-400"/>
      </div>
    </header>);
};
exports.default = Header;
//# sourceMappingURL=Header.jsx.map