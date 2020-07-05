$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 时间过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1, //页码值,
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '', //文章的状态， 可选值有： 已发布、 草稿
    }


    initTable()
    initCate()
        // 获取文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var tbodyhtml = template('tpl-table', res)
                $('tbody').html(tbodyhtml)
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！ ')
                }
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);

                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 为筛选表单绑定 submit 事件

    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
        })
    }
    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
            // 获取删除按钮的个数
            var len = $('.btn-delete').length
            console.log(len)
                // 获取到文章的 id
            var id = $(this).attr('data-id')
                // 询问用户是否要删除数据
            layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除文章失败！')
                        }
                        layer.msg('删除文章成功！')
                            // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                            // 如果没有剩余的数据了,则让页码值 -1 之后,
                            // 再重新调用 initTable 方法
                            // 4
                        if (len === 1) {
                            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                            // 页码值最小必须是 1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable()
                    }
                })

                layer.close(index)
            })
        })
        // 编辑添加点击事件

})