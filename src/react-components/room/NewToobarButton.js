import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "../input/ToolbarButton.scss";

export const presets = [
  "basic",
  "transparent",
  "accept",
  "cancel",
  "accent1",
  "accent2",
  "accent3",
  "accent4",
  "accent5"
];

export const types = ["none", "left", "middle", "right"];

export const statusColors = ["recording", "unread", "enabled", "disabled"];

export const NewToolbarButton = forwardRef(
  (
    { preset, className, iconContainerClassName, children, icon, label, selected, large, statusColor, type, ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          styles.newToolbarButton,
          {[styles.btnActive]: selected}
        )}
        {...rest}
      >
        {icon}
        {label && <label>{label}</label>}
      </button>
    );
  }
);

NewToolbarButton.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.node,
  selected: PropTypes.bool,
  preset: PropTypes.oneOf(presets),
  statusColor: PropTypes.oneOf(statusColors),
  large: PropTypes.bool,
  className: PropTypes.string,
  iconContainerClassName: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(types)
};

NewToolbarButton.defaultProps = {
  preset: "basic"
};
