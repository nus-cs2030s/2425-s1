# Unit 18: Interface

!!! abstract "Learning Objectives"

    Students should

    - understand interface as a type for modeling "can do" behavior.
    - understand the subtype-supertype relationship between a class and its interfaces.

## Modeling Behavior

We have seen how we can write our program using superclasses (_including abstract ones_) to make our code more general and flexible.  In this unit, we will kick this up one more notch and try to write something even more general, through another abstraction.

Let's re-examine this method again:

```Java title="findLargest v0.3"
double findLargest(Shape[] array) {
  double maxArea = 0;
  for (Shape curr : array) {
    double area = curr.getArea();
    if (area > maxArea) {
      maxArea = area;
    }
  }
  return maxArea;
}
```

Note that all that is required for this method to work, is that the type of objects in `array` supports a `getArea` method.  While `Shape` that we defined in the previous unit meets this requirement, it does not have to be.  We could pass in an array of countries or an array of HDB flats.  However, it is unnatural to model a `Country` or a `Flat` as a subclass of `Shape` (_recall inheritance models the IS-A relationship so we cannot easily say that a country is a shape_).

To resolve this, we will look at an abstraction that models what can an entity do, possibly across different class hierarchies.

## Interface

The abstraction to do this is called an _interface_.  An interface is also a type and is declared with the keyword `interface`.

Since an interface models what an entity can do, the name usually ends with the -able suffix[^1].  Java [Comparable](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Comparable.html) is one such example.

Now, suppose we want to create a type that supports the` getArea()` method, be it a shape, a geographical region, or a real estate property.  Let's call it `GetAreable`:

```Java
interface GetAreable {
  public abstract double getArea();
}
```

All methods declared in an interface are `public abstract` by default.  We could also just write:

```Java
interface GetAreable {
  double getArea();
}
```

Now, for every class that we wish to be able to call `getArea()` on, we tell Java that the class `implements` that particular interface.

For instance,
```Java
abstract class Shape implements GetAreable {
  private int numOfAxesOfSymmetry;

  public boolean isSymmetric() {
    return numOfAxesOfSymmetry > 0;
  }
}
```

The `Shape` class will now have a `public abstract double getArea()` thanks to it implementing the `GetAreable` interface.  Since `Shape` inherits the abstract `GetAreable::getArea()` method, it must be declared as an abstract class.

We can have a concrete class implementing an interface too.

```Java
class Flat extends RealEstate implements GetAreable {
  private int numOfRooms;
  private String block;
  private String street;
  private int floor;
  private int unit;

  @Override
  public double getArea() {
      :
  }
}
```

For a class to implement an interface and be concrete, it has to override all abstract methods from the interface and provide an implementation to each, just like the example above.  Otherwise, the class becomes abstract.

With the `GetAreable` interface, we can now make our function `findLargest` even more general.

```Java title="findLargest v0.4"
double findLargest(GetAreable[] array) {
  double maxArea = 0;
  for (GetAreable curr : array) {
    double area = curr.getArea();
    if (area > maxArea) {
      maxArea = area;
    }
  }
  return maxArea;
}
```

!!! info "Class and Interface Inheritance"
    - A class can only extend from one superclass, but it can implement multiple interfaces.
    - An interface can extend from one or more other interfaces, but an interface cannot extend from another class.

??? question "Extra Information"
    The rule above may seem weird considering that `Object` is the root of the class hierarchy.  Wouldn't `Object` be the supertype of all types?  But `Object` is a class, so an interface cannot inherit from `Object`.
    
    While it is true that interface cannot inherit from `Object`, we also have to remember that all run-time type will be a concrete class.  Therefore, all run-time type will be a subtype of `Object`.  So it follows that all type can be type casted into `Object`.
    
    The problem is during type checking, how can we let the compiler knows that an interface has access to all the methods from the class `Object` without actually inheriting `Object`?  The answer is by explicitly adding the method signature for the methods in `Object` when the interface has no supertype.  So in a way, we have "inheritance" without explicitly making it inheritance.

## Interface as Supertype

If a class $C$ implements an interface $I$, $C <: I$.   This definition implies that a type can have multiple supertypes.

In the example above, `Flat` <: `GetAreable` and `Flat` <: `RealEstate`.


## Casting using an Interface

Like any type in Java, it is also possible to cast a variable into an interface.  Lets consider an interface `I` and two classes `A` and `B`. Note that `A` does not implement `I`

```Java
interface I {
    :
}

class A {
    :
}

class B implements I {
    :
}
```

Now lets, consider the following code excerpt:

```Java
I i1 = new B(); // Compiles, widening type conversion
I i2 = (I) new A(); // Also compiles?
```

Note that even though `A` does not implement `I`, the Java compiler allows this code to compile. Contrast this with casting between classes that have no subtype relationship:

```Java
A a = (A) new B(); // Does not compile
B a = (B) new A(); // Does not compile
```

How do we explain this? Well, the Java compiler will not let us cast, when it is provable that it won't work (_e.g., casting between two classes which have no subtype relationship_). However, for interfaces, there is the *possibility* that a subclass *could* implement the interface and therefore Java allows it to compile. Consider one such potential subclass `AI`:

```Java
class AI extends A implements I {
    :
}
```

The lesson here is that when we are using typecasting, we are telling the compiler that *we know best*, and therefore it will not warn us or stop us from making bad decisions. It is important to always be sure when you use an explicit typecast.  Still, the compiler being our friend may decide that we are provably wrong.  But if the compiler cannot show that we are provably wrong in the case of type casting, it will allow us to compile and add a run-time check.


## Impure Interfaces

As we mentioned at the beginning of this module, it is common for software requirements, and their design, to continuously evolve.  Once we define an interface that is exposed beyond the abstraction barrier, however, it is difficult to change that interface.

Suppose that, after we define that `GetAreable` interface, other developers in the team starts to write classes that implement this interface.  One fine day, we realized that we need to add more methods into the `getAreable`.  Perhaps we need methods `getAreaInSquareFeet()` and `getAreaInSquareMeter()` in the interface.  But, one cannot simply add these abstract methods to `getAreable`.  Otherwise, the other developers will have to change their classes to add the implementation of two methods.  Or else, their code would not compile.  Imagine how unhappy they would be!

This is what happened to the Java language when they changed from version 7 to version 8.  The language needed to add a bunch of useful methods to standard interfaces provided by the Java library, but doing so would break existing code written in Java version 7 or before, that rely on these interfaces.

The solution that Java came up with is the allow an interface to provide a _default implementation_ of methods that all implementation subclasses will inherit (_unless they override_).  A method with default implementation is tagged with the `default` keyword.  This design leads to a less elegant situation where an `interface` has some abstract methods and some non-abstract default methods.  In CS2030S, we refer to this as _impure interfaces_ and it is a pain to explain since it breaks our clean distinction between a class and an interface.  _We prefer not to talk about it_ -- but it is there in Java 8 and up.

[^1]: Although in recent Java releases, this is less common.

!!! warning "Example"
    The following example shows a potential use of impure interface.
    
    ```java
    interface Ordered {
      boolean lessThan(Ordered o);                     // this < o
      default boolean greaterThan(Ordered o) {         // this > o   -->  o < this
        return o.lessThan(this);
      }
      default boolean greaterThanOrEqual(Ordered o) {  // this >= o  -->  !(this < o)
        return !this.lessThan(o);
      }
      default boolean lessThanOrEqual(Ordered o) {     // this <= o  -->  !(this > o)  -->  !(o < this)
        return !o.lessThan(this);
      }
    }
    ```
    
    So now, if someone implements the `Ordered` interface, they only need to override one method called `lessThan`.  Then, automatically, it has inherited the method `greaterThan`, `greaterThanOrEqual`, and `lessThanEqual`.

!!! info "Class Diagram (_Part 6_)"
    Similar to abstract class, we denote interface with `<<interface>>`.  Furthermore, since all (_non default_) methods in the interface are public abstract methods, it is best to show them as such.  So, use `+` to indicate public method and put the name in _italics_ to indicate that they are abstract methods.
    
    Also note that if a class is implementing an interface, we connect them with dashed arrow.  Without impure interface, it simplifies our search for a method implementation in the run-time step of dynamic binding.  The method implementation can only be found by following the solid arrow because the dashed arrow leads to an interface.  Since an interface cannot be a subtype of a class, it ensures that there is no method implementation across the dashed arrow.
    
    ```java
    interface GetAreable {
      double getArea();
    }

    abstract class Shape implements GetAreable {
      private int numOfAxesOfSymmetry;

      public boolean isSymmetric() {
        return numOfAxesOfSymmetry > 0;
      }
  
      abstract double getArea();
    }
    ```
    
    ![Interface](figures/ClassDiagram08.png)

