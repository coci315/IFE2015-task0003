!function(_) {
    var template = 
    '<li>\
        <div class="date"></div>\
        <div class="wrap">\
        </div>\
    </li>';

    var template2 = 
    '<div class="todo"></div>';

    //@param {Object} {date:'2015-04-28',name:'todo1',isFinished:true,content:'完成任务1'}
    function Task(options) {
        this.options = options || {};
        // 即 li节点
        this.container = this._layout.cloneNode(true);
        // date节点，用于设置任务日期
        this.taskDate = this.container.querySelector('.date');
        // 在date节点上定义一个widget属性指向this
        this.taskDate.widget = this;
        // taskWrap节点，用于插入子类
        this.taskWrap = this.container.querySelector('.wrap');
        // 将options 复制到 组件实例上
        _.extend(this, options);
        this._renderUI();
        return this;
    }

    _.extend(Task.prototype,{
        _layout: _.html2node(template),
        // 设置任务日期
        setContent: function(date){
            this.taskDate.innerText = date;
            this.taskDate.id = 'id' + date; // id必须以字母开头
        },
        // 添加任务
        addTodo: function(option){
            this.todo = new Todo(option).container
            this.taskWrap.appendChild(this.todo);
        },

        // UI渲染初始化
        _renderUI: function() {
            this.date && this.setContent(this.date);
            if(this.name) {
                this.addTodo(this.options);
            }
        },
    });

    //@param {Object} {date:'2015-04-28',name:'todo1',isFinished:true,content:'完成任务1'}
    function Todo(options) {
        options = options || {};
        // 即 todo节点
        this.container = this._layout.cloneNode(true);
        // 在todo节点上定义一个widget属性指向this
        this.container.widget = this;

        // 将options 复制到 组件实例上
        _.extend(this, options);
        this._renderUI();
        return this;
    }

    _.extend(Todo.prototype,{
        _layout: _.html2node(template2),
        // UI渲染初始化
        _renderUI: function() {
            if(this.date) {
                this.container.setAttribute('data-date',this.date);
            }
            if(this.name) {
                this.container.innerText = this.name;
                this.container.setAttribute('data-name',this.name);
            }
            if(this.isFinished === true) {
                _.addClass(this.container,'z-finished');
            }
            this.container.setAttribute('data-isFinished',this.isFinished);
            if(this.content) {
                this.container.setAttribute('data-content',this.content);
            }
        },
    });
    

    window.Task = Task;
    window.Todo = Todo;

}(util);