import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  imageUrl: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate fetching user data from your authentication system
    const fetchUser = async () => {
      // Replace this with your actual authentication logic
      const userData = {
        id: 'user-id',
        username: 'user-username',
        imageUrl: '/path-to-avatar.png',
      };
      setUser(userData);
      setIsLoaded(true);
    };

    fetchUser();
  }, []);

  return { user, isLoaded };
};
