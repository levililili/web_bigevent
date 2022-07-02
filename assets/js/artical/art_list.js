$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义查询参数对象q
    let q = {
        pagenum: 1, //默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认显示两条
        cate_id: '', //文章分类id
        state: '', //文章的状态
    }

    initCate()
    initTable()


    // 实现筛选功能
    $('#form-select').on('submit', function (e) {
        e.preventDefault()
        // 查询参数q
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        // 渲染文章列表数据
        initTable()
    })

    // 删除文章
    // 通过代理的形式绑定事件
    $('tbody').on('click', '#btnDel', function () {
        let id = $(this).attr('data-id')
        // 获取删除按钮的个数
        let len = $('#btnDel').length
        // 弹出提示框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 关闭 确认框
                    layer.close(index)
                    layer.msg(res.message)

                    // 重新渲染
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

        })

    })


    // 编辑文章
    $('tbody').on('click', '#btnEdit', function () {
        let id = $(this).attr('data-id')
        location.href = '/artical/art_create.html?' + id
    })





    // 定义渲染分页的方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,// 设置默认被选中的分页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断layer.render()）
            // // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                // 不是首次
                if (!first) {
                    initTable()
                }
            }
        });
    }

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染表格
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 分页
                renderPage(res.total)

            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-select', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域
                form.render()
            }
        })
    }

})