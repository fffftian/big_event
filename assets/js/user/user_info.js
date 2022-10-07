$(function(){
    // 入口函数
    let form = layui.form
    let layer = layui.layer

    form.verify({
        nickname: function(value) {
            if(value.length > 6) {
                return '昵称必须是1-6位的字符'
            }
        }
    })
    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if(res.code !== 0) {
                    return layer.msg('请求用户信息失败!')
                }
                // console.log(res)
                // 1. 给表单回写数据
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnRest').on('click',function(e){
        // 阻止表单的默认行为
        e.preventDefault()
        // 刷新用户信息
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e){
        // 阻止表单的默认行为
        e.preventDefault()
        // console.log('ok')
        // 取值
        // console.log(form.val('formUserInfo'))
        // 发起 ajax 数据请求
        $.ajax({
            method: 'PUT',
            url: '/my/userinfo',
            data:form.val('formUserInfo'),
            success(res) {
                console.log(res.code)
                if(res.code !== 0) return layer.msg('更新用户信息失败!')
                layer.msg('更新用户信息成功!')
                // 调用父页面中的方法,重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})