"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/components/common/Modal.tsx
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("./Button")); // Assuming Button.tsx is in the same common folder
const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Close modal">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 pr-10">{title}</h2>

        {/* Modal Body */}
        <div className="mb-6 text-gray-700">
          {children}
        </div>

        {/* Modal Footer */}
        {footer ? (<div className="flex justify-end space-x-3">
            {footer}
          </div>) : (<div className="flex justify-end">
            <Button_1.default onClick={onClose} variant="secondary">Close</Button_1.default>
          </div>)}
      </div>
    </div>);
};
exports.default = Modal;
//# sourceMappingURL=Modal.jsx.map