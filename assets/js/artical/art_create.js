$(function () {
    // 判断是不是编辑文章

    let id = null



    let layer = layui.layer
    let form = layui.form
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 实现封面裁剪
    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 上传封面图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 发表文章
    let art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })

    })

    if (location.search != '') {
        // 修改卡片title
        $('.layui-card-header').html('修改文章')
        id = location.search.substring(1)

        // 快速填充表单域
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 快速填充表单 
                form.val('form-edit', res.data)
                // 文章类别
                $('[name=cate_id]').val(res.data.cate_id)
                // 为裁剪区域重新设置图片
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', 'http://www.liulongbin.top:3007' + res.data.cover_img) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
    }

    // 定义加载文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-select', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    // 发布文章的方法
    function publishArticle(fd) {
        if (id === null) {
            // 发布文章
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.meaasge)
                    }
                    layer.msg(res.message)
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/artical/art_list.html'
                }
            })


        } else {
            // 更新文章
            fd.append('Id', id)
            $.ajax({
                method: 'POST',
                url: '/my/article/edit',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.meaasge)
                    }
                    layer.msg(res.message)
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/artical/art_list.html'
                }
            })
        }

    }





})