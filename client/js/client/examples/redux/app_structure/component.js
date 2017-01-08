(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Application structure</div>
<code class="language-javascript" prism><xmp>// Basic React/Redux application structure may looks like this:
// /actions - all app action creators
// /config
//     routes.js - handle all routes of the app
//     configStore.js - create Redux store with initial state and middleware
// /containers - react containers which handles all components logic
// /components - react stateless views (presentational components)
// /reducers - all app reducers including rootReducer
// /services - all business logic/3rd party API's
// /constants - all action types constants/etc

// Let's take a look at the each folder/file:

/actions/someActions.js
import constants from '../constants/constants';

// Get actions types form constants
const { ACTION_TYPES: { LOAD_HEROES_SUCCESS, LOAD_HEROES_FAILED } } = constants;

const loadHeroesSuccess = (data) => {
    return {
        type: LOAD_HEROES_SUCCESS,
        payload: data
    }
}

const loadHeroesFailed = (error) => {
    return {
        type: LOAD_HEROES_FAILED,
        payload: error,
        error: true
    }
}

export {
    loadHeroesSuccess,
    loadHeroesFailed
};

/config/routes.js
import React from 'react';
import { Router, Route, IndexRoute , browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from './configStore';

import App from '../App';

const routes = (
    // Wrap all routes in provider from react-redux lib and provide store to all application
    <Provider store={store} >
        <Router history={browserHistory}>
            <Route path="/" component={App} >
            </Route>
        </Router>
    </Provider>
);

/config/configStore.js
import { createStore, applyMiddleware  } from 'redux';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

const logger = createLogger();

// Provide root reducer, initial state and middleware to create store for app
let store = createStore(rootReducer, {}, applyMiddleware(thunk, logger));

export default store;

/constants/constants.js
const constants = {
    // all action types
    ACTION_TYPES: {
        LOAD_STARWARS_DATA: 'LOAD_STARWARS_DATA',
        LOAD_STARWARS_DATA_SUCCESS: 'LOAD_STARWARS_DATA_SUCCESS',
        LOAD_STARWARS_DATA_FAILED: 'LOAD_STARWARS_DATA_FAILED',
        SET_VISIBILITY_FILTER: 'SET_VISIBILITY_FILTER',
        ADD_TODO: 'ADD_TODO',
        REMOVE_TODO: 'REMOVE_TODO',
        TOGGLE_TODO: 'TOGGLE_TODO',
        LOAD_HEROES_SUCCESS: 'LOAD_HEROES_SUCCESS',
        LOAD_HEROES_FAILED: 'LOAD_HEROES_FAILED'
    },
    // you can create separate file for another constants or not, do whatever you want
    MAIN_MENU: {
        LINKS: [
            {id: 0, route: '/', name: 'Main'},
            {id: 1, route: '/todo', name: 'Todo list'},
            {id: 2, route: '/star-wars', name: 'Star Wars'},
            {id: 3, route: '/lol', name: 'League of Legends'}
        ]
    }
};

export default constants;

/containers/lolContainer.js
class LolContainer extends Component {
    constructor(props) {
        super(props);

        this.lolActions = props.lolActions;
    }

    // 100500 methods here

    getHeroes() {
        getHeroes(options).then((heroes) => {
            this.lolActions.loadHeroesSuccess(heroes);
        }, error => {
            this.lolActions.loadHeroesFailed(error);
        });
    }

    componentDidMount() {
        this.getHeroes();
    }

    render() {
        this.lolData = this.props.lolData;

        const options = createHeroOptions(this.lolData);
        // Here goes the view (oh... stateless view... yeah..)
        return <LolView lolData={this.lolData} options={options} />;
    }
};
/components/lolComponent.js
// Stateless component which receives data from props
const StarWarsItem = (props) => {
    const {manufacturer, starship_class, passengers, hyperdrive_rating} = props.itemData;

    return (
        <div>
            <div>{manufacturer}</div>
            <div>{starship_class}</div>
            <div>{passengers}</div>
            <div>{hyperdrive_rating}</div>
        </div>
    );
};

export default starWarsContainer;

/reducer/piuReducer.js
import constants from '../constants/constants';

const initialState = {
    data: {},
    type: '',
    version: ''
};
// action types from constants
const { ACTION_TYPES: { LOAD_HEROES_SUCCESS, LOAD_HEROES_FAILED } } = constants;

const lolReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_HEROES_SUCCESS:
            // always return new state yeah..
            return {...state, ...action.payload};

        case LOAD_HEROES_FAILED:
            // always return new state yeah..
            return {...state, data: null, version: '', type: '' }

        default:
            return state;
    }
}

export default lolReducer;

// And catch them all:
import { combineReducers } from 'redux';
import starWarsReducer from './starWarsReducer';
import todoVisibilityReducer from './todoVisibilityReducer';
import todoListReducer from './todoListReducer';
import lolReducer from './lolReducer';

const rootReducer = combineReducers({
    starWarsData: starWarsReducer,
    todoVisibility: todoVisibilityReducer,
    todos: todoListReducer,
    lolData: lolReducer
});

export default rootReducer;

/service/piuService.js
const getHeroes = (options = '?') => {
    const heroesURL = urls.heroes + options + API_KEY;

    return Axios.get(heroesURL).then(response => {
        return response.data;
    }).catch(error => {
        throw new Error(error);
    });
}

const createHeroOptions = (data) => {
    const heroIcon = 'http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/';
    const heroLoader = 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/';
    let heroesKeys;

    if (data) {
        heroesKeys = Object.keys(data.data).sort();
    }

    return {
        heroesKeys,
        heroIcon,
        heroLoader
    };
}

const transformImage = (heroLoader, name, num) => {
    return 'heroLoader + name + num  + .jpg';
}

export {
    getHeroes,
    createHeroOptions,
    transformImage
};
`;
        var id1 = `// Redux's Three Principles:
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

    angular.module('app').component('appStructure', {
        template: template
    });

})();
  