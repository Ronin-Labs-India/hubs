import React from 'react';
import styles from "./ExitRoomBtn.scss";
import { ReactComponent as ExitIcon } from "../icons/exitBtn.svg";
const ExitRoomButton = () => {
  return <div className={styles.exitButton}>
    <ExitIcon />
  </div>
}

export default ExitRoomButton