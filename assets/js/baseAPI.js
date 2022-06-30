// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // 统一为有权限的接口，设置 headers 请求头
    // indexOf找不到返回-1
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    // 权限控制
    options.complete = function (res) {
        // 在complete中要拿到服务器返回的数据，用res.responseJSON
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空token
            localStorage.removeItem('token')
            // 2.强制跳转到登录页
            location.href = '/login.html'
        }
    }
})

