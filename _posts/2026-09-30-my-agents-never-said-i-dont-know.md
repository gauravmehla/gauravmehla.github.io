---
title: "My Agents Never Said \"I Don't Know\""
description: One of my agents was confidently wrong just often enough to matter. Fixing it taught me that agents can write code, but they can't replace it.
---

There's a tempting idea going around right now. Why write code at all, when you can just ask an agent to do the task every time?

For a while, one of my projects worked exactly like that. It's an agent that takes messy input, like photos, exports and half-finished documents, and turns it into clean records I rely on. I'd hand it the input, and it would read it, work out what had changed, update everything, and tell me the result. No real code in the middle, just the agent.

It felt like the future. Mostly, it worked.

## The problem with "mostly"

"Mostly" is fine for a lot of things. It's fine for a first draft, a summary, or an idea to bounce around. It's not fine for something you rely on to be right.

The agent never crashed and never threw an error. Every so often it was just a little bit wrong: something counted twice, something quietly skipped, a number estimated when it should have been looked up. And it was wrong with exactly the same confidence it had when it was right.

That's the part that matters. An agent doesn't say "I don't know." It gives you an answer that sounds finished. When it's wrong, nothing tells you. You find out later, if you find out at all.

## A brilliant reader, an unreliable calculator

The easiest way I've found to explain it is this: an agent is like a brilliant reader who is an unreliable calculator.

Hand it a blurry photo or a messy document, and it will tell you what's in it better than any code I could write. That's real magic, and I wouldn't give it up.

But ask that same reader to add up a long column of numbers in their head, every week, forever, and never slip once? You wouldn't. Not because they aren't smart, but because that isn't a job for judgement. It's a job for a calculator: something that gives the same answer every time, and that you can check.

Code is the calculator. It does exactly what it says, the same way every time. You can test it, and you can prove it's right before you rely on it. When it doesn't know something, you can make it stop and ask instead of guessing.

## So I split the job

This week I drew a line through the middle of the project.

**The agent reads.** It looks at the messy input and says what's in it. That's the part that needs intelligence.

**Code writes.** Everything that changes my data now goes through plain code that follows the same rules every time. It doesn't add something twice. It doesn't quietly overwrite something that changed; it holds it for me to look at. It doesn't skip what it doesn't understand; it stops and says so. And when it isn't sure, it leaves the field empty and waits for me instead of filling in a confident guess.

To check the new version, I ran a real update through it and compared the result with what the agent had produced on its own. They matched, and now I know *why* they matched.

## The twist: an agent wrote the code

Here's the part I find most interesting. I didn't write most of that code by hand. I wrote it together with a coding agent.

So an agent was involved either way. The difference is *where* its work ends up. When the agent does the task directly, its work is gone the moment it answers. You get a result, and you have to trust it. When the agent writes code, its work sticks around as something you can read, test and run a thousand times, and it gives the same answer every time.

That's the whole idea in one line: **Agents can write the code, but they can't replace it.**

If anything, agents make it *easier* to choose code. Writing the careful, boring version used to be the expensive option. Now it's an afternoon. There's less excuse than ever to skip it.

## "Soon they'll just write the binary"

A few weeks ago I heard a prediction that has stuck with me. Since agents can write code, the argument goes, we won't need programming languages much longer: no high-level languages, no low-level languages, no compilers. The agent will just output the raw binary, the ones and zeros the machine runs.

I understand why it sounds plausible. After this week, I think it gets the job of code backwards.

Agents and code are good at completely different things. **An agent gives you generalisation.** It can handle input it has never seen before and make a sensible call about something nobody wrote a rule for. **Code gives you reliability.** It does exactly what it says, the same way every time, and you can check that before you trust it.

Code isn't perfect. It has bugs. But a bug in code is wrong *the same way every time*, so you can find it, understand it, and fix it once. An agent's mistakes come and go, and they look exactly like its correct answers.

Programming languages and compilers were never really for the machine. The machine would happily run raw binary. They're for *us*, so a person can read what the program will do, review it, and reason about it. A compiler is a check that refuses to continue when something doesn't add up. In other words, it's a system that says "I don't know."

An agent that skips all of that and hands you raw binary gives you back exactly the problem from my project, at the lowest level there is: an answer that looks finished, that nobody can read, and that you simply have to trust. I don't want less code because agents can write it. I want more code that I can read, written faster.

## What I'd tell anyone building with agents

- **Use the agent where you need generalisation:** reading, understanding, explaining.
- **Use code where you need reliability:** counting, changing data, following rules.
- **Make it fail loudly.** A system that stops and asks is better than one that quietly guesses.
- **Let the agent write that code.** Then test it like you would any other code.

Agents are a new kind of tool, and a remarkable one. But they're a tool *for* building software, not a replacement for it.
