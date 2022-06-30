let layer = layui.layer
$(function () {

    getUserInfo()

    // 实现退出提示

    $('#btnLogout').on('click', function () {
        layer.confirm('此操作将退出登录, 是否继续?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
            // 2.跳转到登录页面
            location.href = '/login.html'

            // 关闭confirm询问框
            layer.close(index);
        });
    })


})
function renderAvatar(data) {
    // 获取用户ming
    let name = data.nickname || data.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户头像
    // 1.用户有头像
    if (data.user_pic !== null) {
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', data.user_pic).show()

    }
    // 2.用户没有设置头像
    else {
        $('.layui-nav-img').hide()
        $('.text-avatar').html(name[0].toUpperCase()).show()

    }

}

// 获取用户的信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }

    })
}
