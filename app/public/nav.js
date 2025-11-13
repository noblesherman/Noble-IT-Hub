/*
* Handle the doc and elements when a side nav is opened
*/
document.addEventListener('change', function (event) {
  if (!event.target.classList.contains('nav-check')) return;

  if (event.target.checked) {
    setTimeout(function () {
      document.documentElement.classList.add('nav-open');
	  siteLogo.classList.remove('compact');
      logoFull();
    }, 200);
  }
  else {
    document.documentElement.classList.remove('nav-open');
	  if (window.scrollY > 200) {
		siteLogo.classList.add('compact');
    	logoCompact();
	  }
  }
}, false);


/*
* Find a specific letter in each primary-menu nav item and surround it with a span to do some animations on mouse enter and leave
*/
let navItems = document.querySelectorAll('#primary-menu a');

navItems.forEach((item, i) => {
  let label = item.innerText;
  let letterNum = 0;
  let strt = 1;
  let newLetter = true;
  let enterAnim;

  // never use the second letter if the first letter is a W or V
  if (label.substr(0, 1) == 'W' || label.substr(0, 1) == 'w' || label.substr(0, 1) == 'V' || label.substr(0, 1) == 'v') {
    strt = 2;
  }

  // every time the element is mouse entered it changes the letter that should drop
  item.addEventListener('mouseenter', function (event) {
    // only assign a new letter if there's not currently a mouse leave animation going on
    if (newLetter) {
      let indx = Math.floor(Math.random() * (label.length - strt) + strt);

      // change the indx if it's the same as the previous mouse enter
      if (indx == letterNum) {
        if (indx == (label.length - 1)) indx--;
        else indx++;
      }
      letterNum = indx;

      // wrap a new letter in a span
      item.innerHTML = label.substr(0, indx) + '<span class="letter">' + label.substr(indx, 1) + '</span>' + label.substr(indx + 1);
    }


    enterAnim = anime({
      targets: item.querySelector('.letter'),
      rotate: -20,
      translateX: '-.3em',
      translateY: '.3em',
      easing: 'easeOutBounce',
      duration: 500,
    });
  });
  item.addEventListener('mouseleave', function (event) {
    anime({
      targets: item.querySelector('.letter'),
      rotate: 0,
      translateX: 0,
      translateY: 0,
      easing: 'easeInOutBack',
      duration: 500,
      begin: function (anim) {
        newLetter = false;
      },
      complete: function (anim) {
        newLetter = true;
      }
    });
  });
});





/*
* Animate the logo on scroll and on mouse enter / leave
*/
// First define the elments
let siteLogo = document.querySelector('.site-header .logo');
let logoG = siteLogo.querySelector('.G');
logoG.dataset.orig = logoG.getAttribute('d'); // save the original state of the letter 'G'
let logoR1 = siteLogo.querySelector('.R1');
let logoD = siteLogo.querySelector('.D');
let siteTag = document.querySelector('.site-tag');



/*
* Inview change the logo to compact or full
*/
document.addEventListener('inviewSiteHeader', function (event) {
  // the element that triggered the event
  let elem = event.target;

  // on enter of new section slide to the defined data-goto of the slider
  if (elem.classList.contains('exit') && !siteLogo.classList.contains('compact')) {
    siteLogo.classList.add('compact');
    logoCompact();
  }
  else if (elem.classList.contains('enter') && siteLogo.classList.contains('compact')) {
    siteLogo.classList.remove('compact');
    logoFull();
  }
}, false);


// if we're already lower on the page on load
setTimeout(function () {
  if (window.scrollY > 200) {
    siteLogo.classList.add('compact');
    logoCompact();
  }
}, 66);



// On mouse enter and mouse leave when the logo is compact
siteLogo.addEventListener('mouseenter', function (event) {
  if (siteLogo.classList.contains('compact')) {
    logoFull();
  }
});
siteLogo.addEventListener('mouseleave', function (event) {
  if (siteLogo.classList.contains('compact')) {
    logoCompact();
  }
});


// The compact animation function
var logoCompact = function () {
  anime({
    targets: siteLogo.querySelectorAll('[data-hide]'),
    opacity: 0,
    duration: 150,
    easing: 'linear',
  });

  anime({
    targets: logoG,
    d: {
      value: logoG.dataset.morph,
      delay: 120,
      easing: 'easeOutElastic(1, .6)',
    },
    translateX: '-16.5%',
  });

  anime({
    targets: logoR1,
    translateX: '-30%',
  });

  anime({
    targets: logoD,
    translateX: '-34.25%',
  });

  anime({
    targets: siteTag,
    textIndent: '-15em',
    easing: 'easeInOutQuart',
    duration: 400,
  })
}

// The compact animation function
var logoFull = function () {
  anime({
    targets: siteLogo.querySelectorAll('[data-hide]'),
    opacity: 1,
    duration: 150,
    easing: 'linear',
  });

  anime({
    targets: logoG,
    d: logoG.dataset.orig,
    translateX: 0,
  });

  anime({
    targets: logoR1,
    translateX: 0,
  });

  anime({
    targets: logoD,
    translateX: 0,
  });

  anime({
    targets: siteTag,
    textIndent: '0',
    easing: 'easeInOutQuart',
    duration: 400,
  })
}
