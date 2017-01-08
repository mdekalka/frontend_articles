(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Condition statement inside component</div>
<code class="language-javascript" prism><xmp>// if-else statements don't work inside JSX. You probably need to use a ternary expression:
...
render() {
    // If "showMessage" is true render the <Message /> Component otherwise just a warning string
    const message = this.state.showMessage ? <Message /> : 'No message for you';

    return (
        <div>
            <div>{message}</div>
            // Another option: define IIFE and do it inline
            <div>{(() => {
                switch (this.state.showMessage) {
                    case true: return <Message />;
                    case false: return 'No message for you';
                }
            })()}
            </div>
        </div>
    );
}</xmp>
</code>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="https://facebook.github.io/react/tips/if-else-in-JSX.html" target="_blank">Condition statement</a></li>
    </ul>
    </div>
</div>`;

    angular.module('app').component('conditionalStatement', {
        template: template
    });

})();
  