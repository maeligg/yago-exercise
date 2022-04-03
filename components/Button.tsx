import styles from "./Button.module.css";

type Props = {
  white: boolean;
  children: React.ReactNode;
};

const Button = (props: Props) => {
  return (
    <button className={`${styles.button} ${props.white ? styles.white : null}`}>
      {props.children}
    </button>
  );
};

export default Button;
