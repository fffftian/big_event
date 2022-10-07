$(function () {
    getUserInfo()
})
let layer = layui.layer

// 由 var 或者 function 关键字声明的变量可以挂载在window上面 const / let 不可以
// 口诀: 禁止使用 var
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url:'/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('big_news_tokens') || ''
        // },
        success(res) {
            // console.log(res)
            if(res.code !== 0) return layer.msg(res.message)
            // 按需渲染头像
            renderAvatar(res)
        }
        
    })
}

// 渲染用户的头像
function renderAvatar(res){
    if(res.data.user_pic) {
        $('.text-avatar').hide()
        $('.userinfo img').attr('src', res.data.user_pic).show()
    }else{
        $('.layui-nav-img').hide()
        // 显示文字头像,取username属性的第一个字母
        // console.log(res.data)
        const name = res.data.nickname || res.data.username
        const char = name[0].toUpperCase()
        $('.text-avatar').html(char).show()
    }
    const name = res.data.nickname || res.data.username
    $('.text').html(`欢迎&nbsp;&nbsp;${name}`)
}

$('#btnLogout').on('click',function(){
    // 提示用户是否确认退出
    layer.confirm('确定退出登录?',{icon: 3, title: '提示'},
    function(index){
        // 1. 清空本地存储中的 big_news_tokens
        localStorage.removeItem('big_news_tokens')
        // localStorage.clear()
        // 2. 页面需要跳转到登录页面
        location.href = '/login.html'
        layer.close(index)
    })

    // const result = layer.confirm('你确定要退出吗?')
    // if(result){
    //     localStorage.removeItem('big_news_tokens')
    //     // localStorage.clear()
    //     // 2. 页面需要跳转到登录页面
    //     location.href = '/login.html'
    // }
})

// 首页是已经处于登录状态的人,才能够访问到的(权限)
