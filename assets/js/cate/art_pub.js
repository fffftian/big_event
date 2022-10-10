$(function () {
    const form = layui.form
    initArtCateList()
    initEditor()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: 'http://big-event-vue-api-t.itheima.net/my/cate/list',
            headers: {
                Authorization: localStorage.getItem('big_news_tokens')
            },
            success: function (res) {
                if (res.code !== 0) return layer.msg('获取分类失败!')
                const htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                // layui 本身的特性,需要多走一步
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        // 打开系统文件选择框
        file.click()
    })

    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        const filelist = e.target.files   // 伪数组
        if (filelist.length === 0) {
            return layer.msg('请选择照片!')
        }

        // 1. 
        // var file = e.target.files[0]
        // 2. 将文件,转换为路径
        var newImgURL = URL.createObjectURL(filelist[0])
        // 3. 
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    let art_state = '已发布'

    // 为存为草稿按钮,绑定点击事件处理函数
    $('#btnSave').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 将数据收集到 formData 里面去
        let fd = new FormData($(this)[0])
        fd.append('state', art_state)
        // 将封面裁剪过后的图片,输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob)
                // 发起ajax数据请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd){
        $.ajax({
            method: 'POST',
            url: 'http://big-event-vue-api-t.itheima.net/my/article/add',
            headers: {
                Authorization: localStorage.getItem('big_news_tokens')
            },
            data: fd,
            // 注意: 如果向服务器提交的是 FormData 格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success(res){
                if(res.code !== 0) return layer.msg('发布文章失败!')
                layer.msg('发布文章成功')
                // 
                location.href ='/cate/art_list.html'
            }
        })
    }
})