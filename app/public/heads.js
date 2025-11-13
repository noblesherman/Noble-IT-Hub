// loop randomvalues in a function
function randomFloatFaces(elem) {
  if( !("floating" in elem.dataset) ) {
    elem.dataset.floating = 'true';

    anime({
      targets: elem.querySelectorAll('[data-floating-heads] [data-head]'),
      translateX: function(){
        return anime.random(-10,10);
      },
      translateY: function(){
        return anime.random(-15,15);
      },
      rotate: function(){
        return anime.random(-8,8);
      },
      duration: 4000,
      easing: 'easeInOutSine',
      complete: function(anim) {
        elem.removeAttribute('data-floating');
        if( elem.classList.contains('enter') ) {
          randomFloatFaces(elem);
        }
      }
    });
  }
}


// on click heads talk
document.addEventListener('click', function (event) {
  // If the event target doesn't match bail
  if (!event.target.closest('[data-speech]')) return;
  let target = event.target.closest('[data-speech]');

  if( !target.classList.contains('speech') ) {
    target.classList.add('speech');
    speechHead(target, 2500);

    setTimeout(function() {
      target.classList.remove('speech');
    }, 2500);
  }
}, false);


// talking head talking animation
let speechHead = function(target, duration) {
  let loops = Math.round(duration / 200) - 1;

  anime({
    targets: target.querySelector('.mouth'),
    rotate: 10,
    translateX: '5%',
    translateY: '2%',
    loop: loops,
    duration: 200,
    direction: 'alternate',
    easing: 'easeInOutQuart',
  });

  if(target.querySelector('.hand')) {
    anime({
      targets: target.querySelector('.hand'),
      rotate: '+=15',
      translateX: '5%',
      translateY: '2%',
      loop: 4,
      duration: 300,
      direction: 'alternate',
      easing: 'easeInOutQuad',
    });
  }

  if(target.querySelector('.point')) {
    anime({
      targets: target.querySelector('.point'),
      translateX: '-5%',
      translateY: '15%',
      loop: 4,
      duration: 300,
      direction: 'alternate',
      easing: 'easeInOutQuad',
    });
  }
}
