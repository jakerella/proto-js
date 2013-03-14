
// All of these are to be part of ECMAScript.next

if (!Object.defineProperties) {
    Object.defineProperties = function(obj, props) {
        
        // define this anonymously so that we can catch errors and try a fallback
        function doDefineProperty(obj, prop, descriptor) {
            try {
                Object.defineProperty(obj, prop, descriptor);
            } catch(e) {
                // IE 8 may fail on this, so we'll try a fallback...
                if (descriptor.value != undefined) {
                  obj[prop] = descriptor.value;
                }
            }
        }

        // loop through the properties to assign them
        for (var prop in props) {
            if (props.hasOwnProperty(prop) && prop != '__proto__') {
                doDefineProperty(obj, prop, props[prop]);
            }
        }

        // IE 8 won't catch the constructor
        if (props.hasOwnProperty('constructor')) {
          doDefineProperty(obj, 'constructor', props.constructor);
        }
    }
}

if (!Object.create) {
    Object.create = function(obj, subProps) {
        // create a new, empty object
        function F(){}
        // and re-assign it's prototype
        F.prototype = obj;
        var fi = new F();
        if (subProps) {
          // add the new properties (if any)
          Object.defineProperties(fi, subProps);
        }
        // if plain objects don't support __proto__ then we need to manually add it now
        if (!({}).__proto__) { fi.__proto__ = obj; }
        return fi;
    };
}

if (!Object.getOwnPropertyNames) {
    
    // ***WARNING*** This shim will simulate functionality in IE 8, but 
    // only for base objects who have enumerable properties. In other 
    // words, don't use it extend native prototypes (like Array).
    // (Unfortuantely, by definition it is not possible to iterate over 
    // the non-enumerable properties of an object without native code.)
    
    Object.getOwnPropertyNames = function (obj) {
        var pNames = [];
        for (var n in obj) {
            // only use properties directly on the given object
            if (obj.hasOwnProperty(n))
                pNames.push(n);
        }
        return pNames;
    }
}

if (!Object.getOwnPropertyDescriptors) {
    Object.getOwnPropertyDescriptors = function (obj) {
        var descs = {},
            pNames = Object.getOwnPropertyNames(obj),
            d;

        if (obj.hasOwnProperty('constructor')) {
          // the constructor won't be picked up by IE 8
          descs['constructor'] = { enumerable: false, configurable: true, writable: false, value: obj.constructor };
        }

        for (var i=0, l=pNames.length; i<l; ++i) {
            try {
                // see if it works (but we'll try a fallback if not)
                d = Object.getOwnPropertyDescriptor(obj, pNames[i]);

            } catch(e) {
                // IE 8 can bomb on this even though it's defined because in IE8 it only works on DOM objects
                if (obj.hasOwnProperty(pNames[i])) {
                    d = { enumerable: true, configurable: true, writable: true, value: obj[pNames[i]] };
                }
            }
            if (!d) { continue; } // nothing we can do at this point
            
            descs[pNames[i]] = d;
        }
        return descs;
    };
}
