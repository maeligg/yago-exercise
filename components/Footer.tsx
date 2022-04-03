import styles from "./Footer.module.css";
import Button from "./Button";
import { formatCurrency } from "../utils";

type Props = {
  coverQuotes: {
    [x: string]: number;
  };
  covers: Array<string>;
};

const Footer = (props: Props) => (
  <footer className={styles.footer}>
    <span>
      Your total insurance cost :
      <span className="highlighted">
        €
        {props.coverQuotes &&
          formatCurrency(
            Object.entries(props.coverQuotes)
              .filter((quote) => props.covers.includes(quote[0]))
              .reduce((acc, curr) => acc + curr[1], 0)
          )}
      </span>
    </span>
    <Button white>Book now</Button>
  </footer>
);

export default Footer;
