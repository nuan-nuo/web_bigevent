$(function() {
    $('#link-reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link-login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    var form = layui.form
    var layer = layui.layer
    form.verify({
            pass: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            repass: function(value) {
                var repsw = $(".reg-box [name=password]").val()
                if (repsw !== value) {
                    return '两次密码输入不一样'
                }
            }
        })
        // 注册账号获取信息
    $('#form_reg').on('submit', function(e) {
            e.preventDefault()
            $.post('/api/reguser', {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }, function(res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message)
                }
                // console.log(res.message);
                layer.msg('注册成功，请登录')
                $('#link-login').click()
            })
        })
        // 登录账号
    $('#reg_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                localStorage.setItem('token', res.token)

                // 保存token字符串，到localstorage
                location.href = '../index.html'
                console.log($(this).serialize());

            }
        })
    })
})