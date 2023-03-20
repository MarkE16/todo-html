const todos = document.getElementById("todos");
const all = todos.getElementsByTagName("li");
const input = document.getElementById("in");
const btn = document.getElementById("btn");
const clearBtn = document.getElementById("clearbtn");
const counter = document.getElementById("counter");

/* Event Listeners */
input.addEventListener("keypress", function(event) {
  updateTodo(event);
});

input.addEventListener("input", function(event) {
  updateTodo(event);
});

function objectMap(obj) {
  return Object.keys(obj).map(key => {
    return {
      ...obj[key],
      id: key
    };
  });
}

window.onload = function() {
  const items = JSON.parse(localStorage.getItem("todos"));
  const mappedItems = objectMap(items);
  mappedItems.forEach(el => {
    addTodo(el);
  });
}

/**
 *
 */



/**
 * This function is primarily used to call array-like methods on array-like objects like
 * `HTMLCollection` and `NodeList` where they do not have these methods.
 * @param {string} method - The method to call on the array-like object.
 * @param {any[]} arr - The array-like object.
 * @param {function(any): any | null} callback - The callback function to pass to the method.
 * @returns {any[]} The new array with the method applied.
 */
function arrayMethod(method, arr, callback) {
  /*
    Since we're working with HTMLCollection, we need to call
    `Array.prototype.filter.call()` to use the filter method, because
    if we try to use the normal `.filter()` method, it will throw an error.
   */
  switch (method) {
    case "filter":
      return Array.prototype.filter.call(arr, callback);
    case "map":
      return Array.prototype.map.call(arr, callback);
    case "find":
      return Array.prototype.find.call(arr, callback);
    default:
      return arr;
  }
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
    const complete = arrayMethod("filter", all, el => {
      return el.children[0].children[0].checked;
    }).length;
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
  const items = arrayMethod("map", all, el => {
    return {
      text: el.children[1].textContent,
      checked: el.children[0].children[0].checked
    };
  });
  localStorage.setItem("todos", JSON.stringify(items));
}

/**
 * Like the name suggests, this function inserts a node after another node.
 * @param {Node} newNode - The HTML node to insert.
 * @param {Node} referenceNode - The HTML node to insert the new node after.
 * @returns {void}
 */
function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
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
  const checkboxSpan = document.createElement("span");
  const lbl = document.createElement("label");
  const textSpan = document.createElement("label");
  const editInput = document.createElement("input");
  let isEditing = false;

  // Edit attributes for the nodes.
  if (objVal) {
    textSpan.textContent = objVal.text;
    checkbox.checked = objVal.checked;
    editInput.value = objVal.text;
    if (checkbox.checked) {
      lbl.style.textDecoration = "line-through";
    }
  } else {
    textSpan.textContent = input.value;
    editInput.value = input.value;
  }
  // Not the best way to create a unique ID, but it works for the time being.
  const randomID = Math.floor(Math.random() * new Date().getTime());
  textSpan.htmlFor = "todo-" + randomID;
  lbl.htmlFor = "todo-" + randomID;
  lbl.tabIndex = 0;
  checkbox.id = "todo-" + randomID;
  currTodo.id = "" + randomID;
  delBtn.textContent = "Delete";
  delBtn.style.display = "none";
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.display = "none";
  editBtn.textContent = "Edit";
  editInput.type = "text";
  checkbox.type = "checkbox";
  editBtn.className = "action-btn";
  delBtn.className = "action-btn del";
  cancelBtn.className = "action-btn cancel";
  editInput.className = "edit-input";
  editInput.placeholder = "Enter Todo";
  currTodo.className = "todo";
  checkboxSpan.className = "checkbox";
  lbl.className = "checkbox-container";

  // `onclick` events for buttons & inputs
  delBtn.onclick = function() {
    if ((!checkbox.checked && window.confirm(`'${textSpan.textContent}' is not complete. Delete anyway?`)) || checkbox.checked) {
      const selected = arrayMethod("find", todos.children, el => el.id === currTodo.id);
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
      hide(textSpan);
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
      textSpan.textContent = editInput.value;
      editBtn.textContent = "Edit";
      hide(editInput);
      show(textSpan);
      isEditing = false;
      delBtn.style.display = "none";
      cancelBtn.style.display = "none";
      save();
    }
  }

  checkbox.onclick = function() {
    const selected = arrayMethod("find", todos.children, el => el.id === currTodo.id).children[1];
    if (checkbox.checked) {
      selected.style.textDecoration = "line-through";
    } else {
      selected.style.textDecoration = "none";
    }
    getCompleted();
    save();
  }

  editInput.addEventListener("keypress", function(e) {
    if (e.code === "Enter") {
      editBtn.click();
    }
  })

  cancelBtn.onclick = function() {
    hide(editInput);
    show(textSpan);
    editBtn.textContent = "Edit";
    isEditing = false;
    editInput.value = textSpan.textContent;
    delBtn.style.display = "none";
    cancelBtn.style.display = "none";
  }

  // Adding nodes to the DOM and small changes to other nodes.
  fragment
    .appendChild(currTodo)
    .appendChild(lbl)
    .appendChild(checkbox)
    .after(checkboxSpan)
  // insertAfter(textSpan, checkboxSpan);
  currTodo.appendChild(textSpan);
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