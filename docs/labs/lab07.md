# Lab 07: Mini Problems

!!! abstract "Learning Objectives"

    Students should
    
    - be able to use `Stream<T>` in their code to replace loops.
    - be able to write functional-style code.


!!! info "Initializing"

    To get the files, run the following command from your PE node.
    We recommend creating a new directory called `mini` to store all your lab mini problems.

    ```bash
    cp -r ~cs2030s/mini/lab7/ .
    ```

    The files will only be available on Wednesday, 23 October 2024.


!!! warning "Class Files"
    We have given you a `.class` file from a badly written `Maybe<T>` as well as the functional interfaces used in the directory cs2030s/fp.
    These class files are compiled on the PE node, so we can only guarantee that they can work on the PE node.
    They may or may not work on other places especially on other operating systems.

---

## Mini Problem 1

!!! info "CS2030S AY2022-23 Sem 2 PA2"
    This mini problem is adapted from CS2030S AY2022-23 Semester 2 PA 2.
    
You are given two classes: `Product.java` and `Cart.java`.

### Product.java

`Product.java` is a class that represents a product in an e-commerce site.
Each product has

- an ID called `id`, with accessor `getID()`.
- a price called `price`, with accessor `getPrice()`.
- a name called `name`, with accessor `getName()`.

### Cart.java

`Cart.java` is a class that represents a shopping cart in an e-commerce site.
It keeps track the list of products added by the user using an `ArrayList`.
It has three methods

- `int totalCost()` that returns the total cost of all items in the cart.
- `long numOfExpensiveItems(int threshold)` that takes in a threshold price and return the number of items with the price greater than or equal to `threshold`.
- `product findByName(String name)` that takes in a `String` representing the product name and return the **first** product with that name.

### Shopping Spree

Rewrite the three methods in `Cart.java` above using functional style.


## Mini Problem 2

!!! info "CS2030S AY2022-23 Sem 2 PA2"
    This mini problem is adapted from CS2030S AY2022-23 Semester 2 PA 2.
    
You are given two classes: `Account.java` and `Bank.java`.
Additionally, we will be using `Pair.java` from the notes.

### Account.java

`Account.java` is a class that represents an account in a bank.
Each account has

- an account number called `accountNumber`, with accessor `getAccountNumber()`.
- an owner called `owner`, with accessor `getOwner()`.
- a balance called `balance`, with accessor `getBalance()`, and two mutators: `deposit(double amount)` and `withdraw(double amount)`.
- a flag to indicate if an account is closed or not called `isClosed`, with accessor `isClosed()`.


### Bank.java

Our bank is getting more popular and now we need to add more functionalities to it. The board members wants you to implement these methods:

- `double totalMoneyInBank()` that calculates the total money in the bank across all accounts; and
- `String allAccounts()` that return the details of all active accounts in the bank as a string, sorted based on their account balance.
- `Map<Integer, Account> multiAccounts() `that returns a map containing `Accounts` that belong to someone having multiple bank accounts. The key of the map is the account ID, and the value is the Account object.


### Endless Stream of Money!

You implemented these classes using for loops in no time. However, during code review, your manager (who is a big fan of functional programming) told you that these methods should be implemented using `Stream` for the sake of consistency. After all, you implemented the `transfer()` method using functional style.

To help you, your manager came up with a method `Stream<Account> getAccountStream()` that returns a stream of all accounts in the bank. He also gave you the documentation for Java's Stream API.
Equipped with the tools given by your manager, replace all `for` loops in `totalMoneyInBank()`, `allAccounts()`, and `multiAccounts()` using `Stream`!
We have indicated the lines you need to make into functional style as comments in `Bank.java`.