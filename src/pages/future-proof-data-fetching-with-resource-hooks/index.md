---
title: Future-Proof Data Fetching with Resource Hooks
date: '2020-02-23'
spoiler: 'Starting small but staying extensible by using the built-in reactivity and primitives in React - no additional library required'
cta: 'react'
---

I have been using very complex patterns for data fetching in React for a long time. Even for simple one-off fetching, I would bring in Redux- and Redux-Thunk. I wanted to avoid "refactoring everything" if our requirements became more sophisticated.

Even worse, I connected the external state container directly to each component. Every component had its own lifecycle method for starting the fetching of a resource. The same with the selectors. I had to change every single `mapStateToProps` function to introduce independent loading states.

This is not an issue with the library itself but one with how I used it. React offers excellent ways to build non-leaking abstractions for data fetching. Especially with hooks, we don't even need an external state container. A small start with all the options for expansion.

Let’s dive into it: Starting small.

## The Initial Fetch

This is probably the most common use-case and often where applications start off. We want to show some information in our UI, and we need to fetch it from a server. We will do this with a very common strategy called [“fetch-on-render”](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-1-fetch-on-render-not-using-suspense).

Let’s take a look at this bare-bones twitter post component:
```jsx{2}
function TweetDetails({ tweetId }) {
  const { tweet, tweetFetchingError } = useTweet(tweetId);

  if (tweetFetchingError != null) {
    return (
      <p>
        There was an error fetching the Tweet: {tweetFetchingError.message}
      </p>
    );
  }

  if (tweet == null) {
    return <p>Fetching Tweet...</p>;
  }

  return (
    <>
      <p>{tweet.text}</p>
      <p>{tweet.favorite_count} 🤍</p>
    </>
  );
}
```
Note that the component itself does not do any data fetching. No lifecycle methods, effects, or even state have been set up here. It only consumes a useTweet hook and maps the possible return values to a UI representation.

useTweet is a _resource hook_. It provides a clear abstraction over the fetching of a tweet resource. It outputs three possible states:
- We are waiting for data to arrive. Both `tweet` and `tweetFetchingError` are `null`. You can also make this more explicit with an `isFetchingTweet` property, if you prefer that.
- We received data. `tweet` contains the resource.
- Something went wrong. `tweetFetchingError` contains an `Error` instance.

Let’s have a look at how we could implement the hook:

```jsx{11,17}
function useTweet(tweetId) {
  const [tweet, setTweet] = useState(null);
  const [tweetFetchingError, setTweetFetchingError] = useState(null);
  const latestTweetId = useRef(null);

  useEffect(async () => {
    try {
      latestTweetId.current = tweetId;
      const fetchedTweet = await fetchTweet(tweetId);

      if (latestTweetId.current === fetchedTweet.id) {
        setTweet(fetchedTweet);
      }
    } catch (fetchingError) {
      setTweetFetchingError(fetchingError);
    }
  }, [tweetId, fetchTweet]);

  return { tweet, tweetFetchingError };
}
```
The `useEffect` hook implements the “fetch-on-render” strategy. It triggers a new fetch after the first render or whenever the `tweetId` parameter changes. The [dependencies array](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) given to useEffect makes sure of that.

Inside the effect, we use a `fetchTweet` function which does the actual data fetching. _How exactly_ it does that is not relevant. Only that it returns a `Promise` which will either resolve with a tweet or reject with an `Error`.

The `latestTweetId` ref might be the most complex part of this hook. We need it to fix a subtle race condition:

Let’s assume that the effect was just executed and it triggered a request. If we change the `tweetId` before that request came back with a response, we trigger a new request. This creates a race condition between the old request and the new one. Whichever tweet comes back _last_ will be the one that stays in the UI - even if it is the one with the outdated tweet ID. To avoid the race condition, we only store the tweet in our state if it is the _latest_ one that we requested.

With 20 lines of code, we created a complete reactive abstraction around the resource. It even hides the fetch-on-render strategy. If any component wants to display a tweet, dropping a `useTweet` hook into it will be all that we need.

## Resource Updates
Fetch-on-render only gets you so far when building interactive applications. To showcase extensibility, let’s add a new feature to our tweet component: Liking tweets ♥.

To like a tweet, we need to make another HTTP request. Only this time, it’s the consequence of a button click and not a side effect of rendering.

The extended tweet component could look like this:
```jsx{2,19,21}
function TweetDetails({ tweetId }) {
  const { tweet, tweetFetchingError, likeTweet, unlikeTweet } = useTweet(tweetId);

  if (tweetFetchingError != null) {
    return (
      <p>
        There was an error fetching the Tweet: {tweetFetchingError.message}
      </p>
    );
  }

  if (tweet == null) {
    return <p>Fetching Tweet...</p>;
  }

  async function toggleLike() {
    try {
      if (tweet.favorited) {
        await unlikeTweet();
      } else {
        await likeTweet();
      }
    } catch (error) {
      alert(`Something went wrong: ${error.message}`);
    }
  }

  return (
    <>
      <p>{tweet.text}</p>
      <p>
        {tweet.favorite_count}
        <button type="button" onClick={toggleLike}>
          {tweet.favorited ? ❤ : 🤍}
        </button>
      </p>
    </>
  );
}
```
We added two new functions to the public interface of the `useTweet` hook. These are not common global functions that we import from an API utility wrapper. We return them from the hook! We will see in a minute why this is important.

We call these updater functions when the user clicks the heart icon below the tweet. We assume that both functions return a Promise. We await their result and if something goes wrong, we tell the user about it.

Note that the `tweetFetchingError` should not change when something goes wrong with _liking_. We keep these errors separate by design so that we can handle them differently.

The implementation of these two new functions could look as follows:
```jsx{8,11,16,18,25,26}
function useTweet(tweetId) {
  const [tweet, setTweet] = useState(null);
  const [tweetFetchingError, setTweetFetchingError] = useState(null);
  const latestTweetId = useRef(null);

  useEffect(/* same as before */);

  async function likeAndStoreUpdatedTweet() {
    const updatedTweet = await likeTweet(tweetId);
    if (latestTweetId.current === updatedTweet.id) {
      setTweet(updatedTweet);
    }
  }

  async function unlikeAndStoreUpdatedTweet() {
    const updatedTweet = await unlikeTweet(tweetId);
    if (latestTweetId.current === updatedTweet.id) {
      setTweet(updatedTweet);
    }
  }

  return {
    tweet,
    tweetFetchingError,
    likeTweet: likeAndStoreUpdatedTweet,
    unlikeTweet: unlikeAndStoreUpdatedTweet,
  };
}
```
In the `(un)likeAndStoreUpdatedTweet` functions, we use Promise-based `(un)likeTweet` functions. They mark the tweet as liked or not on the server and resolve with the complete updated resource from the back end. This is possible because the Twitter API responds with the updated tweet when we send a [like](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-favorites-create) or [unlike](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-favorites-destroy) request. Many REST APIs follow this pattern to avoid extra round trips.

I want to highlight three things about the updater functions.

Firstly, it is important that we `await` the updates. Like that, the component which consumes the hook can do the same on our returned functions. This is necessary for showing a submitting UI and for error handling as above.

Secondly, we should not `return` anything from the updaters. A `Promise<void>` is fine for error handling or displaying a submitting state. I specifically discourage you from returning the updated resource. Otherwise, the person who uses our hook might think they need to store it in another local state slot. Better not tempt them to introduce a second source of truth 😉

Thirdly, let's focus on how we update the UI. To show the changed like count, we store the resource from the response in the local hook state. We call `setTweet` from _within the hook_. This is why the updaters need to be part of the hook and not a regular import.

To avoid race conditions here again, we also need to apply the race condition remedy we saw before.

## Multiple Components Showing the Same Resource

I mentioned the topic of having a non-leaking abstraction in the beginning. This is essential. It allows us to change implementation details without breaking existing code. 

As an example, let’s assume that our twitter application should grow. It gets a timeline view on the left and a detail view of a selected tweet on the right. The timeline is always visible. This means it is possible for one and the same tweet resource to be used by two components at the same time.

With our current hook, this new feature can lead to inconsistent information in our UI:
- If the user clicks the like button on one side, we will only update one local state with the updated resource. The user will not see the updated like count or the red heart on the other side.
- Even without interaction from our own user: Other users might like tweets, too. If that happens between opening the timeline and a detail view, the like counts also will not match.

In both cases, the user would need to reload the whole page or reopen all pieces of UI to get rid of the inconsistencies. Let’s try to avoid that.

We need to make sure that both components use the exact same copy of the resource when rendering. We will achieve that by setting up a common tweet cache on the [context](https://reactjs.org/docs/context.html).

```jsx
const tweetCacheContext = createContext({});

function TweetCacheProvider({ children }) {
  const [tweetCache, setTweetCache] = useState({});

  function getCachedTweet(tweetId) {
    return tweetCache[tweetId];
  }

  function cacheTweet(tweet) {
    const updatedTweetCache = {
      ...tweetCache,
      [tweet.id]: tweet,
    };
    setTweetCache(updatedTweetCache);
  }

  return (
    <tweetCacheContext.Provider value={{ getCachedTweet, cacheTweet }}>
      {children}
    </tweetCacheContext.Provider>
  );
}
```
With a `<TweetCacheProvider>` at a common point above our components, we can adapt the hook:
```jsx{2,12,22,29,34}
function useTweet(tweetId) {
  const { getCachedTweet, cacheTweet } = useContext(tweetCacheContext);
  const [tweetFetchingError, setTweetFetchingError] = useState(null);
  const latestTweetId = useRef(null);

  useEffect(async () => {
    try {
      latestTweetId.current = tweetId;
      const fetchedTweet = await fetchTweet(tweetId);

      if (latestTweetId.current === fetchedTweet.id) {
        cacheTweet(fetchedTweet);
      }
    } catch (fetchingError) {
      setTweetFetchingError(fetchingError);
    }
  }, [tweetId, fetchTweet, cacheTweet]);

  async function likeAndStoreUpdatedTweet() {
    const updatedTweet = await likeTweet(tweetId);
    if (latestTweetId.current === updatedTweet.id) {
      cacheTweet(updatedTweet);
    }
  }

  async function unlikeAndStoreUpdatedTweet() {
    const updatedTweet = await unlikeTweet(tweetId);
    if (latestTweetId.current === updatedTweet.id) {
      cacheTweet(updatedTweet);
    }
  }

  return {
    tweet: getCachedTweet(tweetId),
    tweetFetchingError,
    likeTweet: likeAndStoreUpdatedTweet,
    unlikeTweet: unlikeAndStoreUpdatedTweet,
  };
}
```
Instead of local state directly in a `useState` hook, the single source of truth now lies in the tweet cache in the context provider. This means there is always only one version of a tweet - the one from the latest fetch or update, no matter which component it came from.

Apart from making our UI consistent, the cache brought some other important changes. With a populated cache, our application will behave differently in certain scenarios.

Before, each `useTweet` hook started out with an empty state and produced a loading view. The hook might now return a cached copy of a tweet right away. If so, the component will instantly render the full UI based on the cached copy. This can make the application feel a lot snappier.

In any case though, the `useEffect` hook will trigger a refetching of the tweet. This is important so that we don’t rely entirely on the cached copy. We show fresh information as soon as possible. In other scenarios, you might want to do more cache management. You could for example evict resources from the cache when a request returns with status 404.

There are applications in which you _absolutely_ need to avoid unnecessary rerenders. For such cases, you should know that the `useTweet` hook will now cause a rerender on _every_ cache update. We will be able to avoid this once the [useContextSelector](https://github.com/reactjs/rfcs/pull/119) hook lands. Until then, you might want to [take other measures for optimization](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

## The Bottom Line

With this refactoring, the most important advantage behind resource hooks became visible. We moved all our resources into a central cache _without changing a single component_. If we ever want to introduce an external state container, we can do so in the same way. But we don't _have to_ do it, especially not right from the start.

When adding the liking feature, we also only touched components for changes in the rendered UI.

All this only works because the resource hook - and not a component - decides
- when to fetch the resource
- where to store it
- when to update it
- if and how to share it

It allows us to gradually expand the logic inside our hook as our requirements grow. 

I’ve been using this pattern on my current project for the past year and I’ve been really happy with it. Give it shot, and let me know how it goes! Or if you rather wouldn’t, let me know why!
