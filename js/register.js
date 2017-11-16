$(function () {
    main();

    var uphone,upwd1,upwd2,nickName;
    //失去焦点的验证
    $('#uphone').blur(phoneCheck);
    $('#upwd1').blur(upwd1Check);
    $('#upwd2').blur(upwd2Check);

    $('#ucheckbox').click(function () {
        /*if($(this).prop('checked')){
            $('tijiao').prop('disabled',false);
        }else {
            $('tijiao').prop('disabled',true);
        }*/
        /*简写*/
        $('#tijiao').prop('disabled',!$(this).prop('checked')).toggleClass('disabled');
    });

    //提交注册
    $('#tijiao').click(function () {
        var rphone=phoneCheck();
        var rupwd1=upwd1Check();
        var rupwd2=upwd2Check();

        if(rphone&&rupwd1&&rupwd2){
            nickName=$.trim($('#nickName').val());
            $.ajax({
                type:'post',
                url:'php/user_register.php',
                data:{phone:uphone,upwd:upwd2,nickName:nickName},
                success:function (d) {
                    console.log("注册信息返回值:"+d);
                    if(d.code==1){
                        sessionStorage.uid=d.userId;
                        sessionStorage.phone=d.phone;
                        sessionStorage.nickName=d.nickName;
                        //跳转回注册之前的页面
                        history.go(-1);
                    }
                }
            })
        }
    });


    //验证手机号函数
    function phoneCheck() {
        //1.是否为空 2.格式是否正确 3.是否已存在
        uphone=$.trim($('#uphone').val());
        var regPhone=/^1[3578]\d{9}$/;
        if(!uphone){//为空
            $('#uphone').siblings('u').hide();
            $('#uphone').siblings('span').show().text('手机号不能为空');
            return false;
        }else if(!regPhone.test(uphone)){//格式不正确
            $('#uphone').siblings('u').hide();
            $('#uphone').siblings('span').show().text('请输入正确的手机号码');
            return false;
        }else if(phoneExist(uphone)){
            $('#uphone').siblings('u').hide();
            $('#uphone').siblings('span').show().text('手机号已被注册');
            return false;
        }else {
            $('#uphone').siblings('span').hide();
            $('#uphone').siblings('u').show();
            return true;
        }

    }

    //手机号是否存在函数
    function phoneExist(uphone) {
        var back;
        $.ajax({
            type:'post',
            url:'php/user_check_phone.php',
            data:{phone:uphone},
            async:false,
            success:function (d) {
                console.log("手机号校验返回值:"+d);
                if(d.code==1){
                    back=true;
                }else {
                    back=false;
                }
            }
        });
        return back;
    }

    //密码的验证
    function upwd1Check() {
        upwd1=$.trim($('#upwd1').val());
        var upwd1Size=upwd1.length;
        //1.是否为空 2.长度验证
        if(!upwd1Size){
            $('#upwd1').siblings('u').hide();
            $('#upwd1').siblings('span').show().text('密码不能为空');
            return false;
        }else if(upwd1Size<6||upwd1Size>12){
            $('#upwd1').siblings('u').hide();
            $('#upwd1').siblings('span').show().text('密码长度应该在6-12位之间');
            return false;
        }else {
            $('#upwd1').siblings('span').hide();
            $('#upwd1').siblings('u').show();
            return true;
        }

    }

    //重复密码验证
    function upwd2Check() {
        upwd2=$.trim($('#upwd2').val());

        //1.验证第一个密码是否正确 2.长度验证
        if(upwd1Check()){
            if(upwd1!=upwd2){
                $('#upwd2').siblings('u').hide();
                $('#upwd2').siblings('span').show().text('两次密码不一致');
                return false;
            }else {
                $('#upwd2').siblings('span').hide();
                $('#upwd2').siblings('u').show();
                return true;
            }
        }

    }
});

