---
title: Future-Proof Data Fetching with Resource Hooks
date: '2020-02-23'
spoiler: 'Starting small but staying extensible by using the built-in reactivity and primitives in React - no additional library required'
cta: 'react'
---

Many people in the React community are using patterns for data fetching which are unnecessarily complex, hard to expand, or both.

In _anticipation_ of more complex future requirements, a lot of developers reach for a Redux- and Redux-Thunk-based setup with lots of steps and layers even for simple Fetch-on-Render use-cases.

Even worse, the external state container is often connected directly to the component lifecycle. Every component decides on its own when and with which arguments to trigger the fetching of a resource. This makes it hard to extend or refactor later on. It can be _very_ frustrating to find out that you cannot show two independent loading states for two resources of the same kind without changing _every connected component_.

I believe this is not a library issue but one with how the library is used. Especially with hooks, React offers excellent ways to build _non-leaking abstractions_ for data fetching that don't require an external state container. A small start with all the options for expansion.

Let's dive into it: Starting small.

## The Initial Fetch

This is probably the most common use-case and often where applications start off. We want to show some information in our UI, and we need to fetch it from a server. We will do this with a very common strategy called ["fetch-on-render"](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-1-fetch-on-render-not-using-suspense).

Let's take a look at this bare-bones Twitter Post component:
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
Note that the component itself does not deal with any data fetching logic itself - no lifecycle methods, effects, or state have been set up here. It only consumes a `useTweet` hook and maps the different possible states to a UI representation.

`useTweet` is a _resource hook_ which provides a clear abstraction over the fetching of a tweet resource. It outputs three possible states:
- we are waiting for data to arrive - both `tweet` and `tweetFetchingError` are `null` (you can also make this more explicit with an `isFetchingTweet` property, if you prefer that)
- we successfully received data - `tweet` contains the resource
- something went wrong - `tweetFetchingError` contains an `Error` instance

Let's have a look at how the hook could be implemented:

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
The `useEffect` hook implements the "fetch-on-render" strategy by triggering a new fetch exactly after the first render _or whenever the `tweetId` parameter changes_. The [dependencies array](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) in the second argument given to `useEffect` makes sure of that.

Inside the effect, we use a `fetchTweet` function which does the actual data fetching. _How exactly_ it does that is not relevant as long as it returns a `Promise` which will either resolve with a tweet or reject with an `Error`.

The `latestTweetId` ref might be the most complex part of this hook. We need it to fix a subtle race condition:

Let's assume that the effect was just executed and triggered a request. If we change the `tweetId` before that request came back with a response, we trigger a new request, creating a race condition between the old request and this new one. Whichever tweet comes back _last_ will be the one that stays in the UI - even if it is the one with the outdated tweet ID. To avoid this race condition, we only store the tweet in our state if it is the _latest_ one that we requested.

With these 20 lines of code, we have created a complete reactive abstraction around the fetch-on-render strategy with a given resource. If any component wants to display a tweet, dropping a `useTweet` hook into it will be all that we need.

The most important part about the complete abstraction is that we can extend its functionality without breaking existing usages. To give you a better idea of what I mean with that, let's add a new feature to our tweet component: Liking tweets ♥.

## Resource Updates
To like a tweet, we need to make another HTTP request - only this time, it's the consequence of a button click and not a side effect of rendering.

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
We added two new functions to the public API of the `useTweet` hook. These are not just global functions that we import from an API utility wrapper. They are returned by the hook! We will see in a minute why this is important.

We call these updater functions when the user clicks the heart icon below the tweet. We assume that both functions return a `Promise`, which is why we `await` their result and if something goes wrong, we tell the user about it.

Note that the `tweet`_`Fetching`_`Error` should not change when anything goes wrong with the new _liking_ feature - we keep these errors separate by design so that we can handle them differently.

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
In the `(un)likeAndStoreUpdatedTweet` functions, we use `Promise`-based `(un)likeTweet` functions which mark the tweet as liked or not on the server and then resolve with the _complete updated resource_ as given from the back end. This is possible because the Twitter API directly responds with the updated tweet when a [like](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-favorites-create) or [unlike](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-favorites-destroy) request is made. Many REST APIs are designed like this to avoid extra round trips.

I want to highlight three things about these updater functions.

Firstly, it is important that we `await` the updates so that the component which consumes the hook can do the same on our returned updaters. This is necessary in case the component should display a submitting state and for specific error handling as above.

Secondly, we should not explicitly `return` anything from the updaters - a `Promise<void>` which eventually resolves with nothing is fine for error handling or displaying a submitting state. I specifically discourage you from returning the updated resource. If you do, the person writing the consuming component might store the returned resource in another manually managed local state, introducing a second source of truth. Better not tempt them 😉 

Thirdly, to rerender the UI with the updated tweet holding the changed like count, we store it in the local hook state by calling `setTweet` from within the hook. This is why the updater functions need to be returned from each hook instance and can't be global.

To avoid race conditions here again, we also need to apply the race condition remedy we saw before.

## Multiple Components Showing the Same Resource

In the next step of our hook evolution, let's assume that our twitter application gets a timeline view on the left and a detail view of a selected tweet to the right. The timeline stays visible though, which means it is possible for one and the same tweet resource to be used by two components at the same time.

With our current hook implementation, this new feature can lead to inconsistent information in our UI:
- If the user clicks the like button in one of the two places, it will only update the local state with the updated resource and the user will not see the updated like count or the red like heart in the other place
- Even without interaction: If the like count changed due to other users liking it between rendering the timeline and rendering the detail view, the like count will also be inconsistent
In both cases, the user would need to reload the whole page or reopen all pieces of UI to get rid of the inconsistencies. Let's try to avoid that.

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
Once we dropped a `<TweetCacheProvider>` at some common point above our two components, we can adapt the hook as follows:
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
Instead of local state directly in a `useState` hook, the single source of truth now resides in the tweet cache, belonging to the context provider. This means there is always only one version of a tweet - the one from the latest fetch or update, no matter which component it came from.

Apart from making our UI consistent, the cache brought some other important changes. With a populated cache, our application will behave differently in certain scenarios.

Previously, each `useTweet` hook started out with an empty state and produced a loading view. The hook might now return a cached copy of a tweet right away. If so, component will instantly render the full UI based on the cached copy. This can make the application feel a lot snappier.

In any case though, the `useEffect` hook will trigger a refetching of the tweet. This is important so that we don't rely only on the cached copy but we make sure that we show fresh information as soon as possible. This is the only measure of updating the cache we will use here. For more complex scenarios, you might want to explicitly evict resources from the cache, e.g. when a request returns with status 404. 

If you _absolutely_ need to avoid unnecessary rerenders in your application, you should be aware that components that use the `useTweet` hook will rerender on _every_ cache update. Until we can work around this with the upcoming [useContextSelector hook](https://github.com/reactjs/rfcs/pull/119), you might want to [take other measures for optimization](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

With this refactoring, the most important advantage behind Resource Hooks became visible: We did not need to change a single component to introduce a new strategy for resource fetching and storage. It is up to the hook - and not up to the component - when to fetch the resource, where to store it, when to update it, and if and how to share it. This allowed us to gradually expand the logic _inside our hook_ to increasingly complex requirements. We only touched components for changes in the rendered UI, and we did not have to anticipate all possible scenarios when setting up our data fetching in the first place.

I've been using this pattern on my current project for the past year and I've been really happy with it. Give it shot, and let me know how it goes! Or if you rather wouldn't, let me know why!
