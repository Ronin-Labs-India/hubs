import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { Button } from "../input/Button";
import { ReactComponent as MicrophoneIcon } from "../icons/Microphone.svg";
import { ReactComponent as MicrophoneMutedIcon } from "../icons/MicrophoneMuted.svg";
import { ReactComponent as VolumeOffIcon } from "../icons/VolumeOff.svg";
import { ReactComponent as InfoIcon } from "../icons/Info.svg";
import styles from "./MicSetupModal.scss";
import { BackButton } from "../input/BackButton";
import { SelectInputField } from "../input/SelectInputField";
import { ToggleInput } from "../input/ToggleInput";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";
import { Popover } from "../popover/Popover";
import { PermissionStatus } from "../../utils/media-devices-utils";
import { Spinner } from "../misc/Spinner";
import dekstop_insta from "../../assets/images/yash_imgs/desktop_inst.png";
import mobile_insta from "../../assets/images/yash_imgs/mobile_inst.png";

export function MicSetupModal({
  className,
  microphoneOptions,
  onChangeMicrophone,
  speakerOptions,
  onChangeSpeaker,
  isMicrophoneEnabled,
  onPlaySound,
  isMicrophoneMuted,
  onChangeMicrophoneMuted,
  onEnterRoom,
  onBack,
  permissionStatus,
  isAudioInputSelectAvailable,
  isAudioOutputSelectAvailable,
  micLevelBar,
  speakerLevelBar,
  isVR,
  isMobile,
  ...rest
}) {
  const iconStyle = isMicrophoneEnabled ? styles.iconEnabled : styles.iconDisabled;
  const [showInstruction, setShowInstruction] = useState(false);
  return (
    <>
    <div className={styles.modal_wrapper} />
    <div className={styles.modal_container}>
      <Modal
        // title={<FormattedMessage id="mic-setup-modal.title" defaultMessage="Microphone Setup" />}
        // beforeTitle={<BackButton onClick={onBack} />}
        className={className}
        disableFullscreen
        {...rest}
      >
        <div className={styles.modal_content}>
          <div className={styles.audio_setup_txt}>
            {!showInstruction ? (<>
              <span className={styles.welcome}>Talk in the</span>
              <span className={styles.org_name}>Metaverse</span>
              <span className={styles.reg_txt}>Yes, you can talk to each other inside this Metaverse!<br/> Enable your microphone below.</span>
            </>): (
              <>
                <span className={styles.welcome}>Instructions</span>
                <span className={styles.reg_txt}>Controls to roam around the metaverse</span>
              </>
            )}
          </div>
          <div className={styles.control_wrapper}>
            <Column center padding grow className={styles.content}>
              <p>
                {/* <FormattedMessage
                  id="mic-setup-modal.check-mic"
                  defaultMessage="Check your microphone and audio before entering."
                /> */}
              </p>
              {!showInstruction ? (<>
                <div className={styles.audioCheckContainer}>
                  <div className={styles.audioIoContainer}>
                    <div className={styles.iconContainer}>
                      <div>
                        {permissionStatus === PermissionStatus.PROMPT && (
                          <div className={styles.spinnerContainer}>
                            <Spinner />
                          </div>
                        )}
                        {permissionStatus === PermissionStatus.GRANTED && isMicrophoneEnabled && !isMicrophoneMuted ? (
                          <MicrophoneIcon className={iconStyle} />
                        ) : (
                          <MicrophoneMutedIcon className={iconStyle} />
                        )}
                      </div>
                      {permissionStatus === PermissionStatus.GRANTED && <> {micLevelBar}</>}
                    </div>
                    <div className={styles.actionContainer}>
                      {permissionStatus === PermissionStatus.GRANTED ? (
                        <>
                          <ToggleInput
                            label={<FormattedMessage id="mic-setup-modal.mute-mic-toggle-v2" defaultMessage="Mute" />}
                            checked={isMicrophoneMuted}
                            onChange={onChangeMicrophoneMuted}
                          />
                          <Popover
                            title="Info"
                            content={
                              <Column className={styles.popoverContent}>
                                <FormattedMessage
                                  id="mic-setup-modal.mute-mic-info"
                                  defaultMessage="You can mute anytime after you enter the room"
                                />
                              </Column>
                            }
                            placement="top"
                            showHeader={false}
                            disableFullscreen
                            popoverClass={styles.popover}
                            arrowClass={styles.popoverArrow}
                          >
                            {({ openPopover, closePopover, triggerRef }) => (
                              <div ref={triggerRef}>
                                <InfoIcon className={styles.infoIcon} onMouseEnter={openPopover} onMouseLeave={closePopover} />
                              </div>
                            )}
                          </Popover>
                        </>
                      ) : (
                        (permissionStatus === PermissionStatus.PROMPT && (
                          <p>
                            <FormattedMessage
                              id="mic-setup-modal.mic-permission-prompt"
                              defaultMessage="Requesting access to your microphone..."
                            />
                          </p>
                        )) ||
                        (permissionStatus === PermissionStatus.DENIED && (
                          <p>
                            <span className={styles.errorTitle}>
                              <FormattedMessage
                                id="mic-setup-modal.error-title"
                                defaultMessage="Microphone access was blocked."
                                className={styles.errorTitle}
                              />
                            </span>{" "}
                            <FormattedMessage
                              id="mic-setup-modal.error-description"
                              defaultMessage="To talk in Hubs you will need to allow microphone access."
                            />
                          </p>
                        ))
                      )}
                    </div>
                    {permissionStatus === PermissionStatus.GRANTED &&
                      isAudioInputSelectAvailable && (
                        <div className={styles.selectionContainer}>
                          <p style={{ alignSelf: "start" }}>
                            <FormattedMessage id="mic-setup-modal.microphone-text" defaultMessage="Microphone" />
                          </p>
                          <SelectInputField
                            className={styles.selectionInput}
                            buttonClassName={styles.selectionInput}
                            onChange={onChangeMicrophone}
                            {...microphoneOptions}
                          />
                        </div>
                      )}
                  </div>
                  <div className={styles.audioIoContainer}>
                    <div className={styles.iconContainer}>
                      <VolumeOffIcon className={styles.iconEnabled} style={{ marginRight: "5px" }} />
                      <> {speakerLevelBar} </>
                    </div>
                    <div className={styles.actionContainer}>
                      <Button preset="basic" onClick={onPlaySound} sm>
                        <FormattedMessage id="mic-setup-modal.test-audio-button" defaultMessage="Test Audio" />
                      </Button>
                    </div>
                    {permissionStatus === PermissionStatus.GRANTED &&
                      isAudioOutputSelectAvailable && (
                        <div className={styles.selectionContainer}>
                          <p style={{ alignSelf: "start" }}>
                            <FormattedMessage id="mic-setup-modal.speakers-text" defaultMessage="Speakers" />
                          </p>
                          <SelectInputField
                            onChange={onChangeSpeaker}
                            className={styles.selectionInput}
                            buttonClassName={styles.selectionInput}
                            {...speakerOptions}
                          />
                        </div>
                      )}
                  </div>
                </div>
                <button className={styles.enterRoomBtn} onClick={() => {isVR ? onEnterRoom() : setShowInstruction(true)}}>
                  <span>{isVR ? "Enter Room" : "Continue"}</span>
                </button>
              </>) : (
                <>
                  {
                    isMobile ? <div className={styles.mobile_inst}><img src={mobile_insta} /></div> : <div className={styles.desktop_inst}>
                      <img src={dekstop_insta} />
                    </div>
                  }
                  <button className={styles.enterRoomBtn} onClick={onEnterRoom}>
                    <span>{"Enter Room"}</span>
                  </button>
                </>
              )}
              {/* <Button preset="primary" onClick={onEnterRoom}>
                <FormattedMessage id="mic-setup-modal.enter-room-button" defaultMessage="Enter Room" />
              </Button> */}
            </Column>
          </div>
        </div>
      </Modal>
    </div>
    </>
  );
}

MicSetupModal.propTypes = {
  className: PropTypes.string,
  onPlaySound: PropTypes.func,
  micLevelBar: PropTypes.node,
  speakerLevelBar: PropTypes.node,
  isMicrophoneEnabled: PropTypes.bool,
  isMicrophoneMuted: PropTypes.bool,
  onChangeMicrophoneMuted: PropTypes.func,
  microphoneOptions: PropTypes.object,
  onChangeMicrophone: PropTypes.func,
  speakerOptions: PropTypes.object,
  onChangeSpeaker: PropTypes.func,
  onEnterRoom: PropTypes.func,
  onBack: PropTypes.func,
  permissionStatus: PropTypes.string,
  isAudioInputSelectAvailable: PropTypes.bool,
  isAudioOutputSelectAvailable: PropTypes.bool
};

MicSetupModal.defaultProps = {
  permissionStatus: PermissionStatus.PROMPT
};
