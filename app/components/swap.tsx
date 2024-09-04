
///unused experimental feature..
import React from "react";

interface SwapProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  className?: string;
}

const SwapIcon: React.FC<SwapProps> = ({ isOpen, toggleDrawer, className }) => {
  return (
    <div className={className}>
      <label className="btn-circle btn-outline swap swap-rotate btn-primary">
        <input type="checkbox" checked={isOpen} onChange={toggleDrawer} />

        {/* Filter icon */}
        <svg
          className="swap-off w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 6H19M21 12H16M21 18H16M7 20V13.5612C7 13.3532 7 13.2492 6.97958 13.1497C6.96147 13.0615 6.93151 12.9761 6.89052 12.8958C6.84431 12.8054 6.77934 12.7242 6.64939 12.5617L3.35061 8.43826C3.22066 8.27583 3.15569 8.19461 3.10948 8.10417C3.06849 8.02393 3.03853 7.93852 3.02042 7.85026C3 7.75078 3 7.64677 3 7.43875V5.6C3 5.03995 3 4.75992 3.10899 4.54601C3.20487 4.35785 3.35785 4.20487 3.54601 4.10899C3.75992 4 4.03995 4 4.6 4H13.4C13.9601 4 14.2401 4 14.454 4.10899C14.6422 4.20487 14.7951 4.35785 14.891 4.54601C15 4.75992 15 5.03995 15 5.6V7.43875C15 7.64677 15 7.75078 14.9796 7.85026C14.9615 7.93852 14.9315 8.02393 14.8905 8.10417C14.8443 8.19461 14.7793 8.27583 14.6494 8.43826L11.3506 12.5617C11.2207 12.7242 11.1557 12.8054 11.1095 12.8958C11.0685 12.9761 11.0385 13.0615 11.0204 13.1497C11 13.2492 11 13.3532 11 13.5612V17L7 20Z" />
        </svg>

        {/* Funnel icon */}
        <svg
          className="swap-on w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 21L3 3V6.33726C3 6.58185 3 6.70414 3.02763 6.81923C3.05213 6.92127 3.09253 7.01881 3.14736 7.10828C3.2092 7.2092 3.29568 7.29568 3.46863 7.46863L9.53137 13.5314C9.70432 13.7043 9.7908 13.7908 9.85264 13.8917C9.90747 13.9812 9.94787 14.0787 9.97237 14.1808C10 14.2959 10 14.4182 10 14.6627V21L14 17V14M8.60139 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L16.8008 11.1992" />
        </svg>
      </label>
    </div>
  );
};

export default SwapIcon;
