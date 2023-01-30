import { number } from "prop-types";
import * as THREE from "three";
import authService from "./service/auth.service";
export class WindfarmHandler {
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

  constructor(hirarchy) {
    //
    console.log("windfarm v 01");
    this.windfarmParent = hirarchy.children[10];
    this.windfarmobj = hirarchy.children[10].children[1];

    this.windfarmobj.traverse(child => {
      child.matrixAutoUpdate = true;
      if (child.name === "Blades") {
        this.blades = child;
      }
      if (child.name === "WindMill_Controller") {
        this.windMill = child;
      }
      // if(child.name === "Blades"){
      //     this.blades = child;
      //     this.blades.matrixAutoUpdate = true;
      // }
    });

    this.alertAnim = this.windfarmParent.children[3];
    this.alertBg = this.windfarmParent.children[2];
    // this.alertBg.push(hirarchy.children[21]);
    // this.alertBg.push(hirarchy.children[22]);

    this.windfarmParent.children[2].children[2].traverse(child => {
      if (child.isMesh) {
        this.alertTurbineTxt = child;
      }
    });

    this.windfarmParent.children[4].traverse(child => {
      if (child.isMesh) {
        this.statsText_1 = child;
        child.matrixAutoUpdate = true;
      }
    });
    this.windfarmParent.children[5].traverse(child => {
      if (child.isMesh) {
        this.statsText_2 = child;
        child.matrixAutoUpdate = true;
      }
    });
    this.windfarmParent.children[6].traverse(child => {
      if (child.isMesh) {
        this.statsText_3 = child;
        child.matrixAutoUpdate = true;
      }
    });

    console.log("txt", this.alertTurbineTxt._private_text);

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
    setInterval(() => {
      this.refreshTurbineApi();
    }, 5000);

    setInterval(() => {
      this.refreshGeneratorApi();
    }, 5000);

    setInterval(() => {
      this.refreshGearApi();
    }, 5000);

    setInterval(() => {
      this.refreshNacelleApi();
    }, 5000);

    window.windfarmobj = this;

    this.takeActionObj = document.getElementById("takeActionWindfarmButton").object3D;
    this.takeActionObj.addEventListener("interact", () => {
      this.TakeActionAlert();
    });
    this.takeActionObj.visible = false;
    this.takeActionObj.matrixAutoUpdate = true;
    this.takeActionObj.rotation.set(1.38, 2.13, 2.16);

    this.takeActionObj.traverse(child => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 0.5;
        child.material.needsUpdate = true;
      }
    });
  }

  update = () => {
    this.delta = Date.now() - this.lastDeltaTime;
    this.lastDeltaTime = Date.now();

    //simulate turbine data
    if (this.turbineData) {
      //step 1 check for alert
      let isAlert = false;
      if (this.turbineData.SpeedStatus === "ALERT") {
        //High blade rotation speed
        isAlert = true;
        this.alertBg.visible = true;
        // console.log("private txt",this.alertTurbineTxt._private_text);
        this.alertTurbineTxt._private_text = "High blade rotation speed";
        this.alertTurbineTxt._needsSync = true;
        this.alertActionData.Paction = this.alertActionDatabase.turbine.alert_highBaldeRotation.Paction;
      }
      if (this.turbineData.AccelerometerStatus === "ALERT") {
        //Turbine is tilted
        isAlert = true;
        this.alertBg.visible = true;
        // this.alertTiltTxt.visible = true;

        // console.log("private txt",this.alertTurbineTxt._private_text);
        this.alertTurbineTxt._private_text = "Turbine is tilted";
        this.alertTurbineTxt._needsSync = true;
        this.alertActionData.Paction = this.alertActionDatabase.turbine.alert_turbineIsTilted.Paction;
      }
      if (!isAlert) {
        this.alertBg.visible = false;
        this.alertAnim.visible = false;
        this.takeActionObj.visible = false;
      } else {
        this.alertAnim.visible = true;
        this.takeActionObj.visible = true;
      }

      // let accelerometer = new THREE.Euler( Number(this.turbineData.Accelerometer_x),Number(this.turbineData.Accelerometer_y),Number(this.turbineData.Accelerometer_z));
      // accelerometer = accelerometer.normalize();
      // let mx = new THREE.Matrix4().lookAt(accelerometer,new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));
      // let qt = new THREE.Quaternion().setFromRotationMatrix(mx);

      let turbineTiltX = Number(this.turbineData.Accelerometer_x);
      if (turbineTiltX > -1.5 && turbineTiltX < 1.5) turbineTiltX = 0;

      let turbineTiltY = Number(this.turbineData.Accelerometer_y);
      if (turbineTiltY > -1.5 && turbineTiltY < 1.5) turbineTiltY = 0;

      this.windfarmRot.x = THREE.MathUtils.degToRad((90 * turbineTiltX) / 10.0);
      this.windfarmRot.y = THREE.MathUtils.degToRad((90 * turbineTiltY) / 10.0);
      this.windfarmRot.z = 0;
      this.windMill.rotation.copy(this.windfarmRot);

      let bladeSpeed = Number(this.turbineData.SpeedOfWindblade);
      // bladeSpeed = 1; //in rps
      if (this.blades) this.blades.rotateX(2 * 3.14 * bladeSpeed * this.delta);

      //show rps
      this.statsText_2._private_text = "rps: " + this.turbineData.SpeedOfWindblade;
      this.statsText_2._needsSync = true;
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
      this.statsText_1._private_text = "Temp.: " + temperature;
      this.statsText_1._needsSync = true;

      this.statsText_3._private_text = "";
      this.statsText_3._needsSync = true;
    }
  };

  refreshTurbineApi = () => {
    if (this.isRefresehTurbineBusy === true) {
      return;
    }
    this.isRefresehTurbineBusy = true;

    authService
      .turbineData()
      .then(data => {
        this.isRefresehTurbineBusy = false;
        this.turbineData = data.turbineName;
        console.log("turbine data", data);
      })
      .catch(err => {
        this.isRefresehTurbineBusy = false;
        console.log("turbine data err", err);
      });
  };

  refreshGeneratorApi = () => {
    if (this.isRefreshGeneratorBusy === true) {
      return;
    }
    this.isRefreshGeneratorBusy = true;

    authService
      .generatorData()
      .then(data => {
        this.isRefreshGeneratorBusy = false;
        this.generatorData = data.generator;
        // console.log("turbine data",data);
      })
      .catch(err => {
        this.isRefreshGeneratorBusy = false;
        // console.log("turbine data err",err);
      });
  };

  refreshGearApi = () => {
    if (this.isRefreshGearBusy === true) {
      return;
    }
    this.isRefreshGearBusy = true;

    authService
      .gearData()
      .then(data => {
        this.isRefreshGearBusy = false;
        this.gearBoxData = data.gearbox;
        // console.log("turbine data",data);
      })
      .catch(err => {
        this.isRefreshGearBusy = false;
        // console.log("turbine data err",err);
      });
  };

  refreshNacelleApi = () => {
    if (this.isRefreshNacelleBusy === true) {
      return;
    }
    this.isRefreshNacelleBusy = true;

    authService
      .nacelleData()
      .then(data => {
        this.isRefreshNacelleBusy = false;
        this.nacelleData = data.nacelle;
        // console.log("turbine data",data);
      })
      .catch(err => {
        this.isRefreshNacelleBusy = false;
        // console.log("turbine data err",err);
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
