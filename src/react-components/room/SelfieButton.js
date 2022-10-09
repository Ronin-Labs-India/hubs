import React from 'react';
import styles from '../input/ToolbarButton.scss';
import {ReactComponent as Icon} from "../icons/CameraIcon.svg"

const SelfieButton = ({onClick}) => {
    return <button className={styles.avatarButton} onClick={onClick}>
        <Icon />
        <label>Selfie</label>
    </button>
}

export default SelfieButton