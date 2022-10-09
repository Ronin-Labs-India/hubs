import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Modal } from "../modal/Modal";
import { Button } from "../input/Button";
import { ReactComponent as EnterIcon } from "../icons/enterMeta.svg";
import { ReactComponent as VRIcon } from "../icons/vrdevice.svg";
import { ReactComponent as ShowIcon } from "../icons/Show.svg";
import { ReactComponent as SettingsIcon } from "../icons/Settings.svg";
import styles from "./RoomEntryModal.scss";
import styleUtils from "../styles/style-utils.scss";
import { useCssBreakpoints } from "react-use-css-breakpoints";
import { Column } from "../layout/Column";
import { AppLogo } from "../misc/AppLogo";
import { FormattedMessage } from "react-intl";
import dLogo from "../../assets/images/yash_imgs/deskLogo.png";
import mLogo from "../../assets/images/yash_imgs/mobileLogo.png";

export function RoomEntryModal({
  className,
  roomName,
  showJoinRoom,
  onJoinRoom,
  showEnterOnDevice,
  onEnterOnDevice,
  showSpectate,
  onSpectate,
  showOptions,
  onOptions,
  ...rest
}) {
  const breakpoint = useCssBreakpoints();
  return (
    <>
    <div className={styles.modal_wrapper} />
    <div className={styles.modal_container}>
      <Modal className={classNames(styles.roomEntryModal, className)} disableFullscreen {...rest}>
        <div className={styles.modal_content}>
          <div className={styles.logo_wrapper}>
            <div>
              <img src={dLogo} className={styles.dLogo} />
              <img src={mLogo} className={styles.mLogo}/>
            </div>
          </div>
          <div className={styles.welcome_txt}>
            <div>
              <span className={styles.welcome}>Welcome to the</span>
              <span className={styles.org_name}>Yashverse!</span>
              <span className={styles.reg_txt}>Choose an option from below to enter.</span>
            </div>
            <div className={classNames(styles.button_wrapper,styles.buttons)}>
            {showJoinRoom && (
              <div>
                <button className={styles.enterRoomBtn} onClick={onJoinRoom}>
                  <EnterIcon />
                  <span>{"Enter the Metaverse"}</span>
                </button>
              </div>
            )}
            {showEnterOnDevice && (
              <div>
                <button className={styles.enterVRBtn} onClick={onEnterOnDevice}>
                  <VRIcon />
                  <span>{"Join with VR Device"}</span>
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
        {/* <Column center className={styles.content}>
          {breakpoint !== "sm" &&
            breakpoint !== "md" && (
              <div className={styles.logoContainer}>
                <AppLogo />
              </div>
            )}
          <div className={styles.roomName}>
            <h5>
              <FormattedMessage id="room-entry-modal.room-name-label" defaultMessage="Room Name" />
            </h5>
            <p>-----{roomName}------</p>
          </div>
          <Column center className={styles.buttons}>
            {showJoinRoom && (
              <Button preset="accent4" onClick={onJoinRoom}>
                <EnterIcon />
                <span>
                  <FormattedMessage id="room-entry-modal.join-room-button" defaultMessage="Join Room" />
                </span>
              </Button>
            )}
            {showEnterOnDevice && (
              <Button preset="accent5" onClick={onEnterOnDevice}>
                <VRIcon />
                <span>
                  <FormattedMessage id="room-entry-modal.enter-on-device-button" defaultMessage="Enter On Device" />
                </span>
              </Button>
            )}
            {showSpectate && (
              <Button preset="accent2" onClick={onSpectate}>
                <ShowIcon />
                <span>
                  <FormattedMessage id="room-entry-modal.spectate-button" defaultMessage="Spectate" />
                </span>
              </Button>
            )}
            {showOptions &&
              breakpoint !== "sm" && (
                <>
                  <hr className={styleUtils.showLg} />
                  <Button preset="transparent" className={styleUtils.showLg} onClick={onOptions}>
                    <SettingsIcon />
                    <span>
                      <FormattedMessage id="room-entry-modal.options-button" defaultMessage="Options" />
                    </span>
                  </Button>
                </>
              )}
          </Column>
        </Column> */}
      </Modal>
    </div>
    </>
  );
}

RoomEntryModal.propTypes = {
  className: PropTypes.string,
  roomName: PropTypes.string.isRequired,
  showJoinRoom: PropTypes.bool,
  onJoinRoom: PropTypes.func,
  showEnterOnDevice: PropTypes.bool,
  onEnterOnDevice: PropTypes.func,
  showSpectate: PropTypes.bool,
  onSpectate: PropTypes.func,
  showOptions: PropTypes.bool,
  onOptions: PropTypes.func
};

RoomEntryModal.defaultProps = {
  showJoinRoom: true,
  showEnterOnDevice: true,
  showSpectate: true,
  showOptions: true
};
