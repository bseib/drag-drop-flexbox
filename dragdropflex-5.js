(function() {
  "use strict";
  window.addEventListener("load", function() {

    var $dnd = $dndFactory.create();

  	Vue.component('draggable-box', {
      template: '#draggable-box-template',
      props: ['item', 'beingDraggedId'],
      data() {
        return {
        }
      },
      mounted: function() {
        var el = this.$refs.domDraggableRef;
        $dnd.registerDraggableChild(el, this.item.id);
      },
      computed: {
      	flexOrder: function() {
          return { 'order': this.item.order };
        },
        isBeingDragged: function() {
          return this.beingDraggedId == this.item.id;
        },
      },
      methods: {}
    });
    
    let app = new Vue({
      el: '#drag-drop-flex-app',
      data: {
        beingDraggedId: null,
        disableDragzoneCount: 0,
      	inventions: [
      	  { id: 49, order: 0, name: 'Printing press' },
      	  { id: 93, order: 1, name: 'Lightbulb' },
      	  { id: 85, order: 2, name: 'Airplane' },
      	  { id: 18, order: 3, name: 'Personal computer' },
      	  { id: 83, order: 4, name: 'Vaccines' },
      	  { id: 24, order: 5, name: 'Automobile' },
      	  { id: 13, order: 6, name: 'Clock' },
      	  { id: 11, order: 7, name: 'Telephone' },
      	  { id: 47, order: 8, name: 'Refrigeration' },
      	  { id: 66, order: 9, name: 'Camera' },
      	],
      },
      created: function() {
        this.init();
      },
      computed: {},
      methods: {

        readDraggingOrderFromUI: function() {
          let list = [];
          _.forEach(_.sortBy(this.inventions, ['order']), function(invention) {
            list.push(invention.id);
          });
          return list;
        },

        applyDraggingOrderToUI: function(list) {
          //console.log(list);
          for (let i=0;i<list.length;i++) {
            let dragId = list[i];
            let invention = _.find(this.inventions, function(o) { return dragId == o.id; });
            invention.order = i;
          }
        },

        init: function() {
          let self = this;
          $dnd.registerDragZone('draggableZone');
          $dnd.registerDragIdListener(function(newDragId) { self.beingDraggedId = newDragId; });
          $dnd.registerDragOrderReader(this.readDraggingOrderFromUI);
          $dnd.registerDragOrderApplier(this.applyDraggingOrderToUI);
        },

      },
    });

  }, false);
}());
