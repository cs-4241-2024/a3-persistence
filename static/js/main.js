// FRONT-END (CLIENT) JAVASCRIPT HERE

let form_template;

async function addEvent(evt) {
    evt.preventDefault();

    const date = document.getElementById('date-new').value;
    if (date === '') {
        alert('Please enter valid date');
        return;
    }

    let event = {
        name: document.getElementById('name-new').value,
        time: date + "T" + document.getElementById(`time-new`).value + ":00.000Z",
        travel_hrs: document.getElementById('hours-new').value,
        travel_mins: document.getElementById('minutes-new').value
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
        travel_mins: document.getElementById(`minutes-${event_id}`).value
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
    evt.target.innerText = "Update";
    evt.target.removeEventListener('click', editEvent);
    evt.target.addEventListener('click', updateEvent);
}

function updateField(form, field, id, value) {
    const input = form.getElementById(field);
    const label = form.getElementById(`${field}-label`);
    label.for += id;
    label.id += id;
    input.id += id;
    if (value === undefined) {
        input.readOnly = false;
    } else {
        input.readOnly = true;
        input.value = value;
    }
}

function updateDurationField(frag, id, hrs, mins) {
    const label = frag.getElementById('duration-label');
    label.for += id;
    label.id += id;
    const hours = frag.getElementById('hours');
    hours.id += id;
    const minutes = frag.getElementById('minutes');
    minutes.id += id;
    if (hrs === undefined) {
        hours.readOnly = false;
        minutes.readOnly = false;
    } else {
        hours.readOnly = true;
        minutes.readOnly = true;
        hours.value = hrs;
        minutes.value = mins;
    }
}

function createForm(evt) {
    let frag = document.getElementById("form-template").content.cloneNode(true);
    const form = frag.getElementById('form');
    const update = frag.getElementById("edit");
    const del = frag.getElementById("del");
    let date;
    let time;
    let id;
    if (evt === undefined) {
        id = '-new'
        evt = {};
        date = undefined;
        time = undefined;
        update.innerText = "Submit";
        del.innerText = "Cancel";
        update.addEventListener('click', addEvent);
        del.addEventListener('click', cancelEvent);
        document.getElementById('add-event').disabled = true;
    } else {
        id = "-" + evt._id;
        const parsedTime = evt.time.split("T")
        date = parsedTime[0];
        time = parsedTime[1].slice(0, 5);
        update.innerText = "Edit";
        del.innerText = "Delete";
        update.addEventListener('click', editEvent);
        del.addEventListener('click', deleteEvent);
    }
    form.id = `form${id}`;
    update.id += id;
    del.id += id;

    updateField(frag,'name', id, evt.name);
    updateField(frag,'date', id, date);
    updateField(frag,'time', id, time);
    updateDurationField(frag, id, evt.travel_hrs, evt.travel_mins);
    updateField(frag, 'depart-time', id, evt.depart_time);

    document.getElementById('forms').appendChild(frag);
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

window.addEventListener('DOMContentLoaded', async () => {
    await fetchEvents();
    document.getElementById('add-event').addEventListener('click', (evt) => {
        evt.preventDefault();
        createForm();
    });
    document.getElementById('logout').addEventListener('click', async (evt) => {
        evt.preventDefault();
        await fetch('/logout', {
            method: 'POST'
        });
        window.location.href = '/';
    });
    if (document.cookie.includes('new')) {
        alert("Account created");
    }
});
