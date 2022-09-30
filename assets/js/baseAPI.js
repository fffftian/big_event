// 每次发起请求之后,都会经过的地方
$.ajaxPrefilter(function (config) {

    // 将key=value形式的数据,转成json格式的字符串
    const format2Json = (source) => {
        let target = {}
        source.split('&').forEach((el) => {
            let kv = el.split('=')
            target[kv[0]] = kv[1]
        })
        return JSON.stringify(target)
    }

    config.url = 'http://big-event-vue-api-t.itheima.net' + config.url

    if(config.url.indexOf('/my/') !== -1){
        config.headers = {
            Authorization: localStorage.getItem('big_news_tokens') || ''
        }
    }
    
    // 统一设置请求头 Content-Type 值
    config.contentType =  'application/json'

    // 统一设置请求的参数 - post 请求
    config.data = config.data && format2Json(config.data)

    // 统一添加错误回调
    config.complete = function(res){
        if(res.responseJSON?.code === 1 && res.responseJSON?.message === '身份认证失败!'){
            // 进此处的化,可以认为请求有误
            localStorage.clear()
            location.href = '/login.html'
        }
    }
})