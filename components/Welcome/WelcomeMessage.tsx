import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
// My imports.
import styles from "./WelcomeMessage.module.css";

function getGreetingMessage(session: Session | null): string {
  if (session) {
    return `Chào mừng ${session.user.name} đến với cửa hàng coffee của tôi!`;
  }
  return "Chào mừng đến với cửa hàng coffee của tôi!";
}

export default function WelcomeMessage() {
  const { data: session } = useSession();
  const greetingMessage = getGreetingMessage(session);

  return (
    <section className={styles.message}>
      <h2>{greetingMessage}</h2>
      <p>
        <Link href="/menu">Đặt coffee mang đi!</Link>
      </p>
    </section>
  );
}
