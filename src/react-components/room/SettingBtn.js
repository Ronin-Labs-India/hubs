import React from 'react';
import styles from "./ExitRoomBtn.scss";
import { ReactComponent as SettingIcon } from "../icons/SettingBtn.svg";
const SettingButton = (props) => {
  return <div className={styles.settingBtn} {...props}>
    <SettingIcon />
  </div>
}

export default SettingButton