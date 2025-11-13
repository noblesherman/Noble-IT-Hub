/*
* Custom Simple Analytics events
* Give each button or clickable element a data-se-event="EVENTNAME" attribute
*/
document.addEventListener('click', function (event) {
    // If the event target doesn't match bail
    if (!event.target.closest('[data-sa-event]')) return;
    let target = event.target.closest('[data-sa-event]');
    // sample_event name just in case it is ommitted in the data-attribute
    let eventName = 'sample_event';

    if (target.getAttribute('data-sa-event') != '') eventName = target.getAttribute('data-sa-event');

    // register the event to Simple Analytics and send the created_at meta data date or even more custom meta data
    if (window.sa_loaded) {
        // format the current date and time
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date + ' ' + time;


        // add the external url as meta data if data-sa-external is available
        if (target.hasAttribute('data-sa-external')) {
            sa_event(eventName, { created_at: dateTime, external_url: target.getAttribute('href') });
        }
        else {
            sa_event(eventName, { created_at: dateTime });
        }
    }
}, false);