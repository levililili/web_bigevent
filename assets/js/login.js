$(function () {
    // 导入 layer
    let layer = layui.layer
    // 点击链接，进行切换
    $('#link_register').on('click', function () {
        $('.loginAndRegBox').css('height', '310px')
        $('.login-box').hide()
        $('.register-box').show()
    })
    $('#link-login').on('click', function () {
        $('.loginAndRegBox').css('height', '270px')
        $('.register-box').hide()
        $('.login-box').show()
    })

    // form.verify()自定义校验规则
    // 从layui获取form对象
    let form = layui.form
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        },
        // 自定义一个叫pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 检验两次密码是否输入一致
        repwd: function (value, item) {
            let pwd = $('.register-box [name=password]').val()
            if (value !== pwd) {
                return '两次密码输入不一致'
            }

        }
    })

    // 监听注册表单
    $('#form_reg').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault()
        // 获取表单的值
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        }

        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录!')


            }

        })

    })

    // 监听登录表单
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        let data = $('#form_login').serialize()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户名或者密码错误！')
                }
                layer.msg('登录成功！')
                // 将身份认证存入到localStorage中
                localStorage.setItem('token', res.token)
                // 跳转到主页
                location.href = '/index.html'
            }

        })
    })
})