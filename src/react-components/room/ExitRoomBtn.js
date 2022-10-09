import React from 'react';
import styles from "./ExitRoomBtn.scss";
import { ReactComponent as ExitIcon } from "../icons/exitBtn.svg";
const ExitRoomButton = (props) => {
  return <div className={styles.exitButton} {...props}>
    <ExitIcon />
  </div>
}

export default ExitRoomButton