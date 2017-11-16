/*main主函数,当头文件加载完成后 执行回调函数 而回调函数中要执行的是一个函数,这就要看 main函数中传进来的函数要进行什么操作*/
function main(callback){
    $('header').load('header.html',function () {
        //有就执行,如果不加的话,没有会报错.所以要加一个判断
        if(callback){
            callback();
        }
        //加载完成之后就判断用户是否登录,从而确定右边登录应该加载什么内容
        if(sessionStorage.uid){//有就说明已登录
            logined();
        }else{//未登录
            noLogin();
        }

    })
}

//加载尾部文件
$(function () {
    /*$('header').load('header.html');*/
    $('footer').load('footer.html');
});

//已登录函数 用于生成 登录|注册 或 已登录 的文本
function logined(){
    var uname=sessionStorage.nickName?sessionStorage.nickName:sessionStorage.phone;
    $('.zf_user').html('<span class="icon_user"></span>'+uname+'</a> | <a href="" class="user_quit">退出</a>');
    //退出登录
    $('.user_quit').click(function (e) {
        e.preventDefault();
        sessionStorage.clear();
        noLogin();
    })
}

//未登录函数 用于生成 登录|注册 并未登录绑定生成模态框等事件,显示或关闭模态框
function noLogin() {
    $('.zf_user').html('<a href="" id="top_login">登录</a> | <a href="register.html">注册</a>');

    //为登录绑定事件
    $('#top_login').click(function (e) {
        //阻止a链接的默认行为
        e.preventDefault();
        if($('.login_bg').size()==0){
            //要判断一下是否已经加载过登录框,否则会每次点击都会加载
            $.ajax({
                type:'get',
                url:'login.html',
                success:function (data) {
                    //加入数据显示模态框
                    $('body').append(data);

                    //关闭登录框
                    $('.close').click(function () {
                        $('.login_bg').hide();
                    });

                    //点击其他非登录框的区域(背景)也将其关闭

                    /*//方案二:由内到外阻止冒泡
                    $('.login').click(function(e){
                        e.stopPropagation();
                        $('.login_bg').show();
                    })*/

                    //方案一:由外到内阻止,确认点击的只是父元素
                    $('.login_bg').click(function (e) {
                        /* 处理兼容性问题
                         e=e || window.event;
                         var target=e.target||e.srcElement*/

                        //阻止事件冒泡 否则点击到子元素也会关闭
                        if(e.target==this){
                            $(this).hide();
                        }
                    });

                    //为登录按钮绑定事件
                    $('#login').click(function(e){
                        login(e);
                    });
                }
            })
        }else{//如果已经加载过,直接显示就行了
            $('.login_bg').show();
        }

    })
}

//登录 用于发送ajax 用户登录
function login(e) {
    e.preventDefault();
    var phone=$.trim($('#phone').val());
    var upwd=$.trim($('#upwd').val());
    if(phone&&upwd){//用户均已输入
        $.ajax({
            type:'post',
            url:'php/user_login.php',
            data:{phone:phone,upwd:upwd},
            success:function (d) {
                console.log(d);
                if(d.code==1){//登录成功
                    $('.login_bg').hide();
                    $('#phone').val('');
                    $('#upwd').val('');
                    sessionStorage.uid=d.userId;
                    /*sessionStorage.setItem(uid,d.userId);*/
                    sessionStorage.phone=d.phone;
                    sessionStorage.nickName=d.nickName;

                    console.log(sessionStorage);

                    logined();

                }else{//登录失败
                    $('#login_tips').show().text('用户名或密码错误')
                }
            }

        })
    }else{//用户名或密码为空
        $('#login_tips').show().text('用户名或密码为空')
    }
}


//导航高亮显示函数
function navText(text) {
    $('.zf_nav li').each(function () {
        var thisText=$(this).text();
        if(text==thisText){
            $(this).addClass('cur');
        }
    })
}

//时间转换函数
function dateFormat(time){
    var t=new Date(time);
    //补全双数
    var tf=function (i) {
        return i>9?i:'0'+i;
    };
    var year=t.getFullYear();
    var month=tf(t.getMonth()+1);
    var day=tf(t.getDate());
    return year+'-'+month+'-'+day;
}
