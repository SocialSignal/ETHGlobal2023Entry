import { useRouter } from "next/router";

export default () => {
  const { id } = useRouter().query;

  return () => <div>Id is {id}</div>;
};
