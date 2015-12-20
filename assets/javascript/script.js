// Initial todos. For now, hard code this, should get this state from persistent storage later.
var todos = [
  {
    id: 1,
    text: 'learn javascript',
    complete: false
  },
  {
    id: 2,
    text: 'eat pizza',
    complete: true
  }
];


if (getFromLocalStorage("todos-list") !== null)
{
  var todos = getFromLocalStorage("todos-list");  
}

// Increment global ID so they are unique.
var id = todos.length;
function incrementId() {
  id = todos.length; //need to re-set it here, in case there are deletions
  id++;
  return id;
}

function renderTodos() {
  $('.todos').html('');

  // if(todos.length === 0) {
  //   return;
  // }

  for (var i = 0; i < todos.length; i++) {
    var todo = todos[i];
    var checked = todo.complete ? 'checked' : ''
    var completedClass="";
    if(todo.complete) {
      completedClass="completed";
    }
    $('.todos').append("<li class='todo' data-id=" + todo.id + "><label class='"+completedClass+"'><input class='toggle-todo' type='checkbox' " + checked + "/> " + todo.text + "</label><span class='deleteMe'> [x]</span></li>");
    }

    addToLocalStorage(todos);
    
    countTodos();
    countStatus();

  }

  function countTodos() {
    var count=todos.length;
    $('.countTotal').text("Total: "+count);
  }

  function countStatus() {
    var countComplete=0;
    var countIncomplete=0;
    for(var i=0; i <todos.length; i++) {
      var todo=todos[i];
      if (todo.complete) {
        countComplete++;
      } else {
        countIncomplete++;
      }
    }
    $('.countComplete').text("Complete: "+countComplete);
    $('.countIncomplete').text("Incomplete: "+countIncomplete);

  }

function findById(id) {
  var todo;

  for(var i = 0; i < todos.length; i++) {
    if (todos[i].id === Number(id)) {
      todo = todos[i];
    }
  }

  return todo;
}

function findArrayPositionByID(id) {
  var position;

  for(var i=0; i< todos.length; i++) {
    if (todos[i].id === Number(id)) {
      position = i;
      return position;
    }
  }
}

function addToLocalStorage(myArray) {
  // localStorage.setItem("todos-list", myArray);
  localStorage["todos-list"] = JSON.stringify(todos); //local storage only allows strings and numbers - thise turns an array, into a string
  //got the idea from http://stackoverflow.com/questions/3357553/how-to-store-an-array-in-localstorage
}

function getFromLocalStorage(key) {
  var myArray = JSON.parse(localStorage["todos-list"]); //this takes the string that is in local storage, and turns it back into the array
  //got the idea from http://stackoverflow.com/questions/3357553/how-to-store-an-array-in-localstorage
  return myArray;
}

$(document).ready(function() {
  // Initialize with any existing todos.
  renderTodos();

  // Bind to input update to mark todo as complete.
  $(document).on('change', '.toggle-todo', function(event) {
    var id = $(event.target).parent().parent().data('id');
    var todo = findById(id);
    todo.complete = event.target.checked;

    renderTodos();
  });

  // Bind to new todo form submission to create new todos.
  $(document).on('click', '.add-todo', function(event) {
    event.preventDefault();
    var text = $('.todo-text').val();
    if (text.length>0) {

      var newTodo = {
        id: incrementId(),
        text: text,
        complete: false
      };

    todos.push(newTodo);

    renderTodos();
    
    } else {
      $('.alert').text("You entered a blank todo!");
    }

    $('.todo-text').val("");

  });

  $(document).on('click', '.clear-completed', function(event) {
    event.preventDefault();
   for(var i=0; i< todos.length; i++) {
      if (todos[i].complete === true) {
        todos.splice(i,1);
      }
    }   
    renderTodos();
  });


  $(document).on('click', '.deleteMe', function(event) {
    var dataID = $(event.target).parent().data('id');
    
    todos.splice(findArrayPositionByID(dataID),1);
    renderTodos();
  });
    

});
