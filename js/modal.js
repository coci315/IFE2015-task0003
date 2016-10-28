!function(_){
    var template = 
    '<div class="m-modal">\
      <div class="modal_align"></div>\
      <div class="modal_wrap">\
        <div class="modal_head">系统消息</div>\
        <div class="modal_body">\
            <p>默认内容</p>\
        </div>\
        <div class="modal_foot">\
          <a class="confirm" href="#">确认</a>\
          <a class="cancel" href="#">取消</a>\
        </div>\
      </div>\
    </div>';




    //@param {Object} {hasInput:true,text:'自定义内容'}
    function Modal(options){
      options = options || {};
      // 即 div.m-modal 节点
      this.container = this._layout.cloneNode(true);
      // body 用于插入自定义内容
      this.body = this.container.querySelector('.modal_body');
      // p节点，用于设置自定义内容
      this.bodyContent = this.container.querySelector('.modal_body p');
      // 将options 复制到 组件实例上
      _.extend(this, options);
      this._renderUI();
      this._initEvent();
      return this;
    }



    _.extend(Modal.prototype, {
      _layout: _.html2node(template),
      // 添加到节点中
      appendTo: function(node) {
        node.appendChild(this.container);
      },

      // 显示弹窗
      show: function(content){
        this.container.style.display = 'block';
      },
      // 隐藏弹窗
      hide: function(){
        this.container.style.display = 'none';
      },
      // 销毁弹窗
      destroy: function() {
        this.container.parentNode.removeChild(this.container);
      },
      _renderUI: function() {
        if(this.hasInput === true) {
            this.body.appendChild(_.html2node('<input type="text">'));
            this.input = this.container.querySelector('.modal_body input');
        }
        this.text && (this.bodyContent.innerText = this.text);
      },

      // 初始化事件
      _initEvent: function(){

        _.addEvent(this.container.querySelector('.confirm'),
          'click', this._onConfirm.bind(this)
        );
        _.addEvent(this.container.querySelector('.cancel'),
          'click', this._onCancel.bind(this)
        );
      },

      _onConfirm: function(){
        this.emit('confirm');
        this.destroy();
      },

      _onCancel: function(){
        this.emit('cancel');
        this.destroy();
      }

    })


    // 使用混入Mixin的方式使得Modal具有事件发射器功能
    _.extend(Modal.prototype, _.emitter);

    // 直接暴露到全局
    window.Modal = Modal;
}(util);