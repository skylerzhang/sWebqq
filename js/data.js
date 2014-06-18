/**
 * Created by skyler on 14-5-22.
 */

function jsonp(url){
    var oS=document.createElement('script');
    var oHead=document.getElementsByTagName('head')[0];
    oS.src=url;
    oHead.appendChild(oS);
}

function signin(json){
    if(json.err){
        alert(json.msg);
    }else{
        alert(json.msg);
    }
}

function login(json){
    if(json.err){
        alert(json.msg);
    }else{
        alert(json.msg);
        //登录成功
        var oName=document.getElementById('name');
        var oFace = document.getElementById('head');
        var oImg = document.createElement('img');
        oImg.src='images/face/'+json.face+'.png';
        oFace.appendChild(oImg);
        //获取用户列表
        jsonp('http://zhinengshe.com/exercise/im/api.php?a=get_user_list&token='+json.token+'&cb=userlist');
        //获取历史纪录
        jsonp('http://zhinengshe.com/exercise/im/api.php?a=get_msg&token='+json.token+'&cb=contentshow');

        //发言
        var oBtn=document.getElementById('content_input_btn');
        var oT=document.getElementById('content_text');
        oBtn.onclick=function(){
            jsonp('http://zhinengshe.com/exercise/im/api.php?a=snd_msg&content='+oT.innerHTML+'&token='+json.token+'&cb=submit');
            oT.value='';
        };

        var jt=json.token;
        window.submit=function(json){
            if (json.error){
                alert('发言失败');
            }else{

                //jsonp('http://zhinengshe.com/exercise/im/api.php?a=get_msg_n&n='+json.ID+'&token=&cb=xxx');
                /*var oDate= new Date();
                oDate.setTime(json.time*1000);
                var T=oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+'  '+oDate.getHours()+':'+oDate.getMinutes()+':'+oDate.getSeconds();
                var oUl=document.getElementById('content_show_list');
                var oLi=document.createElement('li');
                var oT=document.getElementById('content_text');
                oLi.innerHTML=
                    '<span>'+oName.value+'</span> <span>'+T+'</span>'
                    +'<p>'+oT.value+'</p>';
                oUl.appendChild(oLi);*/

                //更新对话内容
                window.refresh=function(json){
                    if (json.error){
                        alert('获取最新发言失败');
                    }else{
                        var oUl=document.getElementById('content_show_list');
                        for (var i=0 ; i<json.data.length; i++){
                            var oDate= new Date();
                            oDate.setTime(json.data[i].post_time*1000);
                            var T=oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+'  '+oDate.getHours()+':'+oDate.getMinutes()+':'+oDate.getSeconds();
                            var oLi=document.createElement('li');
                            oLi.innerHTML=
                                '<span>'+json.data[i].username+'</span> <span>'+T+'</span>'
                                +'<p>'+json.data[i].content+'</p>';
                            oUl.appendChild(oLi);
                        }
                    }
                };

                jsonp('http://zhinengshe.com/exercise/im/api.php?a=get_msg_n&n='+json.ID+'&token='+jt+'&cb=refresh');

            }
        };


    }
}

function userlist(json){
    if (json.err){
        alert(json.msg);
    }else{
        var oUl=document.getElementById('friend_list');
        oUl.innerHTML='';
        for (var i=0; i<json.data.length; i++){
            var oLi=document.createElement('li');
            oLi.innerHTML='<li><img src="images/face/'+json.data[i].face+'.png"><span>'+json.data[i].username+'</span></li>';
            oUl.appendChild(oLi);
        }
    }
}

function contentshow(json){
    if (json.err){
        alert(json.msg);
    }else{

        var oUl=document.getElementById('content_show_list');
        oUl.innerHTML='';
        for (var i=0; i<json.data.length; i++){
            var oDate= new Date();
            oDate.setTime(json.data[i].post_time*1000);
            var T=oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+'  '+oDate.getHours()+':'+oDate.getMinutes()+':'+oDate.getSeconds();
            var oLi=document.createElement('li');
            oLi.innerHTML=
                '<span>'+json.data[i].username+'</span> <span>'+T+'</span>'
                +'<p>'+json.data[i].content+'</p>';
            oUl.appendChild(oLi);
        }
    }
}

/*window.submit=function(json){
    if (json.error){
        alert('发言失败');
    }else{

        jsonp('http://zhinengshe.com/exercise/im/api.php?a=get_msg_n&n='+json.ID+'&token=&cb=xxx');

        var oDate= new Date();
        oDate.setTime(json.time*1000);
        var T=oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+'  '+oDate.getHours()+':'+oDate.getMinutes()+':'+oDate.getSeconds();
        var oUl=document.getElementById('content_show_list');
        var oLi=document.createElement('li');
        var oT=document.getElementById('content_text');
        oLi.innerHTML=
            '<span>'+json.data[i].username+'</span> <span>'+T+'</span>'
                +'<p>'+oT.value+'</p>';
        oUl.appendChild(oLi);
    }
};*/

window.onload=function(){
    var oClose=document.getElementById('close');
    var oLog=document.getElementById('login');
    var oBox=document.getElementById('box');


    //关闭注册页面
    oClose.onclick=function(){
        oLog.style.display='none';
        oBox.style.display='block';
    };

    //登录 & 注册
    var oBtns=document.getElementById('lonin_btn');
    var aBtn=oBtns.getElementsByTagName('input');
    var oName=document.getElementById('name');
    var oPw=document.getElementById('password');

    //登录
    aBtn[0].onclick=function(){
        jsonp('http://zhinengshe.com/exercise/im/api.php?a=lgn&user='+oName.value+'&pass='+oPw.value+'&cb=login');
        //oLog.style.display='none';
        //oBox.style.display='block';
    };

    //注册
    aBtn[1].onclick=function(){
        jsonp('http://zhinengshe.com/exercise/im/api.php?a=reg&user='+oName.value+'&pass='+oPw.value+'&face=ID&cb=signin');
    };


};