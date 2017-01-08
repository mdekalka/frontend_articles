(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Components lifecycle</div>
<code class="language-javascript" prism><xmp>this.state = {}
// Sometimes you'll want your component to manage some piece of state.
// In order to do that you'll first need to set some initial state of your component when your component is first added to the DOM.
constructor(props) {
    super(props);

    this.state = {
        skillList: [],
        isLoading: false
    };
}

"render"
// When called, it should examine this.props and this.state and return a single child element.
// The render() function should be pure, meaning that it does not modify component state, it returns the same result each time
// it's invoked, and it does not read from or write to the DOM or otherwise interact with the browser (e.g., by using setTimeout).
// If you need to interact with the browser, perform your work in componentDidMount() or the other lifecycle methods instead.
// Keeping render() pure makes server rendering more practical and makes components easier to think about.
render() {
    const skillList = this.state.skillList.map(skill => {
        return (
            <div className="skill-list-item" key={skill.id}>
                <img src={skill.img} alt={skill.name} />
                <h3>{skill.name}</h3>
            </div>
        );
    });

    return (
        <div className="skill-list-container box">{skillList}</div>
    );
}

"componentWillMount"
// Invoked once, both on the client and server, immediately before the initial rendering occurs.
// If you call setState within this method, render() will see the updated state and will be executed only once despite the state change.

"componentDidMount"
// Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
// At this point in the lifecycle, you can access any refs to your children (e.g., to access the underlying DOM representation).
// The componentDidMount() method of child components is invoked before that of parent components.
// If you want to integrate with other JavaScript frameworks, set timers using setTimeout or setInterval, or send AJAX requests,
// perform those operations in this method. (ofc, better create a service that return a promise from http request)
componentDidMount() {
    this.setState({ isLoading: true });
    // This will get called right after the component is mounted to the DOM
    Axios.get(this.props.url).then(response => {
        if (response && response.data) {
            this.setState({
                isLoading: false,
                skillList: response.data
            });
        }
    }).catch(error => {
        // Handle error when http request failed
        this.setState({ isLoading: false });
    });
}

"componentWillReceiveProps"
// Invoked when a component is receiving new props. This method is not called for the initial render.
// Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
// The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.

"shouldComponentUpdate"
// Invoked before rendering when new props or state are being received.
// This method is not called for the initial render or when forceUpdate is used.
// Use this as an opportunity to return false when you're certain that the transition to the new props and state will not require
// a component update.

"componentWillUpdate"
// Invoked immediately before rendering when new props or state are being received. This method is not called for the initial render.
// Use this as an opportunity to perform preparation before an update occurs.

"componentDidUpdate"
// Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
// Use this as an opportunity to operate on the DOM when the component has been updated.

"componentWillUnmount"
// Invoked immediately before a component is unmounted from the DOM.
// Perform any necessary cleanup in this method, such as invalidating timers or cleaning up any DOM elements that were created
// in componentDidMount.</xmp>
</code>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="http://codepen.io/piupiupiu/pen/LRzgAX" target="_blank">React component lifecycle</a></li>
      <li class="post-links-item"><a class="post-link" href="https://facebook.github.io/react/docs/react-component.html" target="_blank">Lifecycle overview</a></li>
    </ul>
    </div>
</div>`;

    angular.module('app').component('componentLifecycle', {
        template: template
    });

})();
  