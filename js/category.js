!function(_) {
    var template = 
    '<li>\
        <div class="cg category">\
            <span class="icon"></span><span class="name">百度IFE项目</span><span class="number">(<i>0</i>)</span><span class="delete"></span>\
        </div>\
        <div class="wrap">\
        </div>\
    </li>';

    var template2 = 
    '<div class="cg sub-category"><span class="icon"></span><span class="name">task1</span><span class="number">(<i>0</i>)</span><span class="delete"></span></div>';

    //@param {Object} {name:'分类名称',number:10,canDelete:false}
    function Category(options) {
        this.canDelete = true;
        this.options = options || {};
        // 即 li节点
        this.container = this._layout.cloneNode(true);
        // category节点
        this.category = this.container.querySelector('.category');
        // 在category节点上定义一个widget属性指向this
        this.category.widget = this;
        // cgName节点，用于设置分类名字
        this.cgName = this.container.querySelector('.category .name');
        // cgNumber节点，用于设置分类未完成任务数
        this.cgNumber = this.container.querySelector('.category .number i');
        // cgDelete节点，用于设置是否可删除
        this.cgDelete = this.container.querySelector('.category .delete');
        // cgWrap节点，用于插入子类
        this.cgWrap = this.container.querySelector('.wrap');
        // 将options 复制到 组件实例上
        _.extend(this, options);
        this._renderUI();
        this._initEvent();
        return this;
    }

    _.extend(Category.prototype,{
        _layout: _.html2node(template),
        // 设置分类名字
        setContent: function(obj){
            this.cgName.innerText = obj.name;
            this.cgNumber.innerText = obj.number;
        },
        // 添加子类
        addSubCG: function(obj){
            this.cgWrap.appendChild(new SubCategory(obj).container);
        },

        // 更新分类数量
        updateNumber: function() {
            var subs = this.cgWrap.querySelectorAll('.sub-category .number i');
            var num = 0;
            if(subs.length > 0) {
                for(var i = 0; i < subs.length; i++) {
                    num += Number(subs[i].innerText);
                }
                this.cgNumber.innerText = num;
            }
        },
        // 删除分类
        deleteCG: function(event) {
            // event = event || window.event;
            // if(event.stopPropagation) {
            //     event.stopPropagation();
            // } else {
            //     event.cancelBubble = true;
            // }
            var container = this.container;
            container.parentNode.removeChild(container);
        },
        // UI渲染初始化
        _renderUI: function() {
            this.name && this.setContent(this.options);
            if(this.canDelete === false) {
                this.category.removeChild(this.cgDelete);
            }
        },
        // 初始化事件
        _initEvent: function(){
            // var that = this;
            // if(this.canDelete === true) {
            //     _.addEvent(this.cgDelete,'click',function(event) {
            //         event = event || window.event;
            //         if(event.stopPropagation) {
            //             event.stopPropagation();
            //         } else {
            //             event.cancelBubble = true;
            //         }
            //         that._onDelete();
                    // new Modal({text:'是否确认要删除？'})
                    //     .on('confirm',function() {
                    //         that.deleteCG();
                    //      })
                    //     .appendTo(document.body);
                // });
            // }
        },
        _onDelete: function() {
            this.emit('delete');
        }
    });

    //@param {Object} {name:'子类名称',number:6}
    function SubCategory(options) {
        this.options = options || {};
        // 即 sub-category节点
        this.container = this._layout.cloneNode(true);
        // 在sub-category节点上定义一个widget属性指向this
        this.container.widget = this;
        // scgName节点，用于设置子类名字
        this.scgName = this.container.querySelector('.sub-category .name');
        // scgNumber节点，用于设置子类数量
        this.scgNumber = this.container.querySelector('.sub-category .number i');
        // scgDelete节点，用于绑定删除事件
        this.scgDelete = this.container.querySelector('.sub-category .delete');

        // 将options 复制到 组件实例上
        _.extend(this, options);
        this._renderUI();
        this._initEvent();
        return this;
    }

    _.extend(SubCategory.prototype,{
        _layout: _.html2node(template2),
        // 设置子类名字
        setContent: function(obj){
            this.scgName.innerText = obj.name;
            this.scgNumber.innerText = obj.number;
        },
        // 添加兄弟子类
        addSubCG: function(name){
            this.container.parentNode.insertBefore(new SubCategory({name:name}).container,this.container.nextElementSibling);
        },

        // 更新子类数量
        updateNumber: function(num) {
            this.scgNumber.innerText = num;
        },
        // 删除子类
        deleteSCG: function(event) {
            // event = event || window.event;
            // if(event.stopPropagation) {
            //     event.stopPropagation();
            // } else {
            //     event.cancelBubble = true;
            // }
            var container = this.container;
            container.parentNode.removeChild(container);
        },
        // UI渲染初始化
        _renderUI: function() {
            this.name && this.setContent(this.options);
        },
        // 初始化事件
        _initEvent: function(){
            // var that = this;
            //     _.addEvent(this.scgDelete,'click',function(event) {
            //         event = event || window.event;
            //         if(event.stopPropagation) {
            //             event.stopPropagation();
            //         } else {
            //             event.cancelBubble = true;
            //         }
            //         that._onDelete();
                    // new Modal({text:'是否确认要删除？'})
                    //     .on('confirm',function() {
                    //         that.deleteSCG();
                    //      })
                    //     .appendTo(document.body);
                // });
        },
        _onDelete: function() {
            this.emit('delete');
        }
    });
    
    // 使用混入Mixin的方式使得Category具有事件发射器功能
    _.extend(Category.prototype, _.emitter);
    // 使用混入Mixin的方式使得SubCategory具有事件发射器功能
    _.extend(SubCategory.prototype, _.emitter);
    window.Category = Category;
    window.SubCategory = SubCategory;

}(util);