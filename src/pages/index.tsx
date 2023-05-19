import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/nextjs";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data } = api.posts.getAll.useQuery();

  console.log(data);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          <SignedIn>
            <header>
              <h1>My application</h1>
              <UserButton />
            </header>
            <div>
              {data?.map((post) => (
                <div key={post.id}>{post.content}</div>
              ))}
            </div>
          </SignedIn>
          <SignedOut>
            {/* 
          Non-authenticated visitors will be redirected
          to the sign in page.
        */}
            <RedirectToSignIn />
          </SignedOut>
        </div>
        {/* <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" /> */}
      </main>
    </>
  );
};

export default Home;
