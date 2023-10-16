import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { AnimationClip, ObjectLoader } from "three";
// import { VideoComponent } from '../scene/VideoComponent';

export class WindfarmUtils {
  static Load3DModel_JSON(path) {
    return (
      new Promise() <
      THREE.Object3D >
      ((resolve, reject) => {
        const loader = new THREE.ObjectLoader();
        console.log("JSON DATA", path);

        loader.parse(path, gltf => {
          resolve(gltf);
        });
        // loader = new THREE.lOADER
        // loader.load(, (gltf) => {
        //    resolve(gltf);
        // }, undefined, (error) => {
        //     reject("ERROR:"+error);
        // });
      })
    );
  }

  static Load3DModel(path) {
    return (
      new Promise() <
      THREE.Object3D >
      ((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load(
          path,
          gltf => {
            resolve(gltf.scene);
          },
          undefined,
          error => {
            reject("ERROR:" + error);
          }
        );
      })
    );
  }

  static clamp(x, a, b) {
    return Math.min(Math.max(x, a), b);
  }

  static async load3DModelWithAnimationData(path) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();

      loader.load(
        path,
        gltf => {
          let model = gltf.scene;
          let mixer = new THREE.AnimationMixer(gltf.scene);
          let clips = gltf.animations;
          resolve(new AnimAsset(model, mixer, clips, gltf));
        },
        undefined,
        error => {
          reject("Can not load, error:" + error);
        }
      );
    });
  }

  static load3DModelWithAnimationData_data_uri(uri) {
    return (
      new Promise() <
      AnimAsset >
      ((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load(
          uri,
          gltf => {
            let model = gltf.scene;
            let mixer = new THREE.AnimationMixer(gltf.scene);
            let clips = gltf.animations;
            resolve(new AnimAsset(model, mixer, clips, gltf));
          },
          undefined,
          error => {
            reject("Can not load, error:" + error);
          }
        );
      })
    );
  }

  // static loadVideo(path:any) {
  //     return new Promise<VideoComponent>((resolve, reject) => {

  //             Utils.GetVideoBlob(path).then((value) => {
  //                 const vid = new VideoComponent();
  //                 vid.load(value, 1920, 1080);
  //                 resolve(vid);
  //             }).catch((error) => {
  //                 reject(error);
  //             })

  //             // const vid = new VideoComponent();
  //             // vid.load(require('../assets/videos/gamaon.mp4').default, 1920, 1080, undefined, undefined, () => {
  //             //     this.tvGamaOnVid = vid;
  //             //     resolve(this.tvGamaOnVid);
  //             // }, () => {
  //             //     reject("gamaon error");
  //             // })
  //     })
  // }

  static loadAudio(path) {
    return (
      new Promise() <
      any >
      ((resolve, reject) => {
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load(
          path,
          audioBuffer => {
            resolve(audioBuffer);
          },
          undefined,
          error => {
            reject("Error: " + error.message);
          }
        );
      })
    );
  }

  static GetVideoBlob(path) {
    return (
      new Promise() <
      any >
      ((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open("GET", path, true);
        req.responseType = "blob";

        req.onload = () => {
          // Onload is triggered even on 404
          // so we need to check the status code
          if (req.status === 200) {
            let videoBlob = req.response;
            // var vid = URL.createObjectURL(videoBlob); // IE10+
            // // Video is now downloaded
            // // and we can set it as source on the video element
            // video.src = vid;
            resolve(videoBlob);
          }
        };
        req.onerror = () => {
          // Error
          reject("Can not Load " + path);
        };

        req.send();
      })
    );
  }

  static isFromMobile = () => {
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return true;
    } else {
      return false;
    }
  };

  static getMobileOS = () => {
    var userAgent = navigator.userAgent || navigator.vendor;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
      return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "iOS";
    }

    return "unknown";
  };

  static isSafari = () => {
    return navigator.userAgent.toLowerCase().indexOf("safari/") > -1;
  };

  static requestFullScreen = () => {
    return;

    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
      /* Safari */
      document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) {
      /* IE11 */
      document.body.msRequestFullscreen();
    }
  };
}
export class AnimAsset {
  model = undefined;
  gltf = undefined;
  mixer = undefined;
  clips = undefined;

  constructor(pModel, pMixer, pClips, pGltf) {
    this.model = pModel;
    this.mixer = pMixer;
    this.clips = pClips;
    this.gltf = pGltf;
  }

  makeClone() {
    let gltf = this.gltf;
    let model = this.gltf.scene.clone();
    let mixer = new THREE.AnimationMixer(model);
    let clips = this.gltf.animations;
    return new AnimAsset(model, mixer, clips, undefined);
  }

  getAction(clipIndex) {
    return this.mixer.clipAction(this.clips[clipIndex]);
  }
  getActionByName(clipName) {
    return this.mixer.clipAction(AnimationClip.findByName(this.clips, clipName));
  }
}
