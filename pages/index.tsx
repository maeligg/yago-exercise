import type { NextPage } from "next";
import { useState, useEffect, SyntheticEvent } from "react";
import Head from "next/head";
import styles from "./Index.module.css";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { camelToSentenceCase, formatCurrency } from "../utils";

const coverExplanations = {
  afterDelivery:
    "Covers damage arising after delivery of or completion of work (ex: new machines recently installed at the client's office start a fire).",
  publicLiability:
    "Cover compensation claims for injury or damage (ex: you spill a cup of coffee over a client’s computer equipment).",
  professionalIndemnity:
    "Cover compensation claims for a mistake that you make during your work (ex: accidentally forwarded confidential client information to third parties).",
  entrustedObjects:
    "Objects that don't belong to you, and are entrusted to you. You are obviously liable for any damage to these goods. (ex: you break the super expensive computer that was provided to you as an IT consultant).",
  legalExpenses:
    "Also known as legal insurance, is an insurance which facilitates access to law and justice by providing legal advice and covering legal costs of a dispute. (ex: a client asks you for a financial compensation for a mistake you made in your work and you consider it's absolutely not you fault considering the context and you thus want to hire a lawyer to defend you).",
};

const mapDeductibleFormula = (inputValue: "0" | "1" | "2") => {
  switch (inputValue) {
    case "0":
      return "small";
    case "1":
      return "medium";
    case "2":
      return "large";
  }
};

const mapCoverageCeilingFormula = (inputValue: "0" | "1") => {
  switch (inputValue) {
    case "0":
      return "small";
    case "1":
      return "large";
  }
};

type CoverTypes =
  | "afterDelivery"
  | "publicLiability"
  | "professionalIndemnity"
  | "entrustedObjects"
  | "legalExpenses";

const Home: NextPage = () => {
  const [deductible, setDeductible] = useState(0);
  const [deductibleFormula, setDeductibleFormula] = useState<"0" | "1" | "2">(
    "1"
  );
  const [coverageCeiling, setCoverageCeiling] = useState(0);
  const [coverageCeilingFormula, setCoverageCeilingFormula] = useState<
    "0" | "1"
  >("1");
  const [coverQuotes, setCoverQuotes] =
    useState<{ [key in CoverTypes]: number }>();
  const [covers, setCovers] = useState([
    "professionalIndemnity",
    "legalExpenses",
  ]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);

    fetch("https://staging-gtw.seraphin.be/quotes/professional-liability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
      body: JSON.stringify({
        annualRevenue: 80000,
        enterpriseNumber: "0649885171",
        legalName: "example SA",
        naturalPerson: true,
        nacebelCodes: ["62010", "62020", "62030", "62090", "63110"],
        coverageCeilingFormula: mapCoverageCeilingFormula(
          coverageCeilingFormula
        ),
        deductibleFormula: mapDeductibleFormula(deductibleFormula),
      }),
    })
      .then((res) => res.json())
      .then((quote) => {
        setCoverageCeiling(quote.data.coverageCeiling);
        setDeductible(quote.data.deductible);
        setCoverQuotes(quote.data.grossPremiums);
      })
      .catch((error) => {
        setError(true);
        console.log("Error : ", error);
      });
  }, [deductibleFormula, coverageCeilingFormula]);

  const toggleCover = (coverKey: string) => {
    if (covers.includes(coverKey)) {
      setCovers(covers.filter((cover) => cover !== coverKey));
    } else {
      setCovers([...covers, coverKey]);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>RC pro calculator</title>
        <meta
          name="description"
          content="An app to visualise and cusomise your RC pro (Responsabilité Civile professionelle) quote."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Your insurance</h1>

      {error ? (
        <p className={styles.error}>
          Something went wrong, please refresh the page or try again later.
        </p>
      ) : (
        <main className={styles.main}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 282 120"
            className={styles.yagoSmile}
          >
            <path
              fillRule="evenodd"
              d="M733.843363,92.1691942 C738.614505,91.2949335 743.28734,93.8787502 745.137024,98.3022638 C760.720602,135.521255 794.460389,159.392946 834.167932,159.866658 L835.371725,159.872859 L836.559847,159.866862 C875.272285,159.41124 908.287916,136.677309 924.362305,100.903159 L924.849074,99.8039681 C926.686452,95.5672185 931.122658,93.06587 935.721385,93.7301782 L936.066556,93.7859593 L967.518435,99.4789208 C973.909776,100.630024 977.70019,107.370002 975.246544,113.395297 C955.327097,162.347023 914.318739,198.178957 865.373717,208.735957 L863.888119,209.048117 L858.624069,209.986347 C843.931933,212.599983 828.900076,212.669514 814.196691,210.193851 L812.860943,209.961779 L802.548394,208.11645 L802.365748,208.072994 C754.028565,196.57235 713.912809,160.461507 694.706629,111.719501 C692.392475,105.829089 695.994623,99.3182437 702.125366,97.9869039 L702.450353,97.9216473 L733.843363,92.1691942 Z"
              transform="translate(-694 -92)"
            ></path>
          </svg>
          <section className={styles.section}>
            <h2>Covers</h2>
            <p className={styles.tip}>
              We&apos;ve pre-selected the covers we believe are the most
              important for you.
            </p>
            {coverQuotes && Object.values(coverQuotes).length ? (
              <ul className={styles.covers}>
                {Object.entries(coverQuotes).map((cover) => (
                  <Card
                    key={cover[0]}
                    title={camelToSentenceCase(cover[0])}
                    description={coverExplanations[cover[0]]}
                    cost={formatCurrency(cover[1])}
                    selected={covers.includes(cover[0])}
                    onToggle={() => toggleCover(cover[0])}
                  />
                ))}
              </ul>
            ) : (
              <span className={styles.loader} />
            )}
          </section>

          <section className={styles.section}>
            <h2>
              Deductible :<span className="highlighted"> €{deductible}</span>
            </h2>
            <p className={styles.tip}>
              Your deductible represents the amount you need to pay before the
              insurance will actually reimburse.
            </p>
            <div className={styles.flexWrapper}>
              <input
                type="range"
                id="deductibleFormula"
                min="0"
                max="2"
                onChange={(e: SyntheticEvent) =>
                  setDeductibleFormula(e.target.value)
                }
                value={deductibleFormula}
              />
              <label htmlFor="deductibleFormula">
                Adjust your deductible formula
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <h2>
              Coverage ceiling :
              <span className="highlighted"> €{coverageCeiling}</span>
            </h2>
            <p className={styles.tip}>
              Your coverage ceiling is the max the insurance will cover. Above
              this amount, you’re not covered anymore.
            </p>
            <div className={styles.flexWrapper}>
              <input
                type="range"
                id="coverageCeilingFormula"
                min="0"
                max="1"
                onChange={(e: SyntheticEvent) =>
                  setCoverageCeilingFormula(e.target?.value)
                }
                value={coverageCeilingFormula}
              />
              <label htmlFor="coverageCeilingFormula">
                Adjust your coverage ceiling formula
              </label>
            </div>
          </section>
        </main>
      )}

      <Footer coverQuotes={coverQuotes} covers={covers} />
    </div>
  );
};

export default Home;
