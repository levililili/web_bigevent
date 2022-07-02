$(function () {
    let layer = layui.layer
    let form = layui.form
    // 获取分类列表并且渲染
    getArticalClassify()


    // 预先设置索引
    let indexAdd = null
    // 给添加按钮注册事件
    $('#btnAdd').on('click', function (e) {
        // 弹出层
        indexAdd = layer.open({
            title: '添加文章分类',
            area: ['500px', '270px'],
            type: 1,
            content: $('#dialog-add').html(),
            move: false,
            resize: false,
            scrollbar: false,
        })
    })

    // 通过代理的形式为form-add绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // 添加分类
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 关闭弹出层
                layer.close(indexAdd)
                // 提示信息
                layer.msg(res.message)
                // 重新渲染分类表格
                getArticalClassify()
            }
        })
    })


    // 修改分类
    // 代理：点击修改按钮弹出表单修改
    let indexEdit = null
    $('tbody').on('click', '#btnEdit', function () {
        // 获取id
        let id = $(this).attr('data-id')
        indexEdit = layer.open({
            title: '修改文章分类',
            area: ['500px', '270px'],
            type: 1,
            content: $('#dialog-edit').html(),
            move: false,
            resize: false,
            scrollbar: false,

        })

        // 填充修改表单原有数据,根据 Id 获取文章分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 快速为表单赋值
                form.val('form-edit', res.data)
            }
        })

    })

    // 为form-edit绑定监听事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        // 根据id修改表单数据
        let data = $(this).serialize()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 关闭修改表单弹出层
                layer.close(indexEdit)
                // 重新渲染表格
                getArticalClassify()

            }
        })
    })

    // 删除分类
    // 代理
    $('tbody').on('click', '#btnDelete', function () {
        let id = $(this).attr('data-id')
        console.log(id)
        // 提示
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 关闭 确认框
                    layer.close(index)
                    layer.msg(res.message)
                    // 重新渲染
                    getArticalClassify()
                }
            })

        })
    })
})

function getArticalClassify() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取文章分类失败！')
            }
            let htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
        }
    })
}