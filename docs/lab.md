# CS2030S Programming Exercise Guide

## GitHub Setup 

You need a one-time setup at the beginning of semester to link your PE account to your GitHub account.  Following [the instructions here](github.md) to set up your GitHub account for CS2030S.

## Vim Setup

You need a one-time setup at the beginning of the semester to install the standard vim configuration, color schemes, and plugins.  Follow [the instructions here](vim/setup.md) to set up your Vim for CS2030S.

You will not be able to retrieve an exercise if the expected Vim-related directory cannot be found. 

## GitHub Classroom

We will use GitHub Classroom for our programming exercise release and submission for CS2030S.

Here are what you need to do for every programming exercise:

### 1. Accept the Programming Exercise

Make sure that you have logged into GitHub.  

!!! warning "WARNING"
    If you have multiple GitHub accounts, make sure you use the one with the same GitHub username you have submitted to us.

Click on the given URL to accept the programming exercise. 

A repo will be created automatically for you.

!!! warning "WARNING"
    Do not interact with the programming exercise repo directory using GitHub or other `git` commands.


### 2. Read and Understand the Programming Exercise Task

The programming exercise question will be given in a link on Canvas.

Read through the question carefully before starting your programming exercise.


### 3. Get a Copy on PE Hosts

Run the command `~cs2030s/get exX` (where `X` is the programming exercise number) to clone a copy of the programming exercise on your home directory.  You will see a new directory named something like `exX-username` created, with the skeleton files and questions inside.

You can edit the code, compile, test, etc, on the PE hosts.

You can open two files side-by-side with `vim -O file1 file2` or in different tabs with `vim -p file1 file2`.

!!! warning "WARNING"
    Do not edit your code directly on GitHub.

### 4. Submit a Copy 

When you are ready to submit, run `~cs2030s/submit exX` (where `X` is the programming exercise number).  This will submit a copy to GitHub.  You can submit multiple times, but only the last copy will be graded.

!!! warning "WARNING"
    Do not use `git push` or other `git` commands to submit your code to GitHub.

### 5. Receiving Feedback

The tutors will grade and comment on your submission on Github after the deadline.  You should receive both your comments and your preliminary marks on GitHub.  You can reply to their comment, etc, on GitHub as well.  Communicate with your grader via Ed (or directly if they preferred) if you think the grading is unfair.

!!! warning "WARNING"
    Do not change your code on GitHub after the deadline (by either re-running `submit` or using `git` commands directly).  If you wish to improve upon your code after feedback from the tutors, replicate it in your own personal repo.

Your submission will also be automatically graded by a bot.

### 6. Feedback Reports

A file named `feedback.md` summarizing your marks will be placed into your GitHub repo.

!!! danger "IMPORTANT WARNING"
    If it is not clear to you by now, let us repeat: You should only interact with your programming exercise submissions on GitHub using the provided scripts `get` and `submit`.  Failure to do so will break our workflow and will not be appreciated.  We may deduct marks for students who do not follow this instruction.

    If you accidentally break your repo by running `git` commands on it or edit it directly on GitHub, you should save a copy of your code elsewhere, then reset your programming exercise directory, by (i) requesting your tutor to delete the repo on GitHub, (ii) deleting the corrupted programming exercise directory on PE nodes, (iii) go through Steps 1 and 2 again, then copy back your edited code into the programming exercise directory.

### Dealing with Submission Errors

It is the student's responsibility to ensure that the code is submitted correctly, by checking the GitHub website.  There is no grace period for students to get familiarized with the code submission process.  However, you can still earn 5% towards the final grade even if you miss some programming exercises.

### Dealing with Broken Computers at Home, etc.

The School of Computing has more than 350 computers in various programming labs for students to use.  We do not accept excuses such as broken computers or the Internet at home as justification for late submission.  You can search for available slots in which a programming lab does not hold a class via [nusmods](https://nusmods.com/venues).


## Timeline

The graded programming exercises are released before every Thursday at 8 am, with a deadline (usually Tuesday night in the following week) given.  You must submit each programming exercises before the deadline.

No late submission is accepted for all CS2030S formative assessments, include programming exercises. Students, however, are given the leeway as there are more marks available than what will be awarded.


## General Advice

You are advised to (i) spend some time thinking before you begin coding, (ii) practice incremental coding, and (iii) test your programs thoroughly.

Remember to spend some time thinking about the design and approach to solving each question.

Incremental coding means do NOT type in the whole long program in a single session and then compile it. Instead, type your program in bits and pieces and compile it incrementally. Try to maintain a compilable program even while you are working on it. Submitting a compilable program that partially works is better than submitting an un-compilable one; this is especially important for your practical exams.

You should test your program thoroughly with your test data before submission.

You may assume that all input data are correct unless otherwise stated. Hence, you do NOT need to do input data validation. This is to allow you to focus on getting the program right, instead of worrying about making your program fool-proof.

## Peer-Learning

We encourage students to discuss and seek help from each other and from the lab tutors if they are stuck.  Ed is a great forum for that.  However, do note that while students are encouraged to _discuss the approach_ to the solution, students are _expected to write their code independently_.  Copy-pasting of code or coming up with the code together, line-by-line, is considered [plagiarism](lab.md#plagiarism).

All programming exercises are designed to be completed within half a day.  If you get stuck on an issue for longer than that, you should talk to others.

If you are discussing with other students on specific exercise or task, please document the discussion with the following information as comments in the program so we can keep track of them in case your submissions are flagged as plagiarism.  However, for codes that are blatant copying, no amount of documentation will suffice.

```java
/* Discussion
 * - Participants: Deadpool & Wolverine
 * - Discussion: The class diagram without specific method name.
 */
```

Both parties must provide the documentations similar to the above.  If you are using AI, please document the AI as one of the participant.  Additionally, document the prompt used and the response given.

```java
/* Discussion
 * - Participants: Me, Myself, & AI
 * - Prompt: What is the airspeed velocity of an unladen swallow?
 * - Response: An African or European swallow?
 */
```

## Submissions with Compilation Errors

Writing code that compiles without any compilation error is the most basic requirement for all our programming exercises and practical assessments.  You will the lowest possible score for the given exercise if your code cannot be compiled.

## Identifying Yourself

In every Java file that you submit, you need to identify yourself by writing your name and lab group. Marks may be deducted if you fail to do so. You need to edit the line:

```
@author XXXX (Group YYYY)
```

and change it to something like:

```
@author Deadpool (Group 9A)
```

## Method of Submission

Please follow the instructions above to submit your homework.  Programs submitted through other means, such as emails, will NOT be accepted.

## Use of Ed

If you have doubts about the problem statements of an assignment, you may raise them on Ed.  But before that, please read through the problem statements carefully first, and check if the same questions have been asked and answered on the forum.

Please exercise discretion when posting to Ed.  Before the deadline, you are NOT to post the solution to the assignment, complete or partial, on Ed (or any publicly accessible online site).

## Disallowed Syntax

Some programming exercises may explicitly disallow the use of certain syntax.  If the objective of the exercise is undermined due to the use of forbidden syntax, the penalty will be heavy. If in doubt, please ask for clarification on Ed.

## Plagiarism

While we encourage discussions among students for programming assignments, each student should be responsible for writing his/her own code and should give credit to others when appropriate.

NUS and the School of Computing have a high standard of academic honesty and take any violation seriously. In the context of computing modules, source code plagiarism -- copying code from another source and attributing it as one's own code -- is a serious violation. Please read the page [Preventing Plagiarism](https://www.comp.nus.edu.sg/cug/plagiarism/) from the school's website to familiarize yourself with the policy.

We adopt a "no mercy" policy when it comes to disciplinary action on plagiarism. Both parties, the student who copied, and the student who allowed others to copy, will be penalized equally.

This means that you should also guard your solution carefully, not posting them to publicly accessible places, not changing the permissions of the files on the PE hosts so that it is accessible by others, ensuring your computers are locked when not in use, _etc_.

Copying others' programs will only offer a short-term reprieve. When Practical Assessment (PA) time comes, your inadequacy will be exposed and the consequence would be dire.