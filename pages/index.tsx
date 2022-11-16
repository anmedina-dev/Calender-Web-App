import {
  useSession,
  signOut,
  getSession,
  GetSessionParams,
} from "next-auth/react";
import { GetServerSideProps } from "next";

export default function Home() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return (
      <div>
        <p>You are not Signed in</p>
      </div>
    );
  }

  return (
    <div>
      <p>{session?.user?.name}</p>
      You are signed in<button onClick={() => signOut()}>SignOut</button>
    </div>
  );
}

export const getServerSideProps = async (
  context: GetSessionParams | undefined
) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  return {
    props: { session },
  };
};
