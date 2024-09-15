import Image from "next/image";

type Friend = {
  following: {
    id: string;
    username: string;
    avatar: string | null;
  };
};

type Props = {
  friends: Friend[];
  currentUserId: string;
  onStartChat: (friendId: string) => void;
  unreadMessages: { [key: string]: boolean };
};

const FriendsComponent = ({ friends, currentUserId, onStartChat, unreadMessages }: Props) => {
  // Remove duplicates and non-friends
  const uniqueFriends = Array.from(new Set(friends.map(friend => friend.following.id)))
    .map(id => friends.find(friend => friend.following.id === id))
    .filter(friend => friend && friend.following.id !== currentUserId);

  console.log("Filtered Friends List:", uniqueFriends);

  return (
    <div className="w-1/4 p-4">
      <h2 className="text-xl font-bold mb-4">Friends</h2>
      <ul>
        {uniqueFriends.map((friend) => (
          friend && (
            <li key={friend.following.id} className="flex items-center gap-4 mb-4">
              <Image
                src={friend.following.avatar || "/noAvatar.png"}
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <button
                onClick={() => onStartChat(friend.following.id)}
                className="ml-2 p-1 bg-blue-500 text-white rounded text-xs"
              >
                <span>{friend.following.username}</span>
                {unreadMessages[friend.following.username] && (
                  <span className="text-red-500 ml-2">new</span>
                )}
              </button>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default FriendsComponent;
