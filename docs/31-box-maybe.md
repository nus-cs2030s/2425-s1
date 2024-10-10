# Unit 31: Box and Maybe

!!! abstract "Learning Objectives"

    Students should

    - appreciate the generality of the class `Box<T>` and `Maybe<T>`
    - appreciate how passing in functions as parameter can lead to highly general abstractions
    - appreciate how `Maybe<T>` preserves the "maybe null" semantics over a reference type by internalizing checks for `null`

## Lambda as a Cross-Barrier State Manipulator

Recall that every class has an abstraction barrier between the client and the implementer.  The internal states of the class are heavily protected and hidden.   The implementer selectively provides a set of methods to access and manipulate the internal states of instances.  This approach allows the implementer to control what the client can and cannot do to the internal states.  This is good if we want to build abstractions over specific entities such as shapes or data structures such as a stack, but it is not flexible enough to build general abstraction.

Let's consider the following class:

```Java title="Box v0.0.1"
class Box<T> {
  private T item;
}
```

It is a box containing a single item of type `T`.  Suppose that we want to keep the `item` hidden and we want to have certain rules and maintain some semantics about the use of the `item`.  As such, we don't want to provide any setter or getter, so that the client may not break our rules.  What are some ways we can still operate on this `item`?

One way is to clearly define what we can do with the `item`.  Since the `item` has a type `T`, what can be done on `item` must be whatever can be done on `Object`.  Clearly there are not that many things we can do to `Object`.  But one possibility is to convert `item` from type `T` into a `String`.  We can add the method `mapToString()` as follows.

```java title="Box v0.1"
class Box<T> {
  private T item;
    :

  public Box<String> mapToString() {
    return new Box<String>(this.item.toString());
  }
}
```

But if we do this, for each new operation we want to support we need to add a new method.  For instance, if we want to convert to an integer using `this.item.toString().length()`, then we need to add a new method `mapToInteger`.  Is there a better way?

Another way we can do this is to provide methods that accept a lambda expression, apply the lambda expression on the item, and return the new box with the new value.  This is a more extensible design.  For instance,

```Java title="Box v0.2"
class Box<T> {
  private T item;
    :

  public <U> Box<U> map(Transformer<? super T, ? extends U> transformer) {
    if (!isPresent()) {
      return empty();
    }
    return Box.of(transformer.transform(this.item));
  }
    :

  public Box<T> filter(BooleanCondition<? super T> condition) {
    if (!isPresent() || !(condition.test(this.item)) {
      return emptyBox();
    }
    return this;
  }
    :
}
```

The method `map` takes in a lambda expression and allows us to arbitrarily apply a function to the item, while the method `filter` allows us to perform an arbitrary check on the property of the item.

Methods such as these, which accept a function as a parameter, allow the client to manipulate the data behind the abstraction barrier without knowing the internals of the object.  Here, we are treating lambda expressions as "manipulators" that we can pass in behind the abstraction barrier and modify the internals arbitrarily for us, while the container or the box tries to maintain the semantics for us.

## Maybe

Let's now look at `Box<T>` in a slightly different light.  Let's rename it to `Maybe<T>`.  `Maybe<T>` is an _option type_, a common abstraction in programming languages (`java.util.Optional` in Java, `option` in Scala, `Maybe` in Haskell, `Nullable<T>` in C#, _etc_) that is a wrapper around a value that is either there or is `null`.  The `Maybe<T>` abstraction allows us to write code without mostly not worrying about the possibility that our value is missing.  When we call `map` on a value that is missing, nothing happens.

Recall that we wish to write a program that is as close to pure mathematical functions as possible, a mathematical function always has a well-defined domain and codomain.  If we have a method that looks like this:

```Java
Barista b = coffee.findBarista();
```

Then `findBarista` is mapping from the domain on coffee shop to the codomain of baristas.  However, if we implement `findBarista` such that it returns `null` if no counter is available, then `findBarista` is not a pure function anymore.  The return value `null` is not a barista, as we cannot do things that we can normally do on barista to it.  So `findBarista` now maps to a value outside its codomain! This violation of the purity of function adds complications to our code, as we now have to specifically filter out `null` value, and is a common source of bugs.

One way to fix this is to have a special barista (say, `class BaristaOrNull` extends `Barista`) that is returned whenever no barista is available. This way, our `findCounter` remains a pure function. But this is not a general solution. If we adopt this solution, everywhere we return `null` in place of a non-`null` instance we have to create a special subclass.  We have to do this for all classes that we want to support.  Luckily, we have learnt generics in CS2030S.

A more general way to expand a domain or codomain to include `null` is to create a generic class that does the check.  We can call this class `Maybe<T>`.  So now, we can wrap both `null` and `Barista` under a type called `Maybe<Barista>`.  We only need to ensure that `Maybe<Barista>` never points to `null` (_i.e., we should not have_ `Maybe<Barista> maybe = null`) but it may contain `null` value (_e.g._ `Maybe<Barista> maybe = Maybe.some(null)`).  Then, we can make `findBarista` return `Maybe<Barista>`.

```java
Maybe<Barista> barista = coffee.findBarista();
```

Another way to view the `Maybe<T>` class is that it internalizes all the checks for `null` on the client's behalf.  `Maybe<T>` ensures that if `null` represents a missing value, then the semantics of this missing value is preserved throughout the chain of `map` and `filter` operations.  Within its implementation, `Maybe<T>` do the right thing when the value is missing to prevent us from encountering `NullPointerException`.  There is a check for `null` when needed, internally, within `Maybe<T>`.  This internalization removes the burden of checking for `null` on the programmer and removes the possibility of run-time crashes due to missing `null` checks.
