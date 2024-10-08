import Image from "next/image";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
// My imports.
import styles from "./AdminPage.module.css";
import coffeeLove from "../../public/background/menu.jpg";
// My components.
import LoadingSpinner from "components/UI/LoadingSpinner";
const Admin = dynamic(
  () => import("../../components/Admin/Admin"),
  { loading: () => <LoadingSpinner /> }
);

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
  }

  if (status === "loading" || session === null) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Head>
        <title>Admin</title>
        <meta
          name="description"
          content="Change your password or view your past orders."
          title="title"
        />
      </Head>
      <div className={styles.accountPageImage}>
        <Image
          alt="A coffee cup in a white background and letters spelling LOVE"
          src={coffeeLove}
          title="Image by @inchristalone from Unsplash"
          quality={80}
          placeholder="blur"
          blurDataURL="/blur/accountBlur.png"
          fill
        />
      </div>
      <Admin />
    </>
  );
}
