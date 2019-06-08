
/*
* Class: Todo-List App
*/
var AppTodo = function() {

  this.title = 'TODO WebApp / JQuery v1.12.2';

  this.todos = [
    { id: 1, task: 'Learn Kotlin!',                   done: false, editing: false },
    { id: 2, task: 'Watch the movie: Thor Ragnarok',  done: false, editing: false },
    { id: 3, task: 'Travel to Germany',               done: false, editing: false },
    { id: 4, task: 'Travel to Argentina',             done: true,  editing: false },
  ];
  this.search = '';

  this.recordTemplate = "";


  this.init = function() {
    var _title = $('#title');
    _title.html(this.title);

    this.recordTemplate = this.loadTemplate("template");
    //console.log("record template: ", this.recordTemplate);

    this.refreshList();
  };

  this.updateSearch = function() {
    this.search = $("#search").val();
    this.refreshList();
  };

  this.refreshList = function() {
    //alert("refreshList()");
    var _todoList = $("#todo-list");
    _todoList.html("");

    var fTodos = this.filteredTodos();

    for(var i = 0; i < fTodos.length; i++) {

      var todo = fTodos[i];
      this.insertRow(_todoList, todo);

    }
    this.setEvents(this);
    this.updateUI();
  };

  this.insertRow = function(container, todo) {
    var tag = this.getRecordFromTodo(todo);
    container.append(tag);
  };

  this.sortList = function() {
    //alert("sortList()");
    this.todos.sort((a, b) => {
      return a.task > b.task;
    });
    this.refreshList();
  };

  this.clearList = function() {
    //alert("clearList()");
    var result = confirm("Delete all tasks?");
    if (result) {
        this.todos.splice(0, this.todos.length);
        this.refreshList();
    }
  };

  this.getMaxID = function() {
    return Math.max.apply(Math,this.todos.map(function(i){return i.id;}));
  };

  this.newItem = function() {
    //alert("newItem()");
    var newID = (this.getMaxID() || 0) + 1;

    this.todos.unshift(
      { id: newID, task: '', done: false, editing: true },
    );
    this.refreshList();
  };

  this.updateTodo = function(todo) {
    //alert("update: " + JSON.stringify(todo));
    if (todo.task !== '') {
      var t = this.todos.find(t => t.id == todo.id);
      todo.editing = false;
      t = todo;

      this.refreshList();
    }
  };

  this.deleteTodo = function(todo) {
    //alert("delete: " + JSON.stringify(todo));
    var index = this.todos.indexOf(todo);
    this.todos.splice(index, 1);

    this.refreshList();
  };

  this.filteredTodos = function() {
    return this.todos.filter((t) => {
      return !this.search || t.task.toLowerCase().indexOf(this.search.toLowerCase()) >= 0;
    });
  };

  this.total = function() {
    return this.todos.length;
  };

  this.dones = function() {
    return this.todos.filter(t => t.done == true).length;
  };

  this.updateUI = function() {
    $("#total").html(this.total());
    $("#dones").html(this.dones());
    $("#remainding").html(this.total() - this.dones());
  };

  //-----------
  // record
  //-----------

  this.getTodoIndex = function(id) {
    for(var i = 0; i < this.todos.length; i++) {
      var todo = this.todos[i];
      if (todo.id == id) {
        return i;
      }
    }
    return -1;
  };

  this.getTodo = function(id) {
    var i = this.getTodoIndex(id);
    if (i >= 0 ) {
      return this.todos[i];
    }
    return null;
  };

  this.setTodo = function(_todo) {
    for(var i = 0; i < this.todos.length; i++) {
      var todo = this.todos[i];
      if (todo.id == _todo.id) {
        this.todos[i] = _todo;
        return true;
      }
    }
    return false;
  };

  this.getRecordFromTodo = function(todo) {
    //var todo = this.getTodo(id);
    if (todo !== null) {
      var record = "" + this.recordTemplate;
      record = this.globalReplace(record, "{{id}}",         todo.id);
      record = this.globalReplace(record, "{{chk}}",        (todo.done ? "check" : "unchecked"));
      record = this.globalReplace(record, "{{done}}",       (todo.done ? "done" : ""));
      record = this.globalReplace(record, "{{task}}",       todo.task);
      record = this.globalReplace(record, "readonly",       (todo.editing ? "" : "readonly='{{readonly}}'"));
      record = this.globalReplace(record, "{{showEdit}}",   (todo.editing ? "hidden" : ""));
      record = this.globalReplace(record, "{{showDelete}}", (todo.editing ? "hidden" : ""));
      record = this.globalReplace(record, "{{showSave}}",   (todo.editing ? "" : "hidden"));
      return record;
    }
    return "";
  };

  this.getTodoFromRecord = function(id) {
    var record = $("#record" + id);
    var todo = this.getTodo(id);

    todo.task = record.find("input[name=task]").val();

    return todo;
  };

  this.toogleItem = function(id) {
    var todo = this.getTodoFromRecord(id);
    todo.done = !todo.done;
    this.setTodo(todo);
    this.refreshList();
  };

  this.editItem = function(id) {
    var todo = this.getTodoFromRecord(id);

    var record = $("#record" + id);
    record.find("input[name=task]").prop('readonly', false);

    record.find(".editItem").toggleClass('hidden');
    record.find(".deleteItem").toggleClass('hidden');
    record.find(".saveItem").toggleClass('hidden');

    todo.editing = true;
    this.setTodo(todo);
    //this.refreshList();
  };

  this.deleteItem = function(id) {
    var result = confirm("Delete this task?");
    if (result) {
      var todo = this.getTodo(id);
      this.deleteTodo(todo);
    }
    this.refreshList();
  };

  this.saveItem = function(id) {
    var todo = this.getTodoFromRecord(id);
    todo.editing = false;
    this.setTodo(todo);
    this.refreshList();
  };

  //-----------
  // Events
  //-----------

  this.setEvents = function(context) {

    $("input[name=task]").on('dblclick',function(e) {
      e.preventDefault();
      var id = $(e.target).closest(".record").find("input[type=hidden]").val();
      context.editItem(id);
    });

    $(".toogleItem").on('click',function(e) {
      e.preventDefault();
      var id = $(e.target).closest(".record").find("input[type=hidden]").val();
      context.toogleItem(id);
    });

    $(".editItem").on('click',function(e) {
      e.preventDefault();
      var id = $(e.target).closest(".record").find("input[type=hidden]").val();
      context.editItem(id);
    });

    $(".deleteItem").on('click',function(e) {
      e.preventDefault();
      var id = $(e.target).closest(".record").find("input[type=hidden]").val();
      context.deleteItem(id);
    });

    $(".saveItem").on('click',function(e) {
      e.preventDefault();
      var id = $(e.target).closest(".record").find("input[type=hidden]").val();
      context.saveItem(id);
      $("#search").focus();
    });
  };

  //-----------
  // utils
  //-----------


  this.loadTemplate = function(templateName) {
    var templateNode = document.querySelector(templateName);
    if (templateNode) {
        return (templateNode).innerHTML;
    }
    return '';
  };

  this.globalReplace = function(text, before, later) {
    return text.replace(new RegExp(before, 'gi'), later);
  };


};
