import { useEffect } from 'react';
import { useAuth } from 'contexts/AuthContext';

function LogoutInactiveUser({ timeout }) {
  const { logout } = useAuth();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(logoutUser, timeout);
    };

    const logoutUser = () => {
      // Log out the user when inactive
      logout();
    };

    const handleUserActivity = () => {
      resetTimer();
    };

    // Set up event listeners for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    // Start the timer when the component mounts
    resetTimer();

    // Clean up event listeners and timer on unmount
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearTimeout(timer); // Clear the timer
    };
  }, [logout, timeout]); 

  return null; // No UI rendering needed for this component
}

export default LogoutInactiveUser;
