var util = (function(){
  var STORAGE_KEY = 'GTD-Tools';
  return {
    // 读取localStorage
    fetch: function () {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    },
    // 保存localStorage
    save: function (items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    },
    // 扩展对象
    extend: function (o1, o2){
      for(var i in o2)  {
        o1[i] = o2[i]
      }
      return o1;
    },
    // 将HTML转换为节点
    html2node: function (str){
      var container = document.createElement('div');
      container.innerHTML = str;
      return container.children[0];
    },
    addClass: function (node, className){
      var current = node.className || "";
      if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
        node.className = current? ( current + " " + className ) : className;
      }
    },
    delClass: function (node, className){
      var current = node.className || "";
      node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
    },
    //设置cookie
    setCookie: function (name, value, day, path, domain, secure) {
      var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
      if (day){
        var date = new Date();
        date.setDate( date.getDate() + day);
        cookie += '; expires=' + date.toGMTString();
      }
      if (path)
          cookie += '; path=' + path;
      if (domain)
          cookie += '; domain=' + domain;
      if (secure)
          cookie += '; secure=' + secure;
      document.cookie = cookie;
    },
    //获取cookie
    getCookie: function () {
      var cookie = {};
      var all = document.cookie;
      if (all === '')
          return cookie;
      var list = all.split('; ');
      for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var p = item.indexOf('=');
          var name = item.substring(0, p);
          name = decodeURIComponent(name);
          var value = item.substring(p + 1);
          value = decodeURIComponent(value);
          cookie[name] = value;
      }
      return cookie;
    },
    //删除cookie
    removeCookie: function(name, path, domain) {
        document.cookie = name + '='
        + '; path=' + path
        + '; domain=' + domain
        + '; max-age=0';
    },
    //获取实际样式
    getStyle: function(element, cssPropertyName) {
        return window.getComputedStyle ? getComputedStyle(element,'')[cssPropertyName] : element.currentStyle[cssPropertyName];
    },
    //封装ajax方法
    ajax: function(obj) {
      // 请求参数序列化,即对象转为字符串
      function serialize(data) {
          if (!data) return '';
          var pairs = [];
          for (var name in data) {
              if (!data.hasOwnProperty(name)) continue;
              if (typeof data[name] === 'function') continue;
              var value = data[name].toString();
              name = encodeURIComponent(name);
              value = encodeURIComponent(value);
              pairs.push(name + '=' + value);
          }
          return pairs.join('&');
      }
      var xhr = new XMLHttpRequest();
      //通过使用JS随机数来解决IE浏览器第二次默认获取缓存的问题
      // obj.url = obj.url + '?rand=' + Math.random()
      obj.data = serialize(obj.data);
      //如果是get请求
      if(obj.method === 'get') {
        obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data; 
      }
      //如果是异步请求
      if(obj.async === true) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback();
            }
        };
      }
      xhr.open(obj.method, obj.url, obj.async);
      //如果是post请求，需要设置请求头，放在open方法与send方法之间
      if(obj.method === 'post') {
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xhr.send(obj.data);
      }else {
        xhr.send(null);
      }
      //如果是同步请求
      if(obj.async === false) {
        callback();
      }
      //回调
      function callback() {
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            obj.success(xhr.responseText);
        }else {
            alert('Request was unsuccessful: ' + xhr.status);
        }
      }
    },
    //注册事件兼容
    addEvent: function (node,event,handler) {
      if (node.addEventListener){
          node.addEventListener(event,handler,false);
      }else{
          node.attachEvent('on'+event,handler);
      }
    },
    removeEvent:function (node, event, handler) {
        if(node.removeEventListener) {
            node.removeEventListener(event,handler,false);
        }else {
            node.detachEvent('on' + event,handler);
        }
    },
    emitter: {
      // 注册事件
      on: function(event, fn) {
        var handles = this._handles || (this._handles = {}),
          calls = handles[event] || (handles[event] = []);

        // 找到对应名字的栈
        calls.push(fn);

        return this;
      },
      // 解绑事件
      off: function(event, fn) {
        if(!event || !this._handles) this._handles = {};
        if(!this._handles) return;

        var handles = this._handles , calls;

        if (calls = handles[event]) {
          if (!fn) {
            handles[event] = [];
            return this;
          }
          // 找到栈内对应listener 并移除
          for (var i = 0, len = calls.length; i < len; i++) {
            if (fn === calls[i]) {
              calls.splice(i, 1);
              return this;
            }
          }
        }
        return this;
      },
      // 触发事件
      emit: function(event){
        var args = [].slice.call(arguments, 1),
          handles = this._handles, calls;

        if (!handles || !(calls = handles[event])) return this;
        // 触发所有对应名字的listeners
        for (var i = 0, len = calls.length; i < len; i++) {
          calls[i].apply(this, args)
        }
        return this;
      }
    }

  }
})()