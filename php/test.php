<?php
$conn=mysqli_connect('127.0.0.1','root','aishangyxl','ulift');
if(!$conn){
    die("connect error:".mysqli_connect_error());
}else{
    echo "success connect mysql\n";
}


?>