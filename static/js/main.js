// FRONT-END (CLIENT) JAVASCRIPT HERE

let form_template;

async function addEvent(evt) {
    evt.preventDefault()

    let event = {
        name: document.getElementById('name-new').value,
        time: document.getElementById('date-new').value + "T" + document.getElementById(`time-new`).value + ":00.000Z",
        travel_hrs: document.getElementById('hours-new').value,
        travel_mins: document.getElementById('minutes-new').value,
        user: "66e8631aab3beb056305b80e"
    }

    const response = await fetch('/addEvent', {
        method: 'POST',
        body: JSON.stringify(event),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let res = await response.text();
    res = JSON.parse(res);
    event._id = res._id;
    event.depart_time = res.depart_time;
    console.log("adding");

    document.getElementById('forms').removeChild(document.getElementById('form-new'));
    createForm(event);
    document.getElementById('add-event').disabled = false;
}

async function updateEvent(evt) {
    evt.preventDefault();

    evt.target.disabled = true;
    const event_id = evt.target.id.match(/edit-([0-9a-f]+)/)[1];

    let event = {
        _id: event_id,
        name: document.getElementById(`name-${event_id}`).value,
        time: document.getElementById(`date-${event_id}`).value + "T" + document.getElementById(`time-${event_id}`).value + ":00.000Z",
        travel_hrs: document.getElementById(`hours-${event_id}`).value,
        travel_mins: document.getElementById(`minutes-${event_id}`).value,
        user: "66e8631aab3beb056305b80e"
    }

    const response = await fetch('/updateEvent', {
        method: 'PUT',
        body: JSON.stringify(event),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const text = await response.text();
    document.getElementById(`depart-time-${event_id}`).value = JSON.parse(text).depart_time;

    document.getElementById(`name-${event_id}`).readOnly = true;
    document.getElementById(`date-${event_id}`).readOnly = true;
    document.getElementById(`time-${event_id}`).readOnly = true;
    document.getElementById(`hours-${event_id}`).readOnly = true;
    document.getElementById(`minutes-${event_id}`).readOnly = true;
    evt.target.innerText = "Edit";
    evt.target.removeEventListener('click', updateEvent);
    evt.target.addEventListener('click', editEvent);
    evt.target.disabled = false;
}

async function deleteEvent(evt) {
    evt.preventDefault();

    const event_id = evt.target.id.match(/del-([0-9a-f]+)/)[1];
    document.getElementById('forms').removeChild(document.getElementById(`form-${event_id}`));

    await fetch("/deleteEvent",{
        method: 'DELETE',
        body: JSON.stringify({_id: event_id}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    document.getElementById('add-event').disabled = false;
}

function cancelEvent(evt) {
    evt.preventDefault();
    document.getElementById('forms').removeChild(document.getElementById('form-new'))
    document.getElementById('add-event').disabled = false;
}

function editEvent(evt) {
    evt.preventDefault();
    let event_id = evt.target.id.match(/edit-([0-9a-f]+)/)[1];
    document.getElementById(`name-${event_id}`).readOnly = false;
    document.getElementById(`date-${event_id}`).readOnly = false;
    document.getElementById(`time-${event_id}`).readOnly = false;
    document.getElementById(`hours-${event_id}`).readOnly = false;
    document.getElementById(`minutes-${event_id}`).readOnly = false;
    document.getElementById(`depart-time-${event_id}`).value = null;
    evt.target.innerText = "Update";
    evt.target.removeEventListener('click', editEvent);
    evt.target.addEventListener('click', updateEvent);
}

function createField(form, label, id, type, value, opt) {
    const span = document.createElement('span');
    const lbl = document.createElement('label');
    lbl.for = id;
    lbl.innerText = label;
    span.appendChild(lbl);
    const input = document.createElement('input');
    input.id = id;
    input.type = type;
    input.required = true;
    if (value === undefined) {
        input.readOnly = false;
    } else {
        input.readOnly = true;
        input.value = value;
    }
    if (opt !== undefined) {
        if (opt.placeholder !== undefined)
            input.placeholder = opt.placeholder;
        if (opt.readOnly !== undefined) {
            input.readOnly = opt.readOnly;
        }
    }
    span.appendChild(input);
    form.appendChild(span);
}

function createDurationField(form, label, id, hrs, mins) {
    const span = document.createElement('span');
    const lbl = document.createElement('label');
    lbl.innerText = label;
    span.appendChild(lbl);
    const hours = document.createElement('input');
    hours.id = `hours-${id}`;
    hours.type = 'number';
    hours.step = "1";
    hours.min = "0";
    const minutes = document.createElement('input');
    minutes.id = `minutes-${id}`;
    minutes.type = 'number';
    minutes.max = "59";
    minutes.step = "1";
    minutes.min = "0";
    hours.required = true;
    minutes.required = true;
    if (hrs === undefined) {
        hours.readOnly = false;
        minutes.readOnly = false;
    } else {
        hours.readOnly = true;
        minutes.readOnly = true;
        hours.value = hrs;
        minutes.value = mins;
    }
    lbl.appendChild(hours);
    lbl.insertAdjacentText('beforeend', "hours");
    lbl.appendChild(minutes);
    lbl.insertAdjacentText('beforeend', "minutes");
    span.appendChild(lbl);
    form.appendChild(span);
}

function createForm(evt) {
    // const update = document.createElement("button");
    // const del = document.createElement("button");
    let date;
    let time;
    let id;
    if (evt === undefined) {
        const form = document.dupdocument.getElementById("form-template");
        id = 'new'
        evt = {};
        date = undefined;
        time = undefined;
        update.innerText = "Submit";
        del.innerText = "Cancel";
        update.addEventListener('click', addEvent);
        del.addEventListener('click', cancelEvent);
        document.getElementById('add-event').disabled = true;
    } else {
        id = evt._id;
        const parsedTime = evt.time.split("T")
        date = parsedTime[0];
        time = parsedTime[1].slice(0, 5);
        update.innerText = "Edit";
        del.innerText = "Delete";
        update.addEventListener('click', editEvent);
        del.addEventListener('click', deleteEvent);
    }
    update.id = `edit-${id}`;
    del.id = `del-${id}`;

    const form = document.createElement('form');
    form.id = `form-${id}`;

    createField(form, "Name: ", `name-${id}`, 'text', evt.name, {placeholder: "Event Name"});
    createField(form, "Date: ", `date-${id}`, 'date', date);
    createField(form, "Time: ", `time-${id}`, 'time', time);
    createDurationField(form, "Travel Duration:", id, evt.travel_hrs, evt.travel_mins);
    createField(form, "Departure Time: ", `depart-time-${id}`, 'time', evt.depart_time, {readOnly: true});

    const span = document.createElement('span');
    span.style.display = "flex";
    span.style.justifyContent = "space-between";
    span.appendChild(update);
    span.appendChild(del);
    form.appendChild(span);
    document.getElementById('forms').appendChild(form);
}

async function fetchEvents() {
    form_template = document.getElementById("form-template");
    const response = await fetch('/getEvents', {
        method: 'GET'
    });
    console.log("Got response");
    const text = await response.text();
    console.log(text);
    const events = JSON.parse(text);

    for (let evt of events) {
        createForm(evt);
    }
}

window.addEventListener('load', fetchEvents);
window.addEventListener('load', () => {
    document.getElementById('add-event').addEventListener('click', () => {
        createForm();
    });
})
