// 基地址
const BASEURL: string = 'http://localhost:3000/api/';
// 创建一个请求函数
const request = ({ url = '', method = 'GET', data = {}, tipName = '正在加载中' }) => {
    return new Promise((resolve, reject) => {
        // 显示 正在加载中
        uni.showLoading({
            title: tipName
        });
        const header = {
            Authorization: ''
        };
        if (uni.getStorageSync('my_token')) {
            header.Authorization = uni.getStorageSync('my_token');
        } 
        // 发送请求
        uni.request({
            url: `${BASEURL}${url}`,
            method,
            data,
            header,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                // 关闭提示
                uni.hideLoading();
            }
        });
    })
}
// 暴露request请求方法
export default request