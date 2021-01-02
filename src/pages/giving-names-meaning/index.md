---
title: Giving Names Meaning
date: '2021-01-02'
spoiler: 'Why it is important that names have a meaning and four guidelines that help you achieve that'
cta: 'react'
heroImageAlt: 'A stack of name tags with pens besides them'
---

# Giving Names Meaning

This article is the second of a series about naming.
In [the first one](/pay-more-attention-to-naming), I highlighted why naming is important and why we need to pay more attention to it.

This part will focus on what paying attention to naming can mean in practice. A deep-dive into the strategy and guidelines I try to stick to when I name things.

## Names Must Be Meaningful

There is a single goal that I try to reach when naming things: **The names I give must be meaningful.**

A meaningful name is a name that tells the reader what I want it to. It is not an arbitrary placeholder but a useful abstraction of what it contains.
It promises something to the reader and it also keeps that promise. It reuses words from other names when they represent the same idea. It doesn't use new words for existing things. 

### Fool Me Once, ...

With meaningful names, developers will learn to trust the names and reap the benefits of good naming.
They - and that means also you - will save time while reading and understanding existing code.

Unfortunately, the opposite holds true in an even stronger fashion. If you stumble over a name that doesn't keep its promise, you will grow suspicious of the names in the whole code base.
A single bad name will make every name around it less meaningful. It will cause you to spend more time assuring yourself that the code actually does what it claims to.
## Naming Guidelines

So far, we have been a bit abstract. Let's look at four concrete ways to make sure that your names are meaningful.

### #1 Use Exactly One Name Per Concept

Use the same word for things that are the same, and use different words for things that are different.

This goes for verbs as well as substantives or even adverbs or adjectives, if you come across any.
This is the most important rule, and unfortunately also the most tedious to enforce.
You will often need to propagate name changes through the whole codebase.

```jsx
function saveUser(user) { ... }

function saveCustomer(customer) { ... }
```
These two functions tell me that there are **two concepts** that exist here: **a user and a customer**, and they are **generally _not_ the same**.
If this is not true and every user is always a customer and vice versa, they should both use _the same word_ instead.

```jsx
function setUserEmail(email) { ... }

function updateUserEmail(email) { ... }
```
It's pretty hard to figure out what these functions do without reading their bodies. Will they set some local property only or will they send out a request to a server to store the data there?

If you are consistent with your naming, you will only ever need to read one of each and then you can transfer that concept into other places.

You could establish that `set` will always mean changing client-side data while `update` will change server-side data. Or the other way around - **just be consistent with it!**

**This also goes the other way around - don't reuse a single word for different things. Especially with things that only differ slightly, where the difference is easy to miss.**

### #2 Keep Your Promises

Whatever a name tells you, that's exactly what it should be or do - no exceptions.

```jsx
function setUserEmail(email) {
 if (!isValidEmail(email)) {
 return;
  }
 // ...
}
```

This function will silently do nothing if the email isn't valid. At the time of writing, such code might feel perfectly fine and well-designed. After all, we won't set an email that isn't valid, right? It's not fine at all.

**The function breaks the single promise it makes:
"I'm going to set the user email to what you want me to."**
It's essentially lying to us: it returns as if everything went fine when in fact it didn't do its job.

That silent early return is a bad design decision to begin with, but the fact that it's also not obvious to the caller makes it even worse.
This combination of bad naming and bad design can easily lead to bugs in our software. Will you remember that you set up this early return the next time you call `setUserEmail`?
How can you make sure your coworkers also keep that in mind?

This is an example of how good naming can reveal issues in the underlying code. It can't _solve_ the issue itself but it can at least _point it out_ and motivate us to fix it at its root.

If we want to fix the name, we should call it something like `setUserEmailIfValid`. Then we will at least be aware that the function will _possibly_ do nothing, and we can prepare for that case.

I know, the "if" in the function name feels awkward. It does to me, too, and I try to avoid it when I can.
Avoiding it however doesn't mean pretending that this case doesn't exist.
It means that we need to change the implementation.
That would have been the better design choice from the start, and now the original name is not a lie anymore:

```jsx
function setUserEmail(email) {
 if(!isValidEmail(email)) {
 throw new Error(`The email "${email}" is not valid`);
  }
 // ...
}
```

This is just one example for many cases where accurate naming can help you find issues with the underlying code and work around or fix them.

### #3 Use Accurate and Unambiguous Names

```jsx
let error;
```
Does `error` contain a boolean that is set to `true` when there was an error, or does it contain the actual error? Is it possibly even a function that we can call with a message when something went wrong?
We can't know unless we trace it back to where it gets set. Which error are we even looking at?

Depending on the context, `errorFromUpdate`, `hasError`, or even `didUpdateFail` would be much more meaningful.

```jsx
const tpl = readFile(...);
```

This is something I see way too often. What does `tpl` mean and what are we storing into it - is this a template? Why don't we call it `template`?

```jsx
function (err, res) { ... }
```

What is `err` - probably an error? Is `res` a response or a result?

Remember, your code will be read a multitude of times but it only needs to be written once. There's no need to save keystrokes while typing. You will even _save_ time with longer but unambiguous names!

This also goes for functions that do several things. No need to artificially shorten a name. If a function validates and updates a user email, why don't you call it `validateAndUpdateUserEmail`?
That's better than having to check each time if calling `updateUserEmail` will also validate the email first.

There are countless other ways for a name to be vague or ambiguous. The best way I've found to discover those is to **ask yourself two questions with every new name that you give:**
1. Is there any context or assumption that I had in my mind when I gave this name? Will it work the same way for my colleagues when they read it for the first time?
2. Is there any other way to interpret the name which isn't in line with what I thought?

### #4 Avoid Meaningless Suffixes

Don't give names that end with `Data`, `Info`, `Manager`, `Helper`, `Utils` or anything similar. These words are just noise, they don't add any meaning to the word that came before it.
After all, all we're doing with software is managing information or data and using helpers and utilities to do so.

This is another rule that will force you to solve problems at their root. Most of the time, the suffixes are just cheap ways to avoid refactoring or restructuring your existing code.
Better avoid those shortcuts and find the proper place to put your code.

Why don't you call your `UserData` just `User`? If there already is a `User` concept in your world: Should you maybe be using that instead? If it isn't really a `User` yet, maybe you're dealing with a `UserCreationIntent`?



## Try Them Out!

I find myself coming back to these guidelines almost every day at work. They help me write better code and give more helpful code reviews.

That doesn't mean this is the only way to approach naming. It works for the way I think and work. Maybe it does for you, too? Try it out and let me know what you think!

