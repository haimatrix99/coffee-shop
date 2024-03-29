import { useState, useRef, useCallback } from "react";
// My imports.
import type RegisteredUser from "../../models/RegisteredUser";
import styles from "./AuthForm.module.css";
import { isValidName } from "../../utils/validation/input_validation";

/**
 * Calls our signUp API which creates a new user.
 * @param {User Object{firstName:string, lastName:string, phoneNumber:string, password:string }} userInfo
 * @returns string result message.
 */
async function createUser(userInfo: RegisteredUser) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(userInfo),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();

  if (!response.ok) {
    // Something went wrong in our server.
    throw new Error(responseData.message || "Something went wrong!");
  }
  return responseData;
}

type SingUpProps = {
  switchToSignIn: (isNewUser: boolean, message: string) => void;
  formId: "sign-in" | "sign-up";
};

export default function SignUp({ switchToSignIn, formId }: SingUpProps) {
  // Invalidation react states.
  const [formInputIsValid, setFormInputIsValid] = useState({
    firstName: true,
    lastName: true,
  });
  const [invalidCredentials, setInvalidCredentials] = useState("");
  // React DOM object references.
  const phoneNumberInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);

  /**
   * Validates user input in the front end and sends the new user credentials
   * to our database, only if the inputs are valid.
   * @param {Object} event
   */
  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    // Get user input.
    const enteredPhoneNumber = phoneNumberInputRef.current
      ? phoneNumberInputRef.current.value
      : "";
    const enteredPassword = passwordInputRef.current
      ? passwordInputRef.current.value
      : "";
    const enteredFirstName = firstNameInputRef.current
      ? firstNameInputRef.current.value
      : "";
    const enteredLastName = lastNameInputRef.current
      ? lastNameInputRef.current.value
      : "";

    // Validate user input name.
    // Let phoneNumber and password get handled by input HTML object.
    const enteredFirstNameIsValid = isValidName(enteredFirstName);
    const enteredLastNameIsValid = isValidName(enteredLastName);

    // Save validation for user validation feedback.
    setFormInputIsValid({
      firstName: enteredFirstNameIsValid,
      lastName: enteredLastNameIsValid,
    });

    if (!(enteredFirstNameIsValid && enteredLastNameIsValid)) {
      // Do not submit form since inputs are invalid.
      return;
    }

    const userInfo: RegisteredUser = {
      phoneNumber: enteredPhoneNumber,
      password: enteredPassword,
      firstName: enteredFirstName,
      lastName: enteredLastName,
    };

    try {
      const result = await createUser(userInfo); // Get result from our database when creating a user.
      switchToSignIn(true, result.message); // Redirect user to sign in with new credentials and let the user know their account was created
    } catch (error) {
      setInvalidCredentials(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  const switchToSignInHandler = useCallback(() => {
    switchToSignIn(false, "");
  }, [switchToSignIn]);

  // Get the input classes depending on the input validity.
  const firstNameClasses = `${styles.control} ${
    formInputIsValid.firstName ? "" : styles.invalid
  }`;
  const lastNameClasses = `${styles.control} ${
    formInputIsValid.lastName ? "" : styles.invalid
  }`;

  return (
    <>
      <h1>Tạo tài khoản</h1>
      {invalidCredentials !== "" && (
        <p className={styles.errorMessage}>{invalidCredentials}</p>
      )}
      <form onSubmit={submitHandler} id={formId}>
        <div className={firstNameClasses}>
          <label htmlFor="first-name">Họ</label>
          <input
            type="text"
            id="first-name"
            ref={firstNameInputRef}
            autoComplete="given-name"
          />
          {!formInputIsValid.firstName && <p>Xin mời nhập họ.</p>}
        </div>
        <div className={lastNameClasses}>
          <label htmlFor="last-name">Tên</label>
          <input
            type="text"
            id="last-name"
            ref={lastNameInputRef}
            autoComplete="family-name"
          />
          {!formInputIsValid.lastName && <p>Xin mời nhập tên.</p>}
        </div>
        <div className={styles.control}>
          <label htmlFor="phoneNumber">Số điện thoại của bạn</label>
          <input
            type="phoneNumber"
            id="phoneNumber"
            required
            ref={phoneNumberInputRef}
            autoComplete="phoneNumber"
          />
        </div>
        <div className={styles.control}>
          <label htmlFor="password">Mật khẩu của bạn</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
            minLength={7}
            autoComplete="new-password"
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.submitButton} type="submit">
            Tạo tài khoản
          </button>
          <button
            type="button"
            className={styles.toggle}
            onClick={switchToSignInHandler}
          >
            Đăng nhập với tài khoản
          </button>
        </div>
      </form>
    </>
  );
}
