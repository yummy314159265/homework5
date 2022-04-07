const currentDayEl = $('#currentDay');
const containerEl = $('.container');
const startTime = 9; //9am
const endTime = 18; //6pm

let savedEvents = [];

const getCurrentDay = () => moment().format('MMM Do, YYYY');

const displayCurrentDay = () => currentDayEl.text(getCurrentDay());

const createHourEl = (time) => $(`<div class="col-1 hour" id=${time}-hour>${time}</div>`);

const createTextAreaEl = (time) => {
    let timeNow = parseInt(moment().format('HH'));
    let intTime = parseInt(moment(time, 'hh a').format('HH'));
    let cls = '';

    if (timeNow > intTime) {
        cls = 'past';
    } else if (timeNow === intTime) {
        cls = 'present';
    } else if (timeNow < intTime) {
        cls = 'future';
    }

    return $(`<textarea class="col-10 hour ${cls}" id=${time}-text-area>`);
}

const createSaveButton = (time) => $(`<button class="col-1 saveBtn material-icons" id=${time}-save-btn>save</button>`);

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
        timeBlockEl.append(createSaveButton(hour));
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

const deleteEvents = (id) => {

    for (let i = 0; i < savedEvents.length; i++) {
        if (id === savedEvents[i].id) {
            savedEvents.splice(i, 1);
            console.log(savedEvents)
        }
    }

    setSavedEvents();
}

const setSavedEvents = () => localStorage.setItem('savedEvents', JSON.stringify(savedEvents));

const getSavedEvents = () => {
    
    if (!JSON.parse(localStorage.getItem('savedEvents'))) {
        return;
    }
    
    savedEvents = JSON.parse(localStorage.getItem('savedEvents'));
}

const saveNewEvent = (event) => {
    event.preventDefault();
    target = $(event.target);

    let newEvent = {
        id: target.siblings('textarea').attr('id'),
        text: target.siblings('textarea').val()
    }

    if (!newEvent.text) {
        if (checkForDuplicateIds(newEvent.id)) {
            if(!confirm("Delete event?")) {
                return;
            } else {
                deleteEvents(newEvent.id);
                return;
            }
        }
    } else if (checkForDuplicateIds(newEvent.id)) {
        if (confirm('Overwrite previous event?')) {
            deleteEvents(newEvent.id);
        } else {
            return;
        }
    } else if (!confirm('Save event?')) {
        return;
    }

    savedEvents.push(newEvent);
    setSavedEvents();
}

const init = () => {
    // other stuff here
    getSavedEvents();
    displayCurrentDay();
    displayTimeBlocks();
}

containerEl.on('click', ".saveBtn", saveNewEvent);
init();