import { useState, useRef, useCallback } from "react";
import { useAppDispatch } from "../../store/hooks";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
// My imports
import styles from "./AuthForm.module.css";
import { CART_STORAGE_NAME } from "../../store/cart/cart-actions";
import { sendCartData, fetchCartData } from "../../store/cart/cart-actions";
import {
  isValidPhoneNumber,
  isValidPassword,
} from "../../utils/validation/input_validation";

type SignInProps = {
  switchToSignUp: (isNewUser: boolean, message: string) => void;
  formId: "sign-in" | "sign-up";
};

export default function SignIn({ switchToSignUp, formId }: SignInProps) {
  const [formInputIsValid, setFormInputIsValid] = useState({
    phoneNumber: true,
    password: true,
  });
  const [invalidCredentials, setInvalidCredentials] = useState("");
  const phoneNumberInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Submission handler for sign-in form.
  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    // Get user input.
    const enteredPhoneNumber = phoneNumberInputRef.current
      ? phoneNumberInputRef.current.value
      : "";
    const enteredPassword = passwordInputRef.current
      ? passwordInputRef.current.value
      : "";

    // Validate user input.
    const enteredPhoneNumberIsValid = isValidPhoneNumber(enteredPhoneNumber);
    const enteredPasswordIsValid = isValidPassword(enteredPassword);

    // Save validation for user validation feedback.
    setFormInputIsValid({
      phoneNumber: enteredPhoneNumberIsValid,
      password: enteredPasswordIsValid,
    });

    const formIsValid = enteredPhoneNumberIsValid && enteredPasswordIsValid;
    if (!formIsValid) {
      // Do not submit form since inputs are invalid.
      return;
    }

    // Form inputs are valid, now check if the credentials are valid.

    // Call the provider and pass the configuration
    // Redirect false: Does not redirect to an error page, which returns a promise.
    // Pass credential data too for the backend.
    // Result will have an error if there is an error
    const result = await signIn("credentials", {
      redirect: false,
      phoneNumber: enteredPhoneNumber,
      password: enteredPassword,
    });

    if (!result?.error) {
      // Successful signIn

      // Check if we have any guest cart session.
      const guestCartSessionStorage =
        window.localStorage.getItem(CART_STORAGE_NAME);
      const cart = guestCartSessionStorage
        ? JSON.parse(guestCartSessionStorage)
        : null;
      if (cart && cart.numberOfCartItems > 0) {
        // If we had a guest cart session then save that session into our server with the signin user.
        // Send the cart session to our database if we had items during our guest session.
        dispatch(
          sendCartData({
            items: cart.items,
            numberOfCartItems: cart.numberOfCartItems,
            totalPrice: cart.totalPrice,
          })
        );
      } else {
        // Fetch cart session from our server if there is one.
        dispatch(fetchCartData());
      }
      // clear the local storage from our guest session
      window.localStorage.removeItem(CART_STORAGE_NAME);
      // Redirect user to the home page.
      router.replace("/");
    } else {
      setInvalidCredentials(result ? result.error : "Something went wrong...");
    }
  };

  const switchToSignUpHandler = useCallback(() => {
    switchToSignUp(false, "");
  }, [switchToSignUp]);

  // Get the input classes depending on the input validity.
  const phoneNumberClasses = `${styles.control} ${
    formInputIsValid.phoneNumber ? "" : styles.invalid
  }`;
  const passwordClasses = `${styles.control} ${
    formInputIsValid.password ? "" : styles.invalid
  }`;

  return (
    <>
      <h1>Đăng nhập</h1>
      {invalidCredentials !== "" && (
        <p className={styles.errorMessage}>{invalidCredentials}</p>
      )}
      <form onSubmit={submitHandler} id={formId} name="sign-in">
        <div className={phoneNumberClasses}>
          <label htmlFor="phoneNumber">Số điện thoại của bạn</label>
          <input
            type="phoneNumber"
            id="phoneNumber"
            ref={phoneNumberInputRef}
            autoComplete="phoneNumber"
          />
          {!formInputIsValid.phoneNumber && <p>Xin nhập số điện thoại của bạn</p>}
        </div>
        <div className={passwordClasses}>
          <label htmlFor="password">Mật khẩu của bạn</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            autoComplete="current-password"
          />
          {!formInputIsValid.password && <p>Xin nhập mật khẩu của bạn</p>}
        </div>
        <div className={styles.actions}>
          <button className={styles.submitButton}>Đăng nhập</button>
          <button
            type="button"
            className={styles.toggle}
            onClick={switchToSignUpHandler}
          >
            Tạo tài khoản mới
          </button>
        </div>
      </form>
    </>
  );
}
