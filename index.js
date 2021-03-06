$('.save-btn').on('click', createCard);
$('form').on('keyup', saveBtn);
$('.bottom-box').on('click', upVoting);
$('.bottom-box').on('click', downVoting);
$('.bottom-box').on('click', deleteCard);
$('#search-input').on('keyup', searchBar);
$('.bottom-box').on('keyup', makeEditsTitle);
$('.bottom-box').on('keyup', makeEditsBody);
$('.bottom-box').on('click', completedTask);
$('.show-completed').on('click', showCompleted);

callTasks();

 function TaskObject(title, body) {
    this.id = $.now();
    this.title = title;
    this.body = body;
    this.importance = 2;
    this.completed = false;
 }

 function createTask(title, body) {
    var taskObject = new TaskObject(title, body);
    localStoreCard(taskObject.id, taskObject);
    return taskObject;
 }

 function localStoreCard(id, cardData) {
    localStorage.setItem(id, JSON.stringify(cardData));
 }

function callTasks() {
    for (var i = 0; i < localStorage.length; i++) {
    var cardData = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(cardData.completed === false){
        $( ".bottom-box" ).prepend(newCard(cardData.id, cardData.title, cardData.body, cardData.importance));
    }
    }
}

function createCard(event) {
    event.preventDefault();
    var title = $('#title-input').val();
    var body = $('#body-input').val();
    var newTask = createTask(title, body);
    $( ".bottom-box" ).prepend(newCard(newTask.id, title, body, newTask.importance));
    clearInputs();
}

function newCard(id , title , body, importance, highlight) {
    var importanceOptions = ['none','low','normal','high','critical'];
    var className = 'card-container'
    if (highlight) {
        className += ' completed-task';
    }
    return `<div id="${id}" class="${className}"> 
            <h2 class="title-of-card" contenteditable="true">${title}</h2>
            <button class="delete-button card-Btn"></button>
            <p class="body-of-card" contenteditable="true">
             ${body}</p>
             <button class="upvote card-Btn"></button> 
             <button class="downvote card-Btn"></button> 
             <p class="importance" data-number="0">importance: ${importanceOptions[importance]}</p>
            <button class="complete-btn">Complete</button>
             </div>`;
}

function saveBtn(e) {
    e.preventDefault();
    if ($(e.target).has('#title-input') || $(e.target).has('#body-input')) {
       checkInputs();
    }
}

function checkInputs() {
    if ($('#title-input').val() === '' || $('#body-input').val() === '') {
        $('.save-btn').attr('disabled', true);
       } else {
        $('.save-btn').attr('disabled', false);
       }
}

function showCompleted(){
    for (var i = 0; i < localStorage.length; i++) {
    var cardData = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if(cardData.completed === true){
        $( ".bottom-box" ).prepend(newCard(cardData.id, cardData.title, cardData.body, cardData.importance, true));
    }
    }
}

function upVoting() {
    if ($(event.target).hasClass('upvote')) {
    var cardObject = JSON.parse(localStorage.getItem($(event.target).parent().prop('id')));
    if ($(event.target).hasClass('upvote') && cardObject.importance < 4) {
       cardObject.importance++; 
    } 
    $( ".bottom-box" ).prepend(newCard(cardObject.id, cardObject.title, cardObject.body, cardObject.importance));
    localStoreCard(cardObject.id, cardObject); 
    $(event.target).parent().remove();  
    }
}

function downVoting(){
    if ($(event.target).hasClass('downvote')) {
    var cardObject = JSON.parse(localStorage.getItem($(event.target).parent().prop('id')));
    if ($(event.target).hasClass('downvote') && cardObject.importance > 0) {
        cardObject.importance--;
    }
    $( ".bottom-box" ).prepend(newCard(cardObject.id, cardObject.title, cardObject.body, cardObject.importance));
    localStoreCard(cardObject.id, cardObject); 
    $(event.target).parent().remove();  
    }
}

function deleteCard(event) {
    if ($(event.target).hasClass('delete-button')) {
    var id = $(event.target).parent().attr('id');
    $(event.target).parents('.card-container').remove()
    localStorage.removeItem(id);
    }
}

function completedTask(event){
    if($(event.target).hasClass('complete-btn')){
    var id = $(event.target).parent().attr('id');
    var parsedId = JSON.parse(localStorage.getItem(id));
    $(event.target).parents('.card-container').addClass('completed-task');
    parsedId.completed = !parsedId.complete;
    localStoreCard(parsedId.id, parsedId);
    }
}

function clearInputs() {
    $('#title-input').val('');
    $('#body-input').val('');
    $('.save-btn').attr('disabled', true);
}

function makeEditsTitle(event) {
    if ($(event.target).hasClass('title-of-card')) {
    var id = $(event.target).parent().attr('id');
    var cardData = JSON.parse(localStorage.getItem(id));
    var changeTitle = $(event.target).text();
    cardData.title = changeTitle;
    localStoreCard(id, cardData);
    }
}

function makeEditsBody(event) {
    if ($(event.target).hasClass('body-of-card')) {
    var id = $(event.target).parent().attr('id');
    var cardData = JSON.parse(localStorage.getItem(id));
    var changeBody = $(event.target).text();
    cardData.body = changeBody;
    localStoreCard(id, cardData);
    }
}

function searchBar() {
 var searchValue = $(this).val().toLowerCase();
 $('.card-container').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1)
 });
}
