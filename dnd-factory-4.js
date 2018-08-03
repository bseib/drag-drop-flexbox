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

      me.onDragStart = function(runnerDragId) {
        console.log("onDragStart for " + runnerDragId);
      };
      me.onDragEnter = function(bystanderDragId) {
        console.log("onDragEnter on " + bystanderDragId);
      };
      me.onDrop = function(bystanderDragId) {
        console.log("onDrop on " + bystanderDragId);
      };
      me.onDragEnd = function(runnerDragId) {
        console.log("onDragEnd for " + runnerDragId);
      };
      me.onDragOutside = function() {
        console.log("onDragOutside");
      };

      me.getElDragzone = function() {
        return document.getElementById(me.elDragzoneId);
      };

      me.enableDragzone = function() {
        var elDragzone = me.getElDragzone();
        elDragzone.classList.remove('dragzone-disabled');
        elDragzone.classList.add('dragzone-enabled');
        me.dragEnableChangeListener && me.dragEnableChangeListener(true);
      }      



      /*
       * Public functions
       */

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