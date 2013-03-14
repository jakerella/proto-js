
// ---------------- Test Modules --------------- //

module("Basic Tests");

test("Basic Object Creation", function(a) {
  var Person = Proto.extend({
    constructor: function () { }
  });

  a.ok(Person, "Person object has been created");
  a.equal(Person.__proto__, Proto, "Person has correct prototype");
});

test("Object Creation with Members", function(a) {
  var sayHelloFunction = function() { return "Hello "+this.name; };

  var Person = Proto.extend({
    constructor: function () { },
    name: "Bubbles",
    sayHello: sayHelloFunction
  });

  a.equal(Person.name, "Bubbles", "Person has correct default 'name' property value");
  a.equal(Person.sayHello, sayHelloFunction, "Person has correct 'sayHello' method");
});

test("Instance Creation", function(a) {
  var Person = Proto.extend({
    constructor: function () { },
    name: "Bubbles",
    sayHello: function() { return "Hello "+this.name; }
  });

  var p = Person.new();

  a.ok(Person.isPrototypeOf(p), "Person is a prototype of the instance");
  a.equal(p.name, "Bubbles", "instance has correct 'name' value");
  a.equal(p.sayHello(), "Hello "+p.name, "'sayHello' on Person returns correct value");
});

test("Constructor arguments", function(a) {
  var Person = Proto.extend({
    constructor: function (name, alive) {
      this.name = name;
      this.alive = alive;
    },
    name: "Bubbles",
    sayHello: function() { return "Hello "+this.name; }
  });

  var p = Person.new("Jordan", true);

  a.equal(p.name, "Jordan", "Person has correct 'name' value");
  a.equal(p.alive, true, "Person has correct 'alive' value");
  a.equal(p.sayHello(), "Hello "+p.name, "'sayHello' on Person returns correct value");
});

test("Basic Object Inheritance", function(a) {
  var Person = Proto.extend({
    constructor: function () { },
    name: "Bubbles"
  });

  var Employee = Person.extend({
    constructor: function() { },
    id: null
  });

  a.ok(Employee, "Employee object has been created");
  a.equal(Employee.id, null, "Employee has correct default 'id' value");
  a.equal(Employee.__proto__, Person, "Employee has correct prototype");
  a.equal(Employee.super, Person, "Employee has correct 'super' object: Person");
  a.equal(Employee.super.name, "Bubbles", "Employee.super has correct default value for 'name'");
});

test("Inherited Instance Creation", function(a) {
  var Person = Proto.extend({
    constructor: function () { },
    name: "Bubbles"
  });

  var Employee = Person.extend({
    constructor: function() { },
    id: null
  });

  var e = Employee.new();

  a.ok(Employee.isPrototypeOf(e), "Employee is a prototype of the instance");
  a.ok(Person.isPrototypeOf(e), "Person is a prototype of the instance");
  a.equal(e.id, null, "instance has correct 'id' value");
  a.equal(e.name, "Bubbles", "instance has correct 'name' value");
});

test("Inherited Instance with 'super' Constructor", function(a) {
  var Person = Proto.extend({
    constructor: function (name) {
      this.name = name;
    },
    name: "Bubbles"
  });

  var Employee = Person.extend({
    constructor: function(name, id) {
      Employee.super.constructor.call(this, name);
      this.id = id;
    },
    id: null
  });

  var e = Employee.new("Jordan", 1234);

  a.equal(e.id, 1234, "instance has correct 'id' value");
  a.equal(e.name, "Jordan", "instance has correct 'name' value");
});

