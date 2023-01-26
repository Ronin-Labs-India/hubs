import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://adt-backend.azurewebsites.net/api/v1/adtData",
});

axiosInstance.defaults.timeout = 2500000;
const instanceCreator = ($axios) => ({
  saveHeader({ key, value }) {
    $axios.defaults.headers.common[key] = value;
  },
  deleteHeader(key) {
    delete $axios.defaults.headers.common[key];
  },
  get(url, params) {
    return $axios.get(url, { params });
  },
  post(url, data) {
    return $axios.post(url, data, {
      headers: {
        "Content-Type": `application/json`,
      },
    });
  },
  post_audio(url, formData) {
    return $axios.post(url, formData, {
      headers: {
        "Content-Type": `multipart/form-data;`,
      },
      timeout: 60000000,
    });
  },
  put(url, data) {
    return $axios.put(url, data);
  },
  delete(url, data) {
    return $axios.delete(url, data);
  },
  customRequest(config) {
    return $axios(config);
  },
});

const HTTPService = instanceCreator(axiosInstance);
export default HTTPService;
