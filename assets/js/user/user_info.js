$(function () {
    let form = layui.form
    let layer = layui.layer

    initUserInfo()

    // 实现表单重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })

    // 获取用户信息
    function initUserInfo() {

        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                // 初始化用户的基本信息
                // initUserMessage(res.data)
                // 快速为表单赋值 form.val('filter', object);
                form.val('formUserInfo', res.data)
            }

        })
    }

    // 更新用户基本信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 
                window.parent.getUserInfo()

            }
        })
    })


    // function initUserMessage(data) {
    //     $('.layui-input-block [name=username]').val(data.username)
    //     $('.layui-input-block [name=nickname]').val(data.nickname)
    //     $('.layui-input-block [name=email]').val(data.email)
    // }
})