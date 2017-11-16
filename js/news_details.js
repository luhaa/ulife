$(function () {
    main(function(){
        navText('楼讯');
    })

    //要发送ajax获得页面内容 就要知道点击新闻的ID 它已经加在了地址栏里面,可以从地址栏获取
    var str=location.href;
    //http://localhost/ulife/news_details.html?newsId=2
    var newsId=str.substr(str.lastIndexOf('=')+1);

    $.ajax({
        type:'post',
        url:'php/news_details.php',
        data:{newsId:newsId},
        success:function (d) {
            console.log(d);
            $('.news_title h2').text(d.title);
            var t=dateFormat(parseInt(d.pubTime));
            $('.news_title>p').append(t);
            $('.news_contain').html(d.content);
        }
    })

});