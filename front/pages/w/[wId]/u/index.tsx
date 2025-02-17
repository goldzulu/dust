import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  return {
    redirect: {
      destination: `/w/${context.query.wId}/u/chat`,
      permanent: false,
    },
  };
};

export default function Redirect({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  return <></>;
}
