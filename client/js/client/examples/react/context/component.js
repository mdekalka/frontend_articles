(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Container components</div>
<code class="language-javascript" prism><xmp>// The context is very useful when you have a dynamic tree of components,
// where things are moving, where you have a lot of properties to pass down : passing explicitely every props to every children
// is clearly not an option.

class Context extends Component {
    constructor(props) {
        super(props);
        // Property that child component should receive
        this.name = 'name';
    }

    // The context provider creates an object that React passes the information down automatically
    // and any component in the subtree
    getChildContext() {
        return {
            name: this.name
        }
    }

    render() {
        return (
            <Intermediate name={this.name} />
        );
    }
}
// Define context types
Context.childContextTypes = {
    name: propTypes.string
}

// Another component in DOM tree
class Intermediate extends Component {
    render() {
        return (
            // We didn't pass name like this "name={this.props.name}"
            <Child />
        )
    }
}

// Child component which want to use name from the parent
class Child extends Component {
    render() {
        return (
            <div>
                // Use context 
                <div>{this.context.name}</div>
            </div>
        );
    }
}
// Define context types in Child component
Child.contextTypes = {
    name: propTypes.string
}
// Note: using context is not a good practice in React, but if you have no choice - read the last link</xmp>
</code>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="https://facebook.github.io/react/docs/context.html" target="_blank">React context</a></li>
      <li class="post-links-item"><a class="post-link" href="https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076#.mausrop3v" target="_blank">How to safely use React context</a></li>
      
    </ul>
    </div>
</div>`;

    angular.module('app').component('context', {
        template: template
    });

})();
  