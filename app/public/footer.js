/*
* Custom listener for the inview sections of the Team Heads saying 'hi!'
*/
document.addEventListener('inviewFooter', function (event) {
  // The element that triggered the event
  var elem = event.target;

  // enter for the first time
  if( elem.classList.contains('enter') && !("shown" in elem.dataset) ) {
    elem.dataset.shown = '1';

    anime({
      targets: elem.querySelectorAll('.team-heads li'),
      scale: [0, 1],
      opacity: 1,
      delay: anime.stagger(100),
      duration: 600,
      complete: function(anim) {
        randomFloatFaces(elem); // this function is located in talkingheads.js
      }
    });
  }
  else if(elem.classList.contains('enter')) {
    randomFloatFaces(elem);
  }
}, false);
