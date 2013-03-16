
// ---------------- Test Modules --------------- //

test("Basic Object Creation", function(a) {
  var cf = function () { };
  var Person = Proto.extend({
    constructor: cf
  });

  a.ok(Person, "Person object has been created");
  a.equal(Person.__proto__, Proto, "Person has correct prototype");
  a.equal(Person.constructor, cf, "Person object has correct constructor");
});

test("Basic Object Creation - No Constructor", function(a) {
  var Person = Proto.extend({});

  a.ok(Person, "Person object has been created");
  a.equal(Person.__proto__, Proto, "Person has correct prototype");
});

test("Object Creation with Members", function(a) {
  var sayHelloFunction = function() { return "Hello "+this.name; };

  var Person = Proto.extend({
    name: "Bubbles",
    sayHello: sayHelloFunction
  });

  a.equal(Person.name, "Bubbles", "Person has correct default 'name' property value");
  a.equal(Person.sayHello, sayHelloFunction, "Person has correct 'sayHello' method");
});

test("Instance Creation", function(a) {
  var Person = Proto.extend({
    name: "Bubbles",
    sayHello: function() { return "Hello "+this.name; }
  });

  var p = Person.create();

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

  var p = Person.create("Jordan", true);

  a.equal(p.name, "Jordan", "Person has correct 'name' value");
  a.equal(p.alive, true, "Person has correct 'alive' value");
  a.equal(p.sayHello(), "Hello "+p.name, "'sayHello' on Person returns correct value");
});

test("Basic Object Inheritance", function(a) {
  var Person = Proto.extend({
    name: "Bubbles"
  });

  var Employee = Person.extend({
    id: null
  });

  a.ok(Employee, "Employee object has been created");
  a.equal(Employee.id, null, "Employee has correct default 'id' value");
  a.equal(Employee.__proto__, Person, "Employee has correct prototype");
  a.equal(Employee.parent, Person, "Employee has correct 'parent' object: Person");
  a.equal(Employee.parent.name, "Bubbles", "Employee.parent has correct default value for 'name'");
});

test("Inherited Instance Creation", function(a) {
  var Person = Proto.extend({
    name: "Bubbles"
  });

  var Employee = Person.extend({
    id: null
  });

  var e = Employee.create();

  a.ok(Employee.isPrototypeOf(e), "Employee is a prototype of the instance");
  a.ok(Person.isPrototypeOf(e), "Person is a prototype of the instance");
  a.equal(e.id, null, "instance has correct 'id' value");
  a.equal(e.name, "Bubbles", "instance has correct 'name' value");
});

test("Multiple Inherited Levels", function(a) {
  var Person = Proto.extend({
    name: "Bubbles"
  });

  var Employee = Person.extend({
    id: null
  });

  var Developer = Employee.extend({
    os: 'Linux'
  });

  var UIDeveloper = Developer.extend({
    lang: 'JavaScript'
  });

  var e = Employee.create();
  var d = Developer.create();
  var u = UIDeveloper.create();

  a.ok(Employee.isPrototypeOf(e), "Employee is a prototype of employee");
  a.ok(Person.isPrototypeOf(e), "Person is a prototype of employee");

  a.ok(Developer.isPrototypeOf(d), "Developer is a prototype of dev");
  a.ok(Employee.isPrototypeOf(d), "Employee is a prototype of dev");
  a.ok(Person.isPrototypeOf(d), "Person is a prototype of dev");

  a.ok(UIDeveloper.isPrototypeOf(u), "UIDeveloper is a prototype of uidev");
  a.ok(Developer.isPrototypeOf(u), "Developer is a prototype of uidev");
  a.ok(Employee.isPrototypeOf(u), "Employee is a prototype of uidev");
  a.ok(Person.isPrototypeOf(u), "Person is a prototype of uidev");

  a.equal(d.id, null, "dev has correct 'id' value");
  a.equal(d.os, 'Linux', "dev has correct 'os' value");
  a.equal(d.lang, undefined, "dev has no 'lang' value");

  a.equal(u.id, null, "uidev has correct 'id' value");
  a.equal(u.os, 'Linux', "uidev has correct 'os' value");
  a.equal(u.lang, 'JavaScript', "uidev has no 'lang' value");
});

test("Parent Method Call", function(a) {
  var Person = Proto.extend({
    getSpecies: function getSpecies() { return "Homo Sapien"; },
    speak: function speak(timePeriod, noun) { return "In the "+timePeriod+" there was only "+noun; }
  });

  var Developer = Person.extend({
    getSpecies: function getSpecies() { return this.callParent(arguments)+" Developus"; },
    speak: function speak(timePeriod, noun, language) {
      return this.callParent(arguments)+", then God created "+language;
    },
    promote: function promote(title) { return this.callParent(arguments); }
  });

  var d = Developer.create();

  a.equal(d.getSpecies(), "Homo Sapien Developus", "parent method call - no arguments - works");
  a.equal(d.speak("beginning", "Linux", "JavaScript"), "In the beginning there was only Linux, then God created JavaScript", "parent method call - with arguments - works");
  a.equal(d.promote(), undefined, "parent method call - no parent - works");
});

test("Inherited Instance with Manual 'parent' Constructor", function(a) {
  var Person = Proto.extend({
    constructor: function (name) {
      this.name = name;
    },
    name: "Bubbles"
  });

  var Employee = Person.extend({
    constructor: function(name, id) {
      Employee.parent.constructor.call(this, name);
      this.id = id;
    },
    id: null
  });

  var e = Employee.create("Jordan", 1234);

  a.equal(e.id, 1234, "instance has correct 'id' value");
  a.equal(e.name, "Jordan", "instance has correct 'name' value");
});

test("Constructor parent Method Call (Dynamic)", function(a) {
  var Person = Proto.extend({
    constructor: function constructor(name) {
      this.name = name;
    },
    name: "Bubbles"
  });

  var Employee = Person.extend({
    constructor: function constructor(name, id) {
      this.callParent(arguments);
      this.id = id;
    },
    id: null
  });

  var e = Employee.create("Jordan", 1234);

  a.equal(e.id, 1234, "instance has correct 'id' value");
  a.equal(e.name, "Jordan", "instance has correct 'name' value");
});

test("Multiple Inherited Levels with Parent Method Call", function(a) {
  var Person = Proto.extend({
    getSpecies: function getSpecies() { return "Homo Sapien"; }
  });

  var Employee = Person.extend({});

  var Developer = Employee.extend({
    getSpecies: function getSpecies() { return this.callParent(arguments)+" Developus"; }
  });

  var d = Developer.create();

  a.equal(d.getSpecies(), "Homo Sapien Developus", "Multiple level parent method call works");
});

test("Namespaced Object Creation", function(a) {
  var pt = {};
  pt.Person = Proto.extend({
    name: "Bubbles",
    sayHello: function() { return "Hello "+this.name; }
  });

  var p = pt.Person.create();

  a.ok(pt.Person.isPrototypeOf(p), "Person is a prototype of the instance");
  a.equal(p.name, "Bubbles", "instance has correct 'name' value");
  a.equal(p.sayHello(), "Hello "+p.name, "'sayHello' on Person returns correct value");
});

test("Namespaced Inheritance", function(a) {
  var pt = {};
  pt.Person = Proto.extend({
    name: "Bubbles",
    sayHello: function() { return "Hello "+this.name; }
  });

  pt.Employee = pt.Person.extend({
    id: 1234
  });

  var e = pt.Employee.create();

  a.ok(pt.Employee.isPrototypeOf(e), "Employee is a prototype of the instance");
  a.ok(pt.Person.isPrototypeOf(e), "Person is a prototype of the instance");
  a.equal(e.name, "Bubbles", "instance has correct 'name' value");
  a.equal(e.id, 1234, "instance has correct 'id' value");
  a.equal(e.sayHello(), "Hello "+e.name, "'sayHello' on Person returns correct value");
});

test("Namespacing Proto library", function(a) {
  var pt = {};
  pt.Proto = Proto;
  Proto = null; // to test that namespace works, in case "Proto" is a conflict for anyone

  pt.Person = pt.Proto.extend({
    name: "Bubbles",
    sayHello: function() { return "Hello "+this.name; }
  });

  var p = pt.Person.create();

  a.equal(Proto, null, "Original Proto variable is undefined (correct)");
  a.notEqual(pt.Proto, undefined, "New namespaced Proto object exists");
  a.ok(pt.Person.isPrototypeOf(p), "Person is a prototype of the instance");
  a.equal(p.name, "Bubbles", "instance has correct 'name' value");
  a.equal(p.sayHello(), "Hello "+p.name, "'sayHello' on Person returns correct value");

  Proto = pt.Proto;
});
