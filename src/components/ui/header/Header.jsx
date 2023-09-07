import React, { useContext } from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import AuthContext from "../../../store/auth-context";

const Header = () => {
  const context = useContext(AuthContext);

  return (
    <>
      <main className={styles.header}>
        <div className={styles.headerItems}>
          <Link to="/">
            <div> BridgeTech-Assesment</div>
          </Link>
          {!context.isLoggedIn && (
            <section className={styles.headerAuth}>
              <Link to="/login">
                <button className={styles.headerAuthBtn}>Login</button>
              </Link>
              <Link to="/signup">
                <button
                  className={`${styles.signupBtn} ${styles.headerAuthBtn}`}
                >
                  Signup
                </button>
              </Link>
            </section>
          )}
          {context.isLoggedIn && (
            <section className={styles.headerAuth}>
              <button
                className={`${styles.headerAuthBtn}`}
                onClick={context.onLogout}
              >
                Logout
              </button>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default Header;
