$(document).ready(function(){
  const scroll = () => $('#todos_container').scrollTop($('#todos_container')[0].scrollHeight);

  const createTodo = function() {
    let task = $('#todo_input').val();
    if (task) {
      $.post("/create-todo", {
        task: task
      }, function (response) {
        if (response.success) {
          console.log('result ', response.todo);

          $('#todos_container').append(`
            <div id="${response.todo.id}" class="todo-container cool-scroll-bar-17 ${response.todo.complete ? 'checked' : ''}">
              <div class="remove">
                <img src="/img/trashcan.png"  />
              </div>
              <div data-complete="${response.todo.complete}" class="todo">
                <input type="checkbox" class="checkbox">
                <input type="text" value="${response.todo.task}" class="textbox">
              </div>
            </div>
          `);
          $('#todo_input').val('');
          scroll();
        }
        else {
          alert(response.message);
        }
      });
    } else {
      alert('You must insert a task');
    }
    parent.location.reload();
  }

  const removeTodo = function(e) {
    let id = $(this).parent()[0].id;
    console.log('removing ', id);
    $.post("/delete-todo", {
      id: id
    }, function (response) {
      if (response.success) {
        $('#' + response.id).remove();
      }
      else {
        alert(response.message);
      }
    });
  }

  const saveTodo = function (e) {
    let id = $(this).parent().parent()[0].id;
    let task = $(this).val();
    console.log('task ', task);
    if(!$(this).prev().is(':checked')){
      $.post("/save-todo", {
        id: id,
        task: task
      }, function (response) {
        if (response.success) { 
        }
        else {
          alert(response.message);
        }
      });
    }
  }

  
  const completeTodo = function (e) {
    let id = $(this).parent().parent()[0].id;
    if($(this).is(':checked')){
        console.log(1);
        $.post("/complete-todo", {
              id: id
            }, function (response) {
              console.log(response);
              if (response.success) { 
                $('#' + response.id).addClass('checked');
                console.log("set 1");
                console.log('#' + response.id + ' div.todo');
                $('#' + response.id + '>div.todo').attr("data-complete",1);
              } else {
                alert(response.message);
              }
        });
        
    }else{
       console.log(0);
       $.post("/incomplete-todo", {
          id: id
        }, function (response) {
          console.log(response)
          if (response.success) { 
            $('#' + response.id).removeClass('checked');
            console.log("set 0");
            console.log('#' + response.id + ' div.todo');
             $('#' + response.id + '>div.todo').attr("data-complete",0);
          } else {
            alert(response.message);
          }
        });
    }
}


  $('#todos_container').on('click', '.remove', removeTodo);

  $('#todos_container').on('click', '.checkbox', completeTodo);

  $('#todos_container').on('blur', '.textbox', saveTodo);

  $('#btn').on('click', createTodo);

  $('#todo_input').on('keyup', function (e) {
    if(e.keyCode === 13){
      createTodo();
    }
  });
});