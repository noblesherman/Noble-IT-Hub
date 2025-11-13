/*
* Change the classes of targeted elements on scroll
*/
let colorHasChanged = false; // to track the first colorchange
let activeColorChanges = 0; // number of active color changes

// these are global arrays of available color classes
let bgColorsArr = ['bg-blue', 'bg-white', 'bg-black', 'bg-red', 'bg-yellow', 'bg-gray'];
let txtColorsArr = ['blue', 'white', 'black', 'red', 'yellow', 'gray'];



/*
* Change color of <main>, <header> and <footer>
*/
document.addEventListener('inviewChangeColor', function (event) {
  // the element that triggered the event
  let elem = event.target;

  // on enter of section
  if( elem.classList.contains('enter') ) {
    let targets = document.querySelectorAll(elem.dataset.targets);
    changeElemColorClass(elem.classList, targets, false);
  }
  // on exit of section
  if( elem.classList.contains('exit') ) {
    let targets = document.querySelectorAll(elem.dataset.targets);
    changeElemColorClass(elem.classList, targets, true);
  }
}, false);



/*
* Change the bg and txt color of certain elements, triggered by a scrollposition of another element
*/
function changeElemColorClass(classArr, targets, revert) {
  if( !revert ) {
    activeColorChanges++;

    for( let target of targets ) {
      target.classList.add('color-transition'); // make sure there is a css transition in color

      // find the current classes of the target elements and save them as data-attributes
      let oldClasses = findColorClasses(target.classList, true, true);

      if(oldClasses.bg) {
        if(activeColorChanges === 1) target.dataset.bgColor = oldClasses.bg; // save initial class in dataset of target
        target.classList.remove(...bgColorsArr); // remove all bg-color classes from the classList of target
      }
      if(oldClasses.txt) {
        if(activeColorChanges === 1) target.dataset.txtColor = oldClasses.txt; // save initial class in dataset of target
        target.classList.remove(...txtColorsArr); // remove all color classes from the classList of target
      }


      // find the classes of the requested classArr and put these in the target elements
      let newClasses = findColorClasses(classArr, true, true);

      if( newClasses.bg && ("bgColor" in target.dataset) ) {
        target.classList.add(newClasses.bg);
      }
      if( newClasses.txt && ("txtColor" in target.dataset) ) {
        target.classList.add(newClasses.txt);
      }
    }
  }
  // revert the colors back to original classes (which are saved in the dataset of the target elements)
  else {
    activeColorChanges--;

    if(activeColorChanges == 0) {
      for( let target of targets ) {
        // remove all color classes from the classList of target elements
        target.classList.remove(...bgColorsArr);
        target.classList.remove(...txtColorsArr);


        // get the original colors from the dataset and add them back to the target elements
        if( ('bgColor' in target.dataset) ) {
          target.classList.add(target.dataset.bgColor);
        }
        if( ('txtColor' in target.dataset) ) {
          target.classList.add(target.dataset.txtColor);
        }
      }
    }
  }
}



/*
* Loop and array of classes and find and return the first bgColor and txtColor found
*/
function findColorClasses(classArr, bg, txt) {
  for (var i = 0; i < classArr.length; i++) {
    // find which bg-color is available in the classList (if bgColor is set true)
    if(bg === true || bg === undefined) {
      bg = bgColorsArr.find(function (color) {
        return color === classArr[i];
      });
    }

    // find which color is available in the classList (if txtColor is set true)
    if(txt === true || txt === undefined) {
      txt = txtColorsArr.find(function (color) {
        return color === classArr[i];
      });
    }

    // break the for loop if we've found the bg and fg color
    if( bg !== undefined && txt !== undefined ) {
      break;
    }
  }

  return {bg, txt}; // returns an object
}
