/**
 * Created by xiao lei on 2016/8/14.
 */
var utils=(function(){
    var flag='getComputedStyle' in window; //惰性思想；
    function jsonParse(str){
        return 'JSON' in window?JSON.parse(str):eval('('+str+')');
    }
    function rnd(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();
        }
        if(n>m){
            var tmp=m;
            m=n;
            n=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }
    function makeArray(arg){
        var ary=[];
        if(flag){
            ary=Array.prototype.slice.call(arg);
        }else{
            for(var i=0; i<arg.length; i++){
                ary.push(arg[i])
            }
        }
        return ary;
    }
    function getByClass(strClass,parent){
        //parent=parent||document;
        parent||(parent=document);
        if(flag){ //标准浏览器处理完
            return this.makeArray(parent.getElementsByClassName(strClass));
        }
        //1.字符串转数组
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        //2.获取parent下所有的元素
        var nodeList=parent.getElementsByTagName('*');
        //3.校验每个元素上的class名，是否包含数组中的每一项class名；
        var ary=[];
        for(var i=0; i<nodeList.length; i++){
            var curEle=nodeList[i];
            var bOk=true;
            for(var j=0; j<aryClass.length; j++){
                var reg=new RegExp('\\b'+aryClass[j]+'\\b');
                if(!reg.test(curEle.className)){
                    bOk=false;
                    break;
                }
            }
            if(bOk){
                ary.push(curEle);
            }
        }
        return ary;
    }
    function hasClass(curEle,cName){
        var reg=new RegExp('(^| +)'+cName+'( +|$)');
        return reg.test(curEle.className);
    }
    function addClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for(var i=0; i<aryClass.length; i++){
            if(!this.hasClass(curEle,aryClass[i])){
                curEle.className+=' '+aryClass[i];
            }
            //没有的时候才添加，添加时一定要注意写上空格；
        }
    }
    function removeClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for(var i=0; i<aryClass.length; i++){
            var reg=new RegExp('\\b'+aryClass[i]+'\\b');
            if(reg.test(curEle.className)){
                curEle.className=curEle.className.replace(reg,' ').replace(/(^ +)|( +$)/g,'').replace(/\s+/g,' ');
                //1.先把如何正则的内容替换成空格字符串
                //2.去除首尾空格
                //3.把多有有个多个空格的，都替换成1个空格；
            }
        }
    }
    function getCss(curEle,attr){
        var val=null;
        var reg=null;
        if(flag){//标准
            val=getComputedStyle(curEle,false)[attr];
        }else{//非标准
            if(attr==='opacity'){
                val=curEle.currentStyle.filter; //'alpha(opacity=10)'
                reg=/^alpha\(opacity[=:](\d+)\)$/i;
                return reg.test(val)?reg.exec(val)[1]/100:1;
            }
            val=curEle.currentStyle[attr];
        }
        reg=/^[+-]?((\d|([1-9]\d+))(\.\d+)?)(px|pt|rem|em)$/i;
        return reg.test(val)?parseInt(val):val;
    }
    function setCss(curEle,attr,value){
        if(attr==='float'){
            curEle.style.cssFloat=value;
            curEle.style.styleFloat=value;
            return;
        }
        if(attr==='opacity'){
            curEle.style.opacity=value;
            curEle.style.filter='alpha(opacity='+(value*100)+')';
            return;
        }
        //对单位的处理
        var reg=/^(width|height|top|right|bottom|left|((margin|padding)(top|right|bottom|left)?))$/i;
        if(reg.test(attr)){
            if(!(value==='auto' || value.toString().indexOf('%')!==-1)){
                value=parseFloat(value)+'px';
            }
        }
        curEle.style[attr]=value;
    }
    function setGroupCss(curEle,opt){
        if(opt.toString()!=='[object Object]') return;
        for(var attr in opt){
            this.setCss(curEle,attr,opt[attr]);
        }
    }
    function css(curEle){
        var arg2=arguments[1];
        if(typeof arg2==='string'){
            var arg3=arguments[2];
            if(typeof  arg3==='undefined'){ //当第三个参数不存在，是获取；
                return this.getCss(curEle,arg2);
            }else{
                this.setCss(curEle,arg2,arg3);
            }
        }
        if(arg2.toString()==='[object Object]'){ //获取一组元素
            this.setGroupCss(curEle,arg2);
        }
    }
    function offset(curEle){
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        var par=curEle.offsetParent;
        while(par){
            if(navigator.userAgent.indexOf('MSIE 8.0')===-1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:l,top:t}
    }
    function win(attr,value){
        if(typeof  value==='undefined'){
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr]=document.body[attr]=value;
    }
    function getChildren(curEle,tagName){
        var nodeList=curEle.childNodes;
        var ary=[];
        for(var i=0; i<nodeList.length; i++){
            var curEle=nodeList[i];
            if(curEle.nodeType===1){
                if(tagName !==undefined){//当第二个参数存在的时候，需要再次过滤
                    if(curEle.tagName.toLowerCase()===tagName.toLowerCase()){
                        ary.push(curEle);
                    }
                }else{
                    ary.push(curEle);
                }
            }
        }
        return ary;
    }
    function prev(curEle){
        if(flag){
            return curEle.previousElementSibling;
        }
        var pre=curEle.previousSibling;
        while(pre && pre.nodeType !== 1){
            pre=pre.previousSibling;
        }
        return pre;
    }
    function prevAll(curEle){
        var pre=this.prev(curEle);
        var ary=[];
        while(pre){
            ary.unshift(pre);
            pre=this.prev(pre);
        }
        return ary;
    }
    function next(curEle){
        if(flag){
            return curEle.nextElementSibling;
        }
        var nex=curEle.nextSibling;
        while(nex && nex.nodeType!==1){
            nex=nex.nextSibling;
        }
        return nex;
    }
    function nextAll(curEle){
        var nex=this.next(curEle);
        var ary=[];
        while(nex){
            ary.push(nex);
            nex=this.next(nex);
        }
        return ary;
    }
    function sibling(curEle){
        var ary=[];
        var pre=this.prev(curEle);
        var nex=this.next(curEle);
        if(pre) ary.push(pre);
        if(nex) ary.push(nex);
        return ary;
    }
    function siblings(curEle){
        var ary1=this.prevAll(curEle);
        var ary2=this.nextAll(curEle);
        return ary1.concat(ary2);
    }
    function firstChild(curEle){
        var childs=this.getChildren(curEle);
        return childs[0];
    }
    function lastChild(curEle){
        var childs=this.getChildren(curEle);
        return childs[childs.length-1];
    }
    function index(curEle){
        return this.prevAll(curEle).length;
    }
    function appendChild(parent,curEle){
        parent.appendChild(curEle);
    }
    function prependChild(parent,curEle){
        var first=this.firstChild(parent);
        //查看父容器下是否有第一个子元素，如果有第一个子元素，插入第一个子元素的前面
        if(first){
            parent.insertBefore(curEle,first);
        }else{
            parent.appendChild(curEle);
        }
    }
    function insertBefore(newEle,oldEle){
        oldEle.parentNode.insertBefore(newEle,oldEle);
    }
    function insertAfter(newEle,oldEle){
        var nex=this.next(oldEle);
        if(nex){
            oldEle.parentNode.insertBefore(newEle,nex);
        }else{
            oldEle.parentNode.appendChild(newEle);
        }
    }
    function Linear(t,b,c,d){
        return  t*c/d+b;
    }
    return {
        //jsonParse：把JSON格式的字符串转成JSON格式的数据
        jsonParse:jsonParse,
        //rnd:取一定返回的随机整数
        rnd:rnd,
        //makeArray:类数组转数组
        makeArray:makeArray,
        //在一定范围内，通过class名获取元素
        getByClass:getByClass,
        //hasClass:检查元素身上是否有某个class名
        hasClass:hasClass,
        //addClass:给元素身上添加一组class名； 添加时：先判断没有，才添加
        addClass:addClass,
        //removeClass:删除元素身上的一组class名
        removeClass:removeClass,
        //getCss:获取元素的非行间样式；
        getCss:getCss,
        //setCss:设置一个样式
        setCss:setCss,
        //setGroupCss:给元素身上设置一组样式
        setGroupCss:setGroupCss,
        //css:可以获取和设置的三种方法合为一体；
        css:css,
        //offset:盒子模型的偏移量
        offset:offset,
        //win:浏览器盒子模型兼容
        win:win,
        //getChildren:获取当前元素下，所有子元素，并且可以通过元素标签筛选
        getChildren:getChildren,
        //prev:上一个哥哥元素
        prev:prev,
        //prevAll:所有的哥哥元素
        prevAll:prevAll,
        //next:下一个弟弟元素
        next:next,
        //nextAll：所有的弟弟元素
        nextAll:nextAll,
        //sibling：上一个哥哥+下一个弟弟 组成一个数组
        sibling:sibling,
        //siblings:所有的哥哥+所有的弟弟；
        siblings:siblings,
        //firstChild:第一个子元素
        firstChild:firstChild,
        //lastChild：最后一个子元素
        lastChild:lastChild,
        //index：有多少个哥哥就排行第几；
        index:index,
        //当前元素插入到父容器的末尾；
        appendChild:appendChild,
        //当前元素插入到父容器的最开始：即插入到第一个元素的前面；
        prependChild:prependChild,
        //把新元素插入到指定元素的前面；
        insertBefore:insertBefore,
        //把新元素插入旧元素的后面；即：把新元素插入到旧元素下一项的前面；
        insertAfter:insertAfter,
        Linear:Linear


    }
})();