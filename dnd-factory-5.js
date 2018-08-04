window.$dndFactory = (function() {
  return {
    'create': function() {
      var pub = {};
      var me = {
        dragId: null,
        elDragzoneId: null,
      };
      
      me.createChild = function(childDragId) {
        var childDragId = childDragId;
        return {
          rawDragStart: function(ev) {
            ev.dataTransfer.effectAllowed = "move";
            me.onDragStart(childDragId);
          },
          rawDragEnd: function(ev) {
            me.onDragEnd(childDragId);
          },
          rawDragEnter: function(ev) {
            ev.preventDefault();
            me.onDragEnter(childDragId);
          },
          rawDragOver: function(ev) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move";
          },
          rawDrop: function(ev) {
            ev.preventDefault();
            me.onDrop(childDragId);
          },
          wireDragHandlers: function(el) {
            el.addEventListener('dragstart', this.rawDragStart, false);
            el.addEventListener('dragend', this.rawDragEnd, false);
            el.addEventListener('dragenter', this.rawDragEnter, false);
            el.addEventListener('dragover', this.rawDragOver, false);
            el.addEventListener('drop', this.rawDrop, false);
          },
        };
      };

      me.onDragStart = function(dragId) {
        console.log("onDragStart for " + dragId);
        me.setCurrentDragId(dragId);
        me.predragOrder = [];
        me.draggingOrder = [];
        var uiOrder = me.dragOrderReader();
        for ( var i=0;i<uiOrder.length;i++ ) {
          var dragId = uiOrder[i];
          me.predragOrder.push(dragId);
          me.draggingOrder.push(dragId);
        }
      };
      me.onDragEnter = function(targetDragId) {
        console.log("onDragEnter on " + targetDragId);
        me.draggingOrder = me.reorderList(me.draggingOrder, targetDragId, me.dragId);
        me.dragOrderApplier(me.draggingOrder);
      };
      me.onDrop = function(targetDragId) {
        console.log("onDrop on " + targetDragId);
        me.onDragEnter(targetDragId);
        me.setCurrentDragId(null);
        me.predragOrder = [];
        me.draggingOrder = [];
      };
      me.onDragEnd = function(dragId) {
        console.log("onDragEnd for " + dragId);
        if ( me.predragOrder.length > 0 ) {
          me.dragOrderApplier(me.predragOrder);
        }
        me.setCurrentDragId(null);
        me.predragOrder = [];
        me.draggingOrder = [];
      };
      me.onDragOutside = function() {
        console.log("onDragOutside");
        me.draggingOrder = [];
        for ( var i=0;i<me.predragOrder.length;i++ ) {
          var dragId = me.predragOrder[i];
          me.draggingOrder.push(dragId);
        }
        me.dragOrderApplier(me.draggingOrder);
      };
      
      me.reorderList = function(list, target, mover) {
        if ( target == mover ) {
          return list;
        }
        var newlist = [];
        var foundMoverSlot = false;
        for (var i=0;i<list.length;i++) {
          if ( mover == list[i] ) {
            // found our "mover", the one being dragged. skip pushing it
            foundMoverSlot = true;
          }
          else if ( target == list[i] ) {
            // found the "target", that our mover is hovering over. insert mover "before"
            // if we are sliding items down, or insert "after" if sliding things up.
            if ( foundMoverSlot ) {
              newlist.push(list[i]);
              newlist.push(mover);
            }
            else {
              newlist.push(mover);
              newlist.push(list[i]);
            }
          }
          else {
            newlist.push(list[i]);
          }
        }
        return newlist;
      };



      me.getElDragzone = function() {
        return document.getElementById(me.elDragzoneId);
      };

      me.enableDragzone = function() {
        var elDragzone = me.getElDragzone();
        elDragzone.classList.remove('dragzone-disabled');
        elDragzone.classList.add('dragzone-enabled');
      }

      me.setCurrentDragId = function(newDragId) {
        me.dragId = newDragId;
        me.dragIdChangeListener(newDragId);
      };


      /*
       * Public functions
       */

      // function will return list of ids with order shown on screen
      pub.registerDragOrderReader = function(readerFn) {
        me.dragOrderReader = readerFn;
      }
        
      // function takes list of ids and applies it to dom order
      pub.registerDragOrderApplier = function(writerFn) {
        me.dragOrderApplier = writerFn;
      }

      pub.registerDraggableChild = function(el, childDragId) {
        var child = me.createChild(childDragId);
        child.wireDragHandlers(el);
      };

      pub.registerDragZone = function(elDragzoneId) {
        me.elDragzoneId = elDragzoneId;
        var elDragzone = me.getElDragzone();
        elDragzone.classList.add('dragzone');
        me.enableDragzone();
        elDragzone.addEventListener('dragleave', function(ev) {
          var zone = elDragzone.getBoundingClientRect();
          if ( ev.clientY < zone.top || ev.clientY > zone.bottom || ev.clientX < zone.left || ev.clientX > zone.right) {
            me.onDragOutside();
          }
        }, false);
      };

      pub.registerDragIdListener = function(listener) {
        me.dragIdChangeListener = listener;
      };

      return pub;
    }
  };
})();