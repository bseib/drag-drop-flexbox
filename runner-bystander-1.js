(function() {
  "use strict";
  window.addEventListener("load", function() {

    console.log("okay, let's wire up some drag events");

    let onDragStart = function(ev) {
      ev.dataTransfer.effectAllowed = "move";
      console.log('dragstart on runner');
    };
    let onDrag = function(ev) {
      console.log("Look, I'm dragging!!!");
    };
    let onDragEnd = function(ev) {
      console.log('dragend on runner');
    };

    let el = document.getElementById('runner');
    el.addEventListener('dragstart', onDragStart, false);
    el.addEventListener('drag',      onDrag, false);
    el.addEventListener('dragend',   onDragEnd, false);


  }, false);
}());
