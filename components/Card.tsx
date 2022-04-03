import styles from "./Card.module.css";

type Props = {
  selected: boolean;
  onToggle: () => void;
  title: string;
  description: string;
  cost: number;
};

const Card = (props: Props) => {
  return (
    <li>
      <label
        className={`${styles.label} ${props.selected ? styles.selected : null}`}
      >
        <div className={styles.flexWrapper}>
          <input
            type="checkbox"
            className={styles.checkbox}
            onChange={props.onToggle}
            checked={props.selected}
          />
          <h3>{props.title}</h3>
          <p>{props.description}</p>
        </div>
        <p className={styles.cost}>+ €{props.cost}</p>
      </label>
    </li>
  );
};

export default Card;
