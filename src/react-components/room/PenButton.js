import React from 'react';
import styles from '../input/ToolbarButton.scss';
import {ReactComponent as PenIcon} from "../icons/PenIcon.svg"

const PenButton = ({onClick}) => {
    return <button className={styles.avatarButton} onClick={onClick}>
        <PenIcon />
        <label>Pen</label>
    </button>
}

export default PenButton