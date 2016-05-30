'use strict';

exports.findTransitionEndEvent = function() {
  var div = document.createElement('div');
  var transitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  }

  for(var tran in transitions){
    if( div.style[tran] !== undefined ){
      return transitions[tran];
    }
  }
}

exports.isTargetInRoot = function(target, root) {
  while(target) {
    if (target === root) return true;

    target = target.parentNode;
  }

  return false;
}

exports.debounce = function createDebouncedFn(fn, time) {
  let id;
  return function debounced(...args) {
    clearTimeout(id);
    id = setTimeout(() => {
      return fn.apply(null, args);
    }, time);
  }
}
