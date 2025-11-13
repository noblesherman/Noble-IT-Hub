/*
* InViewSection Class creates an object for all '[data-inview]' elements
*/
class InViewSection {
  constructor(el) {
    this.el = el;
    this.top = this.el.dataset.top || '-100px';
    this.bottom = this.el.dataset.bottom || '-100px';
    this.threshold = this.el.dataset.threshold || 0;
    this.listener = this.el.dataset.listener || false;
    this.setupObserver();
    this.setupCustomEvent();
  }
  // setup a new (async) observer just to watch this instance and start observing this.el
  setupObserver() {
    // setup our observer options (filled with dataset attributes)
    let options = {
      rootMargin: this.top + ' 0px ' + this.bottom + ' 0px',
      threshold: this.threshold
    };

    // create a new observer and start observing
    this.observer = new IntersectionObserver(this.intersectionsChanged, options || {});
    this.observer.observe(this.el);
  }
  // add classes when the observer sees the element in view
  intersectionsChanged(observations) {
    // we're sure the array only has one entry, to set [obs]s
    let [obs] = observations;

    // add new classes on enter
    if ( obs.isIntersecting ) {
      setInViewClasses(obs.target, 'enter');
    }
    // if this section had already entered, add new classes on exit
    else if( obs.target.classList.contains('enter') ) {
      setInViewClasses(obs.target, 'exit');
    }
  }
  setupCustomEvent() {
    // if there is a data-listener create a Custom Event that can be listened to
    // example: give the element a data-listener="abc123" attribute and add an EventListener somewhere like this document.addEventListener('abc123', function (event) { ... });
    if(this.listener) createInViewEvent(this.listener);
  }
}



/*
* Add the correct classes when an element is in view
* This function is loosely based on https://gomakethings.com/detecting-scroll-distances-with-vanilla-js/#detecting-scrolling-distances
* But a major difference is the removal of the 'scroll' listener, since this function is only fired when called for
*/
let setInViewClasses = function(elem, state) {
  setScrollDirection(elem);

  // set a timeout to run after scrolling ends
  isAddingInViewClasses = setTimeout(function() {
    // remove and add state and scroll direction
    if(elem) {
      elem.classList.remove('enter', 'exit');
      elem.classList.add(state);
    }

    // dispatch the custom event (if it's there) so the EventListener knows what's up
    if(elem.dataset.listener) dispatchInViewEvent(elem);

    return;
  }, 66);
};


let isGettingScrollDirection;

let setScrollDirection = function(elem) {
  // set starting position
  let start = window.pageYOffset;

  // clear our global timeout throughout the scroll
  window.clearTimeout(isGettingScrollDirection);

  // set a timeout to run after scrolling ends
  isAddingInViewClasses = setTimeout(function() {
    // calculate distance
    let end = window.pageYOffset;
    // let distance: end - start; // we don't really need this at the moment, but you never know

    // check if the direction class should be up or down
    let dir = 'down';
    if( (end - start) < 0) dir = 'up';

    elem.classList.remove('down', 'up');
    elem.classList.add(dir);
    return;
  }, 66); // 66 is refreshrate of browser
}



/*
* We want to be able to just define a data-listener in the html to get a callback to optionally do even more with the InViewSections
* So here we're creating a global array with CustomEvents
*/
let inViewEvents = [];
function createInViewEvent(listener) {
  // check if this listeners and custom event has already been created, we only need one of each
  let exists = inViewEvents.find(function (item) {
    return item.name === listener;
  });
  if(exists !== undefined) return;

  // create a named custom event
  let event = new CustomEvent(listener, {
    bubbles: true,
  });

  // add the new custom event to the global array
  inViewEvents.push({name: listener, event: event});
}



/*
* Trigger and dispatch the callback custom event
*/
function dispatchInViewEvent(elem) {
  let found = inViewEvents.find(function (item) {
    return item.name === elem.dataset.listener;
  });
  if(found === undefined) return;

  elem.dispatchEvent(found.event);
}




/*
* Find all data-inview sections on load and init them
*/
let inviewSections = [];

window.addEventListener('load', () => {
  var inviewEls = document.querySelectorAll('[data-inview]');

  inviewEls.forEach(function (el, index) {
    let section = new InViewSection(el);
    // Push this new section in the global array of inviewSections objects
    inviewSections.push(section);
  });
}, false);
