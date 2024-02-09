import { useEffect, useState } from 'react';
import { useAuth } from 'contexts/AuthContext';

function LogoutInactiveUser({ timeout }) {
  const { logout } = useAuth();
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timer) {
        clearTimeout(timer);
      }
      setTimer(setTimeout(logoutUser, timeout));
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
      clearTimeout(timer);
    };
  }, [logout, timer, timeout]);

  return null;
}

export default LogoutInactiveUser;
