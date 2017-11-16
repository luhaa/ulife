$(function () {
    /*在每个js文件中调用main函数,并传入要执行的相应操作*/
    main(function () {
        navText('租房');
    });

    var pageNum=1;
    var pageCount;
    var areaId=0;
    var subAreaId=0;
    var priceMin=0;
    var priceMax=20000;
    var sizeMin=0;
    var sizeMax=20000;
    var houseType=0;
    var leaseWay=0;
    zfList();//进入页面就要获取租房列表

    function zfList(){
        var json={//因为需要传好多参数,所以拿出来写 显得好看
            pageNum:pageNum,
            areaId:areaId,
            subAreaId:subAreaId,
            priceMin:priceMin,
            priceMax:priceMax,
            sizeMin:sizeMin,
            sizeMax:sizeMax,
            houseType:houseType,
            leaseWay:leaseWay
        };
        $.ajax({
            type:'post',
            url:'php/zf_list.php',
            data:json,
            success:function (d) {
                var data=d.data;
                var listStr='';
                for(var i=0;i<data.length;i++){

                    listStr+=`
                <li class="clearfloat">
                <a href="zf_details.html?zfId=${data[i].zfId}"><img src="img-house/03.jpg" alt=""></a>

                <div>
                    <h2><a href="zf_details.html?zfId=${data[i].zfId}">data[i].title</a></h2>
                    <p>
                        <span>2室</span>
                        <span>整租</span>
                        <span>65M²</span>
                        <span>2/6层</span>
                        <span>朝向:南</span>
                    </p>
                    <p>万寿路西街11号院</p>
                </div>

                <span><strong>4800</strong>元/月</span>
            </li>   
                `;

                }
                $('.zf_list ul').html(listStr);
                $('.zf_list_head b').text(d.totalRecord);


                //生成页码 条件不一样可能页码页不一样 所以每次刷新页面时都要在动态生成一次,所以放在这里
                pageCount=data.pageCount;
                var pageStr='<a>上一页</a>';
                for(var i=1;i<pageCount+1;i++){
                    pageStr+='<a href="">'+i+'</a>'
                }
                pageStr+='<a>下一页</a>';
                $('.zf_pages').html(pageStr);

                //设置页码class
                $('.zf_pages a').eq(pageNum).addClass('cur');
                if(pageNum==1){
                    $('.zf_pages a:first').addClass('disabled');
                };
                if(pageNum==pageCount){
                    $('.zf_pages a:last').addClass('disabled');
                }
            }

        })
    }

    //单击页码时
    $('.zf_pages').on('click','a',function (e) {
        e.preventDefault();
        //获取页码,可以通过下标  可以通过点击当前的text()
        var index=$(this).index();
        if(index==0){//点击上一页时
            if(pageNum==1) return;
            pageNum--;
        }else if(index=pageCount+1){//下一页
            if(pageNum==pageCount) return;
            pageNum++;
        }else {
            pageNum=index;
        }

        zfList();
    });

    //动态加载一级区域 (每点击一次都要动态加载租房列表)
    $.ajax({
        type:'post',
        url:'php/area_list.php',
        success:function (d) {
            var areaStr='';
            for(var i=0;i<d.length;i++){
                areaStr+='<li data-areaId='+d[i].areaId+'>'+d[i].areaName+'</li>';
            }
            $('#area').append(areaStr);
        }
    });

    //当点击了一级区域后,加载二级区域 (每点击一次都要动态加载租房列表)
    $('#area').on('click','li',function () {
        /*点击的时候通过areaId来判断点了谁,怎么获取areaId呢?可以通过拼接字符串的时候把他当作自定义属性加在元素上*/
        areaId=$(this).attr('data-areaId');

        //选择高亮
        $('#area li').removeClass();
        $(this).addClass('cur');

        //当点击不限的时候
        if(areaId==0){//点不限时,二级区域隐藏且为空
            $('#subArea').empty().hide();
        }else{//显示二级区域
            $.ajax({
                type:'post',
                url:'php/area_list_sub.php',
                data:{areaId:areaId},
                success:function (d) {
                    var subAreaStr='<li data-subAreaId="0" class="cur">不限</li>';
                    for(var i=0;i<d.length;i++){
                        subAreaStr+='<li data-subAreaId='+d[i].subAreaId+'>'+d[i].subAreaName+'</li>';
                    }
                    $('#subArea').show().html(subAreaStr);
                }
            });
        }

        pageNum=1;//每次刷新时都要把它重置为1 否则它是全局变量 每次点击会累加
        subAreaId=0;
        zfList();
    });


    //点击二级分类时 (重新刷新列表 需要提交二级分类的ID上去)
    $('#subArea').on('click','li',function () {
        subAreaId=$(this).attr('data-subAreaId');

        //选择高亮
        $('#subArea li').removeClass();
        $(this).addClass('cur');

        pageNum=1;//每次刷新时都要把它重置为1 否则它是全局变量 每次点击会累加
        zfList();//重新刷新
    });
    
    
    //选择租金时
    $('#price').on('click','li',function () {

        //选择高亮
        $('#price li').removeClass();
        $(this).addClass('cur');

        priceMin=$(this).attr('data-min');
        priceMax=$(this).attr('data-max');

        pageNum=1;//每次刷新时都要把它重置为1 否则它是全局变量 每次点击会累加
        zfList();//重新刷新
    })
    
    //选择面积时
    $('#size').on('click','li',function () {
        //高亮
        $('#size li').removeClass();
        $(this).addClass('cur');

        sizeMin=$(this).attr('data-min');
        sizeMax=$(this).attr('data-max');

        pageNum=1;//每次刷新时都要把它重置为1 否则它是全局变量 每次点击会累加
        zfList();//重新刷新
    })

    //选择房型
    $('#houseType').on('click','li',function () {
        //高亮
        $('#houseType li').removeClass();
        $(this).addClass('cur');

        houseType=$(this).attr('data-houseType');

        pageNum=1;//每次刷新时都要把它重置为1 否则它是全局变量 每次点击会累加
        zfList();//重新刷新

    })
    
    //选择方式
    $('#leaseWay').on('click','li',function () {
        //高亮
        $('#leaseWay li').removeClass();
        $(this).addClass('cur');

        leaseWay=$(this).attr('data-leaseWay');

        pageNum=1;//每次刷新时都要把它重置为1 否则它是全局变量 每次点击会累加
        zfList();//重新刷新

    })

});

