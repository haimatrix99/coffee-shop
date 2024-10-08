import Head from "next/head";
import Image from "next/image";
import { m } from "framer-motion";
// My imports.
import styles from "./HomePage.module.css";
import coffeeShopImage from "../public/background/coffee-shop-bg.jpg";
import { pageAnimation } from "../utils/animations/animation";
// My component.
import WelcomeMessage from "../components/Welcome/WelcomeMessage";

export default function Home() {
  return (
    <>
      <Head>
        <title>Coffee Shop</title>
        <meta
          name="description"
          content="Chào mừng bạn đến với cửa hàng coffee của tôi!"
          title="title"
        />
      </Head>
      <div className={styles.homeImage}>
        <Image
          alt="Coffee Shop Interior"
          title="Image by @pinchebesu from Unsplash"
          src={coffeeShopImage}
          quality={80}
          placeholder="blur"
          blurDataURL="/blur/homeBlur.png"
          fill
        />
      </div>
      <m.div
        className={styles.pageOverlay}
        initial="in"
        animate="animate"
        variants={pageAnimation}
      >
        <WelcomeMessage />
      </m.div>
    </>
  );
}
