---
title: Pay More Attention to Naming
date: '2020-12-30'
spoiler: 'I''ve seen bad naming cause countless bugs and problems that cost real time and money. Here''s why that happens and how to avoid it.'
cta: 'react'
heroImageAlt: 'A bamboo forest with names carved into the canes'
---

Many things are moving super fast in software development.
Especially in the front end community, it's hard to follow every new hype.
It's also completely unnecessary! I know that the hot new topics dominate twitter and medium.
That doesn't mean that they're the best use of our time. 

Software development is both a craft and an art.
If we want to be good at it, we want to nail the basics before spending a lot of effort on the details.
A carpenter needs to know how to build stable furniture before building a cupboard.
Especially if it's supposed to be one that follows the latest trends in interior design.

I'm writing this article because I've seen way too many rickety cupboards.
They look nice and modern but under the weight of everyday use, they creak and bend - and sometimes even break.

A carpenter's basics might be geometry or mechanics. Our most important one is naming.
It's a powerful tool that can solve complete classes of problems even before they arise.
Others that it doesn't solve right away often become more visible with careful naming.

## Why Naming is So Important

Good naming alone doesn't make a good code base, but it can set you out on a pretty good start.
Bad naming can definitely break it.
That's because anything we write down is not only there for the machine to execute. Our colleagues and our future self will need to read it again at some point, and then build on top of it. That's why bad naming is also contagious.

Typing out actual code is almost always the last step of a series of things that we commonly call "writing code".
Ironically, we spend the majority of time not writing but _reading_.
We read what's already there and figure out what it does.
Once we have understood enough of it, we start thinking about how we need to change it so that it does what we want it to.
Only after that we start typing.

> Indeed, the ratio of time spent reading versus writing is well over 10 to 1.
> We are constantly reading old code as part of the effort to write new code.
> ...[Therefore,] making it easy to read makes it easier to write.
>
>-- <cite>Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship</cite>

**Since we spend the vast majority of time reading, we should optimize our code for that.**

Let me describe two extremes of how I've experienced good and bad naming change this process.

### Well-Named Code

A well-named piece of code tells me exactly what it does without making me think too much.

It uses the same name for things that are the same and different names for things that are different from each other.
It creates a clear mental model in my head which matches the actual behavior once I run the code.

I don't need to spend a lot of time digging into where a value comes from or what a function does.
I can trust their names.
They always do exactly what they promise, no surprises.

When I add more code, I find it easy to reuse existing names since I have understood what they mean. 

There aren't any unforeseen side effects from my changes. No room for misunderstandings that would break existing behavior.

### Badly-Named Code

A badly-named piece of code makes it hard for me to figure out what it does.
I'm unsure if it's super complex because its requirements are or if it simply doesn't follow any consistent naming scheme.

It seems to be using several names for what looks like the same thing to me.
It also uses the same name for different things and I'm unsure which should be which.

I need to navigate many different layers of function calls and trace variable assignments because their names aren't reliable.
Sometimes they lie to me or hide specific side effects or edge cases.
I have to create a mental translation layer to be able to make assumptions about what the code does.

At some point, I might even feel overwhelmed with the complexity.
I'll need someone to explain the code to me.
If that's not possible, I'll resort to trial and error to figure out which parts I'll need to change to reach my goal.

In my newly-added code, I try to use names that roughly match what's already there, as best as I can.
I'm not sure if I'm using them correctly though.

In the end, I've made the code even harder to understand.
I'm not even sure if I didn't add any bugs because of misunderstandings.

---

Bottom line, good naming helps us work faster, with more confidence, and with high quality.
Bad naming makes our jobs harder and it will make code decay much faster.



## Why Naming is Hard

The reason why we need to pay attention to naming is because it's _hard_.
We won't do a good job at it if we don't pay attention to it.
We will miss edge cases, details and intricacies.
We will accidentally use the same name for two different things.
We will use ambiguous or vague terms without realizing it.
And anyone building on top of the names we chose might inadvertently do the same.

**To give a good name to something, we must have understood it well enough, if not entirely.**
Then we need to find a good description for our understanding: **Words which will invoke the same thoughts in other people's minds.**

> Naming is the art of determining the true essence of a thing
>
> <cite>-- [The Kingkiller Chronicle Wiki about Naming](https://kingkiller.wiki/w/Naming)</cite>

Understanding something deeply takes time and effort, but at least this understanding will enable us to correctly build on top of it.

Finding a good name for what we built is extra effort. 
It is also not necessary for making the code work as it should.
**Names are for humans and not for machines**, after all. 
That's why we often neglect this part, imposing a debt on whoever will have to work with this code afterwards.
We're not doing anyone a service with that though. Especially since the person coming back to the code will often be our future selves.

The most complex part about naming isn't what we write down into the code.
It's the assumptions we make _when we select our words_.
Most often, we write code in English.
The actual words and phrases we use are usually a mixture of technical terms (e.g., "submit") and business concepts (e.g., "add to cart").
All good intentions with careful naming are in vein if _your_ interpretation of submitting doesn't match your coworkers' ones.
That's why **it is crucial to use the same names in both code and conversations with your colleagues**.
Otherwise you will never find potential mismatches.

Also never shy away from a naming discussion in a pull request!
You might be on to a bigger mismatch of assumptions.
You could even uncover unknown bugs in your code base.

## Start Practicing!

With all these thoughts, you might understand that I don't believe one can be "done" learning how to name things.
Naming always depends on the challenge in front of you and the people around you.
That's why our naming skills need to grow with every new topic and project.
I'm also constantly trying to improve at it, and I will continue until I stop writing code.

All the more reason to practice!

If you're now thinking: "OK, but where do I start?": Go ahead and read [my follow-up article](/how-to-give-meaningful-names) with four concrete guidelines that help you find good names for things, including examples for each one.