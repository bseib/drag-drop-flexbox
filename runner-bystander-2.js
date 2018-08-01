(function() {
  "use strict";
  window.addEventListener("load", function() {

    console.log("okay, let's wire up some drag events");

    let onDragStart = function(ev) {
      ev.dataTransfer.effectAllowed = "move";
      console.log('dragstart on runner');
    };
    let onDrag = function(ev) {
      //console.log("Look, I'm dragging!!!");
    };
    let onDragEnd = function(ev) {
      console.log('dragend on runner');
    };

    let elRunner = document.getElementById('runner');
    elRunner.addEventListener('dragstart', onDragStart, false);
    elRunner.addEventListener('drag',      onDrag, false);
    elRunner.addEventListener('dragend',   onDragEnd, false);


    let elBystander = document.getElementById('bystander');
    let onDragEnter = function(ev) {
      ev.preventDefault();
      if ( elBystander === ev.target ) {
        console.log('dragenter on bystander');        
      }
    };
    let onDragExit = function(ev) {
      if ( elBystander === ev.target ) {
        console.log('dragexit on bystander');
      }
    };
    let onDragLeave = function(ev) {
      if ( elBystander === ev.target ) {
        console.log('dragleave on bystander');
      }
    };
    let onDragOver = function(ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
      console.log('dragover on bystander');
    };
    let onDrop = function(ev) {
      ev.preventDefault();
      console.log('drop on bystander');
    };
    elBystander.addEventListener('dragenter', onDragEnter, false);
    elBystander.addEventListener('dragexit',  onDragExit, false);
    elBystander.addEventListener('dragleave', onDragLeave, false);
    elBystander.addEventListener('dragover',  onDragOver, false);
    elBystander.addEventListener('drop',      onDrop, false);


  }, false);
}());
