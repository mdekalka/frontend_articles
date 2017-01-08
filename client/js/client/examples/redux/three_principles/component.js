(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Three Principles</div>
<code class="language-javascript" prism><xmp>// Redux's Three Principles:
// - Single source of truth
// - State is read-only
// - Changes are made with pure functions

// Get the store creator function from redux
import { createStore } from 'redux';

// Create a store that handle the all state and let to dispatch actions, also you need to specify a reducer
 that tell how state is updated with actions.
// There should only be a single store in your app.
createStore(reducer, [preloadedState], [enhancer])

// Arguments:
reducer (Function):
// A reducing function that returns the next state tree,
// given the current state tree and an action to handle.
[preloadedState] (any):
// The initial state. You may optionally specify it to hydrate 
// the state from the server in universal apps, or to restore a previously serialized user session.
// If you produced reducer with combineReducers, this must be a plain object with the same shape as
// the keys passed to it. Otherwise, you are free to pass anything that your reducer can understand.
[enhancer] (Function):
// The store enhancer. You may optionally specify it to enhance the store
// with third-party capabilities such as middleware, time travel, persistence, etc.
// The only store enhancer that ships with Redux is applyMiddleware().

// Then create a simple reducer(Takes the previous state and an action, and returns the next states)
const counterReducer = (state = 0, action) => {
    // if state is undefined - set it to default 0
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;

        case 'DECREMENT':
            return state - 1;

        case 'RESET':
            return 0;

        default:
            return state;
    }
    // always return new state
}

// Let's create a simple store:
const store = createStore(counterReducer);

// You can get the current state of store like this:
const currentState = store.getState();

// Re-render component every time when state changes(Not a best solution - see section about creating TodoList)
const reduxRender = () => {
    ReactDOM.render(<ReduxCounter store={store.getState()} />, document.getElementById('redux-counter'));
};

// Subscribe - register a callback and call anytime when action will be dispatch and store changes
store.subscribe(reduxRender);
reduxRender();

// Code example:
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

const counterReducer = (state = 0, action) => {
    // if state is undefined - set it to default 0
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;

        case 'DECREMENT':
            return state - 1;

        case 'RESET':
            return 0;

        default:
            return state;
    }
    // always return new state
}
const counterStore = createStore(counterReducer);

class ReduxCounter extends Component {
    constructor(props) {
        super(props);

        this.store = this.props.store;
    }

    componentWillMount() {
        this.unsubscribe = this.store.subscribe(() => {
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStateChange(value) {
        if (value) {
            this.store.dispatch({ type: 'INCREMENT', payload: {} });
        } else {
            this.store.dispatch({ type: 'DECREMENT', payload: {} });
        }
    }

    onReset() {
        this.store.dispatch({ type: 'RESET' });
    }

    render() {
        // get state of store
        const store = this.store.getState();

        return (
            <div className="container">
                <div>Current state: {store}</div>
                <div onClick={() => this.onStateChange(false)}>DECREMENT</div>
                <div onClick={() => this.onReset()}>RESET</div>
                <div onClick={() => this.onStateChange(true)}>INCREMENT</div>
            </div>
        );
    }
}

const reduxRender = () => {
    ReactDOM.render(<ReduxCounter store={counterStore} />, document.getElementById('redux-counter'));
};

counterStore.subscribe(reduxRender);
reduxRender();

export default ReduxCounter;</xmp>
</code>
    </div>
</div>`;

    angular.module('app').component('threePrinciples', {
        template: template
    });

})();
  