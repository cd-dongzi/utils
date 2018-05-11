class OtherFn {

    /**
     * [deepClone 深度克隆]
     * @param  {[type]} obj [克隆对象]
     * @return {[type]}     [返回深度克隆后的对象]
     */
    deepClone (obj) {
        if (obj === null || typeof obj !== 'object') return obj
        var isType = function(obj, type) {
            var flag,
                typeString = Object.prototype.toString.call(obj)
            switch(type) {
                case 'Array':
                    flag = typeString === '[object Array]'
                    break
                case 'Date':
                    flag = typeString === '[object Date]'
                    break
                case 'RegExp':
                    flag = typeString === '[object RegExp]'
                    break
                default:
                    flag = false
            }
            return flag
        }
        var getRegExp = function(re) {
            var flags = ''
            if (re.global) flags += 'g'
            if (re.ignoreCase) flags += 'i'
            if (re.multiline) flags += 'm'
            return flags
        }

        var _clone = function(parent) {
            var child, proto, parents = [], children = []
            if (isType(parent, 'Array')) {// 对数组做特殊处理
                child = [];
            } else if (isType(parent, 'RegExp')) {// 对正则做特殊处理
                child = new RegExp(parent.source, getRegExp(parent));
                if (parent.lastIndex) child.lastIndex = parent.lastIndex;
            } else if (isType(parent, 'Date')) {// 对Date做特殊处理
                child = new Date(parent.getTime());
            } else {
                // 处理对象原型
                proto = Object.getPrototypeOf(parent);
                // 利用Object.create切断原型链
                child = Object.create(proto);
            }
            // 处理循环引用
            var index = parents.indexOf(parent);

            if (index != -1) {
                // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
                return children[index];
            }
            parents.push(parent);
            children.push(child);

            for (var i in parent) {
                child[i] = _clone(parent[i]);
            }

            return child;
        }
        return _clone(obj)
    }

    /**
     * 防抖动
     * @param  {Function} fn        [执行的函数]
     * @param  {[type]}   delay     [多少秒之后执行]
     * @param  {[type]}   immediate [是否立即执行]
     * @return {[type]}             []
     */
    debounce(fn, delay, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) fn.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, delay);
            if (callNow) fn.apply(context, args);
        };
    }

    /**
     * 节流
     * @param  {[type]} func  [执行的函数]
     * @param  {[type]} delay [多少秒之内执行一次]
     * @return {[type]}       [description]
     */
    throttle (func,delay){
        var prev = Date.now();
        return function(){
            var context = this;
            var args = arguments;
            var now = Date.now();
            if(now-prev>=delay){
                func.apply(context,args);
                prev = Date.now();
            }
        }
    }

    /**
     * 圆形碰撞
     * @param  {[type]} circle1 [description]
     * @param  {[type]} circle2 [description]
     * @return {[type]}         [description]
     */
    circleImpact(circle1,circle2) {
        var r1 = circle1.offsetWidth / 2;
        var l1 = circle1.offsetLeft;
        var t1 = circle1.offsetTop;

        var r2 = circle2.offsetWidth / 2;
        var l2 = circle2.offsetLeft;
        var t2 = circle2.offsetTop;

        var a = (l1 + r1) - (l2 + r2);
        var b = (t1 + r1) - (t2 + r2); 

        var c = Math.sqrt(a * a + b * b);

        if (c>=(r1+r2)) {
            return false;
        }else{
            return true;
        }
    }

    /**
     * 矩形碰撞
     * @param  {[type]} rect1 [description]
     * @param  {[type]} rect2 [description]
     * @return {[type]}       [description]
     */
    rectImpact(rect1, rect2) {
        var t1 = rect1.offsetTop;  
        var l1 = rect1.offsetLeft;  
        var r1 = rect1.offsetLeft + rect1.offsetWidth;  
        var b1 = rect1.offsetTop + rect1.offsetHeight;  

        var t2 = rect2.offsetTop;  
        var l2 = rect2.offsetLeft;  
        var r2 = rect2.offsetLeft + rect2.offsetWidth;  
        var b2 = rect2.offsetTop + rect2.offsetHeight; 

        if(b1<t2 || l1>r2 || t1>b2 || r1<l2){// 表示没碰上  
            return false
        }else{  
            return true
        }  
    }

    /**
     * 图片压缩
     * @param  {[type]}   file [压缩文件]
     * @param  {[type]}   obj  [压缩参数]
     * @param  {Function} cb   [回调函数]
     * @return {[type]}        [返回压缩前和压缩后的格式]
     */
    photoCompress(file, obj, cb) {
        /*
            obj = {
                width: 图片宽,
                height: 图片高,
                quality: 图像质量，
                blob: 是否转换成Blob
            }
         */
        //将以base64的图片url数据转换为Blob
        function convertBase64UrlToBlob(urlData){
            var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
        }

        // canvas 绘制图片
        function canvasDataURL(oldBase64){
            var img = new Image();
            img.src = oldBase64;
            img.onload = function(){
                var that = this;
                // 默认按比例压缩
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = obj.width || w;
                h = obj.height || (w / scale);
                var quality = 0.7;  // 默认图片质量为0.7
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(that, 0, 0, w, h);
                // 图像质量
                if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                    quality = obj.quality;
                }
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', quality);
                // 回调函数返回base64的值
                if (obj.blob) {
                    cb && cb(convertBase64UrlToBlob(base64), convertBase64UrlToBlob(oldBase64))
                }else{
                    cb && cb(base64, oldBase64);
                }
            }
        }

        // 读取图片的base64格式
        var ready=new FileReader();
        ready.readAsDataURL(file);
        ready.onload=function(){
            var re=this.result;
            canvasDataURL(re)
        }
    }

    /*获取网址参数*/
    getUrlParams(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if(r!=null) return  r[2]; return null;
    }

    /*获取全部url参数,并转换成json对象*/
    getUrlAllParams (url) {
        var url = url ? url : window.location.href;
        var _pa = url.substring(url.indexOf('?') + 1),
            _arrS = _pa.split('&'),
            _rs = {};
        for (var i = 0, _len = _arrS.length; i < _len; i++) {
            var pos = _arrS[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            var name = _arrS[i].substring(0, pos),
                value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
            _rs[name] = value;
        }
        return _rs;
    }

    /*删除url指定参数，返回url*/
    delParamsUrl(url, name){
        var baseUrl = url.split('?')[0] + '?';
        var query = url.split('?')[1];
        if (query.indexOf(name)>-1) {
            var obj = {}
            var arr = query.split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            };
            delete obj[name];
            var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
            return url
        }else{
            return url;
        }
    }

    /*获取十六进制随机颜色*/
    getRandomColor () {
        return '#' + (function(h) {
            return new Array(7 - h.length).join("0") + h;
        })((Math.random() * 0x1000000 << 0).toString(16));
    }

    /*图片加载*/
    imgLoadAll(arr,callback){
        var arrImg = []; 
        for (var i = 0; i < arr.length; i++) {
            var img = new Image();
            img.src = arr[i];
            img.onload = function(){
                arrImg.push(this);
                if (arrImg.length == arr.length) {
                    callback && callback();
                }
            }
        }
    }

    /*音频加载*/
    loadAudio(src, callback) {
        var audio = new Audio(src);
        audio.onloadedmetadata = callback;
        audio.src = src;
    }

    /*DOM转字符串*/
    domToStirng(htmlDOM){
        var div= document.createElement("div");
        div.appendChild(htmlDOM);
        return div.innerHTML
    }

    /*字符串转DOM*/
    stringToDom(htmlString){
        var div= document.createElement("div");
        div.innerHTML=htmlString;
        return div.children[0];
    }


    /**
     * 光标所在位置插入字符，并设置光标位置
     * 
     * @param {dom} 输入框
     * @param {val} 插入的值
     * @param {posLen} 光标位置处在 插入的值的哪个位置
     */
    setCursorPosition (dom,val,posLen) {
        var cursorPosition = 0;
        if(dom.selectionStart){
            cursorPosition = dom.selectionStart;
        }
        this.insertAtCursor(dom,val);
        dom.focus();
        console.log(posLen)
        dom.setSelectionRange(dom.value.length,cursorPosition + (posLen || val.length));
    }

    /*光标所在位置插入字符*/
    insertAtCursor(dom, val) {
        if (document.selection){
            dom.focus();
            sel = document.selection.createRange();
            sel.text = val;
            sel.select();
        }else if (dom.selectionStart || dom.selectionStart == '0'){
            let startPos = dom.selectionStart;
            let endPos = dom.selectionEnd;
            let restoreTop = dom.scrollTop;
            dom.value = dom.value.substring(0, startPos) + val + dom.value.substring(endPos, dom.value.length);
            if (restoreTop > 0){
                dom.scrollTop = restoreTop;
            }
            dom.focus();
            dom.selectionStart = startPos + val.length;
            dom.selectionEnd = startPos + val.length;
        } else {
            dom.value += val;
            dom.focus();
        }
    }
}