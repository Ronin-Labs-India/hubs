import React from 'react';
import styles from "./ExitRoomBtn.scss";
import { ReactComponent as SettingIcon } from "../icons/SettingBtn.svg";
const SettingButton = () => {
  return <div className={styles.settingBtn}>
    <SettingIcon />
  </div>
}

export default SettingButton