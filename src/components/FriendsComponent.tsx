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
};

const FriendsComponent = ({ friends }: Props) => {
  return (
    <div className="w-1/4 p-4">
      <h2 className="text-xl font-bold mb-4">Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.following.id} className="flex items-center gap-4 mb-4">
            <Image
              src={friend.following.avatar || "/noAvatar.png"}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <Link href={`/profile/${friend.following.username}`}>
              {friend.following.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsComponent;