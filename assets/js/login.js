$(function(){
    // 绑定点击事件 点击登录 显示去注册页面
    $('#link_reg').on('click',function(){
        $('.reg_box').show()
        $('.login-box').hide()
    })
    // 点击 去登录 的链接
    $('#link_login').on('click',function(){
        $('.reg_box').hide()
        $('.login-box').show()
    })

    // 从 layui 中获取 form 对象
    
    let form = layui.form
    let layer = layui.layer
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd:[ /^[\S]{6,12}$/ , '密码必须6到12位,且不能出现空格' ],
        repwd: function(value) {
            // 密码框里面的值
            // 属性选择器: 
            const pwd = $('.reg_box [name=password]').val()
            if( pwd !== value){
                return '两次密码不一致,请重新输入'
            }
        }
    })

    

    // 监听注册表单提交事件
    $('#form_reg').on('submit', function(e){
        e.preventDefault()
        // const username = $('#form_reg [name=username]').val()
        // const password = $('#form_reg [name=password]').val()
        // const repassword = $('#form_reg [name=repassword]').val()
        $.ajax({
            method: 'POST',
            url: '/api/reg',
            // data: JSON.stringify({
            //     // 可以将对象转成json格式的字符串
            //     username,
            //     password,
            //     repassword
            // }),
            data: $(this).serialize(),
            success(res) {
                if(res.code !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                $('#link_login').click()
            },
            err(res){
                console.log('')
            }
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // data: JSON.stringify({
            //     // 可以将对象转成json格式的字符串
            //     username,
            //     password,
            //     repassword
            // }),
            data: $(this).serialize(),
            success(res) {
                if(res.code !== 0) return layer.msg(res.message)
                // token 意思是令牌的意思(下一次去请求有权限的接口的时候"带着")
                localStorage.setItem('big_news_tokens', res.token)

                
                // 固定的写法: Bearer token字符串、Bearer 译为持票人拿着token去请求
                location.href = '/index.html'
            }
        })
    })
})