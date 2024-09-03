import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import IconComponent from "./IconComponent";

const Navbar = () => {
  return (
    <div className="h-24 flex items-center justify-between">
      {/* LEFT */}
      <div className="md:hidden lg:block w-[20%]">
        <Link href="/" className="font-bold text-xl text-blue-600">
          SocialMedia
        </Link>
      </div>
      {/* CENTER */}
      <div className="hidden  md:flex   w-[50%] text-sm items-center justify-between">
        {/* LINKS */}
        <div className="flex gap-6 text-gray-600">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/home.png"
              alt="Homepage"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Homepage</span>
          </Link>
          <Link href="/friends" className="flex items-center gap-2">
            <Image
              src="/friends.png"
              alt="Friends"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Friends</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/stories.png"
              alt="Stories"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Stories</span>
          </Link>
        </div>

        <div className='flex flex-col xl:flex-row m-5 p-2 bg-slate-100 items-center rounded-xl relative'>
          <input type="text" placeholder="search..." className="bg-transparent outline-none w-full xl:w-auto"/>
          <Image src="/search.png" alt="" width={14} height={14} className="absolute m-b-4"/>
       </div>


      </div>
      {/* RIGHT */}

      <div className="w-[30%] flex items-center gap-4 xl:gap-8 justify-end ">


        <ClerkLoading>
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2
           border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] 
           text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>

                  <IconComponent/>

       
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <Image src="/social_logo.png" alt="" width={20} height={20} />
              <Link href="/sign-in">Login/Register</Link>
            </div>

          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;