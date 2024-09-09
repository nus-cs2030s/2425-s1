# Unit 23: Generics

!!! abstract "Learning Objectives"

    Students should

    - know how to define and instantiate a generic type and a generic method.
    - be familiar with the term parameterized types, type arguments, type parameters.
    - appreciate how generics can reduce duplication of code and improve type safety.

## The `Pair` class

Sometimes it is useful to have a lightweight class to bundle a pair of variables together.  One could, for instance, write a method that returns two values.  The example defines a class `IntPair` that bundles two `int` variables together. This is a utility class with neither semantics nor methods associated with it and so, we did not attempt to hide the implementation details.

```Java title="Integer Pair"
class IntPair {
  private int first;
  private int second;

  public IntPair(int first, int second) {
    this.first = first;
    this.second = second;
  }

  int getFirst() {
    return this.first;
  }

  int getSecond() {
    return this.second;
  }
}
```

This class can be used, for instance, in a function that returns two `int` values.

```Java
IntPair findMinMax(int[] array) {
  int min = Integer.MAX_VALUE;  // stores the min
  int max = Integer.MIN.VALUE;  // stores the max
  for (int i : array) {
    if (i < min)  {
      min = i;
    }
    if (i > max) {
      max = i;
    }
  }
  return new IntPair(min, max);
}
```

We could similarly define a pair class for two doubles (`DoublePair`), two booleans (`BooleanPair`), _etc_.  In other situations, it is useful to define a pair class that bundles two variables of two different types, say, a `Customer` and a `CoffeeCounter`; a `String` and an `int`; _etc_.  

We should not, however, create one class for each possible combination of types.  A better idea is to define a class that stores two `Object` references:

```Java title="Pair v0.1"
class Pair {
  private Object first;
  private Object second;

  public Pair(Object first, Object second) {
    this.first = first;
    this.second = second;
  }

  Object getFirst() {
    return this.first;
  }

  Object getSecond() {
    return this.second;
  }
}
```

At the cost of using a [wrapper class](19-wrapper.md) in place of primitive types, we get a single class that can be used to store any type of values.  

You might recall that we used a similar approach for our [`contains` method](14-polymorphism.md) to implement a general _method_ that works for any type of object.  Here, we are using this approach for a general _class_ that encapsulates any type of object.

Unfortunately, the issues we faced with narrowing type conversion and potential run-time errors apply to the `Pair` class as well.  Suppose that a function returns a `Pair` containing a `String` and an `Integer`, and we accidentally treat this as an `Integer` and a `String` instead, the compiler will not be able to detect the type mismatch and stop the program from crashing during run-time.

```Java
Pair foo() {
  return new Pair("hello", 4);
}

Pair p = foo();
Integer i = (Integer) p.getFirst(); // run-time ClassCastException
```

To reduce the risk of human error, what we need is a way to specify the following: suppose the type of `first` is $S$ and type of `second` is $T$, then we want the return type of `getFirst` to be $S$ and of `getSecond` to be $T$.

## Generic Types

In Java and many other programming languages, the mechanism to do this is called generics or templates.  Java allows us to define a _generic type_ that takes other types as _type parameters_, just like how we can write methods that take in variables as parameters.  

### Declaring a Generic Type

Let's see how we can do this for `Pair`:

```Java title="Pair v0.2"
class Pair<S,T> {
  private S first;
  private T second;

  public Pair(S first, T second) {
    this.first = first;
    this.second = second;
  }

  public S getFirst() {
    return this.first;
  }

  public T getSecond() {
    return this.second;
  }
}
```

We declare a generic type by specifying its type parameters between `<` and `>` when we declare the type.  By convention, we use a single capital letter to name each type parameter.  These type parameters are scoped within the definition of the type.  In the example above, we have a generic class `Pair<S,T>` (_read "pair of S and T"_)  with `S` and `T` as type parameters.  We use `S` and `T` as the type of the fields `first` and `second`.  We ensure that `getFirst()` returns type `S` and `getSecond()` returns type `T`, so that the compiler will give an error if we mix up the types.

Note that the constructor is still declared as `Pair` (_without the type parameters_).

### Using/Instanting a Generic Type

To use a generic type, we have to pass in _type arguments_, which itself can be a non-generic type, a generic type, or another type parameter that has been declared.  Once a generic type is instantiated, it is called a _parameterized type_.

To avoid potential human errors leading to `ClassCastException` in the example above, we can use the generic version of `Pair` as follows, taking in two non-generic types:

```Java
Pair<String,Integer> foo() {
  return new Pair<String,Integer>("hello", 4);
}

Pair<String,Integer> p = foo();
Integer i = (Integer) p.getFirst(); // compile-time error
```

With the parameterized type `Pair<String,Integer>`, the return type of `getFirst` is bound to `String`, and the compiler now have enough type information to check and give us an error since we try to cast a `String` to an `Integer` in the expression `(Integer) p.getFirst()`.  We can see this by the following reasoning below.

!!! info "Type Analysis"
    1. The return type of `p.getFirst()` is the generic type `S`.
    2. The variable `p` has the compile-time type of `Pair<String, Integer>`.
    3. The class `Pair` is declared with two type parameters `Pair<S, T>`.
    4. By type parameter passing, we have `S` = `String` and `T` = `Integer`.
    5. The return type of `p.getFirst()` is `S`.
    6. Since `S` is a `String` due to (4), the return type of `p.getFirst()` is `String`.
    7. Since `String` </: `Integer` and both are concrete classes, we cannot type cast `String` to `Integer`.
    8. Hence we get compile-time error.

Note that we use `Integer` instead of `int`, since _only reference types_ can be used as type arguments.

Just like you can pass a parameter of a method to another method, we can pass the type parameter of a generic type to another:

```Java
class DictEntry<T> extends Pair<String,T> {
    :
}
```

We define a generic class called `DictEntry<T>` with a single type parameter `T` that extends from `Pair<String,T>`, where `String` is the first type argument (_in place of_ `S`), while the type parameter `T` from `DictEntry<T>` is passed as the type argument for `T` of `Pair<String,T>`.

!!! info "Generic Type Declaration vs Usage"
    In geenral, generic type declaration will always be enclosed within `< .. >`.  However, there are at least two cases where the types within `< .. >` are not declared but used.

    1. Extending/implementing a generic class/interface.
        - Consider `class DictEntry<T> extends Pair<String, T>`.
        - We declare a generic type `T` in `class DictEntry<T> ..`.
        - We use the non-generic type `String` in `.. extends Pair<String, ..>`.
        - We use the generic type `T` in `.. extends Pair<.., T>`.
    2. Instantiating an instance of a generic type.
        - Consider `new Pair<X, Y>( ,, )`.
        - The two types `X` and `Y` are not generic type declaration.


### Generic Methods

Methods can be parameterized with a type parameter as well.  Consider the `contains` method, which we now put within a class for clarity.

```Java title="contains v0.1"
class A {
  // version 0.1 (with polymorphism)
  public static boolean contains(Object[] array, Object obj) {
    for (Object curr : array) {
      if (curr.equals(obj)) {
        return true;
      }
    }
    return false;
  }
}
```

While using this method does not involve narrowing type conversion and type casting, it is a little to general -- it allows us to call `contains` in a nonsensical way, like this:

```Java
String[] strArray = new String[] { "hello", "world" };
A.contains(strArray, 123);
```

Searching for an integer within an array of strings is a futile attempt!  Let's constrain the type of the object to search for to be the same as the type of the array.  We can make this type the parameter to this method:

```Java title="contains v0.5"
class A {
  public static <T> boolean contains(T[] array, T obj) {
    for (T curr : array) {
      if (curr.equals(obj)) {
        return true;
      }
    }
    return false;
  }
}
```

The above shows an example of a _generic method_.  The type parameter `T` is declared within `<` and `>` and is added before the return type of the method.  This parameter `T` is then scoped within the whole method.

To call a generic method, we need to pass in the type argument placed before the name of the method[^1].  For instance,

```Java
String[] strArray = new String[] { "hello", "world" };
A.<String>contains(strArray, 123); // type mismatch error
```

[^1]: Java actually can infer the type using the _type inference_ mechanism and allows us to skip the type argument, but for clarity, we insist on specifying the type explicitly until students get used to the generic types and reasoning about types.

The code above won't compile since the compiler expects the second argument to also be a `String`.

```
_.java:_: error: incompatible types: int cannot be converted to String
		A.<String>contains(strArray, 123); // type mismatch error
		                             ^
Note: Some messages have been simplified; recompile with -Xdiags:verbose to get full output
1 error
```

Additionally, the number of type arguments passed must match the number of type arguments expected.  This is similar to how the number of argument values passed must match the number of parameter variables expected.  Consider the following method invocation.

```Java
String[] strArray = new String[] { "hello", "world" };
A.<String, String>contains(strArray, "123"); // no more type mismatch, but wrong number of type arguments
```

The code will not compile with the following error message.

```
_.java:_: error: method contains in class A cannot be applied to given types;
		A.<String, String>contains(strArray, "123"); // type mismatch error
		 ^
  required: T[],T
  found: String[],String
  reason: wrong number of type arguments; required 1
  where T is a type-variable:
    T extends Object declared in method <T>contains(T[],T)
1 error
```

Our old implementation of [`contains` method](14-polymorphism.md) (_reproduced below_) is simply a special case of the contains method above.

```java
boolean oldContains(Object[] array, Object obj) {
  for (Object curr : array) {
    if (curr.equals(obj)) {
      return true;
    }
  }
  return false;
}
```

The following two statements are equivalent.

```java
oldContains(objArr, obj);
A.<Object>contains(objArr, obj);
```

!!! danger "Type Parameter Confusion"
    A potential confusion arise when we declare type parameter with the same name but are actually different type.  Recap that we declare a type parameter by enclosing it within `<` and `>`.  As you have seen in [Declaring a Generic Type](#declaring-a-generic-type) and [Generic Methods](#generic-methods), the two places where you can declare type parameters are when you declare a class or when you declare a method.

    We can also declare a type `<T>` in both as shown below.

    ```java
    class Confused<T> {
      private T t;

      public <T> T getT() {
        return this.t;
      }
    }
    ```

    You will notice that you get a weird error.

    ```
    Main.java:5: error: incompatible types: T#1 cannot be converted to T#2
            return this.t;
                       ^
      where T#1,T#2 are type-variables:
        T#1 extends Object declared in class Confused
        T#2 extends Object declared in method <T#2>getT()
    1 error
    ```

    What are these `T#1` and `T#2`?  In the class declaration, we have `class Confused<T> { .. }` so we are declaring that we have a type called `T` that is generic.  In the method, this `T` is _shadowed_ by the nearer type parameter declaration `public <T> T getT() { .. }`.  So the two `T` are actually different types, they just happen to have the same name.

    To differentiate them, Java compiler typically will add a unique numbering.  The `T` from `class Confused<T> { .. }` is then renamed into `T#1` together with all its usage.  The `T` from `public <T> T getT() { .. }` is then renamed into `T#2`.  So internally, Java may actually be looking at the following:

    ```java
    class Confused<T#1> {
      private T#1 t;

      public <T#2> T#2 getT() {
        return this.t;
      }
    }
    ```

    Of course the above is not a valid code as `T#1` is not a valid name for a type.  But you can clearly see that `this.t` has a type of `T#1`, but we expect the return type of `T#2`.

## Bounded Type Parameters

Let's now try to apply our newly acquired trick to fix the issue with `findLargest`.  Recall that we have the following `findLargest` method (_which we now put into an ad hoc class just for clarity_), which [requires us to perform a narrowing type conversion](20-casting.md) to cast from `GetAreable` and possibly leading to a run-time error.

```Java title="findLargest v0.5"
class A {
  public static GetAreable findLargest(GetAreable[] array) {
    double maxArea = 0;
    GetAreable maxObj = null;
    for (GetAreable curr : array) {
      double area = curr.getArea();
      if (area > maxArea) {
        maxArea = area;
        maxObj = curr;
      }
    }
    return maxObj;
  }
}
```

Let's try to make this method generic, by forcing the return type to be the same as the type of the elements in the input array,

```Java title="findLargest v0.6"
class A {
  public static <T> T findLargest(T[] array) {
    double maxArea = 0;
    T maxObj = null;
    for (T curr : array) {
      double area = curr.getArea();
      if (area > maxArea) {
        maxArea = area;
        maxObj = curr;
      }
    }
    return maxObj;
  }
}
```

The code above won't compile, since the compiler cannot be sure that it can find the method `getArea()` in type `T`.  In contrast, when we run `contains`, we had no issue since we are invoking the method `equals`, which exists in any reference type in Java.

Since we intend to use `findLargest` only in classes that implement the `GetAreable` interface and supports the `getArea()` method, we can put a constraint on `T`.  We can say that `T` must be a subtype of `GetAreable` when we specify the type parameter:

```Java title="findLargest v0.7"
class A {
  public static <T extends GetAreable> T findLargest(T[] array) {
    double maxArea = 0;
    T maxObj = null;
    for (T curr : array) {
      double area = curr.getArea();
      if (area > maxArea) {
        maxArea = area;
        maxObj = curr;
      }
    }
    return maxObj;
  }
}
```

We use the keyword `extends` here to indicate that `T` must be a subtype of `GetAreable`.  It is unfortunate that Java decides to use the term `extends` for any type of subtyping when declaring a bounded type parameter, even if the supertype is an interface (_such as_ `GetAreable`).

We can use bounded type parameters for declaring generic classes as well.  For instance, Java has a generic interface `Comparable<T>`, which dictates the implementation of the following `int compareTo(T t)` for any concrete class that implements the interface.   Any class that implements the `Comparable<T>` interface can be compared with an instance of type `T` to establish an ordering.  Such ordering can be useful for sorting objects, for instance.

Suppose we want to compare two `Pair` instances, by comparing the first element in the pair, we could do the following:

```Java title="Pair v0.3"
class Pair<S extends Comparable<S>,T> implements Comparable<Pair<S,T>> {
  private S first;
  private T second;

  public Pair(S first, T second) {
    this.first = first;
    this.second = second;
  }

  public S getFirst() {
    return this.first;
  }

  public T getSecond() {
    return this.second;
  }

  @Override
  public int compareTo(Pair<S,T> s1) {
    return this.first.compareTo(s1.first);
  }

  @Override
  public String toString() {
    return this.first + " " + this.second;
  }
}
```

Let's look at what it means:

- We declared `Pair` to be a generic type of two type parameters: the first one `S` is bounded and must be a subtype of `Comparable<S>`.  This bound is self-referential, but it is intuitive -- we say that `S` must be comparable to itself, which is common in many use cases.
- Since we want to compare two `Pair` instances, we make `Pair` implements the `Comparable` interface too, passing in `Pair<S,T>` as the type argument to `Comparable`.

Let's see this in action with [`Arrays::sort`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Arrays.html#sort(java.lang.Object%5B%5D)) method, which sorts an array based on the ordering defined by `compareTo`.

```Java
Object[] array = new Object[] {
  new Pair<String,Integer>("Alice", 1),
  new Pair<String,Integer>("Carol", 2),
  new Pair<String,Integer>("Bob", 3),
  new Pair<String,Integer>("Dave", 4),
};

java.util.Arrays.sort(array);

for (Object o : array) {
  System.out.println(o);
}
```

You will see the pairs are sorted by the first element.

!!! note "Upper Bound"
    Note that there is only "upper bound" in bounded type parameters.  For a more flexible typing, we have to rely on wildcards that can specify either the upper bound or the lower bound.