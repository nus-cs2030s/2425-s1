# Unit 25: Unchecked Warnings

!!! abstract "Learning Objectives"

    Students should

    - be aware of how to use generics with an array.
    - be aware of unchecked warnings that compilers can give when we are using generics.
    - be able to make arguments why a piece of code is type-safe for simple cases.
    - know how to suppress warnings from compilers.
    - be aware of the ethics when using the `@SuppressWarnings("unchecked")` annotation.
    - know what is a raw type.
    - be aware that raw types should never never be used in modern Java.

## Creating Arrays with Type Parameters

We have seen how arrays and generics do not mix well.  One way to get around this is to use [Java Collections](https://en.wikipedia.org/wiki/Java_collections_framework), a library of data structures provided by Java, instead of arrays, to store our items.  The `ArrayList` class
provides similar functionality to an array, with some performance overhead.  

```Java
ArrayList<Pair<String,Integer>> pairList;
pairList = new ArrayList<Pair<String,Integer>>(); // ok

pairList.add(0, new Pair<Double,Boolean>(3.14, true));  // error

ArrayList<Object> objList = pairList;  // error
```

`ArrayList` itself is a generic class, and when parameterized, it ensures type-safety by checking for appropriate types during compile time.  We can't add a `Pair<Double,Boolean>` object to a list of `Pair<String,Integer>`.  Furthermore, unlike Java array, which is covariant, generics are **invariant**.  There is no subtyping relationship between `ArrayList<Object>` and `ArrayList<Pair<String,Integer>>` so we can't alias one with another, preventing the possibility of heap pollution.

Using `ArrayList` instead of arrays only _gets around_ the problem of mixing arrays and generics, as a user.  `ArrayList` is implemented with an array internally after all.  As computing students, especially computer science students, it is important to know how to implement your own data structures instead of using ones provided by Java or other libraries.  

Let's try to build one and to minimize confusion, let's call it `Seq<T>`:

```Java title="Seq<T> v0.1"
class Seq<T> {
  private T[] array;

  public Seq(int size) {
    this.array = (T[]) new Object[size];
  }

  public void set(int index, T item) {
    this.array[index] = item;
  }

  public T get(int index) {
    return this.array[index];
  }

  public T[] getArray() {
    return this.array;
  }
}
```

This generic class is a wrapper around an array of type `T`.  Recall that we cannot instantiate a generic array direction (_i.e., cannot instantiate_ `new T[]`).  On Line 6, to get around this restriction, we instantiate via `new` keyword, an array of `Object` instead, and then cast it to an array of `T[]` instead.

The code now compiles.  Why would we expect this to compile at all?  Think about what the type erased code would look like.  So there is at least some reason why we would expect the code to work.

=== "Type Erased Code"
    ```Java
    // version 0.1
    class Array    {
      private Object[] array;

      Array(int size) {
        this.array = (Object[]) new Object[size];
      }

      public void set(int index, Object item) {
        this.array[index] = item;
      }

      public Object get(int index) {
        return this.array[index];
      }

      public Object[] getArray() {
        return this.array;
      }
    }
    ```

=== "Generic Code (_aligned_)"
    ```Java
    // version 0.1
    class Array<T> {
      private T     [] array;

      Array(int size) {
        this.array = (T     []) new Object[size];
      }

      public void set(int index, T      item) {
        this.array[index] = item;
      }

      public T      get(int index) {
        return this.array[index];
      }

      public T     [] getArray() {
        return this.array;
      }
    }
    ```

As we can see from the type erased code, the type of the field `array` is indeed `Object[]`.  Unfortunately, although the code compiles, we receive the following message:

```
$ javac Seq.java
Note: Seq.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
```

Let's do what the compiler tells us, and compile with the `-Xlint:unchecked` flags.
```
$ javac -Xlint:unchecked Seq.java
Seq.java:6: warning: [unchecked] unchecked cast
    array = (T[]) new Object[size];
                  ^
  required: T[]
  found:    Object[]
  where T is a type-variable:
    T extends Object declared in class Seq
1 warning
```

We get a warning that our Line 6 is doing an unchecked cast.  

## Unchecked Warnings

An unchecked warning is basically a message from the compiler that it has done what it can, and because of type erasures, there could be a run-time error that it cannot prevent.
Recall that type erasure generates the following code:
```Java
(String) array.get(0);
```

Since `array` is an array of `Object` instances and Java array is covariant, the compiler can't guarantee that the code it generated is safe anymore.

Consider the following:
```Java
Seq<String> seq = new Seq<String>(4);
Object[] objArray = seq.getArray();
objArray[0] = 4;
seq.get(0);  // ClassCastException
```

The last line would generate a `ClassCastException`, exactly a scenario that the compiler has warned us.

It is now up to us humans to change our code so that the code is safe.  Suppose we remove the `getArray` method from the `Seq` class,

```Java title="Seq<T> v0.2"
class Seq<T> {
  private T[] array;

  public Seq(int size) {
    this.array = (T[]) new Object[size];
  }

  public void set(int index, T item) {
    this.array[index] = item;
  }

  public T get(int index) {
    return this.array[index];
  }
}
```

Can we prove that our code is type-safe?  In this case, yes.

!!! info "Type Safety"
    1. `array` is declared as `private` so it is accessible only by code written inside the class `Seq`.
    2. The only way someone can put something into `array` is through the method `Seq::set(int, T)`.
    3. `Seq::set(int, T)` only put items of type `T` into `array` based on the implementation.
    4. The only type of objects we can get out of array must be of type `T` (_or subtype of_ `T`).
    5. `Seq::get(int)` will always retrieve either `T` (_or subtype of_ `T`).
    6. Since we can only insert/retrieve `T` from `array` due to (4) and (5), it is safe to cast `Object[]` to `T[]`.

If we wish to put in a paragraph, we can write the following instead.

> Since `array` is declared as `private`, the only way someone can put something into the `array` is through the `Seq::set` method[^1].  `Seq::set` only put items of type `T` into `array`.  So the only type of objects we can get out of `array` must be of type `T`.  So we, as humans, can see that casting `Object[]` to `T[]` is type-safe.

[^1]: Another win for information hiding!

If we are sure (_and only if we are sure_) that the line

```
    array = (T[]) new Object[size];
```

is safe, we can thank the compiler for its warning and assure the compiler that everything is going to be fine.  We can do so with the `@SuppressWarning("unchecked")` annotation.

```Java title="Seq<T> v0.3" hl_lines="5-8"
class Seq<T> {
  private T[] array;

  public Seq(int size) {
	// The only way we can put an object into array is through
	// the method set() and we only put object of type T inside.
	// So it is safe to cast `Object[]` to `T[]`.
	@SuppressWarnings("unchecked")
    T[] a = (T[]) new Object[size];
	this.array = a;
  }

  public void set(int index, T item) {
    this.array[index] = item;
  }

  public T get(int index) {
    return this.array[index];
  }
}
```

`@SuppressWarning` is a powerful annotation that suppresses warning messages from compilers.  Like everything that is powerful, we have the responsibility to use it properly:

- `@SuppressWarning` can apply to declaration at a different scope: a local variable, a method, a type, _etc_.  We must always use `@SuppressWarning` to the _most limited_ scope to avoid unintentionally suppressing warnings that are valid concerns from the compiler.
- We must suppress a warning _only if_ we are sure that it will not cause a type error later.  
- We must always add a note (_as a comment_) to fellow programmers explaining why a warning can be safely suppressed.

Note that since `@SuppressWarnings` cannot apply to an assignment but only to declaration, we declare a local variable `a` in the example above before assigning `this.array` to `a`.

## Raw Types

Another common scenario where we can get an unchecked warning is the use of _raw types_.  A raw type is a generic type used without type arguments.  Suppose we do:

```Java
Seq a = new Seq(4);
```

The code would compile perfectly.  We are using the generic `Seq<T>` as a raw type `Seq`.  Java allows this code to compile for backward compatibility.  This is anyway what the code looks like after type erasure and how we would write the code in Java before version 5.   Without a type argument, the compiler can't do any type checking at all.  We are back to the uncertainty that our code could bomb with `ClassCastException` after it ships.

Mixing raw types with paramterized types can also lead to errors.  Consider:
```Java
Seq<String> seq = new Seq<String>(4);
populateSeq(seq);
String str = seq.get(0);
```

where the method `populateArray` uses raw types:
```Java
void populateArray(Seq a) {
  a.set(0, 1234);
}
```

Since we use raw types in this method, the compiler can't help us.  It will warn us:
```
Seq.java:24: warning: [unchecked] unchecked call to set(int,T) as a member of the raw type Seq
    a.set(0, 1234);
         ^
  where T is a type-variable:
    T extends Object declared in class Seq
1 warning
```

If we ignore this warning or worse, suppress this warning, we will get a run-time error when we execute `a.get(0)`.

Raw types must not be used in your code, ever.  The only exception to this rule is using it as an operand of the `instanceof` operator[^2].  Since `instanceof` checks for run-time type and type arguments have been erased, we can only use the `instanceof` operator on raw types.

[^2]: Even this one will be subsumed in the future and we will no longer allow any use of raw types.