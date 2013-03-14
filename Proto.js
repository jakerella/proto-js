////////// API //////////

/**
 * The root of all classes that adhere to "the prototypes as classes" protocol.
 * The neat thing is that the class methods "create" and "extend" are automatically
 * inherited by subclasses of this class (because Proto is in their prototype chain).
 */
var Proto = {
    /**
     * Class method: create a new instance and let instance method constructor() initialize it.
     * "this" is the prototype of the new instance.
     * @return {object} An instance of the desired prototype
     */
    create: function () {
        var instance = Object.create(this);
        if (instance.constructor) {
            instance.constructor.apply(instance, arguments);
        }
        return instance;
    },

    /**
     * Class method: subclass "this" (a prototype object used as a class)
     * @param  {object} subProps The properties of the sub-prototype
     * @return {object} The new prototype
     */
    extend: function (subProps) {
        // We cannot set the prototype of "subProps"
        // => copy its contents to a new object that has the right prototype
        var subProto = Object.create(this, Object.getOwnPropertyDescriptors(subProps));
        subProto.parent = this; // for parent prototype calls
        // Does the browser not support __proto__? Then add it manually
        // (Yes, this is also in our shim, but some browsers have Object.create and not __proto__ - IE9)
        if (!({}).__proto__) { subProto.__proto__ = this; }
        return subProto;
    }
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
        Employee.parent.constructor.call(this, name);
        this.title = title;
    },
    describe: function () {
        return Employee.parent.describe.call(this)+" ("+this.title+")";
    },
});
*/

/***** Interaction *****
var jane = Employee.create("Jane", "CTO"); // normally: new Employee(...)
> Employee.isPrototypeOf(jane) // normally: jane instanceof Employee
true
> jane.describe()
'Person called Jane (CTO)'
*/
