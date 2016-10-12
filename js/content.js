/**
 * Created by Cathy on 2016/9/6.
 */
function content(id){
    var oBox=document.getElementById(id);
    var aDiv=utils.getChildren(oBox,'div');
    var oUl=oBox.getElementsByTagName('ul')[0];
    var aLi=oUl.getElementsByTagName('li');
    utils.css(aDiv[0],'left',0);
    for(var j=0;j<aDiv.length;j++){
        aDiv[j].flag=false;
    }
    aDiv[0].flag=true;
    var l=(utils.win('clientWidth')-960)/2;
    var l1=utils.win('clientWidth')/2+480;
    for(var i=0;i<aDiv.length;i++){
        aDiv[i].index=i;
        aLi[i].index=i;
        aLi[i].onclick=function(){
            for(var j=0;j<aLi.length;j++){
                if(aLi[j]===this){
                    aLi[j].className='on';
                }else{
                    aLi[j].className='';
                }
            }
            var _this=this;
            for(var i=0;i<aDiv.length;i++){
                if(aDiv[i].flag){  //说明是当前显示在中间的那一页
                    if(this.index>i){  //说明点击的按钮大于当前显示的那一页，当前页应当从左边退出，下一页从右边往左进入
                        aDiv[i].flag=false;
                        aDiv[_this.index].flag=true;
                        utils.css(aDiv[_this.index],'left',l1);
                        animate(aDiv[i],{left:-l1},700,5,function(){
                            animate(aDiv[_this.index],{left:0},700,5);
                        })
                    }else if(this.index<i){ //说明点击的按钮小于当前显示的那一页，当前页面应当从右边退出，下一页从左边往右进入
                        aDiv[i].flag=false;
                        aDiv[_this.index].flag=true;
                        utils.css(aDiv[_this.index],'left',-l1);
                        animate(aDiv[i],{left:l1},700,5,function(){
                            animate(aDiv[_this.index],{left:0},700,5);
                        })
                    }else{
                        animate(aDiv[i],{left:-960},700,5,function(){
                            utils.css(aDiv[_this.index],'left',l1);
                            animate(aDiv[_this.index],{left:0},700,5);
                        })
                    }
                    break;
                }
            }
        }
    }
}