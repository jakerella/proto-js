////////// API //////////

// To be part of ECMAScript.next
if (!Object.create) {
  Object.create = function(o) {
    function F(){}
    F.prototype = o;
    return new F();
  };
}

if (!Object.getOwnPropertyDescriptors) {
    Object.getOwnPropertyDescriptors = function (obj) {
        var descs = {};
        for (var propName in Object.getOwnPropertyNames(obj)) {
            if (Object.getOwnPropertyDescriptor(obj, propName)) {
                descs[propName] = Object.getOwnPropertyDescriptor(obj, propName);
            }
        }
        return descs;
    };
}

/**
 * The root of all classes that adhere to "the prototypes as classes" protocol.
 * The neat thing is that the class methods "new" and "extend" are automatically
 * inherited by subclasses of this class (because Proto is in their prototype chain).
 */
var Proto = {
    /**
     * Class method: create a new instance and let instance method constructor() initialize it.
     * "this" is the prototype of the new instance.
     * @return {object} An instance of the desired prototype
     */
    new: function () {
        var instance = Object.create(this);
        if (instance.constructor) {
            instance.constructor.apply(instance, arguments);
        }
        return instance;
    },

    /**
     * Class method: subclass "this" (a prototype object used as a class)
     * @param  {object} subProps The properties of the sub-prototype
     * @return {object} The new  prototype
     */
    extend: function (subProps) {
        // We cannot set the prototype of "subProps"
        // => copy its contents to a new object that has the right prototype
        var subProto = Object.create(this, Object.getOwnPropertyDescriptors(subProps));
        subProto.super = this; // for super-calls
        return subProto;
    },
};

/**
 * Optional: compatibility with constructor functions
 */
Function.prototype.extend = function(subProps) {
    var constrFunc = this;
    // Let a prototype-as-class extend a constructor function constrFunc.
    // Step 1: tmpClass is Proto, but as a sub-prototype of constrFunc.prototype
    var tmpClass = Proto.extend.call(constrFunc.prototype, Proto);
    // Step 2: tmpClass is a prototype-as-class => use as such
    return tmpClass.extend(subProps);
};

////////// Demo //////////

/***** Code *****
// Superclass
var Person = Proto.extend({
    constructor: function (name) {
        this.name = name;
    },
    describe: function() {
        return "Person called "+this.name;
    },
});

// Subclass
var Employee = Person.extend({
    constructor: function (name, title) {
        Employee.super.constructor.call(this, name);
        this.title = title;
    },
    describe: function () {
        return Employee.super.describe.call(this)+" ("+this.title+")";
    },
});
*/

/***** Interaction *****
var jane = Employee.new("Jane", "CTO"); // normally: new Employee(...)
> Employee.isPrototypeOf(jane) // normally: jane instanceof Employee
true
> jane.describe()
'Person called Jane (CTO)'
*/
