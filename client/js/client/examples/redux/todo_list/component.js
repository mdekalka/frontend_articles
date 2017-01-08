(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Three Principles</div>
<code class="language-javascript" prism><xmp>import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

// Reducer for todos state
const todosReducer = (state = [], action) => {
    // Always return the news state, avoid mutating objects(arrays) 
    switch (action.type) {
        case 'ADD_TODO':
            return [...state, action.payload];

        case 'TOGGLE_TODO':
            return state.map(item => {
                if (item.id !== action.payload.id) {
                    return item;
                }

                return {
                    ...item,
                    completed: !item.completed
                };
            });

        case 'REMOVE_TODO':
            return [ ...state.slice(0, action.payload.index), ...state.slice(action.payload.index + 1)];

        default: 
            return state;
    }
}

// Pass an action with data (data will store in payload property)
const visibilityFilterReducer = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.payload.filter;

        default:
            return state;
    }
};

// Reducer for toggling liked state
const disableStateReducer = (state = false, action) => {
    switch (action.type) {
        case 'TOGGLE_FREEZE':
            return action.payload.state;

        default:
            return state;
    }
}

// To combine reducers in one reducer use this function and pass it to the createStore
const todoListReducer = combineReducers({
    todos: todosReducer,
    visibilityFilter: visibilityFilterReducer,
    disableState: disableStateReducer
});

const todoListStore = createStore(todoListReducer);
// If you call getState() on init store - you will get the following object
// {
//     todos: [],
//     disableState: false,
//     visibilityFilter: 'SHOW_ALL'
// }

const getVisibilityTodos = (todos, filter) => {
    switch(filter) {
        case 'SHOW_ALL':
            return todos;

        case 'SHOW_ACTIVE':
            return todos.filter(item => !item.completed)

        case 'SHOW_COMPLETED':
            return todos.filter(item =>  item.completed)
    }
}

let uniqueId = 0;
let AddTodoContainer = ({ disabled, dispatch }) => {
    let input;

    return (
        <div>
            <input type="text" ref={node => {
                input = node;
            }}/>
            {/* You can create a separate function for dispatchers */}
            <button disabled={disabled} onClick={() => {
                dispatch({ type: 'ADD_TODO', payload: {
                    id: uniqueId++,
                    text: input.value
                }});

                input.value = '';
            }}>Add todo item</button>
        </div>
    );
}

// connect(state, dispatch) - if state equals null - component will not subscribe to store changes and pass only dispatch
// connect() - pass only dispatch to the component
AddTodoContainer = connect((state) => {
    return {
        disabled: state.disableState
    }
})(AddTodoContainer);

// NOTE: see below how we can create this component dynamically using connect
// class VisibleTodoListContainer extends Component {
//     componentWillMount() {
//         const {store} = this.context;

//         this.unsubscribe = store.subscribe(() => {
//             this.forceUpdate();
//         })
//     }

//     componentWillUnmount() {
//         this.unsubscribe();
//     }

//     render() {
//         const {store} = this.context;
//         const storeState = store.getState();
//         const visibleTodos = getVisibilityTodos(storeState.todos, storeState.visibilityFilter);

//         return (
//             <TodoList todos={visibleTodos}  onTodoClick={(id) => {
//                 store.dispatch({ type: 'TOGGLE_TODO', payload: { id: id} })
//             }} />
//         );
//     }
// };
// VisibleTodoListContainer.contextTypes = {
//     store: React.PropTypes.object
// };

// Only presentational layer
const TodoList = ({todos, onTodoClick}) => {
    return (
        <ul>
            {todos.map(todo =>
                // {...todo} Es6 object Destructuring
                <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
            )}
        </ul>
    );
};
// Only presentational layer
const Todo = ({onClick, completed, text}) => {
    return (
        <li className={completed ? 'completed': ''} onClick={onClick}>{text}</li>
    );
};

// NOTE: new implementaion of VisibleTodoListContainer component using connect
// return state that will pass to the child component
const mapStateToTodoListProps = (state) => {
    return {
        todos: getVisibilityTodos(state.todos, state.visibilityFilter)
    }
};
// return dispatch that will pass to the child component
const mapDispatchToTodoListProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch({ type: 'TOGGLE_TODO', payload: { id: id} });
        }
    }
}
// You can replace this hand-written component to dynamically one using connect
const VisibleTodoListContainer = connect(
    mapStateToTodoListProps,
    mapDispatchToTodoListProps
)(TodoList);

const Link = ({active, children, onClick}) => {
    if (active) {
        return <span>{children}</span>;
    }

    return (
        <a href='#' onClick={e => {
             e.preventDefault();
             onClick();
           }}>{children}
        </a>
    );
};

const mapStateToLinkProps = (state, ownProps) => {
    return {
        active: state.visibilityFilter === ownProps.filter
    }
}

const mapDispatchToLinkProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch({ type: 'SET_VISIBILITY_FILTER', payload: {filter: ownProps.filter} });
        }
    }
}

const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link);

const FooterContainer = () => {
    return (
        <p>
            Show:
            {' '}
            <FilterLink filter='SHOW_ALL'>
            All
            </FilterLink>
            {', '}
            <FilterLink filter='SHOW_ACTIVE'>
            Active
            </FilterLink>
            {', '}
            <FilterLink filter='SHOW_COMPLETED'>
            Completed
            </FilterLink>
        </p>
    )
}

const Disable = ({disabled, onFreezToggle, children}) => {
    return (
        <div className={disabled ? 'disabled' : ''} onClick={() => {
            let newState = !disabled;
            onFreezToggle(newState);
        }}>{children}</div>
    )
}

const DisableContainer = connect((state) => {
    return {
        disabled: state.disableState
    }
}, (dispatch) => {
    return {
        onFreezToggle: (status) => {
            dispatch({ type: 'TOGGLE_FREEZE', payload: {state: status }});
        }
    }
})(Disable);

class ReduxTodoList extends Component {
    render() {
        // Wrap each component in container to separate functional component from presentational
        return (
            <div className="todo-list">
                <DisableContainer>Disable State</DisableContainer>
                <AddTodoContainer />
                <VisibleTodoListContainer />
                <FooterContainer />
            </div>
        );
    }
}

ReactDOM.render(
    // use provider from react-redux to pass a store to childrens cocmponents
    <Provider store={todoListStore} >
        <ReduxTodoList />
    </Provider>,
    document.getElementById('redux-todo')
);

export default ReduxTodoList;</xmp>
</code>
    </div>
</div>`;

    angular.module('app').component('todoList', {
        template: template
    });

})();
  