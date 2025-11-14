import styles from "./ToggleSwitch.module.css"

type ToggleSwitchProps = {
    changeIsDelivery: (open: boolean) => void;
    isDelivery: boolean;
}

export function ToggleSwitch({ changeIsDelivery, isDelivery }: ToggleSwitchProps) {
  return (
    <div className={styles.container}>
      <span className={isDelivery ? styles.labelOff : styles.labelOn}>
        NÃO
      </span>
      
      <button
        type="button"
        onClick={() => changeIsDelivery(!isDelivery)}
        className={`${styles.toggle} ${isDelivery ? styles.toggleOn : styles.toggleOff}`}
        aria-label="Toggle switch"
      >
        <span className={`${styles.slider} ${isDelivery ? styles.sliderOn : ''}`} />
      </button>
      
      <span className={isDelivery ? styles.labelOn : styles.labelOff}>
        SIM
      </span>
    </div>
  );
}