!function(_) {
    var template = 
    '<div class="m-detail">\
        <div class="title">\
            <span class="name"></span><span class="finish" style="display:none;"></span><span class="edit" style="display:none"></span>\
        </div>\
        <div class="date">\
            <p></p>\
        </div>\
        <div class="content">\
            <p></p>\
        </div>\
    </div>';

    var template2 = 
    '<div class="m-detail m-edit" style="z-index: 10">\
        <div class="title">\
            <label for="titleInput">任务标题:</label><input id="titleInput" type="text"><span class="tips"></span><span class="confirm">确定</span><span class="cancel">取消</span>\
        </div>\
        <div class="date">\
            <label for="dateInput">任务日期:</label><input id="dateInput" type="text" placeholder="格式为YYYY-MM-DD"><span class="tips"></span>\
        </div>\
        <div class="content">\
            <div><label for="contentInput">任务内容:</label><span class="tips"></span></div>\
            <textarea id="contentInput"></textarea>\
        </div>\
    </div>';

    //@param {Object} {date:'2015-04-28',name:'todo1',isFinished:true,content:'完成任务1'}
    function Detail(options) {
        this.options = options || {};
        // 即 m-detail节点
        this.container = this._layout.cloneNode(true);
        // 在m-detail节点上定义一个widget属性指向this
        this.container.widget = this;
        // taskName节点，用于设置任务名字
        this.taskName = this.container.querySelector('.title .name');
        // finishBtn节点，用于设置是否有完成按钮
        this.finishBtn = this.container.querySelector('.title .finish');
        // editBtn节点，用于设置是否有完成按钮
        this.editBtn = this.container.querySelector('.title .edit');
        // taskDate节点，用于设置分类名字
        this.taskDate = this.container.querySelector('.date p');
        // taskContent节点，用于设置是否可删除
        this.taskContent = this.container.querySelector('.content p');
        // 将options 复制到 组件实例上
        _.extend(this, options);
        this._renderUI();
        this._initEvent();
        return this;
    }

    _.extend(Detail.prototype,{
        _layout: _.html2node(template),
        // 设置各项内容
        setContent: function(obj){
            this.taskName.innerText = obj.name;
            this.taskDate.innerText = obj.date === '' ? '' : '任务日期：' + obj.date;
            this.taskContent.innerText = obj.content;
            if(obj.isFinished === false) {
                this.showBtn();
            }else {
                this.hideBtn();
            }
            this.editBtn.style.display = obj.date === '' ? 'none' : 'inline-block';
        },
        // 隐藏finishBtn按钮
        hideBtn: function(){
            this.finishBtn.style.display = 'none';
        },
        // 隐藏finishBtn按钮
        showBtn: function(){
            this.finishBtn.style.display = 'inline-block';
        },
        // 重置各项内容为空
        reset: function() {
            this.setContent({name: '',date: '',content: ''});
        },
        getData: function() {
            var obj = {};
            obj.name = this.taskName.innerText;
            obj.date = this.taskDate.innerText.slice(5);
            obj.content = this.taskContent.innerText;
            return obj;
        },
        // UI渲染初始化
        _renderUI: function() {
            if(this.name) {
                this.setContent(this.options);
            }
        },
        // 初始化事件
        _initEvent: function(){
            var that = this;
            _.addEvent(this.finishBtn,'click',function(event) {
                new Modal({text:'是否确认完成该项任务？'})
                    .on('confirm',function() {
                         that._onFinish();
                    })
                    .appendTo(document.body);
            });
            _.addEvent(this.editBtn,'click',function() {
                that._onEdit();
                // that.container.parentNode.appendChild(new Editor(that.getData()).container);
            });
        },
        _onFinish: function(){
          this.emit('finish');
          // this.hideBtn();
        },
        _onEdit: function(){
            this.emit('edit');
        }
    });

    //@param {Object} {date:'2015-04-28',name:'todo1',isFinished:true,content:'完成任务1'}
    function Editor(options) {
        this.options = options || {};
        // 即 m-edit节点
        this.container = this._layout.cloneNode(true);
        // 在m-edit节点上定义一个widget属性指向this
        this.container.widget = this;
        // titleInput节点，用于设置任务名字
        this.titleInput = this.container.querySelector('.title input');
        // titleTips节点，用于设置提示消息
        this.titleTips = this.container.querySelector('.title .tips');
        // dateInput节点，用于设置任务日期
        this.dateInput = this.container.querySelector('.date input');
        // dateTips节点，用于设置提示消息
        this.dateTips = this.container.querySelector('.date .tips');
        // contentInput节点，用于设置任务内容
        this.contentInput = this.container.querySelector('.content textarea');
        // contentTips节点，用于设置提示消息
        this.contentTips = this.container.querySelector('.content .tips');
        // 将options 复制到 组件实例上
        _.extend(this, options);
        this._renderUI();
        this._initEvent();
        return this;
    }

    _.extend(Editor.prototype,{
        _layout: _.html2node(template2),
        // 设置各项内容
        setContent: function(obj){
            this.titleInput.value = obj.name;
            this.dateInput.value = obj.date;
            this.contentInput.innerText = obj.content;
        },
        getData: function() {
            var obj = {};
            obj.name = this.titleInput.value;
            obj.date = this.dateInput.value;
            obj.content = this.contentInput.value;
            obj.isFinished = false;
            return obj;
        },
        // UI渲染初始化
        _renderUI: function() {
            if(this.name != undefined) {
                this.setContent(this.options);
            }
        },
        // 销毁组件
        destroy: function() {
          this.container.parentNode.removeChild(this.container);
        },
        //验证任务名称
        checkT: function() {
            if(this.titleInput.value.trim() === ''){
                this.titleTips.innerText = '名称不能为空';
            }else {
                this.titleTips.innerText = '';
            }
            return !(this.titleInput.value.trim() === '');
        },
        //验证任务日期
        checkD: function() {
            if(this.dateInput.value.trim() === '') {
                this.dateTips.innerText = '日期不能为空';
                return false;
            } else {
                if(! /^[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]$/.test(this.dateInput.value.trim())){
                    this.dateTips.innerText = '日期格式有误';
                    return false;
                } else {
                    if(new Date(this.dateInput.value.trim()).getDate() != this.dateInput.value.trim().slice(-2)) {
                        this.dateTips.innerText = '日期不合法';
                        return false;
                    }else {
                        this.dateTips.innerText = '';
                        return true;
                    }
                }
            }
        },
        //验证任务内容
        checkC: function() {
            if(this.contentInput.value.trim() === ''){
                console.log(this.contentInput.value)
                this.contentTips.innerText = '内容不能为空';
            }else {
                this.contentTips.innerText = '';
            }
            return !(this.contentInput.value.trim() === '');
        },
        // 初始化事件
        _initEvent: function(){
            var that = this;
            _.addEvent(this.titleInput,'blur',function(event) {
                that.checkT();
            });
            _.addEvent(this.dateInput,'blur',function(event) {
                that.checkD();
            });
            _.addEvent(this.contentInput,'blur',function(event) {
                that.checkC();
            });
            _.addEvent(this.container.querySelector('.title .confirm'),'click',function() {
                that._onConfirm();
            });
            _.addEvent(this.container.querySelector('.title .cancel'),'click',function() {
                that._onCancel();
            });
        },
        _onConfirm: function(){
          this.emit('confirm');
          this.destroy();
        },

        _onCancel: function(){
          this.emit('cancel');
          this.destroy();
        }
    });
    

    // 使用混入Mixin的方式使得Detail具有事件发射器功能
    _.extend(Detail.prototype, _.emitter);
    // 使用混入Mixin的方式使得Editor具有事件发射器功能
    _.extend(Editor.prototype, _.emitter);
    window.Detail = Detail;
    window.Editor = Editor;

}(util);