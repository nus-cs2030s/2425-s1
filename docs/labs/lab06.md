# Lab 06: Mini Problems

!!! abstract "Learning Objectives"

    Students should
    
    - be able to use `Maybe<T>` class in their code.
    - be able to write functional-style code.


!!! info "Initializing"

    To get the files, run the following command from your PE node.
    We recommend creating a new directory called `mini` to store all your lab mini problems.

    ```bash
    cp -r ~cs2030s/mini/lab6/ .
    ```

    The files will only be available on Wednesday, 16 October 2024.


!!! warning "Class Files"
    We have given you a `.class` file from a badly written `Maybe<T>` as well as the functional interfaces used in the directory cs2030s/fp.
    These class files are compiled on the PE node, so we can only guarantee that they can work on the PE node.
    They may or may not work on other places especially on other operating systems.


---

## Maybe

Our `Maybe` class has the following methods available.  Methods that are not available cannot be used.  You should not modify `Maybe` class.
You may use the method descriptor as an inspiration for future exercises to make your method more flexible.
All the methods below are `public`.
No other `public` methods are available.


| Method | Description |
|---|---|
| `static <T> Maybe<T> of`<br>&nbsp;&nbsp;&nbsp;&nbsp;`(T val)` | Returns a new `Maybe<T>` depending on the value of `val`.<ul><li>If `val` is `null` returns the singleton `NONE` without any value inside</li><li>Otherwise returns a new `Maybe<T>` with the content `val`.</li></ul> |
| `static <T> Maybe<T> some`<br>&nbsp;&nbsp;&nbsp;&nbsp;`(T val)` | Returns a new `Maybe<T>` with the content `val` regardless if `val` is `null` or not. |
| `static <T> Maybe<T> none`<br>&nbsp;&nbsp;&nbsp;&nbsp;`(T val)` | Returns a the singleton `NONE` without any value inside. |
| `<U> Maybe<U> map`<br>&nbsp;&nbsp;&nbsp;&nbsp;`(Transformer<? super T,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`? extends U> func)` | Transform `this.val` (_if any_) using `func` and return a new `Maybe<U>`.<ul><li>If there is no `this.val` returns the singleton `NONE` without any value inside.</li><li>Otherwise return a new instance of `Maybe<U>` with `this.val` transformed using `func`. |
| `Maybe<T> filter`<br>&nbsp;&nbsp;&nbsp;&nbsp;`(BooleanCondition<? super T> pred)` | Transform `this.val` (_if any_) depending on the result of `pred`.<ul><li>If there is no `this.val` returns the singleton `NONE` without any value inside.</li><li>If `this.val == null` returns the singleton `NONE` without any value inside.</li><li>If `this.val` evaluates to `false` when passed into` pred` returns the singleton `NONE` without any value inside.</li><li>Otherwise the current instance.</li></ul> |
| `<U> Maybe<U> flatMap`<br>&nbsp;&nbsp;&nbsp;&nbsp;`(Transformer<? super T,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`? extends Maybe<? extends U>> func)` | Transform `this.val` (_if any_) using `func` and return a new `Maybe<U>`.<ul><li>If there is no `this.val` returns the singleton `NONE` without any value inside.</li><li>Otherwise return a new instance of `Maybe<U>` with `this.val` transformed using `func` but without making a nested `Maybe`. |
| `T orElse`<br>&nbsp;&nbsp;&nbsp;&nbsp;`(Producer<? extends T> prod)` | Returns `this.val` (_if any_).<ul><li>If there is no `this.val` produce a new value using `prod`.</li><li>Otherwise `this.val`. |
| `void ifPresent`<br>&nbsp;&nbsp;&nbsp;&nbsp;`(Consumer<? super T> cons)` | Consumes `this.val` (_if any_).<ul><li>If there is no `this.val` do nothing.</li><li>Otherwise consume `this.val` using `cons`. |

---

## Map

| Method | Description |
|---|---|
| `V get`<br>&nbsp;&nbsp;&nbsp;&nbsp;`(Object key)` | Returns the value to which the specified `key` is mapped, or `null` if this map contains no mapping for the key. |

---

## Functional-Style

As a sanity check, your answer should be **ONLY** a single statement without any blocks of code inside.
Most of the time, this will be a `return` statement if you need to return some value.
However, in some cases, you are to write a `void` method in which case, there should not be a `return`.

Additionally, you may use lambda expressions with a single return expression (_if necessary_).
You should not create new methods (_not even constructors_) or use blocks in your lambda expressions.

A typical misconception is to think that as long as there is only one `return` statement, the code is functional-style.
This is not correct if the code has other statements (_e.g.,_ assignments before the `return`).

---


## Mini Problem 1

### `Maybe<T>` I Can Get Good Grades

Now that we have our `Maybe` class, let's try to use it to do something more meaningful.

It is a common idiom (_although not a good one_) for a method to return a value if successful and return a `null` otherwise. It is up to the caller to check and make sure that the return value is not `null` before using it, to prevent receiving a run-time `NullPointerException`.

One example of this is the `Map<K,V>` implemented in Java. The relevant methods is the `Map::get` that returns `null` if the key that you are looking for does not exist.

We have given you a program `Lab6Mini1.java` that uses multiple layers of `Map` to store information about students, their modules, and their assessment grades. There is a method `getGrade` that, given this map, a student, a module, and an assessment, look up the corresponding grade. There are multiple checks if a returned value is `null` in this method.

Our new `Maybe<T>` class provides a good abstraction for the returned value from `Map::get` since the value returned is either some value or none!

Modify `getGrade` so that it uses `Maybe<T>` and is written in a functional-style.
If your code works, the output should still be the same as before which is shown below.

```
A
A-
A+
A
C
No such entry
No such entry
No such entry
```



## Mini Problem 2

### `Maybe<T>` I Can Earn a Lot of Money

!!! info "CS2030S AY2022-23 Sem 2 PA2"
    This mini problem is adapted from CS2030S AY2022-23 Semester 2 PA 2.

You are given three classes: `Pair`, `Account`, and `Bank`. You should read the given source codes to understand the behavior of each class and their interaction with each other.

Your task is simply to remove all conditional statements and all reference to `null` in the `transfer` method inside the `Bank` class (_reproduced below_):

```java
class Bank {
  // ... fields and other methods omitted ...
  void transfer(int from, int to, double amount) {
    Account fromAccount = findAccount(from);
    Account toAccount = findAccount(to);
    if (fromAccount != null && toAccount != null && fromAccount.getBalance() >= amount &&
        !fromAccount.isClosed() && !toAccount.isClosed()) {
      fromAccount.transferTo(toAccount, amount);
    }
  }
}
```

Note that you may not be able to rewrite `transfer` in a functional-style easily.
That is fine for now.
If you do have time, do try to rewrite it in functional-style.

!!! warning "Do NOT Change Behavior"
    This is a given, but the behavior of your code should not change after rewriting the implementation.

**Hint:** Your implementation should look something like this:

```java
Maybe<> fromAccount = ...;
Maybe<> toAccount = ...;
fromAccount.something(...);
```

This is not functional-style as we have two assignments before the third statement.
If your code works, the output should still be the same as before which is shown below.

```
Bank Status:
Acc ID: 1, balance: 100.00
Acc ID: 2, balance: 150.00
Acc ID: 3, balance: 90.00
Acc ID: 4, balance: 70.00 [Closed]

Bank Status:
Acc ID: 1, balance: 110.00
Acc ID: 2, balance: 140.00
Acc ID: 3, balance: 90.00
Acc ID: 4, balance: 70.00 [Closed]

Bank Status:
Acc ID: 1, balance: 110.00
Acc ID: 2, balance: 140.00
Acc ID: 3, balance: 90.00
Acc ID: 4, balance: 70.00 [Closed]

Bank Status:
Acc ID: 1, balance: 110.00
Acc ID: 2, balance: 140.00
Acc ID: 3, balance: 90.00
Acc ID: 4, balance: 70.00 [Closed]
```

!!! note "Follow Up"
    How would you change your implementation if `Account` class were **immutable**? What other steps do you need to do to update the state of the `Bank`?