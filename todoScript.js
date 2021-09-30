const myList = document.getElementById("list");
const doneList = document.getElementById("donelist");
const noitem = document.getElementById("noitem");
const doneitem = document.getElementById("doneitem")
const itemContent = document.getElementById("itemname");
let count = todoCount = todoneCount = countDone = x = y = 0;
let todo = [];
let todone = [];
let temp;

const TodoHelper = {
    splicer(array, selectItem) {
        for (let i = 0; i < array.length; i++) {
            if (selectItem == array[i])
                array.splice(i, 1);
        }
    },

    appropriator(array, selectItem, value) {
        for (let i = 0; i < array.length; i++) {
            if (selectItem == array[i]) {
                array[i] = value;
            }
        }
    },
}

const Todo = {
    save_count() {
        let localCount = count;
        let localCountDone = countDone;
        localStorage.setItem("count", localCount);
        localStorage.setItem("countDone", localCountDone);
    },

    get_count() {
        let localCount = localStorage.getItem("count");
        let localCountDone = localStorage.getItem("countDone");
        count = localCount;
        countDone = localCountDone;
    },

    save_list() {
        let str = JSON.stringify(todo);
        let str1 = JSON.stringify(todone);
        localStorage.setItem("todo", str);
        localStorage.setItem("todone", str1);

    },

    get_list() {
        let str = localStorage.getItem("todo");
        let str1 = localStorage.getItem("todone");

        todo = JSON.parse(str);
        todone = JSON.parse(str1);
        if (!todo) {
            todo = [];
        }
        if (!todone) {
            todone = [];
        }
    },

    all_save() {
        Todo.save_list();
        Todo.save_count();
        this.display_title();
    },

    remove_list(id) {
        let root = document.getElementById(id);
        while (root.firstChild) {
            root.removeChild(document.getElementById(id).firstChild);

        }

        if (myList.id == id) {
            todo = [];
            count = 0;
        } else {
            todone = [];
            countDone = 0;
        }
        Todo.all_save()
    },

    additem_whenenter(e) {
        if (e.keyCode === 13 && itemContent.value) {
            additem_todo('new');
        }
    },

    display_title() {
        if (count === 0) {
            noitem.style.display = "block";
        }
        if (count !== 0) {
            noitem.style.display = "none";
        }
        if (countDone === 0) {
            doneitem.style.display = "block";
        }
        if (countDone !== 0) {
            doneitem.style.display = "none";
        }
    }
}


Todo.get_count();
Todo.get_list();

while (todoCount > 0) {
    additem_todo('todo');
    --todoCount;
}

while (todoneCount > 0) {
    additem_todo('todone');
    --todoneCount;
}

function additem_todo(flag) {
    console.log(flag)
    let item = document.createElement("li");
    let span = document.createElement("span");
    let check = document.createElement("input");
    let spanimg = document.createElement("span");
    item.appendChild(check);

    item.appendChild(spanimg);
    item.appendChild(span);

    check.setAttribute('type', 'checkbox');
    check.classList.add("check-item");
    span.classList.add("list-item");
    spanimg.classList.add("glyphicon");
    spanimg.classList.add("glyphicon-remove");


    switch (flag) {
        case "todo": {
            let itemContent = todo[x];
            span.innerHTML = itemContent;
            myList.appendChild(item);
            x++;
            document.getElementById("noitem").style.display = "none";
            break;
        }
        case 'todone': {
            check.checked = true;
            let itemContent = todone[y];
            span.innerHTML = itemContent;
            doneList.appendChild(item);
            y++;
            document.getElementById("doneitem").style.display = "none";
            break;
        }
        default: {
            todo.push(itemContent.value);
            Todo.save_list();
            span.innerHTML = itemContent.value;
            myList.appendChild(item);
            itemContent.value = "";
            count++;
            Todo.save_count();
            Todo.display_title();
            break;
        }
    }

    check.addEventListener("change", function () {

        let doneItem = this.parentElement;
        temp = doneItem.childNodes[2].innerHTML;
        if (myList.id == this.parentElement.parentElement.id) {
            myList.removeChild(doneItem);
            span.innerHTML = temp;
            doneList.appendChild(item);
            count--;
            countDone++;
            todone.push(temp);
            TodoHelper.splicer(todo, temp)

        } else {
            doneList.removeChild(doneItem);
            span.innerHTML = temp;
            myList.appendChild(item);
            count++;
            countDone--;
            todo.push(temp);
            TodoHelper.splicer(todone, temp)

        }
        Todo.all_save()
    })

    spanimg.addEventListener("click", function () {

        let removeItem = this.parentElement;
        temp = removeItem.childNodes[2].innerHTML;

        if (myList.id == this.parentElement.parentElement.id) {
            myList.removeChild(removeItem);
            count--;
            TodoHelper.splicer(todo, temp)
        } else {
            doneList.removeChild(removeItem);
            countDone--;
            TodoHelper.splicer(todone, temp)
        }
        Todo.all_save()

    });


    const myFunc = function () {

        let data = this.innerHTML;
        let parent = this.parentElement;
        span.innerHTML = "";
        let form = document.createElement("span");
        let text = document.createElement("input");
        let ok = document.createElement("button");
        let cancel = document.createElement("button");


        text.value = data;
        ok.innerHTML = "OK";
        cancel.innerHTML = "Cancel";

        console.log(data)

        if (typeof data === 'string') {
            form.appendChild(text);
            form.appendChild(ok);
            form.appendChild(cancel);
            span.appendChild(form);
        }


        ok.addEventListener("click", function () {
            span.removeChild(form);
            TodoHelper.appropriator(todo, data, text.value)
            TodoHelper.appropriator(todone, data, text.value)
            Todo.save_list();
            data = text.value;
            span.innerHTML = data;
            parent.appendChild(span);
            span.addEventListener("dblclick", myFunc)
        });

        cancel.addEventListener("click", function () {
            span.removeChild(form);
            span.innerHTML = data;
            parent.appendChild(span);
            span.addEventListener("dblclick", myFunc)
        });
        span.removeEventListener("dblclick", myFunc);
    }
    span.addEventListener("dblclick", myFunc)
}





