/**
 * Created by Cathy on 2016/9/2.
 */
function Banner(id,url){
    this.oBox=document.getElementById(id);
    this.oInner=this.oBox.getElementsByTagName('div')[0];
    this.aA=this.oInner.getElementsByTagName('a');
    this.aImg=this.oInner.getElementsByTagName('img');
    this.oUl=this.oBox.getElementsByTagName('ul')[0];
    this.aLi=this.oUl.getElementsByTagName('li');
    this.url=url;
    this.timer=null;
    this.step=0;
    this.data=null;
    this.init();
}
Banner.prototype={
    constructor:Banner,
    init:function(){
        var _this=this;
        this.getData();
        this.bind();
        setTimeout(function(){
            _this.lazyImg();
        },300);
        clearInterval(this.timer);
        this.timer=setInterval(function(){
            _this.autoMove()
        },4000);
        this.handleChange();
    },
    getData:function(){
        var _this=this;
        var xml=new XMLHttpRequest();
        xml.open('get',this.url,false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4&& /^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    },
    bind:function(){
        var strA='';
        var strLi='';
        for(var i=0;i<this.data.length;i++){
            strA+='<a href="javascript:;"><img realImg="'+this.data[i].imgSrc+'"></a>';
            strLi+=i===0?'<li class="on"></li>':'<li></li>';
        }
        this.oInner.innerHTML=strA;
        this.oUl.innerHTML=strLi;
    },
    lazyImg:function(){
        var _this=this;
        for(var i=0;i<this.aA.length;i++){
            var tmpImg=new Image;
            tmpImg.src=this.aImg[i].getAttribute('realImg');
            tmpImg.index=i;
            tmpImg.onload=function(){
                _this.aImg[this.index].src=this.src;
                tmpImg=null;
            }
        }
        this.aA[0].style.opacity=1;
    },
    autoMove:function(){
        this.step++;
        if(this.step>=this.aA.length){
            this.step=0;
        }
        for(var i=0;i<this.aA.length;i++){
            if(i===this.step){
                utils.css(this.aA[i],'zIndex',1);
                var siblings=utils.siblings(this.aA[i]);
                animate(this.aA[i],{opacity:1},1000,function(){
                    for(var i=0;i<siblings.length;i++){
                        utils.css(siblings[i],'opacity',0)
                    }
                });
            }else{
                utils.css(this.aA[i],'zIndex',0);
            }
        }
        this.bannerTip();
    },
    bannerTip:function(){
        for(var i=0;i<this.aA.length;i++){
            this.aLi[i].className=i===this.step?'on':null
        }
    },
    handleChange:function(){
        var _this=this;
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].index=i;
            this.aLi[i].onmouseover=function(){
                clearInterval(_this.timer);
                _this.step=this.index-1;
                _this.autoMove();
            };
            this.aLi[i].onmouseout=function(){
                _this.timer=setInterval(function(){
                    _this.autoMove()
                },4000);
            }
        }
    }
};