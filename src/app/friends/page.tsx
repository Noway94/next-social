"use client"
import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
}

interface Follower {
  following: User;
}

const FriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('/api/following');
        const data: Follower[] = await response.json();
        setFriends(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>FriendsPage</h1>
      <ul>
        {friends.map((friend) => (
          <li key={friend.following.id}>
            {friend.following.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsPage;
