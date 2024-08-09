import React from 'react';

function Logout() {
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = './login';
  };

  // Call handleLogout when the component mounts
  React.useEffect(() => {
    handleLogout();
  }, []);

  return null; // This component does not render anything
}

export default Logout;
