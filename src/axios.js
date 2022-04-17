import axios from 'axios'
import router from './router'
import { Notification } from 'element-ui';

axios.defaults.baseURL = "http://localhost:8081"
// axios.defaults.baseURL = "http://172.27.184.8:8081"



const request = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': "application/json; charset=utf-8"
    }
})

request.interceptors.request.use(config => {
    config.headers['Authorization'] = localStorage.getItem("token")
    return config
})

request.interceptors.response.use(response=> {
    let res = response.data

    if(res.code === 200) {
        return response
    } else if(res.code == 204) {
        Notification.warning({
            title: "警告",
            message: res.msg
        })
        return response
    }  else if(res.code == 201) {
        Notification.error({
            title: "提示",
            message: res.msg
        })
        return response
    } else if(response.status === 200) {
        return response
    } else {
        Notification.error({
            title: "错误",
            message: res.msg
        })
        return response
    }
}, error => {

    if (error.response.data) {
        error.massage = error.response.data.msg
    }
    // 没有权限
    if (error.response.status === 401) {
        router.push("/login")
        localStorage.clear()
        sessionStorage.clear()
    }
    Notification.error(error.massage)
    return Promise.reject(error)

})

export default request