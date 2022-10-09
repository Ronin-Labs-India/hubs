import React from 'react';
import styles from '../input/ToolbarButton.scss';
import {ReactComponent as Icon} from "../icons/ChatIcon.svg"

const ChatButton = ({onClick}) => {
    return <button className={styles.avatarButton} onClick={onClick}>
        <Icon / >
        <label>Chat</label>
    </button>
}

export default ChatButton