import React from "react";
import {
  useSession,
  signIn,
  getSession,
  GetSessionParams,
} from "next-auth/react";

export default function login() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <p>You are not Signed in</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }
}

export const getServerSideProps = async (
  context: GetSessionParams | undefined
) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: { session },
  };
};
