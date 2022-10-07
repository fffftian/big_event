$(function () {
    const layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传文件的按钮
    $('#btnInput').on('click', function () {
        // 打开文件选择框
        $('#file').click()

        // 要去选择某个图片(我怎么知道用户选择了图片) (文件选择框的 change 事件)
    })

    // 当用户选择了文件,会触发 change 事件
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

    $('#btnUpload').on('click', function (e) {
        // 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 调用接口,把头像上传到服务器
        $.ajax({
            method: 'PATCH',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if(res.code !== 0) return layer.msg('上传头像失败!')

                layer.msg('上传头像成功')
                window.parent.getUserInfo()
            }
        })
    })
})

/* 
base64 格式: 以 data:image/png:base64, 为 前缀的字符串
哪些图片: 小icon, 小图标, 验证码
缺点: 转换完之后会比原图片大很多 (30%)
*/