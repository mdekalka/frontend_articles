(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Container components</div>
<code class="language-javascript" prism><xmp>// A container does data fetching and then renders its corresponding sub-component. That’s it.
// Create a component with postfix "-Container" and put all logic here:

class ComponentContainer extends Component {
    constructor() {
        super();

        this.state = {
            comments: []
        };
   }

    componentDidMount() {
        // AJAX data load and changes "comments" state
    }
}

and then create a data representational component which takes comments as a prop

class ComponentView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // render comments 
        return <div></div>;
    }
}

// What we have done:
// - separated our data-fetching and rendering concerns.
// - made our ComponentView component reusable.
// - give ComponentView the ability to set PropTypes and fail loudly.</xmp>
</code>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="https://www.youtube.com/watch?v=KYzlpRvWZ6c" target="_blank">Container components</a></li>
    </ul>
    </div>
</div>`;

    angular.module('app').component('containerComponents', {
        template: template
    });

})();
  