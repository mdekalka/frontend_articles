(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Lifecycle hooks (version 1.5.3+)</div>
        <div class="post-title">$onInit()</div>
        <p class="post-block">This lifecycle is executed when all controllers on the element have been constructed and after their bindings are initialized. This hook is meant to be used for any kind of initialization work for the controller.
        </p>
<code class="language-javascript" prism><xmp>.component('lifecycleHooksExample', {
        controller: function() {
            this.setInitialState = function() {
                this.items = [1, 2, 3];
            };

            // initialize default state
            this.$onInit = function() {
                this.setInitialState();
            };
        }
    });</xmp>
</code>
<p class="post-block">
Because the lifecycles are well-defined we can also inherit behaviour from other components, and they’re readily available inside the <span class="highlight">$onInit</span> hook. We can access controllers of parent components on our own component’s controller, as those are exposed to it for intercomponent communication. 
</p>
<code class="language-javascript" prism><xmp>.component('lifecycleHooksExample', {
        // allow to render child component inside parent component
        transclude: true,
        template: '<div>Parent component {{$ctrl.items}}<div ng-transclude></div></div>',
        controller: function() {
            this.setInitialState = function() {
                this.items = [1, 2, 3];
            };

            this.addItems = function(item) {
                this.items.push(item);
            };

            this.$onInit = function() {
                this.setInitialState();
            };
        }
    }).component('lifecycleHooksExampleChild', {
        require: {
            // require paprent component
            'parent': '^lifecycleHooksExample'
        },
        template: '<div>Child component</div>',
        controller: function() {
            this.$onInit = function() {
                // if you want to call parent method on init, always call it inside $onInit method,
                // call it roughly inside controller will not work
                this.parent.addItems(100);
            };
        }
    });</xmp>
</code>
<div class="post-title">$onChanges()</div>
<p class="post-block">Building components at one point you will have data coming into your component from the parent component. With <span class="highlight">$onChanges</span> we can react to this changes and update the child compoment data effectively.
</p>
<p class="post-block"><span class="highlight">$onChanges</span> hook is called in two scenarios, one being during component initialization, it passes down the initial changes that can be used right away through <span class="highlight">isFirstChange</span> method. The other scenario is when changes occur in <span class="highlight">one way bindings <</span> and <span class="highlight">evaluated DOM attributes @</span>. It propagates this changes down to the child component which we would re-assign to our local component. 
</p>
<p class="post-block">Note: <span class="highlight">Lifecycle method $onChange will be called before $onInit for the component</span>
</p>
<code class="language-javascript" prism><xmp>// <component obj="someObject"></component>
this.$onChanges = function(changes) {
    if (changes.user.isFirstChange()) {
        // We have a cloned Object that we can fully mutate without two-way binding
        this.user = angular.copy(changes.user.currentValue);
    }
    this.user = changes;
};

// parent component
.component('lifecycleHooks', {
        template: template
    }).component('lifecycleHooksExample', {
        template: '<div>{{$ctrl.user | json}}
                    <lifecycle-hooks-example-child user=$ctrl.user on-change="$ctrl.changeUser($event)"></lifecycle-hooks-example-child>
                   </div>',
        controller: function() {
            this.setInitialState = function() {
                this.user = {
                    name: 'noNameNPC',
                    id: 100
                };
            };

            this.changeUser = function(event) {
                // update user state
                this.user = event.user;
            };

            this.$onInit = function() {
                this.setInitialState();
            };
        }
    })

//  child component
.component('lifecycleHooksExampleChild', {
        bindings: {
            user: '<', // pass user object
            onChange: '&' // pass callback
        },
        template: '<div>
                    <input class="input-text input-post" ng-model="$ctrl.user.name"/>
                    <button class="btn" ng-click="$ctrl.saveUser()">Change user</button>
                  </div>',
        controller: function() {
            this.saveUser = function() {
                this.onChange({
                    $event: {
                        user: this.user // pass the new user to the parent component
                    }
                });
            };

            this.$onChanges = function(changes) {
                if (changes.user) {
                    // We have a cloned object that we can fully mutate without two-way binding
                    this.user = angular.copy(changes.user.currentValue);
                }
            };
        }
    });</xmp>
</code>
<div class="post-title">$postLink()</div>
<p class="post-block">This hook is called aftet the controller's element and its children have been linked. When the component elements have been compiled and ready to go, this hook will be fired.
</p>
<code class="language-javascript" prism><xmp>// ...
controller: function () {
    this.$postLink = function () {
    };
}</xmp>
</code>
<div class="post-title">$onDestroy()</div>
<p class="post-block"><span class="highlight">$onDestroy()</span> is a hook that is called when its containing scope is destroyed. We can use this hook to release external resources, watches and event handlers.
</p>
<code class="language-javascript" prism><xmp>// ...
controller: function($element) {
    var clickHandler = function () {};

    this.$onInit = function () {
        $element.on('click', clickHandler);
    };
    // component scope is destroyed
    this.$onDestroy = function () {
        // remove listener here to avoid memory leaks
        $element.off('click', clickHandler);
    };
}</xmp>
</code>
<div class="post-title">Demo</div>
<lifecycle-hooks-example></lifecycle-hooks-example>
    </div>
    <div class="post-title">Links</div>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="https://docs.angularjs.org/guide/component" target="_blank">Official documentation</a></li>
      <li class="post-links-item"><a class="post-link" href="https://toddmotto.com/angular-1-5-lifecycle-hooks" target="_blank">Lifecycle hooks (Todd Motto)</a></li>
      <li class="post-links-item"><a class="post-link" href="http://blog.thoughtram.io/angularjs/2016/03/29/exploring-angular-1.5-lifecycle-hooks.html" target="_blank">Exploring Lifecycle hooks</a></li>
      <li class="post-links-item"><a class="post-link" href="https://scotch.io/tutorials/understanding-angular-1-5-lifecycle-hooks" target="_blank">Understanding Angular 1.5 Lifecycle Hooks</a></li>
      <li class="post-links-item"><a class="post-link" href="http://www.codelord.net/2016/04/14/angular-1-dot-5-new-component-lifecycle-hooks/" target="_blank">New component lifecycle hooks</a></li>
    </ul>
</div>`;

    angular.module('app').component('lifecycleHooks', {
        template: template
    }).component('lifecycleHooksExample', {
        template: '<div>{{$ctrl.user | json}}<lifecycle-hooks-example-child user=$ctrl.user on-change="$ctrl.changeUser($event)"></lifecycle-hooks-example-child></div>',
        controller: function() {
            this.setInitialState = function() {
                this.user = {
                    name: 'noNameNPC',
                    id: 100
                };
            };

            this.changeUser = function(event) {
                this.user = event.user;
            };

            this.$onInit = function() {
                this.setInitialState();
            };
        }
    }).component('lifecycleHooksExampleChild', {
        bindings: {
            user: '<',
            onChange: '&'
        },
        template: '<div><input class="input-text input-post" ng-model="$ctrl.user.name"/><button class="btn" ng-click="$ctrl.saveUser()">Change user</button></div>',
        controller: function() {

            this.$onInit = function() {
            };

            this.saveUser = function() {
                this.onChange({
                    $event: {
                        user: this.user
                    }
                });
            };

            this.$onChanges = function(changes) {
                if (changes.user) {
                    this.user = angular.copy(changes.user.currentValue);
                }
            };
        }
    });

})();