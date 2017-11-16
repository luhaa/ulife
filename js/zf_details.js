$(function () {
    main(function () {
        navText('租房')
    });

    //获取租房id (通过上一个页面 a的字符串拼接获得的 ?zfId='')
    var str=location.href;
    var zfId=str.substr(str.lastIndexOf('=')+1);

    $.ajax({
        type:'post',
        url:'php/zf_details',
        data:{zfId:zfId},
        success:function (d) {
            var t=dateFormat(parseInt(d.pubTime));

            //动态修改各处的信息
            $('.zf_detetails_title h2').html(d.title);
            $('.zf_detetails_title p').html('房源编号：'+d.zfId+'  更新时间：'+t);
            $('.zf_detetails_info>p>b').html(d.price+' <b>元/月</b>');

            //房源信息





            //房源详情
            var details=d.details;
            var imgArr=d.picList;
            for (var i=0;i<imgArr.length;i++){
                details+='img src="'+imgArr[i]+'" alt="">'
            }
            $('.zf_detetails_text').append(details);

            //生成图片轮播图
            $('#largeImg').attr('src',imgArr[0].zfpic); //上面的大图 默认为第一张

            var samllImg='';
            for (var i=0;i<imgArr.length;i++){
                samllImg+='<li>img src="'+imgArr[i]+'" alt=""></li>'
            }

            $('.zf_detetails_pic_min ul').width(imgArr.length*100);//根据图片的数量ul的宽是动态的值,它关系到后面的滚动,所以要提前设置好

            $('.zf_detetails_pic_min ul').html(samllImg);
            $('.zf_detetails_pic_min ul li:first').addClass('cur');//默认第一张高亮显示


            //图片的切换
            $('.zf_detetails_pic_min ul li').click(function () {
                $('.zf_detetails_pic_min ul li:first').removeClass();
                $(this).addClass('cur'); //点击哪张图片 图片高亮

                var src=$(this).find('img').attr('src');
                $('#largeImg').attr('src',src); //显示对应的大图
            });

            imgScorll(); //图片滚动

        }
    });
    
    //图片滚动函数 ul是绝对定位的且宽度是固定的 滚动式每次修改它的left值或right值
    function imgScorll() {
        var moveSize=100;//一次滚动的宽度(图片的宽度加上一个间距) 如果图片或间距的大小变化了 直接修改这个值就行了
        var size=400;//当前可显示的宽度
        var ulL=parseInt($('.zf_detetails_pic_min ul').css('left'));//ul的left值
        var ulW=parseInt($('.zf_detetails_pic_min ul').width())-size;//ul的总宽度-size(可以移动的最大距离)
        //右边箭头
        $('.zf_detetails_pic_min .right').click(function () {
            if(ulL>-ulW){ //不可能一直移下去
                ulL-=moveSize;//每次点击的时候修改ul的left 减去一个moveSize
                $('.zf_detetails_pic_min ul').css('left',ulL);//重新设置ul的left值
            }

        });

        //左边箭头
        $('.zf_detetails_pic_min .left').click(function () {
            if(ulL<0){ //说明图片被左移过
                ulL+=moveSize;//每次点击的时候修改ul的left 减去一个moveSize
                $('.zf_detetails_pic_min ul').css('left',ulL);//重新设置ul的left值
            }

        })
    };
    
    //判断此房源是否已经被收藏 favorite_select.php (已关注后每次点击进入这个房源是 都应该是 '取消关注')
    $('.zf_detetails_title').on('click','a',function () {
        if(sessionStorage.uid){
            $.ajax({
                type:'post',
                url:'php/favorite_select.php',
                data:{userId:sessionStorage.uid,zfId:zfId},
                success:function (d) {
                    if(d.code==1){//已关注过
                        $('.zf_detetails_title a').text('取消关注');
                    }
                }
            })
        }

    });
    
    //点击收藏房源 favorite_addOrDelete.php
    $('.zf_detetails_title').on('click','a',function (e) {
        e.preventDefault();
        if(sessionStorage.uid){//已登录
            $.ajax({
                type:'post',
                url:'php/favorite_addOrDelete.php',
                data:{userId:sessionStorage.uid,zfId:zfId},
                success:function (d) {
                    if(d.code==1){//关注成功
                        $('.zf_detetails_title a').text('取消关注');
                    }else {//取消关注
                        $('.zf_detetails_title a').text('关注此房源');
                    }
                }
            })
        }else {//未登录
            alert('请登录后再收藏');
        }
    });
});