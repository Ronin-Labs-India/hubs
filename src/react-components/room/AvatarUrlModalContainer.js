import React from "react";
/* { store, scene, onClose  } */
export function AvatarUrlModalContainer() {
  // const onSubmit = useCallback(
  //   ({ url }) => {
  //     store.update({ profile: { ...store.state.profile, ...{ avatarId: url } } });
  //     scene.emit("avatar_updated");
  //     onClose();
  //   },
  //   [store, scene, onClose]
  // );

  return (
    <div>
      <iframe
        src="https://laalsingh.readyplayer.me/avatar?frameApi`"
        frameBorder="0"
        width={1000}
        height={700}
      ></iframe>
    </div>
  );
  // return <AvatarUrlModal onSubmit={onSubmit} onClose={onClose} />;
}

// AvatarUrlModalContainer.propTypes = {
//   store: PropTypes.object.isRequired,
//   scene: PropTypes.object.isRequired,
//   onClose: PropTypes.func
// };
