import React from 'react';
import styles from '../input/ToolbarButton.scss';
import {ReactComponent as AvatarIcon} from "../icons/AvatarIcon.svg"

const AvatarButton = ({onClick}) => {
    return <button className={styles.avatarButton} onClick={onClick}>
        <AvatarIcon / >
        <label>Avatar</label>
    </button>
}

export default AvatarButton