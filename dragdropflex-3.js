(function() {
  "use strict";
  window.addEventListener("load", function() {

  	Vue.component('draggable-box', {
      template: '#draggable-box-template',
      props: ['item'],
      data() {
        return {
        }
      },
      //mounted: function() {
        // var el = this.$refs.domDraggableRef;
        // $dnd.registerDraggableChild(el, this.item.dragId);
      //},
      /*
      computed: {
      	flexOrder: function() {
          return { 'order': this.item.order };
        },
      },
      */
      methods: {}
    });
    
    let app = new Vue({
      el: '#drag-drop-flex-app',
      data: {
      	inventions: [
      	  { order: 3, name: 'Printing press' },
      	  { order: 1, name: 'Lightbulb' },
      	  { order: 2, name: 'Airplane' },
      	  { order: 0, name: 'Personal computer' },
      	  { order: 4, name: 'Vaccines' },
      	  { order: 5, name: 'Automobile' },
      	  { order: 6, name: 'Clock' },
      	  { order: 7, name: 'Telephone' },
      	  { order: 8, name: 'Refrigeration' },
      	  { order: 9, name: 'Camera' },
      	],
      },
      computed: {},
      methods: {},
    });

  }, false);
}());
