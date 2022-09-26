$(function(){
    // 绑定点击事件 点击登录 显示去注册页面
    $('.login-wrap').on('click', function(){
        $('.login-wrap').hide()
        $('.reg-wrap').show()
    })

    // 绑定点击事件 点击注册 显示登录页面
    $('.reg-wrap').on('click', function(){
        $('.login-wrap').show()
        $('.reg-wrap').hide()
    })
})