!function(_) {
    // 数组的indexOf兼容
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function(searchElement, fromIndex) {
        var k;
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = o.length >>> 0;
        if (len === 0) {
          return -1;
        }
        var n = +fromIndex || 0;
        if (Math.abs(n) === Infinity) {
          n = 0;
        }
        if (n >= len) {
          return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
          if (k in o && o[k] === searchElement) {
            return k;
          }
          k++;
        }
        return -1;
      };
    }
    //trim兼容
    if (!String.prototype.trim) {
      String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
      };
    }
    //bind兼容
    if(!Function.prototype.bind){
        Function.prototype.bind = function (obj) {
            // 获取函数本身
            var _func = this,
                // 第一个参数为obj，即函数调用者，第二个参数开始，如果有传入，即需要绑定的参数
                _params = Array.prototype.slice.call(arguments,1);
            // 返回一个函数，这是一个闭包，外部变量可以通过获取这个返回的函数来访问以上两个变量
            return function(){
                // 获取这个返回函数的参数
                var _localParams = Array.prototype.slice.call(arguments);
                // 合并参数，一起传入apply函数
                _params = _params.concat(_localParams);
                _func.apply(obj, _params);
            }
        }
    }
    // innerText兼容
    if(!('innerText' in document.body)) {
        HTMLElement.prototype.__defineGetter__('innerText',function() {
            return this.textContent;
        });
        HTMLElement.prototype.__defineSetter__('innerText',function(s) {
            return this.textContent = s;
        });
    }
    function $(selector) {
        return document.querySelector(selector);
    };
    function $$(selector) {
        return document.querySelectorAll(selector);
    }
    // 关于事件的几个方法
    _.extend($,{
        on: function (element, event, listener) {
                if(element.addEventListener) {
                    element.addEventListener(event,listener,false);
                }else {
                    element.attachEvent('on' + event,listener);
                }
            },
        un: function (element,event,listener) {
            if(element.removeEventListener) {
                element.removeEventListener(event,listener,false);
            }else {
                element.detachEvent('on' + event,listener);
            }
        },
        click: function(element,listener) {
            $.on(element,'click',listener);
        },
        enter: function(element,listener) {
            $.on(element,'keydown',function(e){
                e = e || window.event;
                if(e.keyCode == 13) {
                    listener();
                }
            });
        },
        delegate: function(element,selector,eventName,listener,except) {
            $.on(element,eventName,function(e) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                // var arr = [].slice.call(element.querySelectorAll(selector),0);
                // 兼容IE8
                var arr = [];
                var eles = element.querySelectorAll(selector);
                for(var i=0;i<eles.length;i++) {
                    arr.push(eles[i]);
                }
                var arr2 = [];
                var eles2 = null;
                if(typeof except != 'undefined') {
                    eles2 = element.querySelectorAll(except);
                    for(var i=0;i<eles2.length;i++) {
                        arr2.push(eles2[i]);
                    }
                    if(arr2.indexOf(target) != -1) return;
                }

                while(target != element) {
                    if(arr.indexOf(target) != -1) {
                        listener.call(target,e);
                        break;
                    }
                    target = target.parentNode;
                }

            });
        }
    });
    function padding(number) {
        return number < 10 ? '0'+number : ''+number;
    }
    function format(date) {
        return date.getFullYear() + '-' + padding(date.getMonth() + 1) + '-' + padding(date.getDate());
    }
    // 0-1.定义数据
    var data = _.fetch() || {totalNumber:12,category:[
        {name:'百度IFE项目',number:10,todos:[],subCategory:[
                {name:'task1',number:6,todos:[
                        {name:'to-do 1',date:'2015-04-28',isFinished:true,content:'完成任务1'},
                        {name:'to-do 2',date:'2015-04-28',isFinished:false,content:'完成任务2'},
                        {name:'to-do 3',date:'2015-04-29',isFinished:false,content:'完成任务3'},
                        {name:'to-do 4',date:'2015-04-29',isFinished:false,content:'完成任务4'},
                        {name:'to-do 5',date:'2015-04-30',isFinished:false,content:'完成任务5'},
                        {name:'to-do 6',date:'2015-04-30',isFinished:false,content:'完成任务6'},
                        {name:'to-do 7',date:'2015-05-04',isFinished:false,content:'完成任务7'}
                ]},
                {name:'task2',number:4,todos:[
                        {name:'to-do 1',date:'2015-04-28',isFinished:false,content:'完成任务1'},
                        {name:'to-do 2',date:'2015-04-29',isFinished:false,content:'完成任务2'},
                        {name:'to-do 3',date:'2015-04-30',isFinished:false,content:'完成任务3'},
                        {name:'to-do 4',date:'2015-05-04',isFinished:false,content:'完成任务4'}
                ]}
        ]},
        {name:'毕业设计',number:1,todos:[{name:'to-do 1',date:'2015-05-08',isFinished:false,content:'完成开题报告'}],subCategory:[]},
        {name:'社团活动',number:0,todos:[{name:'to-do 1',date:'2015-04-27',isFinished:true,content:'完成五一活动预算编制'}],subCategory:[]},
        {name:'家庭生活',number:0,todos:[{name:'to-do 1',date:'2015-04-21',isFinished:true,content:'逛商场'}],subCategory:[]},
        {name:'默认分类',number:1,todos:[{name:'to-do 1',date:'2015-05-11',isFinished:false,content:'吃饭'},{name:'to-do 2',date:'2015-05-11',isFinished:false,content:'打豆豆'}],subCategory:[]}
    ]};
    updateDataNumber(data);
    // 0-2.按日期从小到大排序
    function byDate(a,b) {
        return new Date(a.date) - new Date(b.date);
    }
    // 0-3.更新data的number
    function updateDataNumber(data) {
        function getUnfinishedNums(array) {
            var num = 0;
            for(var m = 0;m < array.length;m++) {
                if(array[m].isFinished === false) {
                    num++;
                }
            }
            return num;
        }
        var arr = data.category;
        var totalNumber = 0;
        for(var i = 0; i < arr.length; i++) {
            var arrSCG = arr[i].subCategory;
            if(arrSCG.length > 0) {
                var number = 0;
                for(var j = 0;j < arrSCG.length; j++) {
                    arrSCG[j].number = getUnfinishedNums(arrSCG[j].todos);
                    number += arrSCG[j].number;
                }
                arr[i].number = number + getUnfinishedNums(arr[i].todos);
                totalNumber += arr[i].number;
            } else {
                arr[i].number = getUnfinishedNums(arr[i].todos);
                totalNumber += arr[i].number;
            }
        }
        data.totalNumber =  totalNumber;
    }
    // 获取任务总数节点
    var totalTaskNums = $('#total i');
    // 获取分类列表节点
    var cgList = $('.m-category-list');
    // 获取分类容器节点
    var cgContainer = $('.m-category-list ul');
    // 定义一个变量存储被选中的分类或子类
    var selectCG = null;
    // 获取新增分类节点
    var addCG = $('.addcategory');

    // 定义一个变量存储被选中的任务
    var selectTask = null;
    // 获取任务列表节点
    var taskList = $('.m-task-list');
    // 获取新增任务节点
    var addTask = $('.addtask');

    // 获取g-body节点，用于插入任务详情
    var gBody = $('.g-body');

    // 获取m-tab节点，用于代理选项卡点击事件
    var eleTab = $('.m-sl-menu .m-tab');
    // 获取选项卡节点
    var tabs = eleTab.querySelectorAll('span');
    // 定义一个变量存储被选中的选项卡
    var selectTab = null;
    // 初始选中第一个选项卡
    toSelectTab(tabs[0]);

    // 2-6.选中某个选项卡
    function toSelectTab(node) {
        for(var i=0;i<tabs.length;i++) {
            _.delClass(tabs[i],'z-crt');
        }
        _.addClass(node,'z-crt');
        selectTab = node;
    }
    // 2-7.在m-tab节点上代理选项卡节点点击事件
    $.delegate(eleTab,'span','click',function(){
        toSelectTab(this);
        updateCGList(data.category,selectCG.index);
    })
    //初始化任务详情
    var initDetail = new Detail()
                        .on('finish',function() {
                            if(selectTab.id == 'all') {
                                this.hideBtn();
                            }
                            var todos = [];
                            if(selectCG.index.indexOf('-') == -1) {
                                todos = data.category[selectCG.index].todos;
                            } else {
                                var arr = selectCG.index.split('-');
                                todos = data.category[arr[0]].subCategory[arr[1]].todos;
                            }
                            todos[selectTask.index].isFinished = true;
                            updateDataNumber(data);
                            updateTotalTaskNums();
                            updateCGList(data.category,selectCG.index,selectTab.id == 'all' ? selectTask.index : undefined);
                            _.save(data);
                        }).on('edit',function() {
                            gBody.appendChild(new Editor(this.getData()).on('confirm',function() {
                                var todos = [];
                                var index = '';
                                var obj = this.getData();
                                if(selectCG.index.indexOf('-') == -1) {
                                    todos = data.category[selectCG.index].todos;
                                } else {
                                    var arr = selectCG.index.split('-');
                                    todos = data.category[arr[0]].subCategory[arr[1]].todos;
                                }
                                var isFinished = todos[selectTask.index].isFinished;
                                todos[selectTask.index] = obj;
                                todos[selectTask.index].isFinished = isFinished;
                                todos.sort(byDate);
                                index = todos.indexOf(obj);
                                updateTaskList(todos,index);
                                _.save(data);
                            }).container);
                        });
    gBody.appendChild(initDetail.container);
    // 初始化任务总数
    updateTotalTaskNums();
    // 初始化分类列表
    cgList.replaceChild(renderCGList(data.category),cgList.children[1]);
    // 获取默认分类节点
    var defaultCG = document.getElementById('defaultCG');
    // 选中默认分类节点
    toSelectCG(defaultCG);


    //  1-4.选中某个分类或子类
    function toSelectCG(node,index) {
        var cgs = cgList.querySelectorAll('.cg');
        for(var i=0;i<cgs.length;i++) {
            _.delClass(cgs[i],'z-crt');
        }
        _.addClass(node,'z-crt');
        selectCG = node;
        if(node.index.indexOf('-') == -1) {
            updateTaskList(data.category[node.index].todos,index);
        }else {
            var arr = node.index.split('-');
            updateTaskList(data.category[arr[0]].subCategory[arr[1]].todos,index);
        }
    }
    // 1-5-1.分类列表节点上代理分类或子类的点击事件
    $.delegate(cgList,'.cg','click',function() {
        toSelectCG(this);
    },'.delete');
    // 1-5-2.分类列表节点上代理删除按钮的点击事件
    $.delegate(cgList,'.delete','click',function() {
        var index = this.parentNode.index;
        var selectIndex = '';
        new Modal({text:'是否确认要删除？'})
            .on('confirm',function() {
                if(index.indexOf('-') == -1) {
                    data.category.splice(index,1);
                    selectIndex = '' + Math.min(index,data.category.length - 1);
                }else {
                    var arr = index.split('-');
                    data.category[arr[0]].subCategory.splice(arr[1],1);
                    if(data.category[arr[0]].subCategory.length == 0) {
                        selectIndex = arr[0];
                    }else {
                        selectIndex = arr[0] + '-' + Math.min(arr[1],data.category[arr[0]].subCategory.length - 1);
                    }
                }
                updateDataNumber(data);
                updateTotalTaskNums();
                updateCGList(data.category,selectIndex);
                _.save(data);
             })
            .appendTo(document.body);
    });
    // 1-6.给新增分类的按钮注册点击事件
    $.click(addCG,function() {
        new Modal({hasInput:true,text:'请输入新分类的名称'})
            .on('confirm',function() {
                if(this.input.value.trim() != ''){
                    var index = '';
                    // 如果当前选中的是子类
                    if(selectCG.className.indexOf('sub-category') != -1) {
                        // 在数据中添加分类
                        // data.category.push({name:this.input.value,number:0,todos:[],subCategory:[]});
                        index = '' + (data.category.push({name:this.input.value,number:0,todos:[],subCategory:[]}) - 1);
                    }else {
                        // 否则，在数据中当前分类下添加子类
                        // data.category[selectCG.index].subCategory.push({name:this.input.value,number:0,todos:[]});
                        index = selectCG.index + '-' + (data.category[selectCG.index].subCategory.push({name:this.input.value,number:0,todos:[]}) - 1);
                    }
                    // 更新分类列表
                    updateCGList(data.category,index);
                    _.save(data);
                }
            })
            .appendTo(document.body);
    });

    // 2-3.选中某个任务节点
    function toSelectTask(taskIndex) {
        var todos = taskList.querySelectorAll('.todo');
        for(var i=0;i<todos.length;i++) {
            if(todos[i].index == taskIndex) {
                _.addClass(todos[i],'z-crt');
                selectTask = todos[i];
            } else {
                _.delClass(todos[i],'z-crt')
            }
        }
        var arrTodos = [];
        if(selectCG.index.indexOf('-') == -1) {
            arrTodos = data.category[selectCG.index].todos;
        }else {
            var arr = selectCG.index.split('-');
            arrTodos = data.category[arr[0]].subCategory[arr[1]].todos
        }
        initDetail.setContent(arrTodos[taskIndex]);
    }
    // 2-4.任务列表节点上代理任务的点击事件
    $.delegate(taskList,'.todo','click',function() {
        toSelectTask(this.index);
    });
    // 2-5.给新增任务的按钮注册点击事件
    $.click(addTask,function() {
        gBody.appendChild(new Editor({name:'',date:format(new Date()),content:''}).on('confirm',function() {
            var index = '';
            var todos = [];
            var obj = this.getData();
            if(selectCG.index.indexOf('-') == -1) {
                todos = data.category[selectCG.index].todos;
            } else {
                var arr = selectCG.index.split('-');
                todos = data.category[arr[0]].subCategory[arr[1]].todos;
            }
            todos.push(obj);
            todos.sort(byDate);
            index = todos.indexOf(obj);
            updateDataNumber(data);
            updateTotalTaskNums();
            updateCGList(data.category,selectCG.index,index);
            _.save(data);
        }).container);
    });
    // 2-0.根据selectTab来筛选todos
    function filterTodos(todos) {
        var arr = [];
        if(selectTab.id == 'all') {
            for(var i = 0; i < todos.length; i++) {
                todos[i].index = i;
                arr.push(todos[i]);
            }
        } else if(selectTab.id == 'unfinished') {
            for(var i = 0; i < todos.length; i++) {
                if(todos[i].isFinished === false) {
                   todos[i].index = i;
                   arr.push(todos[i]); 
                }
            }
        } else {
            for(var i = 0; i < todos.length; i++) {
                if(todos[i].isFinished === true) {
                   todos[i].index = i;
                   arr.push(todos[i]); 
                }
            }
        }
        return arr;
    }

    // 2-1.渲染任务列表
    // @param {Array}  [{date:'2015-04-28',name:'todo1',isFinished:true,content:'完成IFE2015task001'}]
    function renderTaskList(arr) {
        arr = filterTodos(arr);
        var ul = document.createElement('ul');
        var task = null;
        var todo = null;
        for(var i = 0;i < arr.length;i++) {
            var oldTask = ul.querySelector('#id'+arr[i].date);
            if(oldTask !== null) {
                todo = new Todo(arr[i]).container;
                todo.index = '' + arr[i].index;
                oldTask.widget.taskWrap.appendChild(todo);
            }else {
                task = new Task(arr[i]);
                task.todo.index = '' + arr[i].index;
                ul.appendChild(task.container);
            }
        }
        return ul;
    }
    // 2-2.更新任务列表，可以传入索引值，指定选中某一项，不传则选中第一项
    function updateTaskList(arr,index) {
        taskList.replaceChild(renderTaskList(arr),taskList.children[0]);
        var todos = taskList.querySelectorAll('.todo');
        if(todos.length > 0) {
            if(index != undefined) {
                toSelectTask(index);
            } else {
                toSelectTask(todos[0].index);
            }
        }else {
            // 如果没有todos，将任务详情的内容置空
            initDetail.reset();
        }
    };
    // 1-1.渲染分类列表
    // @param {Array}  [{name:'百度IFE项目',number:10,subCategory:[{name:'task1',number:6}]}]
    function renderCGList(arr) {
        var ul = document.createElement('ul');
        var cg = null;
        var subCG = null;
        for(var i = 0;i < arr.length;i++) {
            if(arr[i].name == '默认分类') {
                cg = new Category({name:arr[i].name,number:arr[i].number,canDelete:false});
                // 默认分类上添加id，用于查找
                cg.category.id = 'defaultCG';
            } else {
                cg = new Category({name:arr[i].name,number:arr[i].number});
            }
            // 在category节点上添加index
            cg.category.index = '' + i;
            var arrSCG = arr[i].subCategory;
            if(arrSCG.length > 0){
                for(var j = 0;j < arrSCG.length; j++) {
                    subCG = new SubCategory({name:arrSCG[j].name,number:arrSCG[j].number});
                    // 在sub-category节点上添加index
                    subCG.container.index = i+'-'+ j;
                    cg.cgWrap.appendChild(subCG.container);
                }
            }
            ul.appendChild(cg.container);
        }
        return ul;
    };
    // 1-2.更新分类列表
    // @param {Array}  arr  [{name:'百度IFE项目',number:10,subCategory:[{name:'task1',number:6}]}]
    // @param {String} index  '1' or '1-1'  根据索引来选中某一项
    function updateCGList(arr,index,taskIndex) {
        cgList.replaceChild(renderCGList(arr),cgList.children[1]);
        if(typeof index == 'undefined') {
            toSelectCG(document.getElementById('defaultCG'));
        } else {
            var lis = cgList.querySelectorAll('li');
            if(index.indexOf('-') == -1) {
                toSelectCG(lis[index].querySelector('.category'),taskIndex);
            }else {
                var array = index.split('-');
                toSelectCG(lis[array[0]].querySelectorAll('.sub-category')[array[1]],taskIndex);
            }
        }
    }

    // 1-3.更新任务总数
    function updateTotalTaskNums() {
        totalTaskNums.innerText = data.totalNumber;
    }
}(util);