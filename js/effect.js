/**
 * Created by skyler on 14-5-25.
 */
webqq={
    common:{}, //公共接口
    effect:{}, //各种效果
    data:{}    //调用数据
};

webqq.common={
    $:function(id){
        return document.getElementById(id);
    },
    $$:function(oParent,tagName){
        return oParent.getElementsByTagName(tagName);
    },
    $$$:function (oParent, className){
        if (oParent.getElementsByClassName){
            return oParent.getElementsByClassName(className);
        }else{
            var rel=[];
            className=className.replace(/^\s+|\s+$/g, '');
            var reg = /'\\b'+className+'\\b'/;
            var aEle=document.getElementsByTagName('*');
            for (var i=0 ; i<aEle.length; i++){
                var arr=aEle[i].className.split(' ');
                if (reg.text(className)){
                    rel.push(aEle[i]);
                }
            }
            return rel;
        }
    },
    json2url:function(json){
        json.t=Math.random();
        var arr=[];
        for (var name in json){
            arr.push(name +'='+json[name]);
        }
        return arr.join('&');
    },
    ajax:function(json){
        json= json || {};
        if (!json.url){
            alert('请输入正确的地址');
        }
        json.data=json.data || {};
        json.type=json.type || 'get';
        json.time=json.time || 3;
        var timer=null;
        if (window.XMLHttpRequest){
            var oAjax=new XMLHttpRequest();
        }else{
            var oAjax=new ActiveXObject('Microsoft.HTTP');
        }
        switch (json.type.toLocaleLowerCase()){
            case 'get':
                oAjax.open('GET', json.url+'?'+webqq.common.json2url(json.data), true);
                oAjax.send();
                break;
            case 'post':
                oAjax.open('POST', json.url, true);
                oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                oAjax.send(json2url(json.data));
        }
        oAjax.onreadystatechange=function(){
            if (oAjax.readyState==4){
                if (oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
                    clearTimeout(timer);
                    json.success && json.success(oAjax.responseText);
                }else{
                    clearTimeout(timer);
                    json.error && json.error(oAjax.status);
                }
            }
        };

        //超时
        timer= setTimeout(function(){
            alert('超时')
        },json.time*1000);

    },
    jsonp:function(json){
        if (!json.url){
            alert('请求地址不正确');
            return
        }
        json= json || {};
        json.data=json.data || {};
        json.time=json.time || 3;
        json.cbName=json.cbName || 'cb';

        var timer=null;
        var fnName='show'+Math.random();
        fnName=fnName.replace('.', '');
        json.data[json.cbName]=fnName;

        var oScript=document.createElement('script');
        var oHead=webqq.common.$$(document,'head')[0];
        oScript.src=json.url+webqq.common.json2url(json.data);
        //alert(oScript.src);
        oHead.appendChild(oScript);

        timer=setTimeout(function(){
            alert('网络超时');
        },json.time*1000);

        window[fnName]=function(json_data){
            clearTimeout(timer);
            json.success && json.success(json_data);
            oHead.removeChild(oScript);
        }
    },
    getStyle:function(obj,name){
        return obj.currentStyle? obj.currentStyle(name):getComputedStyle(obj, false)[name];
    },
    startMove:function(obj, json){
        clearInterval(obj.timer);
        obj.timer=setInterval(function(){
            var arrived=true;
            for (var name in json){
                var iTarget= json[name];
                if (name='opacity'){
                    var iCur=Math.round(parseFloat(webqq.common.getStyle(obj, name))*100);
                }else{
                    var iCur=parseInt(webqq.common.getStyle(obj, name));
                }
                if (iTarget!=iCur){
                    arrived=false;
                }
                var iSpeed=(iTarget-iCur)/8;
                iSpeed= iSpeed>0? Math.ceil(iSpeed): Math.floor(iSpeed);

                if (name =='opacity'){
                    obj.style[name]= iTarget/100;
                    obj.style.filter='alpha(opacity:'+(iCur+iSpeed)/100+')';
                }else{
                    obj.style[name]=iCur+iSpeed+'px';
                }
            }
            if (arrived){
                clearInterval(obj.timer);
            }
        },30)
    }
};

webqq.effect={
    close:function (oBtn,oDiv){
        oBtn.onclick=function(){
            oDiv.style.display='none';
        }
    },
    drag:function(obj,oDiv){
        obj.onmousedown=function(ev){
            var oEvent = ev || event;
            var disX=oEvent.clientX-oDiv.offsetLeft;
            var disY=oEvent.clientY-oDiv.offsetTop;
            document.onmousemove=function(ev){
                var oEvent = ev || event;
                oDiv.style.left=oEvent.clientX-disX+oDiv.offsetWidth/2+'px';
                oDiv.style.top=oEvent.clientY-disY+oDiv.offsetHeight/2+'px';
            };
            document.onmouseup=function(){
                document.onmousemove=null;
                document.onmouseup=null;
                obj.releaseCapture && obj.releaseCapture();
            };
            obj.setCapture && obj.setCapture();
            return false;
        }
    },
    changeFace:function(obj){
        var n=1;
        obj.onclick=function(){
            n++;
            obj.children[0].src='images/face/'+n+'.png';
            if (n==10){
                n=1;
            }
        };
        return n;
    },
    cbDown:function(obj){
        obj.onmousedown=function(ev){
            var oEvent = ev || event;
            oEvent.cancelBubble=true;
        };
    }

};

webqq.data={
    signin:function(oBtn, oName, oPw, id){
        oBtn.onclick=function(){
            webqq.common.jsonp({
                url:'http://zhinengshe.com/exercise/im/api.php?',
                data:{a:'reg',user:oName,pass:oPw, face:id},
                success:function(json){
                    if(json.err){
                        alert(json.msg);
                    }else{
                        alert(json.msg);
                    }
                }
            })
        }
    },
    longin:function(){

    },
    nowId:0,
    createMsg:function(time,name,value,ID){
        var oUl=webqq.common.$('content_show_list');
        var oDate=new Date();
        oDate.setTime(time*1000);
        var T=oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+' '+oDate.getHours()+':'+oDate.getMinutes()+':'+oDate.getSeconds()
        var oLi=document.createElement('li');
        oLi.innerHTML=
            '<span>'+name+'</span> <span>'+T+'</span>'
            +'<p>'+value+'</p>';
        oUl.appendChild(oLi);
        ID=parseInt(ID);
        webqq.data.nowId=Math.max(ID,webqq.data.nowId);
    },
    logout:function(){

    }
};

window.onload=function(){

    var timer=null;

    var oClose=webqq.common.$('close');
    var oLog=webqq.common.$('login');
    var oBox=webqq.common.$('box');

    var oBtn=webqq.common.$('lonin_btn');
    var aBtn=webqq.common.$$(oBtn,'input');
    var oName=webqq.common.$('name');
    var oPw=webqq.common.$('password');

    var oFace=webqq.common.$('login_img');
    var oBoxClose=webqq.common.$('box_close');
    var oNav=webqq.common.$('nav');

    var oContentCt=webqq.common.$('content_ct');
    var oFriend=webqq.common.$('friend');
    var oContentText=webqq.common.$('content_text');
    var oContentTxBtn=webqq.common.$('content_input_btn');

    var oHideSliderBtnR=webqq.common.$('hide_slider_btn');
    var oHideSliderBtnL=webqq.common.$('hide_slider_btn1');

    oHideSliderBtnR.onclick=function(){
        oFriend.style.width=0;
        oFriend.style.borderLeft=0;
        oContentCt.style.width=100+'%';
        oHideSliderBtnR.style.display='none';
        oHideSliderBtnL.style.display='block';
    };
    oHideSliderBtnL.onclick=function(){
        oFriend.style.width=30+'%';
        oFriend.style.borderLeft='1px #000000 solid';
        oContentCt.style.width=70+'%';
        oHideSliderBtnL.style.display='none';
        oHideSliderBtnR.style.display='block';
    };

    //阻止onmousedown冒泡
    webqq.effect.cbDown(oName);
    webqq.effect.cbDown(oPw);
    webqq.effect.cbDown(oFace);
    webqq.effect.cbDown(oBoxClose);
    webqq.effect.cbDown(oClose);

    //给登录框和对话框添加拖拽
    webqq.effect.drag(oLog,oLog);
    webqq.effect.drag(oNav,oBox);

    //关闭登录框
    webqq.effect.close(oClose,oLog);

    //更换头像
    webqq.effect.changeFace(oFace);
    var id=webqq.effect.changeFace(oFace);

    //注册
    webqq.data.signin(aBtn[1],oName.value,oPw.value,id);

    //var nowId=0;

    //登录
    aBtn[0].onclick=function(){
        webqq.common.jsonp({
            url:'http://zhinengshe.com/exercise/im/api.php?',
            data:{a:'lgn',user:oName.value,pass:oPw.value},
            success:function(json){
                if (json.err){
                    alert(json.msg);
                }else{
                    alert(json.msg);
                    oLog.style.display='none';
                    oBox.style.display='block';

                    //生成头像
                    var oFace = document.getElementById('head');
                    var oImg = document.createElement('img');
                    oImg.src='images/face/'+json.face+'.png';
                    oFace.appendChild(oImg);
                    //获取用户列表
                    webqq.common.jsonp({
                        url:'http://zhinengshe.com/exercise/im/api.php?',
                        data:{a:'get_user_list', token:json.token},
                        success:function(json){
                            if (json.err){
                                alert(json.msg);
                            }else{
                                var oUl=webqq.common.$('friend_list');
                                oUl.innerHTML='';
                                for (var i=0; i<json.data.length; i++){
                                    var oLi=document.createElement('li');
                                    oLi.innerHTML='<li><img src="images/face/'+json.data[i].face+'.png"><span>'+json.data[i].username+'</span></li>';
                                    oUl.appendChild(oLi);
                                }
                            }
                        }
                    });
                    //获取发言记录
                    webqq.common.jsonp({
                        url:'http://zhinengshe.com/exercise/im/api.php?',
                        data:{a:'get_msg',token:json.token},
                        success:function(json){
                            if (json.err){
                                alert(json.msg);
                            }else{

                                var oUl=webqq.common.$('content_show_list');
                                oUl.innerHTML='';
                                for (var i=0; i<json.data.length; i++){
                                    webqq.data.createMsg(json.data[i].post_time,json.data[i].username,json.data[i].content,json.data[i].ID);
                                    /*var oDate= new Date();
                                    oDate.setTime(json.data[i].post_time*1000);
                                    var T=oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+'  '+oDate.getHours()+':'+oDate.getMinutes()+':'+oDate.getSeconds();
                                    var oLi=document.createElement('li');
                                    oLi.innerHTML=
                                        '<span>'+json.data[i].username+'</span> <span>'+T+'</span>'
                                        +'<p>'+json.data[i].content+'</p>';
                                    oUl.appendChild(oLi);*/
                                }
                            }
                        }
                    });
                    //发言
                    oContentTxBtn.onclick=function(){
                        webqq.common.jsonp({
                            url:'http://zhinengshe.com/exercise/im/api.php?',
                            data:{a:'snd_msg',content:oContentText.innerHTML,token:json.token},
                            success:function(json){
                                if (json.err){
                                    alert('发言失败');
                                }else{
                                    webqq.data.createMsg(json.time,oName.value,oContentText.innerHTML,json.ID);
                                    /*
                                    var oUl=webqq.common.$('content_show_list');
                                    var oDate=new Date();
                                    oDate.setTime(json.time*1000);
                                    var T=oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+' '+oDate.getHours()+':'+oDate.getMinutes()+':'+oDate.getSeconds()
                                    var oLi=document.createElement('li');
                                    oLi.innerHTML=
                                        '<span>'+oName.value+'</span> <span>'+T+'</span>'
                                        +'<p>'+oContentText.innerHTML+'</p>';
                                    oUl.appendChild(oLi);*/
                                }
                            }
                        })
                    };
                    //获取更新
                    timer=setInterval(function(){
                        webqq.common.jsonp({
                            url:'http://zhinengshe.com/exercise/im/api.php?',
                            data:{a:'get_msg_n',n:webqq.data.nowId ,token:json.token},
                            success:function(json){
                                if (json.err){
                                    alert('获取发言记录失败');
                                }else{
                                    for (var i=0; i<json.data.length; i++){
                                        webqq.data.createMsg(json.data[i].post_time,json.data[i].username,json.data[i].content,json.data[i].ID);
                                        /*var oUl=webqq.common.$('content_show_list');
                                        var oDate=new Date();
                                        oDate.setTime(json.data[i].post_time*1000);
                                        var T=oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+' '+oDate.getHours()+':'+oDate.getMinutes()+':'+oDate.getSeconds()
                                        var oLi=document.createElement('li');
                                        oLi.innerHTML=
                                            '<span>'+json.data[i].username+'</span> <span>'+T+'</span>'
                                            +'<p>'+json.data[i].content+'</p>';
                                        oUl.appendChild(oLi);*/
                                    }
                                }
                            }
                        })
                    },1000);
                    //注销
                    oBoxClose.onclick=function(){
                        webqq.common.jsonp({
                            url:'http://zhinengshe.com/exercise/im/api.php?',
                            data:{a:'logout',token:json.token},
                            success:function(json){
                                if (json.err){
                                    alert('退出失败')
                                }else{
                                    alert(json.msg);
                                    clearInterval(timer);
                                    oLog.style.display='block';
                                    oBox.style.display='none';
                                }
                            }
                        })
                    };
                }
            }
        })
    };

};