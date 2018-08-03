window.exampleFactory = (function() {
  return {
    'create': function(name) {
      var pub = {
        world: "hello " + name,
      };
      var me = {
        justme: "can't see me " + name,
      };
      
      me.callMeMaybe = function() {
        console.log("calling callMeMaybe: " + me.justme);
      };

      pub.simpleCall = function() {
        console.log("calling simpleCall: " + pub.world);
      }

      pub.secondCall = function() {
        console.log("calling secondCall");
        me.callMeMaybe();
      }
      
      return pub;
    }
  };
})();

// from console do:
// bob = exampleFactory.create('bob');
// bob.callMeMaybe(); /* fails */
// bob.simpleCall();
// bob.secondCall();