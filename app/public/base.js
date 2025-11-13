/**
*
* Core js with shared functions.
*
*/


/**
* Debounce functions for better performance
* (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
* @param  {Function} fn The function to debounce
*/
var debounce = function (fn) {
  // Setup a timer
  var timeout;

  // Return a function to run debounced
  return function () {
    // Setup the arguments
    var context = this;
    var args = arguments;

    // If there's a timer, cancel it
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    // Setup the new requestAnimationFrame()
    timeout = window.requestAnimationFrame(function () {
      fn.apply(context, args);
    });
  }
};



/*
 * Get all siblings of an element
 * @param  {Node}  elem The element
 * @return {Array}      The siblings
 */
var getSiblings = function (elem) {
    return Array.prototype.filter.call(elem.parentNode.children, function (sibling) {
        return sibling !== elem;
    });
};



/*
* Helper to get the bounds of a certain element
* @top: the elements y-position (in px) from the top of the window
* @height: the true height (in px) of the element
* @width: the true width (in px) of the element
*/
function getBounds(el) {
  var rect = el.getBoundingClientRect(),
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, height: rect.height, width: rect.width }
}



/*
* Helper that returns true or false if an element is in view of current scrolled window
*/
function getInView(el) {
  if(el) {
    let elRect = el.getBoundingClientRect();
    let realOffset = elRect.y + window.scrollY;
    return (window.scrollY + vh) > realOffset && window.scrollY < (realOffset + el.offsetHeight);
  }
}


/*
* Helper that returns the scrolled percentage of the given element in relation to the height of the window
*/
function getPercentageInView(el) {
  return (window.scrollY - (el.offsetTop - vh)) / (el.offsetHeight + vh);
}



/*
* Helper to get and update (on window resize) the current document window height (in px) and width (in px)
*/
var vh = document.documentElement.clientHeight || window.innerHeight;
var vw = document.documentElement.clientWidth || window.innerWidth;
var windowResizeCore = debounce(function() {
  // update vh and vw when the window is resized
  vh = document.documentElement.clientHeight || window.innerHeight;
  vw = document.documentElement.clientWidth || window.innerWidth;
});
window.addEventListener('resize', windowResizeCore);





/* 
* This is a little helper to enable :active states in css for touch devices as they don't seem to work natively
* More on this here: https://codepen.io/pocotan001/pen/njmXbW
*/
document.addEventListener("touchstart", function() {},false);

