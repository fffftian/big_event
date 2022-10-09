$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        const y = dt.getFullYear()
        const m = padZero(dt.getMonth() + 1)
        const d = padZero(dt.getDate())

        const hh = padZero(dt.getHours())
        const mm = padZero(dt.getMinutes())
        const ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象,将来请求数据的时候
    // 需要将请求参数提交到服务器
    let qs = {
        pagenum: 1,   // 当前页码值(表示当前是第几页)
        pagesize: 2,  // 当前页面显示多少条
        cate_id: '',  // 当前选择的文件
        state: ''     // 当前文章所处的状态,可选值:已发布,操作 都是字符串类型
    }

    // 加载文章列表
    loadArticleList()
    function loadArticleList() {
        $.ajax({
            method: 'GET',
            url: `/my/article/list?pagenum=${qs.pagenum}&pagesize=${qs.pagesize}&cate_id=${qs.cate_id}&state=${qs.state}`,
            // data: qs,
            success(res) {
                // console.log(res)
                if (res.code !== 0) return layer.msg('获取文章列表失败')
                // 使用模板引擎渲染页面的数据
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 做分页效果: 总数是必要条件
                renderPage(res.total)
            }
        })
    }

    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                if (res.code !== 0) return layer.msg('获取分类失败!')
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // layui 本身的特性,需要多走一步
                form.render()
            }
        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 只需要处理一下参数,再直接调用获取列表的方法
        const cate_id = $('[name=cate_id]').val()
        qs.cate_id = cate_id
        const state = $('[name=state]').val()
        qs.state = state
        loadArticleList()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total)
        // layerui 提供
        laypage.render({
            elem: 'pageBox',    // 分页容器的 ID
            count: total,       // 总数据条数
            limit: qs.pagesize, // 每页显示几条数据
            curr: qs.pagenum,    // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候,触发 jump 回调
            // 触发 jump 回调的方式有两种:
            //1. 点击页码的时候,会触发 jump 回调
            //2. 只要调用了 laypage
            jump: function (obj, first) {
                // jump回调触发的时机: 1. 初次渲染分页组件的时候  2. 主动切换页码值的时候
                // console.log(first)
                // console.log(obj)
                // console.log(obj.curr,obj.limit)
                qs.pagenum = obj.curr
                qs.pagesize = obj.limit
                // // 把最新的页码值,赋值到 q 这个查询参数对象中
                // if(typeof first === 'undefined')
                if (!first) {
                    // 根据最新的 q 获取对应的数据列表,并渲染表格
                    // 如果直接进行调用的话,回导致死循环的问题
                    // 应该是用户主动切换页码值的时候去加载列表
                    loadArticleList()
                }
            }
        })
    }

    // 通过代理的形式,为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete',function(){
        // console.log('ok')

        const id = $(this).attr('data-id')
        const len = $('.btn-delete').length
        console.log(id, len)
        // 获取到文章的 id
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            
            $.ajax({
                method: 'DELETE',
                url:`/my/article/info?id=${id}`,
                success: function(res) {
                    console.log(res)
                    if(res.code !== 0) return layer.msg('删除文章失败!')
                    layer.msg('删除文章成功!')
                    // 当数据删除完成后,需要判断当前这一页中,是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 loadArticleList 方法

                    // 获取删除按钮元素的个数
                    if(len === 1){
                        // 如果当前都已经是第一页,就不要减了,默认是第一页就好了
                        qs.pagenum = qs.pagenum === 1 ? 1 : qs.pagenum - 1
                    }
                    loadArticleList()
                }
            })
            
            layer.close(index);
          });
    })
})