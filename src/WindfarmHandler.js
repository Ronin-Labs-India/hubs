import { number } from "prop-types";
import * as THREE from "three";
import authService from "./service/auth.service";
import windfarm_glb from "./assets/models/custom/windmill_1.glb";
import { WindfarmUtils } from "./utils_windfarm/WindfarmUtils";
// import { Utils } from "./utils_windfarm/Utils";
export class WindfarmHandler {
  static instance;
  // SpeedOfWindblade = 0;
  // Accelerometer_x = 0;
  // Accelerometer_y = 0;
  // Accelerometer_z = 0;
  // SpeedStatus = undefined;
  // AccelerometerStatus = undefined;

  isRefresehTurbineBusy = false;
  isRefreshGeneratorBusy = false;
  isRefreshGearBusy = false;
  isRefreshNacelleBusy = false;
  isAlertActionBusy = false;

  turbineData = undefined;
  generatorData = undefined;
  gearBoxData = undefined;
  nacelleData = undefined;

  windfarmRot = new THREE.Euler(0, 0, 0);
  alertActionData = {
    Pid: "WF01Turbine01",
    Paction: "TurnOn"
  };
  alertActionDatabase = {
    turbine: {
      alert_highBaldeRotation: {
        Paction: "Reduce"
      },
      alert_turbineIsTilted: {
        Paction: "TurnOff"
      }
    }
  };
  iotRoomName = ["localhost", "yash-gitex", "yash-verse"];

  // static init = () => {
  //   ExternalSceneManager.instance = new ExternalSceneManager();
  // };
  static getInstance = () => {
    if (WindfarmHandler.instance === undefined || WindfarmHandler.instance === null)
      WindfarmHandler.instance = new WindfarmHandler();

    return WindfarmHandler.instance;
  };
  constructor() {}

  load = envdata => {
    // check if user entered in iot room
    let url = window.location.href.toLowerCase();
    let isRoomFound = false;
    for (let i = 0; i < this.iotRoomName.length; i++) {
      let pattern = new RegExp(this.iotRoomName[i]);
      let result = pattern.test(url);
      if (result) {
        isRoomFound = true;
        break;
      }
    }

    if (isRoomFound === true) {
      console.log("iot room found:" + this.iotRoomName);
    } else {
      console.log("iot room not found");
      return;
    }

    // **********************************

    //load hirarchy
    this.hirarchy = envdata;

    console.log("hirarchy", this.hirarchy);

    //load windfarm
    WindfarmUtils.load3DModelWithAnimationData(windfarm_glb)
      .then(animdata => {
        console.log("windmill loaded : ", animdata.model);
        this.hirarchy.add(animdata.model);
        this.windfarmobj = animdata.model;

        this.windfarmobj.traverse(child => {
          child.matrixAutoUpdate = true;
          if (child.name === "Blades") {
            this.blades = child;
          }
          if (child.name === "Windmill_Without_Bones") {
            this.windMill = child;
          }
          if (child.name === "Warning") {
            this.alertAnim = child;
          }
          if (child.name === "Control_Panel") {
            this.alertBg = child;
          }
        });

        if (this.hirarchy) {
          for (let i = 0; i < this.hirarchy.children.length; i++) {
            switch (this.hirarchy.children[i].name) {
              case "txt_alert":
                this.alertTurbineTxt = this.hirarchy.children[i].children[1];
                this.alertTurbineTxt.matrixAutoUpdate = true;

                this.alertTurbineTxt._private_text = "";
                this.alertTurbineTxt._needsSync = true;
                break;
              case "txt_stat_1":
                this.statsText_1 = this.hirarchy.children[i].children[1];
                this.statsText_1.matrixAutoUpdate = true;

                this.statsText_1._private_text = "";
                this.statsText_1._needsSync = true;
                break;
              case "txt_stat_2":
                this.statsText_2 = this.hirarchy.children[i].children[1];
                this.statsText_2.matrixAutoUpdate = true;

                this.statsText_2._private_text = "";
                this.statsText_2._needsSync = true;
                break;
              case "txt_stat_3":
                this.statsText_3 = this.hirarchy.children[i].children[1];
                this.statsText_3.matrixAutoUpdate = true;

                this.statsText_3._private_text = "";
                this.statsText_3._needsSync = true;
                break;
            }
          }
          // this.hirarchy.traverse(child => {
          //   if (child.name == ) {

          //   }
          // });

          // this.hirarchy.traverse(child => {
          //   if (child.name == "txt_stat_1") {

          //   }
          // });
          // this.hirarchy.traverse(child => {
          //   if (child.isMesh) {

          //   }
          // });
          // this.windfarmParent.children[6].traverse(child => {
          //   if (child.isMesh) {

          //   }
          // });
        }

        // console.log("txt", this.alertTurbineTxt._private_text);

        // this.alertTiltTxt = this.windfarmParent.children[2];
        // this.alertTurbineTxt = this.windfarmParent.children[3];
        this.alertBg.traverse(child => {
          child.matrixAutoUpdate = true;
        });

        this.alertBg.visible = false;
        // this.alertTiltTxt.visible = false;
        this.alertAnim.visible = false;

        // this.windMill.visible = false;
        // this.windMill.rotateY(3.14);
        // console.log("tilt applied to windmill", this.windMill.rotation);

        //Update logic , later use aframe tick function to update
        this.lastDeltaTime = Date.now();
        setInterval(() => {
          this.update();
        }, 1000 / 40);

        //api calling refresh

        this.refreshTurbineApi();

        this.refreshGeneratorApi();

        this.refreshGearApi();

        this.refreshNacelleApi();

        window.windfarmobj = this;

        this.takeActionObj = document.getElementById("takeActionWindfarmButton").object3D;
        this.takeActionObj.addEventListener("interact", () => {
          this.TakeActionAlert();
        });
        this.takeActionObj.visible = true;
        this.takeActionObj.matrixAutoUpdate = true;
        this.takeActionObj.rotation.set(1.38, 2.13, 2.16);

        this.takeActionObj.traverse(child => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 0.5;
            child.material.needsUpdate = true;
          }
        });
      })
      .catch(e => {
        console.log("windmill not loaded : ", e);
      });
  };

  update = () => {
    this.delta = Date.now() - this.lastDeltaTime;
    this.lastDeltaTime = Date.now();

    //simulate turbine data
    if (this.turbineData) {
      let isConnected = this.turbineData.Connectivity === "Connected";
      //step 1 check for alert
      let isAlert = false;
      if (this.turbineData.SpeedStatus === "ALERT" && isConnected) {
        //High blade rotation speed
        isAlert = true;
        this.alertBg.visible = true;
        // console.log("private txt",this.alertTurbineTxt._private_text);
        if (this.alertTurbineTxt) {
          this.alertTurbineTxt._private_text = "High blade rotation speed";
          this.alertTurbineTxt._needsSync = true;
        }
        this.alertActionData.Paction = this.alertActionDatabase.turbine.alert_highBaldeRotation.Paction;
      }
      if (this.turbineData.AccelerometerStatus === "ALERT" && isConnected) {
        //Turbine is tilted
        isAlert = true;
        this.alertBg.visible = true;
        // this.alertTiltTxt.visible = true;

        // console.log("private txt",this.alertTurbineTxt._private_text);
        if (this.alertTurbineTxt) {
          this.alertTurbineTxt._private_text = "Turbine is tilted";
          this.alertTurbineTxt._needsSync = true;
        }
        this.alertActionData.Paction = this.alertActionDatabase.turbine.alert_turbineIsTilted.Paction;
      }
      if (!isAlert) {
        this.alertBg.visible = false;
        this.alertAnim.visible = false;
        this.takeActionObj.visible = false;
        this.alertTurbineTxt._private_text = "";
        this.alertTurbineTxt._needsSync = true;
      } else {
        this.alertAnim.visible = true;
        this.takeActionObj.visible = true;
      }

      let turbineTiltX = Number(this.turbineData.Accelerometer_x);
      if ((turbineTiltX > -1.5 && turbineTiltX < 1.5) || !isConnected) turbineTiltX = 0;

      let turbineTiltY = Number(this.turbineData.Accelerometer_y);
      if ((turbineTiltY > -1.5 && turbineTiltY < 1.5) || !isConnected) turbineTiltY = 0;

      this.windfarmRot.x = 0; //THREE.MathUtils.degToRad((90 * turbineTiltX) / 10.0);
      this.windfarmRot.y = THREE.MathUtils.degToRad(-66.98); //
      this.windfarmRot.z = THREE.MathUtils.degToRad((-1.0 * 90 * turbineTiltY) / 10.0);
      this.windMill.rotation.copy(this.windfarmRot);

      let bladeSpeed = Number(this.turbineData.SpeedOfWindblade);
      if (!isConnected) bladeSpeed = 0;
      // bladeSpeed = 1; //in rps
      if (this.blades) this.blades.rotateZ(2 * 3.14 * bladeSpeed * this.delta);

      //show rps
      if (this.statsText_2) {
        this.statsText_2._private_text = "rps: " + this.turbineData.SpeedOfWindblade;
        this.statsText_2._needsSync = true;
      }
    }

    //Simulate generator data
    if (this.generatorData) {
      //check alert
      if (this.generatorData.TemperatureStatus === "ALERT") {
        //generator temperature is high
      }
      if (this.generatorData.HumidityStatus === "ALERT") {
        //generator humidity is high
      }
      if (this.generatorData.VibrationStatus === "ALERT") {
        //generator vibration is high
      }

      let temperature = this.generatorData.temperature;
      let humidity = this.generatorData.humidity;
      let vibration = this.generatorData.vibration;
    }

    //Simulate gear data
    if (this.gearBoxData) {
      if (this.gearBoxData.TemperatureStatus === "ALERT") {
        //gear temperature is high
      }
      let temperature = this.gearBoxData.temperature;
    }

    //Simulate Nacell data
    if (this.nacelleData) {
      if (this.nacelleData.HumidityStatus === "ALERT") {
        //nacelle humidity is high
      }
      if (this.nacelleData.TemperatureStatus === "ALERT") {
        //macelle temperature is hight
      }
      let humidity = this.nacelleData.humidity;
      let temperature = this.nacelleData.temperature;
      //show rps
      if (this.statsText_1) {
        this.statsText_1._private_text = "Temp.: " + temperature;
        this.statsText_1._needsSync = true;
      }

      if (this.statsText_3) {
        this.statsText_3._private_text = "Hum.: " + humidity;
        this.statsText_3._needsSync = true;
      }
    }
  };

  refreshTurbineApi = () => {
    authService
      .turbineData()
      .then(data => {
        this.turbineData = data.turbineName;
        console.log("turbine data", data);
        setTimeout(() => {
          this.refreshTurbineApi();
        }, this.apiTimeGap);
      })
      .catch(err => {
        console.log("turbine data err", err);
        setTimeout(() => {
          this.refreshTurbineApi();
        }, this.apiTimeGap);
      });
  };
  apiTimeGap = 2000;
  refreshGeneratorApi = () => {
    authService
      .generatorData()
      .then(data => {
        this.generatorData = data.generator;
        console.log("Generator data", data);
        setTimeout(() => {
          this.refreshGeneratorApi();
        }, this.apiTimeGap);
      })
      .catch(err => {
        // console.log("turbine data err",err);
        setTimeout(() => {
          this.refreshGeneratorApi();
        }, this.apiTimeGap);
      });
  };

  refreshGearApi = () => {
    authService
      .gearData()
      .then(data => {
        this.gearBoxData = data.gearbox;
        console.log("Gear data", data);
        setTimeout(() => {
          this.refreshGearApi();
        }, this.apiTimeGap);
      })
      .catch(err => {
        // console.log("turbine data err",err);
        setTimeout(() => {
          this.refreshGearApi();
        }, this.apiTimeGap);
      });
  };

  refreshNacelleApi = () => {
    authService
      .nacelleData()
      .then(data => {
        this.nacelleData = data.nacelle;
        console.log("nacelle data", data);
        setTimeout(() => {
          this.refreshNacelleApi();
        }, this.apiTimeGap);
      })
      .catch(err => {
        setTimeout(() => {
          this.refreshNacelleApi();
        }, this.apiTimeGap);
      });
  };

  TakeActionAlert = () => {
    if (this.isAlertActionBusy) return;
    this.isAlertActionBusy = true;

    console.log("Alert Action");
    authService
      .takeAction(this.alertActionData)
      .then(data => {
        this.isAlertActionBusy = false;
        console.log("Alert Action taken", data);
      })
      .catch(err => {
        this.isAlertActionBusy = false;
        console.log("Alert Action is not taken", data);
      });
  };
}
