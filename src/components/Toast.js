import React, { useEffect, useState } from "react";

const Toast = ({ message, show, duration }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timeout = setTimeout(() => {
        setVisible(false);
      }, duration || 3000);

      return () => clearTimeout(timeout);
    }
  }, [show, duration]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md flex items-center">
        <i className="fas fa-check-circle mr-2"></i>
        <span>{message || "Success! You are now logged in."}</span>
      </div>
    </div>
  );
};

export { Toast };
