import authService from "./service/auth.service";
export class WindfarmHandler{
    constructor(windfarmobj)
    {
        this.windfarmobj = windfarmobj;
        this.isRefreseBusy = false;
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
        setInterval(()=>{
            this.update();
        },1000/40);

        //api calling refresh
        setInterval(()=>{
            this.refreshApi();
        },5000) 
    } 
    
    update =()=>{
        if(this.blades)
            this.blades.rotateZ(0.1);
    }

    refreshApi=()=>{
        if(this.isRefreseBusy === true){
            return;
        }
        this.isRefreseBusy = true;
        authService.turbineData().then((data)=>{
            this.isRefreseBusy = false;
            console.log("turbine data",data);
        }).catch((err)=>{
            this.isRefreseBusy = false;
            console.log("turbine data err",err);
        })
    }
}