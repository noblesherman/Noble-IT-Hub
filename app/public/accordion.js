// when an accordion is clicked, make sure the rest of them close
document.addEventListener('click', function (event) {
  // If the event target doesn't match bail
  if (!event.target.closest('.accordion')) return;

  // relies on getSiblings() which should be in core.js
  let siblings = getSiblings(event.target.closest('.accordion'));
  for( let sib of siblings ) {
    if( sib.hasAttribute('open') ) {
      sib.removeAttribute('open');
    }
  }
}, false);
