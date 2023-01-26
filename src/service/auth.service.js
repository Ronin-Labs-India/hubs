import { resolveModuleName } from "typescript";
import HTTPService from "./http.service";

const authService = {
  async turbineData() {
    return new Promise((resolve, reject) => {
        HTTPService.get('/TurbineName/WF01Turbine01').then(({data})=>{
          resolve(data);
        }).catch((e)=>{
          reject(e);
        });
      } 
    )
  },
  async generatorData() {
    return new Promise((resolve, reject) => {
        HTTPService.get('/Generator/WF01Turbine01').then(({data})=>{
          resolve(data);
        }).catch((e)=>{
          reject(e);
        });
      } 
    )
  },
  async gearData() {
    return new Promise((resolve, reject) => {
        HTTPService.get('/GearBox/WF01Turbine01').then(({data})=>{
          resolve(data);
        }).catch((e)=>{
          reject(e);
        });
      } 
    )
  },
  async nacelleData() {
    return new Promise((resolve, reject) => {
        HTTPService.get('/Nacelle/WF01Turbine01').then(({data})=>{
          resolve(data);
        }).catch((e)=>{
          reject(e);
        });
      } 
    )
  },
  // async login(payload) {
  //   return new Promise((resolve, reject) => {
  //       HTTPService.post('/login',payload).then(({data})=>{
  //         resolve(data);
  //       }).catch((e)=>{
  //         reject(e);
  //       });
  //     } 
  //   )
  // },

  // async otpVerification(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/verifyOTP',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },

  // async checkRiddleAnswer(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/city/riddle/submit',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },

  // async spinConfig(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/spinwheel/config',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },

  // async spinwheelReward(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/spinwheel/reward',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },

  // async cityConfig(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/city/config',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },

  // async resendOTP(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/resendOTP',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },
  
  // async souledReward(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/souled/reward',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },

  // async getProfileData(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/user/profile',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },

  // async verifyCodeWrapper(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/user/refcode',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },

  // async verifyRecaptcha(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/user/captcha',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },

  // async resendSMSVoucherCode(payload){
  //   return new Promise((resolve, reject) => {
  //     HTTPService.post('/spinWheel/reward/resend',payload).then(({data})=>{
  //       resolve(data);
  //     }).catch((e)=>{
  //       reject(e);
  //     });
  //   } 
  // )
  // },
  
};
export default authService;
