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
  // Log the initial friends array
  //console.log("Initial Friends List:", friends);

  // Remove duplicates and non-friends
  const uniqueFriends = Array.from(new Set(friends.map(friend => friend.following.id)))
    .map(id => friends.find(friend => friend.following.id === id))
    .filter(friend => friend && friend.following.id !== currentUserId && friend.following.username);

  // Log the filtered friends array
 // console.log("Filtered Friends List:", uniqueFriends);

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
              <Link href={`/profile/${friend.following.username}`}
                className="ml-2 p-1 bg-blue-500 text-white rounded text-xs"
              >
                {friend.following.username}
              </Link>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
