import Image from "next/image";
import Link from "next/link";

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
};

const FriendsList = ({ friends, currentUserId }: Props) => {
 // console.log("Current User ID:", currentUserId);
  //console.log("Friends List:", friends);

  const filteredFriends = friends.filter((friend) => {
    console.log(`Checking friend ID: ${friend.following.id} against current user ID: ${currentUserId}`);
    return friend.following.id !== currentUserId;
  });
 // console.log("Filtered Friends List:", filteredFriends);

  return (
    <div className="w-1/4 p-4">
      <h2 className="text-xl font-bold mb-4">Friends</h2>
       
      <ul>
        {filteredFriends.map((friend) => (
          <li key={friend.following.id} className="flex items-center gap-4 mb-4">
            <Image
              src={friend.following.avatar || "/noAvatar.png"}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <Link href={`/profile/${friend.following.username}`}
              className="ml-2 p-1 bg-blue-500 text-white rounded text-xs"
            >
              {friend.following.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
