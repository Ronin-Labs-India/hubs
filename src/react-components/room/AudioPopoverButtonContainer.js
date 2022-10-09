import React, { useState } from "react";
import PropTypes from "prop-types";
import { AudioPopoverButton } from "./AudioPopoverButton";
import { useMicrophoneStatus } from "./useMicrophoneStatus";
import { ToolbarMicButton } from "../input/ToolbarMicButton";
import { ReactComponent as MicrophoneIcon } from "../icons/Microphone.svg";
import { ReactComponent as MicrophoneMutedIcon } from "../icons/MicrophoneMuted.svg";
import { ReactComponent as LogoIcon } from "../icons/logoIcon.svg";
import { FormattedMessage } from "react-intl";
import styles from "./AudioPopover.scss"

export const AudioPopoverButtonContainer = ({ scene, initiallyVisible, content }) => {
  const { isMicMuted, toggleMute, isMicEnabled } = useMicrophoneStatus(scene);
  const [popup, setPopup] = useState(false)
  return (
    <div className={styles.mic_wrapper}>
      <AudioPopoverButton
      initiallyVisible={initiallyVisible}
      content={content}
      tooglePopup={setPopup}
      micButton={
        <ToolbarMicButton
          scene={scene}
          icon={isMicMuted || !isMicEnabled ? <MicrophoneMutedIcon /> : <MicrophoneIcon />}
          // label={<FormattedMessage id="voice-button-container.label" defaultMessage="Voice" />}
          preset={popup? "activeBtn": "basic"}
          onClick={toggleMute}
          statusColor={isMicMuted || !isMicEnabled ? "disabled" : "enabled"}
          type={"right"}
        />
      }
      onChangeMicrophoneMuted={toggleMute}
    />
    <div className={styles.logo_wrapper}>
      <LogoIcon />
    </div>
    </div>
  );
};

AudioPopoverButtonContainer.propTypes = {
  scene: PropTypes.object.isRequired,
  initiallyVisible: PropTypes.bool,
  content: PropTypes.element
};
