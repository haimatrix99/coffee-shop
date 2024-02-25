import type { Session } from "next-auth";
import dynamic from "next/dynamic";
import { useState } from "react";
import { m } from "framer-motion";
// My imports.
import styles from "./AccountMenu.module.css";
import { pageAnimation } from "../../utils/animations/animation";
// My components.
import Card from "../UI/Card";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { useRouter } from "next/router";
const SettingsMenu = dynamic(() => import("./SettingsMenu/SettingsMenu"), {
  loading: () => <LoadingSpinner />,
});
const PastOrders = dynamic(() => import("../PastOrders/PastOrders"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

type UserProfileProps = {
  session: Session;
};

export default function UserProfile(props: UserProfileProps) {
  const [viewSettings, setViewSettings] = useState(false);
  const [showPastOrders, setShowPastOrders] = useState(false);
  const router = useRouter();
  const user = props.session.user;
  console.log(user);
  const isAdmin = user.isAdmin;

  const toggleShowPastOrdersHandler = () => {
    setShowPastOrders((prevState) => !prevState);
  };

  const goToProfileMenuHandler = () => {
    setViewSettings(false);
  };

  const goToSettingsMenuHandler = () => {
    setShowPastOrders(false);
    setViewSettings(true);
  };

  const goToAdminPageHandler = () => {
    router.push("/admin");
  };

  return (
    <m.div initial="in" animate="animate" variants={pageAnimation}>
      <Card style="container">
        <section className={styles.profile}>
          <h1>{user.name}</h1>
          {isAdmin && (
            <>
            <button
              name="Admin"
              onClick={goToAdminPageHandler}
              className={styles.viewSettings}
            >
              Quản lý cửa hàng
            </button>
          </>
          )
            
          }
          {!viewSettings && (
            <>
              <button
                name="Settings"
                onClick={goToSettingsMenuHandler}
                className={styles.viewSettings}
              >
                Cài đặt
              </button>
              <button
                name="Show Past Orders"
                onClick={toggleShowPastOrdersHandler}
                className={styles.viewSettings}
              >
                {showPastOrders ? "Ẩn lịch sử mua hàng" : "Hiện lịch sử mua hàng"}
              </button>
            </>
          )}
          {viewSettings && (
            <SettingsMenu
              session={props.session}
              onToProfileMenu={goToProfileMenuHandler}
            />
          )}
        </section>
      </Card>
      {showPastOrders && <PastOrders />}
    </m.div>
  );
}
