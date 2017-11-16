$(function () {
    main(function () {
        navText('楼讯');
    });

    var pageNum=1;//默认为1
    newsList();//进入页面就要加载列表


    //生成列表 要反复用所以放在函数中
    function newsList() {
        $.ajax({
            type:'post',
            url:'php/news_list.php',
            data:{pageNum:pageNum},
            success:function(d){
                console.log('进入页面返回的数据:'+d.data);
                var data=d.data;
                var listStr='';
                for(var i=0;i<data.length;i++){
                    var thist=dateFormat(parseInt(data[i].pubTime));
                    listStr+=`
                <li class="clearfloat">
                <div>
                <h2><a href="news_details.html?newsId=${data[i].newsId}">${data[i].title}</a></h2>
                <p>${data[i].abstract}</p>
                <span>发布时间 : ${thist}</span>
                </div>
                <img src="${data[i].pic}" alt="">
                </li>
                `;
                }
                $('.news_list').append(listStr);

                //判断当前页码是不是最后一页
                if(d.pageNum==d.pageCount){
                    $('.loadMore').html('<span>没有啦</span>');
                }else {
                    $('.loadMore').html('<span class="more">加载更多</span>');
                }
            }
        });
    }


    //加载更多
    $('.loadMore').on('click','.more',function () {
        $('.loadMore').html('<span class="icon"></span>');
        pageNum++;
        newsList();
    })
    

});