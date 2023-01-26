import * as THREE from "three";
import authService from "./service/auth.service";
export class WindfarmHandler{

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

    turbineData = undefined;
    generatorData = undefined;
    gearBoxData = undefined;
    nacelleData = undefined;

    constructor(windfarmobj)
    {
        this.windfarmobj = windfarmobj;
    
        this.windfarmobj.traverse((child)=>{
            if(child.name === "WindMill"){
                this.windMill = child;
                this.windMill.matrixAutoUpdate = true;
            }
            if(child.name === "Blades"){
                this.blades = child;
                this.blades.matrixAutoUpdate = true;
            }
        });

        //Update logic , later use aframe tick function to update
        this.lastDeltaTime = Date.now();
        setInterval(()=>{
            this.update();
        },1000/40);

        //api calling refresh
        setInterval(()=>{
            this.refreshTurbineApi();
        },5000) 

        setInterval(()=>{
            this.refreshGeneratorApi();
        },5000) 
        
        setInterval(()=>{
            this.refreshGearApi();
        },5000)

        setInterval(()=>{
            this.refreshNacelleApi();
        },5000)
    } 
    
    update =()=>{
        this.delta = Date.now() - this.lastDeltaTime;

        //simulate turbine data
        if(this.turbineData){
            //step 1 check for alert
            if(this.turbineData.SpeedStatus === "ALERT"){
                //High blade rotation speed
            }
            if(this.turbineData.AccelerometerStatus === "ALERT"){
                //Turbine is tilted
            }

            let accelerometer = new THREE.Vector3(this.turbineData.Accelerometer_x,this.turbineData.Accelerometer_y,this.turbineData.Accelerometer_z);
            accelerometer = accelerometer.normalize();
            let mx = new THREE.Matrix4().lookAt(accelerometer,new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));
            let qt = new THREE.Quaternion().setFromRotationMatrix(mx);

            this.windMill.quaternion.copy(qt);

            let bladeSpeed = this.turbineData.SpeedOfWindblade;
            if(this.blades)
                this.blades.rotateZ(2 * 3.14 * bladeSpeed * this.delta);
        }

        //Simulate generator data
        if(this.generatorData){
            //check alert
            if(this.generatorData.TemperatureStatus === "ALERT"){
                //generator temperature is high
            }
            if(this.generatorData.HumidityStatus === "ALERT"){
                //generator humidity is high
            }
            if(this.generatorData.VibrationStatus === "ALERT"){
                //generator vibration is high
            }

            let temperature = this.generatorData.temperature;
            let humidity = this.generatorData.humidity;
            let vibration = this.generatorData.vibration;
        }

        //Simulate gear data
        if(this.gearBoxData){
            if(this.gearBoxData.TemperatureStatus === "ALERT"){
                //gear temperature is high
            }
            let temperature = this.gearBoxData.temperature;
        }

        //Simulate Nacell data
        if(this.nacelleData){
            if(this.nacelleData.HumidityStatus === "ALERT"){
                //nacelle humidity is high
            }
            if(this.nacelleData.TemperatureStatus === "ALERT"){
                //macelle temperature is hight
            }
            let humidity = this.nacelleData.humidity;
            let temperature = this.nacelleData.temperature;
        }

        
    }

    refreshTurbineApi=()=>{
        if(this.isRefresehTurbineBusy === true){
            return;
        }
        this.isRefresehTurbineBusy = true;

        authService.turbineData().then((data)=>{
            this.isRefresehTurbineBusy = false;
            this.turbineData = data;
            // console.log("turbine data",data);
        }).catch((err)=>{
            this.isRefresehTurbineBusy = false;
            // console.log("turbine data err",err);
        })
    }

    refreshGeneratorApi=()=>{
        if(this.isRefreshGeneratorBusy === true){
            return;
        }
        this.isRefreshGeneratorBusy = true;

        authService.generatorData().then((data)=>{
            this.isRefreshGeneratorBusy = false;
            this.generatorData = data;
            // console.log("turbine data",data);
        }).catch((err)=>{
            this.isRefreshGeneratorBusy = false;
            // console.log("turbine data err",err);
        })
    }

    refreshGearApi=()=>{
        if(this.isRefreshGearBusy === true){
            return;
        }
        this.isRefreshGearBusy = true;

        authService.gearData().then((data)=>{
            this.isRefreshGearBusy = false;
            this.gearBoxData = data;
            // console.log("turbine data",data);
        }).catch((err)=>{
            this.isRefreshGearBusy = false;
            // console.log("turbine data err",err);
        })
    }

    refreshNacelleApi=()=>{
        if(this.isRefreshNacelleBusy === true){
            return;
        }
        this.isRefreshNacelleBusy = true;

        authService.nacelleData().then((data)=>{
            this.isRefreshNacelleBusy = false;
            this.nacelleData = data;
            // console.log("turbine data",data);
        }).catch((err)=>{
            this.isRefreshNacelleBusy = false;
            // console.log("turbine data err",err);
        })
    }
}