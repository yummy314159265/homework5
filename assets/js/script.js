const currentDayEl = $('#currentDay');
const containerEl = $('.container');
const modalLabelEl = $('#ModalLabel');
const modalButtonEl = $('#s-d-btn');
const modalEl = $('#Modal');
const feedbackEl = $('#feedback');
const startTime = 9; 
const endTime = 18; 

let savedEvents = [];
let textAreaValue = {
    id: '',
    text: ''
};

const getCurrentDay = () => moment().format('MMM Do, YYYY');

const displayCurrentDay = () => {
    currentDayEl.text(getCurrentDay());
    console.log('updating day...', moment().format('MMMM Do YYYY, h:mm:ss a'));
}

const createHourEl = (time) => $(`<div class="col-1 hour" id=${time}-hour>${time}</div>`);

const setTimeClass = (time) => {
    let timeNow = parseInt(moment().format('HH'));
    let cls = ''
    
    if (timeNow > time) {
        cls = 'past';
    } else if (timeNow === time) {
        cls = 'present';
    } else if (timeNow < time) {
        cls = 'future';
    }

    return cls;
}

const createTextAreaEl = (time) => {
    let timeBlock = parseInt(moment(time, 'hh a').format('HH'));
    let cls = setTimeClass(timeBlock);

    return $(`<textarea class="col-10 hour ${cls}" id=${time}-text-area>`);
}

const createSaveButton = (time) => $(`<button class="saveBtn material-icons h-50" type="button" data-bs-toggle="modal" data-bs-target="#Modal" id=${time}-save-btn>save</button>`);

const createDelButton = (time) => $(`<button class="deleteBtn material-icons h-50" type="button" data-bs-toggle="modal" data-bs-target="#Modal" id=${time}-del-btn>delete</button>`);

const createButtonDivEl = (time) => {
    let buttonDivEl = $(`<div class="col-1 buttonDiv" id=${time}-button-div>`);
    buttonDivEl.append(createSaveButton(time));
    buttonDivEl.append(createDelButton(time));
    return buttonDivEl;
}

const populateTextArea = (id) => {
    let textArea = $(`#${id}`);

    for (let savedEvent of savedEvents) {
        if (savedEvent.id === id) {
            textArea.val(savedEvent.text);
        }
    }    
}

const displayTimeBlocks = () => {
    
    for (let i = startTime; i < endTime; i++) {
        let hour = `${i}am`;

        if (hour === 0) {
            hour = `12am`
        } if (i === 12) {
            hour = `12pm`
        } else if (i > 12) {
            hour = `${i-12}pm`;
        }

        let timeBlockEl = $(`<div class="row time-block" id=${hour}-time-block>`);
        timeBlockEl.append(createHourEl(hour));
        timeBlockEl.append(createTextAreaEl(hour));
        timeBlockEl.append(createButtonDivEl(hour));
        containerEl.append(timeBlockEl);
        populateTextArea(`${hour}-text-area`);
    }
}

const checkForDuplicateIds = (id) => {
    for(let i = 0; i < savedEvents.length; i++) {
        if (id === savedEvents[i].id) {
            return true;
        }
    }
}

const removeEvents = (id) => {
    for (let i = 0; i < savedEvents.length; i++) {
        if (id === savedEvents[i].id) {
            savedEvents.splice(i, 1);
        }
    }
}

const deleteEvent = (eventForDeletion) => {
    if (checkForDuplicateIds(eventForDeletion.id)) {
        removeEvents(eventForDeletion.id);
        $(`#${eventForDeletion.id}`).val('');
        
        let feedbackText = 'Deleting event...';
        displayFeedbackEl(feedbackText);

        setSavedEvents();
    } 
}

const setSavedEvents = () => localStorage.setItem('savedEvents', JSON.stringify(savedEvents));

const getSavedEvents = () => {
    
    if (!JSON.parse(localStorage.getItem('savedEvents'))) {
        return;
    }
    
    savedEvents = JSON.parse(localStorage.getItem('savedEvents'));
}

const saveNewEvent = (newEvent) => {

    if (checkForDuplicateIds(newEvent.id)) {
        removeEvents(newEvent.id);
    } 

    let feedbackText = 'Saving event...';
    displayFeedbackEl(feedbackText);

    savedEvents.push(newEvent);
    setSavedEvents();
}

const getTextAreaValue = (buttonPressed) => {
    return {
        id: buttonPressed.parent().siblings('textarea').attr('id'),
        text: buttonPressed.parent().siblings('textarea').val()
    }
}

const displaySaveModal = (event) => {
    event.preventDefault();
    let target = $(event.target);

    textAreaValue = getTextAreaValue(target);
    
    if (textAreaValue.text === '') {
        modalButtonEl.attr('data-function', 'delete');
    } else {
        modalButtonEl.attr('data-function', 'save');
    }

    modalLabelEl.text('Save event?');
}

const displayDeleteModal = (event) => {
    event.preventDefault();
    let target = $(event.target);

    textAreaValue = getTextAreaValue(target);

    modalLabelEl.text('Delete event?');
    modalButtonEl.attr('data-function', 'delete');
}

const confirmSaveOrDelete = (event) => {
    event.preventDefault();
    let target = $(event.target);


    if (target.attr('data-function') === 'delete') {
        deleteEvent(textAreaValue);
    } else if (target.attr('data-function') === 'save') {
        saveNewEvent(textAreaValue);
    }
}

const displayFeedbackEl = (feedback) => {

    feedbackEl.text(feedback)

    setTimeout(() => {
        feedbackEl.css('top', '10px');
    }, 10)

    setTimeout(() => {
        feedbackEl.css('top', '-35px');
    }, 3000)
}

const updateTextAreas = () => {
    let repeater = setInterval(() => {

        textAreas = $('textarea')

        for (let textArea of textAreas) {
            let timeBlock = parseInt($(textArea).attr('id').split('-')[0]);
            let cls = setTimeClass(timeBlock);
            if (!$(textArea).hasClass(cls)) {
                textArea.removeClass(['past', 'present', 'future']);
                textArea.addClass(cls);
            }
        }

        console.log('updating time block...', moment().format('MMMM Do YYYY, h:mm:ss a'));

    }, 5000);
}

const updateDate = () => setInterval(displayCurrentDay, 3600000);


const init = () => {
    getSavedEvents();
    displayCurrentDay();
    displayTimeBlocks();
    updateTextAreas();
    updateDate();
}

containerEl.on('click', ".deleteBtn", displayDeleteModal);
containerEl.on('click', ".saveBtn", displaySaveModal);
modalButtonEl.on('click', confirmSaveOrDelete)

init();