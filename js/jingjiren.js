$(function () {
    main(function () {
        navText('经纪人');
    });

    var pageNum=1;
    var pageCount=1;
    jingjirenList();//进入页面之后就要获取经纪人列表

    //生成经纪人列表及页码函数 jingjiren_list.php
    function jingjirenList() {

        $.ajax({
            type:'post',
            url:'php/jingjiren_list.php',
            data:{pageNum:pageNum,pageCount:pageCount},
            success:function (d) {
                var data=d.data;
                var jjrL='';
                for(var i=0;i<data.length;i++){
                    jjrL+=`
                    <li class="clearfloat">
                        <a href="dainpu.html">
                        <img src="img-jingjiren/yang.jpg" alt="">
                        </a>

                        <div>
                            <h2>杨幂</h2>
                            <p>主营板块: 海淀 &nbsp;公主坟</p>
                            <span><i></i>18501018536</span>
                         </div>

                        <span>进入TA的店铺</span>
                    </li>
                    
                    `;
                }
                $('.jjr_list_head b').text(data.jingjirenNum); //修改经纪人总数
                $('jjr_list').html(jjrL);

                //生成分页条
                pageCount=data.pageCount;
                var pageStr='<a>上一页</a>';
                for(i=1;i<pageCount+1;i++){
                    pageStr+= '<a>'+i+'</a>';
                }
                pageStr+='<a>下一页</a>';
                $('.zf_pages').html(pageStr);

                //设置页码的样式
                $('.zf_pages a').eq(pageNum).addClass('cur'); //进入哪一页时哪一页高亮
                if(pageNum==1){
                    $('.zf_pages a:first').addClass('disabled');
                };
                if(pageNum==pageCount){
                    $('.zf_pages a:last').addClass('disabled');
                }
            }
        })
    }

    //页码切换
    $('.zf_pages').on('click','a',function (e) {
        e.preventDefault();
        var index=$(this).index();
        if(index==0){
            if(pageNum==1)return;
            pageNum--;
        }else if(index==pageCount+1){
            if(pageNum==pageCount)return;
            pageNum++;
        }else {
            pageNum=index;
        }
        jingjirenList();
    })

    //加载一级区域

    //为一级区域绑定点击事件,并加载二级区域

    //为二级区域绑定事件



});
