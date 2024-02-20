import styles from "./GuestPrompt.module.css";
type GuestPromptProps = {
  onContinue: VoidFunction;
  onToSignIn: VoidFunction;
};
export default function GuestPrompt(props: GuestPromptProps) {
  // Prompt if a guest user wants to continue as guest.
  return (
    <div className={styles.guestPrompt}>
      <h2>Tiếp tục với khách?</h2>
      <div className={styles.actions}>
        <button onClick={props.onContinue}>Đúng</button>
        <button onClick={props.onToSignIn}>Đăng nhập/Tạo tài khoản</button>
      </div>
    </div>
  );
}
