/*
* Custom listener for the inview sections with the shapes
*/
let homeShapes = document.querySelector('.home-shapes'); // the element that contains the shapes
let shapeInterval = undefined; // define a global var for the shapes/faces interval

if(homeShapes) {
  document.addEventListener('inviewShapes', function (event) {
    // the element that triggered the event
    let elem = event.target;

    // on enter of new section get the desired position for the homeShapes and apply a transform
    if( elem.classList.contains('enter') ) {
      let positionX = 0;
      let positionY = 0;
      let addY = 0;

      if (elem.dataset.position == 'left' && vw >= 768) positionX = '-42.5%';
      if (elem.dataset.position == 'right' && vw >= 768) positionX = '42.5%';
      // we need different values for landscape mobile screens (also check page-home.css why this is)
      if( vw <= 767 && vh < vw) addY = -(parseInt(elem.dataset.section) * 6);
      // we need different values for wider screens (also check page-home.css why this is)
      if( vw >= 768) addY = 9 + (parseInt(elem.dataset.section) * 4);
      // we need different values for higher screens (also check page-home.css why this is)
      if( vh >= 920 && vh > vw) addY = 9 + (parseInt(elem.dataset.section) * 6);
      // we need different values for super big screens (also check page-home.css why this is)
      if( vw >= 1560 && vh >= 920) addY = 9 + (parseInt(elem.dataset.section) * 10);

      // if this section requires a Y position correction
      if ("y" in elem.dataset) positionY = parseInt(elem.dataset.y) + addY + 'em';

      anime({
        targets: homeShapes,
        translateX: positionX,
        translateY: positionY,
        easing: 'easeInOutCirc',
        duration: 350,
      });


      switch (elem.dataset.section) {
        case '0':
        startShapesInterval(true, 0);
        break;
        case '1':
        startShapesInterval(false, 0);
        shapify(4);
        break;
        case '2':
        startShapesInterval(false, 0);
        shapify(5);
        break;
        case '3':
        startShapesInterval(false, 0);
        shapify(6);
        break;
      }
    }
  }, false);


  function startShapesInterval(start, indx) {
    if( start && document.querySelector('.title-shapes [data-section="0"]').classList.contains('enter') ) {
      // change the shapes according to iteration
      shapify(indx);
      indx++;

      // only the first 4 shapes are faces
      if( indx > 3) indx = 0;

      shapeInterval = setTimeout( function() {
        startShapesInterval(true, indx); // run another iteration of the shapes
      }, 2500);
    }
    else if(!start && shapeInterval !== undefined) {
      clearTimeout(shapeInterval);
    }
  }

  function shapify(indx) {
    // the easing for all animations
    let defaultEasing = 'easeOutElastic(1, .7)';

    // we use arrays to set the new values of the shapes, values in order: 1. translateX  2. translateY  3. rotate
    let circVal = [], halfVal = [], rectVal = [], lineVal = [];

    // switch to determine the new values for the shapes
    switch (indx) {
      default:
      // circ doesn't need a rotate value
      case 0:
      circVal = ['0%', '-80%'];
      halfVal = ['-50%', '20%', '90deg'];
      rectVal = ['-125%', '-80%', '-90deg'];
      lineVal = ['60%', '-140%', '-45deg'];
      break;
      case 1:
      circVal = ['-50%', '20%'];
      halfVal = ['-150%', '-130%', '-90deg'];
      rectVal = ['67.5%', '-105%', '45deg'];
      lineVal = ['-50%', '-105%', '0deg'];
      break;
      case 2:
      circVal = ['37.5%', '-100%'];
      halfVal = ['-137.5%', '-75%', '90deg'];
      rectVal = ['-50%', '0%', '-45deg'];
      lineVal = ['-75%', '-137.5%', '-225deg'];
      break;
      case 3:
      circVal = ['-125%', '-115%'];
      halfVal = ['-50%', '-15%', '-270deg'];
      rectVal = ['25%', '-115%', '90deg'];
      lineVal = ['25%', '35%', '45deg'];
      break;
      case 4: // data-section="1"
      circVal = ['-150%', '-95%'];
      halfVal = ['20%', '22%', '45deg'];
      rectVal = ['10%', '-95%', '-45deg'];
      lineVal = ['-70%', '-15%', '-225deg'];
      break;
      case 5: // data-section="2"
      circVal = ['20%', '-7.5%'];
      halfVal = ['-120%', '-115%', '-270deg'];
      rectVal = ['-120%', '-7.5%', '90deg'];
      lineVal = ['20%', '-115%', '90deg'];
      break;
      case 6: // data-section="3"
      circVal = ['25%', '-80%'];
      halfVal = ['-50%', '20%', '90deg'];
      rectVal = ['-125%', '-80%', '-90deg'];
      lineVal = ['-50%', '-55%', '0'];
      break;
    }

    anime({
      targets: homeShapes.querySelector('.circ'),
      translateX: circVal[0],
      translateY: circVal[1],
      easing: defaultEasing,
    });

    anime({
      targets: homeShapes.querySelector('.half'),
      translateX: halfVal[0],
      translateY: halfVal[1],
      rotate: halfVal[2],
      delay: 70,
      easing: defaultEasing,
    });

    anime({
      targets: homeShapes.querySelector('.rect'),
      translateX: rectVal[0],
      translateY: rectVal[1],
      rotate: rectVal[2],
      delay: 140,
      easing: defaultEasing,
    });

    anime({
      targets: homeShapes.querySelector('.line'),
      translateX: lineVal[0],
      translateY: lineVal[1],
      rotate: lineVal[2],
      delay: 210,
      easing: defaultEasing,
    });
  }
}


/*
* Custom listener for the inview sections of the Team Heads saying 'hi!'
*/
document.addEventListener('inviewTeamHeads', function (event) {
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





/*
* Bubble shapes creates an object for all '.bubble-icon' elements and does some magic with them on scroll
*/
let bubbleIconTemp = document.getElementById('bubble-icon-temp');
let bubblesSection = document.querySelector('[data-bubbles]');

if( bubbleIconTemp ) {

  class BubbleShape {
    constructor(el) {
      this.el;
      this.animation;
      this.index;
      this.position;
      this.firstround = true;
    }
    init(indx, pos) {
      // save the the correct data-index
      this.index = indx;
      this.position = pos;

      // create a clone of the bubble and append
      this.create();
    }
    create() {
      // find the template and make a clone of it
      let temp = document.querySelector("#bubble-icon-temp .bubble-icon");
      let clone = temp.cloneNode(true);

      // choose a child vector shape (0,1,2 or 3) and remove it's className .shape
      let randomInt = Math.floor(Math.random() * (4 - 1 + 1) + 1);
      if(randomInt == 1) clone.querySelector('.shape:first-child').classList.remove('shape');
      else clone.querySelector('.shape:nth-child('+ randomInt +')').classList.remove('shape');

      // remove the rest of the shapes
      let shapeEls = clone.querySelectorAll('.shape');
      for( let shapeEl of shapeEls ) {
        shapeEl.parentNode.removeChild(shapeEl);
      }

      // set the index attribute
      clone.dataset.index = this.index;

      // append the new clone
      document.getElementById('bubbleIcons' + this.position).appendChild(clone);
      this.el = clone;

      // create and start the animation
      this.go();
    }
    go() {
      let obj = this;
      let el = this.el;

      // create a randomized animation for the bubble
      this.animation = anime({
        targets: el,
        keyframes: [
          {
            translateX: function() {
              return anime.random(-25, 0) + 'vw';
            },
            easing: 'easeInOutQuad',
          },
          {
            translateX: function() {
              return anime.random(-25, 0) + 'vw';
            },
            easing: 'easeInOutQuad',
          },
          {
            translateX: function() {
              return anime.random(-30, 10) + 'vw';
            },
            easing: 'easeInOutQuad',
          }
        ],
        translateY: function() {
          return '-' + anime.random(100, 160) + 'vh';
        },
        rotate: {
          targets: el.querySelector('svg'),
          value: function() {
            return anime.random(1, 3) + 'turn';
          },
        },
        scale: {
          targets: el.querySelector('svg'),
          value: 1.5,
        },
        duration: anime.random(9000, 16000),
        easing: 'linear',
        complete: function(anim) {
          obj.pop() // pop the shape at the end of the animation and create a new shape
        }
      });

      // flap the thinking head once
      thinkingHead(document.getElementById('bubbleIcons' + this.position));

      if(this.firstround) {
        this.animation.pause();
        this.animation.seek(this.animation.duration * (7 - this.index) / 10);
        this.animation.play();
        this.firstround = false;
      }
    }
    pop() {
      let obj = this;
      let el = this.el;

      if( !el.classList.contains('pop') ) {
        // show the pop shape
        el.classList.add('pop');

        // stop and remove animation
        this.animation.remove();
        setTimeout(function() {
          // remove this bubble
          el.parentNode.removeChild(el);
          // and create a new one at the bottom
          obj.create();
        }, 100);
      }
    }
    pauseAnim() {
      this.animation.pause();
    }
    playAnim() {
      this.animation.play();
    }
    get element() {
      return this.el;
    }
    get anim() {
      return this.animation;
    }
  }


  // create the bubble shapes and fill the bubbleShapes array
  let bubbleShapes = [];


  // Show control if the bubbles should be animation or not
  document.addEventListener('inviewBubbles', function (event) {
    // the element that triggered the event
    let elem = event.target;

    // on enter of new section slide to the defined data-goto of the slider
    if( elem.classList.contains('enter') && !("shown" in elem.dataset) ) {
      elem.dataset.shown = '1';

      let bubbleIndx = 0;
      let maxBubbles = (vw >= 768) ? 10 : 7;

      // create the bubbles
      let bubbleInterval = setInterval(function() {
        let bubble = new BubbleShape();

        // push this new BubbleShape in the global array of bubbleShapes objects
        bubbleShapes.push(bubble);

        // determine the position
        let bubblePos = bubbleIndx % 3;

        // init the bubble shape and give it an index
        bubble.init(bubbleIndx, bubblePos);

        // update the index
        bubbleIndx++;

        // delete the interval if index is reached
        if ( bubbleIndx == maxBubbles ) {
          clearInterval(bubbleInterval);
        }
      }, 66);
    }
    else if (elem.classList.contains('enter') && ("shown" in elem.dataset) ) {
      // start playing the animations again
      for( let bubble of bubbleShapes ) {
        bubble.playAnim();
      }
    }
    else {
      // pause the animations and stop harrassing the cpu
      for( let bubble of bubbleShapes ) {
        bubble.pauseAnim();
      }
    }
  }, false);







  // when a bubbleShape is clicked, pop it and create a new one at the bottom
  document.addEventListener('click', function (event) {
    // If the event target doesn't match bail
    if (!event.target.closest('.bubble-icon')) return;
    let target = event.target.closest('.bubble-icon');

    // call the pop function for the BubbleShape object in the global BubbleShape array
    bubbleShapes[target.dataset.index].pop();

  }, false);


  // function that let's a head open and close
  let thinkingHead = function(target) {
    if( !target.classList.contains('thinking') ) {
      target.classList.add('thinking');

      anime({
        targets: target.querySelector('.head'),
        rotate: -25,
        translateX: '12%',
        translateY: '-10%',
        direction: 'alternate',
        easing: 'easeInOutQuart',
        duration: 500,
        complete: function(anim) {
          target.classList.remove('thinking');
        }
      });
    }
  }
}



/*
* Use Siema to create three sliders with the head parts
*/
let headSliders = [];
let headSliderEls = document.querySelectorAll('.head-slider');

for( let slider of headSliderEls ) {
  let siema = new Siema({
    selector: slider,
    duration: 300,
    startIndex: parseInt(slider.dataset.start),
    loop: true,
  });

  // push the siema object and the goto into an array
  let headSlider = [siema, parseInt(slider.dataset.goto)];

  // push this new array in the global array of headSliders
  headSliders.push(headSlider);
}


// Show the faces move on scroll
document.addEventListener('inviewHeadSliders', function (event) {
  // the element that triggered the event
  let elem = event.target;

  // on enter of new section slide to the defined data-goto of the slider
  if( elem.classList.contains('enter') && !("shown" in elem.dataset) ) {
    elem.dataset.shown = '1';

    for( let slider of headSliders ) {
      setTimeout(function() {
        slider[0].goTo(slider[1]);
      }, 500);
    }
  }
  // on enter do a random switch of the face
  else if (elem.classList.contains('enter') && ("shown" in elem.dataset) ) {
    for ( let slider of headSliders ) {
      const randomNum = Math.floor(Math.random() * 3);
      setTimeout(function() {
        if( slider[0].currentSlide !== randomNum ) {
          slider[0].goTo(randomNum);
        }
        else {
          slider[0].next();
        }
      }, 500);
    }
  }
}, false);





/*
* The Tower of Heads
*/
let towerOfHeads = document.querySelector('.tower-of-heads'); // the element that contains the shapes

if(towerOfHeads) {
  // Show the faces on the first time on enter on scroll
  document.addEventListener('inviewTowerOfHeads', function (event) {
    // the element that triggered the event
    let elem = event.target;

    // on enter of new section slide to the defined data-goto of the slider
    if( elem.classList.contains('enter') && !("shown" in elem.dataset) ) {
      elem.dataset.shown = '1';

      towerOfHeads.classList.add('animating');

      anime({
        targets: towerOfHeads.querySelectorAll('li'),
        opacity: {
          value: 1,
          easing: 'steps(1)',
          duration: 10,
        },
        translateY: ['-100vh', 0],
        delay: anime.stagger(100, {from: 'last'}),
        duration: 600,
        easing: 'easeOutBounce',
        complete: function(anim) {
          towerOfHeads.classList.remove('animating');
        }
      });
    }
  }, false);


  // on head click shake the tower
  document.addEventListener('click', function (event) {
    // If the event target doesn't match bail
    if (!event.target.closest('[data-shake-tower]')) return;
    let target = event.target.closest('[data-shake-tower]');

    if( !towerOfHeads.classList.contains('animating') ) {
      towerOfHeads.classList.add('animating');

      shakeTower(parseInt(target.dataset.shakeTower), parseInt(target.dataset.duration));

      setTimeout(function() {
        towerOfHeads.classList.remove('animating');
      }, parseInt(target.dataset.duration) * 2);
    }
  }, false);


  // shakes the tower
  function shakeTower(indx, duration) {
    // the easing for all animations
    let defaultEasing = 'easeOutBack';
    let threshold = 50;

    // we use arrays to set the new values of the faces and shapes, values in order:
    // 1. delay  2. translateX  3. translateY  4. rotate
    let gijsVal = [], timVal = [], joepVal = [], circVal = [], rectVal = [], lineVal = [], halfVal = [];

    // switch to determine the new values for the faces and shapes
    switch (indx) {
      default:

      case 1:
      gijsVal = [0, '5%', '3%', '8deg'];
      timVal  = [60, '-2%', '0', '-2deg'];
      joepVal = false;
      circVal = [40, '13%', '12%'];
      rectVal = [40, '4%', '6%', '5deg'];
      lineVal = [80, '-1%', '1%', '-2deg'];
      halfVal = false;
      break;
      case 2:
      gijsVal = [60, '12%', '6%', '12deg'];
      timVal  = [0, '-6%', '3%', '-6deg'];
      joepVal = [60, '-2%', '2%', '2deg'];
      circVal = [80, '30%', '25%'];
      rectVal = [60, '-10%', '10%', '-15deg'];
      lineVal = [40, '-2%', '6%', '-15deg'];
      halfVal = [80, '-2%', '2%', '-3deg'];
      break;
      case 3:
      gijsVal = [100, '5%', '15%', '20deg'];
      timVal  = [60, '-10%', '8%', '-8deg'];
      joepVal = [0, '4%', '4%', '6deg'];
      circVal = [120, '80%', '40%'];
      rectVal = [80, '-15%', '25%', '-18deg'];
      lineVal = [60, '10%', '25%', '-20deg'];
      halfVal = [40, '-4%', '6%', '-10deg'];
      break;
    }

    if(gijsVal) {
      anime({
        targets: towerOfHeads.querySelector('.tower-gijs'),
        translateX: gijsVal[1],
        translateY: gijsVal[2],
        rotate: gijsVal[3],
        duration: duration,
        easing: defaultEasing,
        delay: gijsVal[0],
        update: function(anim) {
          if(anim.progress > threshold) {
            anim.pause();
            resetTower(anim.animatables[0].target, duration);
            anim.remove();
          }
        }
      });
    }

    if(timVal) {
      anime({
        targets: towerOfHeads.querySelector('.tower-tim'),
        translateX: timVal[1],
        translateY: timVal[2],
        rotate: timVal[3],
        duration: duration,
        easing: defaultEasing,
        delay: timVal[0],
        update: function(anim) {
          if(anim.progress > threshold) {
            anim.pause();
            resetTower(anim.animatables[0].target, duration);
            anim.remove();
          }
        }
      });
    }

    if(joepVal) {
      anime({
        targets: towerOfHeads.querySelector('.tower-joep'),
        translateX: joepVal[1],
        translateY: joepVal[2],
        rotate: joepVal[3],
        duration: duration,
        easing: defaultEasing,
        delay: joepVal[0],
        update: function(anim) {
          if(anim.progress > threshold) {
            anim.pause();
            resetTower(anim.animatables[0].target, duration);
            anim.remove();
          }
        }
      });
    }


    if(circVal) {
      anime({
        targets: towerOfHeads.querySelector('.tower-circ'),
        translateX: circVal[1],
        translateY: circVal[2],
        duration: duration,
        easing: defaultEasing,
        delay: circVal[0],
        update: function(anim) {
          if(anim.progress > threshold) {
            anim.pause();
            resetTower(anim.animatables[0].target, duration);
            anim.remove();
          }
        }
      });
    }

    if(rectVal) {
      anime({
        targets: towerOfHeads.querySelector('.tower-rect'),
        translateX: rectVal[1],
        translateY: rectVal[2],
        rotate: rectVal[3],
        duration: duration,
        easing: defaultEasing,
        delay: rectVal[0],
        update: function(anim) {
          if(anim.progress > threshold) {
            anim.pause();
            resetTower(anim.animatables[0].target, duration);
            anim.remove();
          }
        }
      });
    }

    if(lineVal) {
      anime({
        targets: towerOfHeads.querySelector('.tower-line'),
        translateX: lineVal[1],
        translateY: lineVal[2],
        rotate: lineVal[3],
        duration: duration,
        easing: defaultEasing,
        delay: lineVal[0],
        update: function(anim) {
          if(anim.progress > threshold) {
            anim.pause();
            resetTower(anim.animatables[0].target, duration);
            anim.remove();
          }
        }
      });
    }

    if(halfVal) {
      anime({
        targets: towerOfHeads.querySelector('.tower-half'),
        translateX: halfVal[1],
        translateY: halfVal[2],
        rotate: halfVal[3],
        duration: duration,
        easing: defaultEasing,
        delay: halfVal[0],
        update: function(anim) {
          if(anim.progress > threshold) {
            anim.pause();
            resetTower(anim.animatables[0].target, duration);
            anim.remove();
          }
        }
      });
    }
  }


  // bend the shapes and head back to zero, one by one
  function resetTower(target, duration) {
    anime({
      targets: target,
      translateX: 0,
      translateY: 0,
      rotate: 0,
      duration: duration * 1.3,
      easing: 'easeInOutBack',
    });
  }
}
