/**
 * Created by skyler on 14-6-15.
 */

window.onload=function ()
{
    var url='http://zhinengshe.com/exercise/im/api.php';
    var oDivReg=document.getElementById('reg_div');
    var oDivMsg=document.getElementById('msg_div');

    var username='';
    var token='';

    var nowID=0;

    //注册登录等
    (function (){
        var oUl=getByClass(document, 'loginList')[0];
        var oTxtUser=oUl.getElementsByTagName('input')[0];
        var oTxtPass=oUl.getElementsByTagName('input')[1];

        var face=1;

        //注册
        (function (){
            var oBtnPrev=getByClass(document, 'userPrev')[0];
            var oBtnNext=getByClass(document, 'userPrev')[0];
            var oBtn=getByClass(document, 'reg')[0];

            var now=1;

            oBtn.onclick=function ()
            {
                jsonp(url, {a: 'reg', user: oTxtUser.value, pass: oTxtPass.value, face: 1}, function (json){
                    if(json.err)
                    {
                        alert('注册出错：'+json.msg);
                    }
                    else
                    {
                        alert('注册成功');
                    }
                });
            };
        })();

        //登录
        (function (){
            var oBtn=getByClass(document, 'login')[0];

            oBtn.onclick=function ()
            {
                jsonp(url, {a: 'lgn', user: oTxtUser.value, pass: oTxtPass.value}, function (json){
                    if(json.err)
                    {
                        alert('登录失败'+json.msg);
                    }
                    else
                    {
                        token=json.token;

                        alert('登录成功');

                        username=oTxtUser.value;

                        oDivReg.style.display='none';
                        oDivMsg.style.display='block';

                        document.getElementById('face_img').src='images/face/'+json.face+'.jpg';

                        gotoMsg();
                    }
                });
            };
        })();

        //头像选择
        var oUser=getByClass(document, 'userImg')[0];
        var oImg=oUser.children[0];
        var oPrev=oUser.children[1];
        var oNext=oUser.children[2];

        oUser.onmouseover=function ()
        {
            startMove(oPrev, {opacity: 100});
            startMove(oNext, {opacity: 100});
        };
        oUser.onmouseout=function ()
        {
            startMove(oPrev, {opacity: 0});
            startMove(oNext, {opacity: 0});
        };

        oPrev.onclick=function ()
        {
            face--;

            if(face==0)face=8;

            oImg.src='images/face/'+face+'.jpg';
        };
        oNext.onclick=function ()
        {
            face++;

            if(face==9)face=1;

            oImg.src='images/face/'+face+'.jpg';
        };
    })();

    function gotoMsg()
    {
        //滚动条
        var oScrollMsg=new ScrollBar('messageListTop', 'messageListContent', 'smallScroll', 'smallThis');
        var oScrollOnline=new ScrollBar('onlineNumber', 'onlineList', 'bigScroll', 'bigThis');

        (function (){
            //消息
            var oDiv=getByClass(document, 'messageListContent')[0];

            //发送
            var oTxt=document.getElementById('txt1');
            var oBtn=document.getElementById('btn1');

            oBtn.onclick=function ()
            {
                jsonp(url, {a: 'snd_msg', content: oTxt.innerHTML, token: token}, function (json){
                    var oNewDiv=createMsg(json.ID, username, json.time, oTxt.innerHTML);

                    oTxt.innerHTML='';
                    oDiv.appendChild(oNewDiv);

                    oScrollMsg.resize();
                    oScrollMsg.scrollTo(1);
                });
            };
        })();

        (function (){
            //获取初始信息
            var oDiv=getByClass(document, 'messageListContent')[0];
            jsonp(url, {a: 'get_msg', token: token}, function (json){
                console.log(json);
                for(var i=0;i<json.data.length;i++)
                {
                    var oNewDiv=createMsg(json.data[i].ID, json.data[i].username, json.data[i].post_time, json.data[i].content);

                    oDiv.appendChild(oNewDiv);
                }

                oScrollMsg.resize();
                oScrollMsg.scrollTo(1);
            });
        })();

        function createMsg(ID, name, time, content)
        {
            function toDou(n){return n<10?'0'+n:''+n;}
            //日期
            var oDate=new Date();
            var now=new Date();
            oDate.setTime(time*1000);

            var sTime='';

            if(now.getFullYear()!=oDate.getFullYear() || now.getMonth()!=oDate.getMonth() || now.getDate()!=oDate.getDate())
            {
                sTime=oDate.getFullYear()+'-'+toDou(oDate.getMonth()+1)+'-'+toDou(oDate.getDate())+' ';
            }

            sTime+=toDou(oDate.getHours())+':'+toDou(oDate.getMinutes())+':'+toDou(oDate.getSeconds());

            //创建
            var oDiv=document.createElement('div');

            oDiv.className='mList_y';

            oDiv.innerHTML='<h3><span class="mListName">'+name+'</span><span class="time">'+sTime+'</span></h3><p>'+content+'</p>';

            ID=parseInt(ID);
            nowID=Math.max(nowID, ID);

            return oDiv;
        }

        //在线列表收缩
        (function (){
            var opened=true;

            var oBtn=getByClass(document, 'zxlb')[0];
            var oMsg=getByClass(document, 'messageList')[0];
            var oList=getByClass(document, 'onlineNumber')[0];

            oBtn.onclick=function ()
            {
                if(opened)
                {
                    oMsg.style.width='100%';
                    oList.style.display='none';
                }
                else
                {
                    oMsg.style.width='72%';
                    oList.style.display='block';
                }

                opened=!opened;
            };
        })();

        //获取在线列表
        (function (){
            var oUl=getByClass(document, 'onlineList')[0];

            jsonp(url, {a: 'get_user_list', token: token}, function (json){
                //alert(JSON.stringify(json));
                oUl.innerHTML='';

                for(var i=0;i<json.data.length;i++)
                {
                    var oLi=document.createElement('li');

                    oLi.innerHTML='<img src="images/face/'+json.data[i].face+'.jpg"><span>'+json.data[i].username+'</span>';

                    oUl.appendChild(oLi);
                }
            });
        })();

        setInterval(function (){
            var oDiv=getByClass(document, 'messageListContent')[0];

            jsonp(url, {a: 'get_msg_n', n: nowID, token: token}, function (json){
                for(var i=0;i<json.data.length;i++)
                {
                    var oNewDiv=createMsg(json.data[i].ID, json.data[i].username, json.data[i].post_time, json.data[i].content);

                    oDiv.appendChild(oNewDiv);
                }

                if(json.data.length)
                {
                    oScrollMsg.resize();
                    oScrollMsg.scrollTo(1);
                }
            });
        }, 1000);
    }
};
