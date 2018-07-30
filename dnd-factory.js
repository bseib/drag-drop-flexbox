window.$dndFactory = (function() {
  return {
    'create': function() {
      var pub = {};
      var me = {
        dragId: null,
        predragOrder: [],
        draggingOrder:[],
        elDragzoneId: null,
      };
      
      me.createChild = function(childDragId) {
        var childDragId = childDragId;
        return {
          onDragStart: function(ev) {
            var dt = ev.dataTransfer;
            //dt.setData('text', '' + childDragId);
            dt.effectAllowed = "move";
            me.onDragStart(childDragId);
          },
          onDragEnd: function(ev) {
            me.onDragEnd();
          },
          onDragEnter: function(ev) {
            me.onDragEnter(childDragId);
          },
          onDragOver: function(ev) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move";
          },
          onDrop: function(ev) {
            ev.preventDefault();
            me.onDrop(childDragId);
          },
          wireDragHandlers: function(el) {
            el.addEventListener('dragstart', this.onDragStart, false);
            el.addEventListener('dragend', this.onDragEnd, false);
            el.addEventListener('dragenter', this.onDragEnter, false);
            el.addEventListener('dragover', this.onDragOver, false);
            el.addEventListener('drop', this.onDrop, false);
          },
        };
      };

      me.onDragStart = function(dragId) {
        var elDragzone = me.getElDragzone();
        if ( elDragzone.classList.contains('dragzone-disabled') ) {
          // don't allow dragging if set to inactive
          return;
        }
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
        me.draggingOrder = me.reorderList(me.draggingOrder, targetDragId, me.dragId);
        me.dragOrderApplier(me.draggingOrder);
      };
      me.onDragOutside = function() {
        me.draggingOrder = [];
        for ( var i=0;i<me.predragOrder.length;i++ ) {
          var dragId = me.predragOrder[i];
          me.draggingOrder.push(dragId);
        }
        me.dragOrderApplier(me.draggingOrder);
      };
      me.onDrop = function(targetDragId) {
        me.onDragEnter(targetDragId);
        me.setCurrentDragId(null);
        me.predragOrder = [];
        me.draggingOrder = [];
      };
      me.onDragEnd = function() {
        if ( me.predragOrder.length > 0 ) {
          me.dragOrderApplier(me.predragOrder);
        }
        me.setCurrentDragId(null);
        me.predragOrder = [];
        me.draggingOrder = [];
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
      
      me.setCurrentDragId = function(newDragId) {
        me.dragId = newDragId;
        me.dragIdChangeListener(newDragId);
      };
      
      me.getElDragzone = function() {
        return document.getElementById(me.elDragzoneId);
      };

      
      // parent registers a function that can return a list of dragId's in current order shown in UI
      pub.registerDragOrderReader = function(readerFn) {
        me.dragOrderReader = readerFn;
      }
        
      // parent registers a function that takes a list of dragId's and applies it to the UI
      pub.registerDragOrderApplier = function(writerFn) {
        me.dragOrderApplier = writerFn;
      }
      
      pub.registerDragZone = function(elDragzoneId) {
        me.elDragzoneId = elDragzoneId;
        var elDragzone = me.getElDragzone();
        elDragzone.classList.add('dragzone');
        pub.enableDragzone();
        elDragzone.addEventListener('dragleave', function(ev) {
          var zone = elDragzone.getBoundingClientRect();
          if ( ev.clientY < zone.top || ev.clientY > zone.bottom || ev.clientX < zone.left || ev.clientX > zone.right) {
            me.onDragOutside();
          }
        }, false);
      };
        
      pub.disableDragzone = function() {
        var elDragzone = me.getElDragzone();
        elDragzone.classList.remove('dragzone-enabled');
        elDragzone.classList.add('dragzone-disabled');
        me.dragEnableChangeListener && me.dragEnableChangeListener(false);
      }

      pub.enableDragzone = function() {
        var elDragzone = me.getElDragzone();
        elDragzone.classList.remove('dragzone-disabled');
        elDragzone.classList.add('dragzone-enabled');
        me.dragEnableChangeListener && me.dragEnableChangeListener(true);
      }
      
      pub.isDragzoneEnabled = function() {
        var elDragzone = me.getElDragzone();
        return ( elDragzone.classList.contains('dragzone-enabled') );
      }

      pub.registerDraggableChild = function(el, childDragId) {
        var child = me.createChild(childDragId);
        child.wireDragHandlers(el);
      };
      
      pub.registerDragIdListener = function(listener) {
        me.dragIdChangeListener = listener;
      };
      
      pub.registerDragEnableChangeListener = function(listener) {
        me.dragEnableChangeListener = listener;
      };
      
      return pub;
    }
  };
})();