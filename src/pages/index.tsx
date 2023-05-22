import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignInButton,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  // const {user} = useUser();
  // if (!user) return null;
  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  return (
    <div className="flex w-full gap-3">
      {/* <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      /> */}
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-14 w-14",
          },
        }}
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })}>Post</button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s Profile picture`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username} `}</span>·
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;
  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded } = useUser();

  // Start fetching early
  api.posts.getAll.useQuery();

  //Returns empty div if user is not loaded
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="border-b border-slate-400 p-4">
        <SignedIn>
          {/* <div>
              <h1>My application</h1>
              <UserButton />
            </div> */}
          <CreatePostWizard />
          {/* <button
                  onClick={() => {
                    void signOut();
                  }}
                >
                  Sign out
                </button> */}
        </SignedIn>
        <SignedOut>
          {/* Non-authenticated visitors will be redirected to the sign in page.*/}
          {/* <RedirectToSignIn /> */}
          <div className="flex justify-center">
            <SignInButton />
          </div>
        </SignedOut>
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
