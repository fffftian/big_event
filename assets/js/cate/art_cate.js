$(function () {
    const layer = layui.layer
    const form = layui.form


    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                if (res.code !== 0) return layer.msg('获取分类失败!')
                const htmlStr = template('tpl-table', res)
                // $('tbody').empty().append(htmlStr)
                $('tbody').html(htmlStr)
            }
        })
    }

    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,    // 页面层
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式,为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()

        // 需要判断当前是什么状态
        if (isEdit) {
            $.ajax({
                method: 'PUT',
                url: '/my/cate/info',
                data: $(this).serialize(),
                success(res) {
                    if (res.code !== 0) return layer.msg('修改分类失败!')
                    layer.msg('修改分类成功!')
                    initArtCateList()
                }
            })
        } else {
            $.ajax({
                method: 'POST',
                url: '/my/cate/add',
                // data: $(this).serialize()
                data: form.val('addForm'),
                success(res) {
                    if (res.code !== 0) return layer.msg('添加分类失败!')
                    layer.msg('添加分类成功!')
                    initArtCateList()
                }
            })
        }
        isEdit = false
        layer.close(indexAdd)
        

    })

    let isEdit = false // 用来记录当前是什么状态
    // 通过代理的形式,为btn-edit 绑定点击事件
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 用户点击修改按钮的时候,置为true
        isEdit = true
        indexAdd = layer.open({
            type: 1,    // 页面层
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#dialog-add').html()
        })
        console.log($(this).attr('data-id'))
        const id = $(this).attr('data-id')
        // 需要回写表单
        $.ajax({
            method: 'GET',
            // url: '/my/cate/info?id='+ $(this).attr('data-id'),
            url: `/my/cate/info?id=${id}`,
            // data: {
            //     id: $(this).attr('data-id')
            // }
            success(res) {
                if (res.code !== 0) return layer.msg('获取分类详情失败')
                form.val('addForm', res.data)
            }
        })
    })

    // 添加删除逻辑
    $('tbody').on('click', '.btnDelete', function() {
        const result = confirm('您确定要删除该分类吗?')
        const id = $(this).attr('data-id')
        if(result) {
            $.ajax({
                method: 'DELETE',
                url: `/my/cate/del?id=${id}`,
                success(res) {
                    if(res.code !== 0) return layer.msg('删除分类详情失败!')
                    layer.msg('删除分类详情成功')
                    initArtCateList()
                }
            })
        }
    })
})