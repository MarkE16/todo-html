const todos = document.getElementById("todos");
const all = todos.getElementsByTagName("li");
const input = document.getElementById("in");
const btn = document.getElementById("btn");
const clearBtn = document.getElementById("clearbtn");
const counter = document.getElementById("counter");


function objectMap(obj) {
  return Object.keys(obj).map(key => {
    return {
      text: obj[key].text,
      checked: obj[key].checked
    }
  })
}

window.onload = function() {
  const items = JSON.parse(localStorage.getItem("todos"));
  const mappedItems = objectMap(items);
  mappedItems.forEach(el => {
    addTodo(el);
  });
}

function updateTodo(e) {
  /*
  Trim the current input state value of all whitespace, and check if the length is 0.
  If 0 (or empty), disable the button. Otherwise, enable it, because you have
  something to do!
  */
  if (all.length > 0) {
    enable(clearBtn);
  } else {
    disable(clearBtn);
  }
  if (e.type === "keypress" && e.key === "Enter" && input.value.trim().length > 0) {
    addTodo();
    return;
  }
  if (e.target.value.trim().length === 0) {
    disable(btn);
  } else {
    enable(btn);
  }
}

function disable(el) {
  el.disabled = true;
}

function enable(el) {
  el.disabled = false;
}

function show(el) {
  el.style.display = "block";
}

function hide(el) {
  el.style.display = "none";
}

function getCompleted() {
  if (all.length === 0) {
    counter.textContent = "+ No Todos!";
  } else {
    const complete = [...all].filter(el => el.children[0].checked).length;
    if (complete === all.length) {
      counter.textContent = "+ Hooray! Finished with everything!";
    } else {
      counter.textContent = `+ Completed ${complete} of ${all.length} todos.`;
    }
  }
}

function clearTodos() {
  if (window.confirm("Are you positive you want to clear all todos?")) {
    // Clear all children until there are none left.
    while (todos.firstChild) {
      todos.removeChild(todos.lastChild);
    }
    // Disable the clear button since there are no children left.
    disable(clearBtn);
    getCompleted();
    save();
  }
}

function save() {
  const items = [...all].map(el => {
    return {
      text: el.children[1].textContent,
      checked: el.children[0].checked
    }
  })
  localStorage.setItem("todos", JSON.stringify(items));
}

// Giant block of code !!
function addTodo(objVal=undefined) {
  // Variablees!
  const fragment = document.createDocumentFragment();
  const checkbox = document.createElement("input");
  const currTodo = document.createElement("li"); // Create a list element
  const delBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const cancelBtn = document.createElement("button");
  const lbl = document.createElement("label");
  const editInput = document.createElement("input");
  let isEditing = false;

  // Edit attributes for the nodes.
  if (objVal) {
    lbl.textContent = objVal.text;
    checkbox.checked = objVal.checked;
    editInput.value = objVal.text;
    if (checkbox.checked) {
      lbl.style.textDecoration = "line-through";
    }
  } else {
    lbl.textContent = input.value;
    editInput.value = input.value;
  }
  // Not the best way to create a unique ID, but it works for the time being.
  const randomID = Math.floor(Math.random() * new Date().getTime());
  lbl.htmlFor = "todo-" + randomID;
  checkbox.id = "todo-" + randomID;
  currTodo.id = all.length;
  delBtn.textContent = "Delete";
  delBtn.style.display = "none";
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.display = "none";
  editBtn.textContent = "Edit";
  editInput.type = "text";
  checkbox.type = "checkbox";
  editBtn.className = "action-btn";
  delBtn.className = "action-btn";
  cancelBtn.className = "action-btn";
  editInput.className = "edit-input";
  editInput.placeholder = "Enter Todo";
  currTodo.className = "todo";

  // `onclick` events for buttons & inputs
  delBtn.onclick = function() {
    if ((!checkbox.checked && window.confirm(`'${lbl.textContent}' is not complete. Delete anyway?`)) || checkbox.checked) {
      const selected = [...todos.children].find(el => el.id === currTodo.id);
      todos.removeChild(selected);
      if (all.length === 0) {
        disable(clearBtn);
      }
      getCompleted();
      save();
    }
  }

  editBtn.onclick = function() {
    if (!isEditing) {
      editBtn.textContent = "Finish";
      editBtn.style.opacity = 1;
      hide(lbl);
      show(editInput);
      isEditing = true;
      editInput.focus();
      delBtn.style.display = "block";
      cancelBtn.style.display = "block";
    } else {
      if (editInput.value.trim().length === 0) {
        alert("You must enter a todo or delete it!");
        editInput.focus();
        return;
      }
      lbl.textContent = editInput.value;
      editBtn.textContent = "Edit";
      show(lbl);
      hide(editInput);
      isEditing = false;
      delBtn.style.display = "none";
      cancelBtn.style.display = "none";
      save();
    }
  }

  checkbox.onclick = function() {
    const selected = [...todos.children].find(el => el.id === currTodo.id).children[1];
    if (checkbox.checked) {
      selected.style.textDecoration = "line-through";
    } else {
      selected.style.textDecoration = "none";
    }
    getCompleted();
    save();
  }

  editInput.onkeypress = function(e) {
    if (e.keyCode === 13) {
      editBtn.click();
    }
  }

  cancelBtn.onclick = function() {
    hide(editInput);
    show(lbl);
    editBtn.textContent = "Edit";
    isEditing = false;
    editInput.value = lbl.textContent;
    delBtn.style.display = "none";
    cancelBtn.style.display = "none";
  }

  // Adding nodes to the DOM and small changes to other nodes.
  fragment
    .appendChild(currTodo)
    .appendChild(checkbox)
    .after(lbl)
  currTodo.appendChild(editInput);
  currTodo.appendChild(editBtn);
  currTodo.appendChild(delBtn);
  currTodo.appendChild(cancelBtn);
  todos.appendChild(fragment); // Add the list element to the `<ul>` element
  input.value = ""; // Reset the input state
  input.focus(); // Focus the input element
  disable(btn); // Disable the button again since the input is empty
  getCompleted();
  save();
  if (all.length > 0) {
    enable(clearBtn);
  }
}