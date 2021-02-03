---
title: How Jest Mocks Your Imports
date: '2021-02-03'
spoiler: "What jest.mock does might look trivial but it's not, especially when ECMAScript modules come into play"
cta: 'react'
heroImageAlt: 'A panel with plugs, buttons, and dials'
---

I recently had a discussion with a colleague about a test which wouldn't work. As it turned out, they were trying to use `jest.mock` to replace a module that the tested file imported. Only that they weren't using it in the _intended_ way.

This article should give you a deeper insight into why there even _is_ a wrong way of using `jest.mock` - and why I would prefer to have an explicit keyword similar to the ESM `import` instead of the function API we see now.

## The Gist

If you're not interested in the details and inner workings of all of this, just take the following with you and you'll probably be totally fine:

**Always put `jest.mock` calls at the top of the file, right after the last `import` statement. Never call `jest.mock` inside `describe`, `it`, `test`, or any other function block.**

If you're interested where this rule comes from, just read on!

## Let's Start With An Example 

Let's assume we have a function that fetches a given Pokémon from the PokéAPI. We'll be using the excellent [ky](https://github.com/sindresorhus/ky) library for that:
```javascript
// fetchPokemon.js
import ky from 'ky';

export default function fetchPokemon(name) {
    return ky.get(`https://pokeapi.co/api/v2/${name}`);
}
```

Then in the corresponding unit test, we would usually want to avoid that an actual HTTP request gets sent. In our case, we could mock out ky in its entirety. `jest.mock` is a great tool for that:
```javascript{5}
// fetchPokemon.test.js
import fetchPokemon from './fetchPokemon';
import ky from 'ky';

jest.mock('ky');

describe('fetchPokemon', () => {
    it('calls ky.get with the expected URL', () => {
        fetchPokemon('squirtle');
        expect(ky.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/squirtle');
    });
});
```

Now let's take a closer look at what this does.
Judging from the sequence of statements, one might think that `jest.mock` will replace the given module _when it is called_, for any code that comes after itself. Technically, that's kind of what it does. It's still not the whole truth.

Let me illustrate what I mean with a simplified experiment:

```javascript{3,7}
import thing from './thing';

console.log(thing.mock != null); // Is this a mock?

jest.mock('./thing');

console.log(thing.mock != null); // How about now?
```

What do you think is the output of this?

It might be surprising that both `console.log` statements in fact log `true`! `thing` seems to be a mock right from the start, even though `jest.mock` is only called after the first `console.log`. How come?

## Deep-diving Into It

The reason for this is that jest is not actually executing the code as we see it. 

Jest internally compiles your test code with [babel](https://babeljs.io/) and a plugin called [babel-jest](https://www.npmjs.com/package/babel-jest). This plugin is what enables jest to replace imports before they are actually used. More specifically, it's [babel-plugin-jest-hoist](https://www.npmjs.com/package/babel-plugin-jest-hoist). The package description states the following:

> Babel plugin to hoist `jest.disableAutomock`, `jest.enableAutomock`, `jest.unmock`, `jest.mock`, calls above `import` statements.

Let that sink in for a second: This plugin will move all `jest.mock` calls _above_ import statements? You might be asking yourself: Is it even possible to execute code before `import`s are resolved?

It's not.

`import` statements are implicitly hoisted to the top of the file, similar to `function` statements. This means the following code is perfectly fine:
```javascript
ky.get('https://pokeapi.co/api/v2/squirtle');

import ky from 'ky';
```
It's fine because the `import` will still run first.

This also means that, if the following really was what jest executes, `jest.mock` _couldn't possibly_ be run before the import is evaluated:
```javascript
jest.mock('ky');

// This will be evaluated first
import ky from 'ky';
```
Let alone set up a mock for an import that _another_ imported module will do:
```javascript
jest.mock('ky');

// fetchPokemon will in turn import ky first
import fetchPokemon from './fetchPokemon';
```

So how does jest get a chance to replace the import, then?

Jest also changes all ECMAScript `import`s into CommonJS `require` statements. Those are not hoisted anywhere. They stay right where they are, in the same execution order in which the babel plugin put them.

This means our first experiment will in fact be turned into:
```javascript{1,3}
jest.mock('./thing');

const thing = require('./thing');

console.log(thing.mock != null); // Is this a mock?

console.log(thing.mock != null); // How about now?
```

And now it's pretty obvious why both `console.log`s logged `true`.

## Why I'd Prefer a Different API

This also highlights why I'm unhappy with the function call API of `jest.mock` when combined with ECMAScript `import` statements. Without knowing that Jest does all these transformations in the background, it's pretty surprising to see how this seemingly regular function call behaves.

Since Babel is already part of this feature, we might as well go all the way and define a new keyword for mocked imports. This will at least highlight that something special is going on here. I would propose a `mock` keyword like:
```javascript{3}
// fetchPokemon.test.js
import fetchPokemon from './fetchPokemon';
mock ky from 'ky';

describe(/* ... */);
```

If this looks a bit too radical, I could also imagine an import path prefix, [inspired by AdonisJS 5](https://preview.adonisjs.com/blog/introducing-adonisjs-v5/#esm-imports-all-the-way):
```javascript
import ky from '@mocked:ky';
```

## What Do You Think?

I realize the `mock` keyword is a controversial suggestion. The prefix approach might look more magical but it would integrate better with existing tooling. I believe either of them would make it clearer what's going on, especially when combined with ECMAScript `import`s.

Maybe you have an even better idea? Let's discuss!
