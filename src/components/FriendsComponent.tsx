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
  unreadMessages: { [key: string]: boolean }; // Add unreadMessages prop
};

const FriendsComponent = ({ friends, currentUserId, onStartChat, unreadMessages }: Props) => {
  const filteredFriends = friends.filter((friend) => friend.following.id !== currentUserId);
  console.log("Filtered Friends List:", filteredFriends);

  return (
    <div className="w-1/4 p-4">
      <h2 className="text-xl font-bold mb-4">Friends</h2>
      <ul>
        {filteredFriends.map((friend, index) => (
          <li key={`${friend.following.id}-${index}`} className="flex items-center gap-4 mb-4">
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
        ))}
      </ul>
    </div>
  );
};

export default FriendsComponent;
