(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Basic authentication</div>
        <p class="post-block">You need to create a global abstract state and tag it to highlight the fact that it requires authentication.
        </p>
<code class="language-javascript" prism><xmp>// parent state
.state('app', {
    component: app,
    // ...
    data: {
        requiredAuth: true
    }
})
// child state
.state('new', {
    parent: 'app',
    url: '/new',
    component: 'newPage'
})
.state('contact', {
    parent: 'app',
    url: 'edit',
    component: 'editPage',
}
});
// check authentication on state change event:
$rootScope.$on('$stateChangeStart', function (event, toState) {
    var requiredAuth = toState.data.requiredAuth;

    if (requiredAuth && !authService.isAuthorized()) {
        // redirect to login or try to authenticate
        event.preventDefault();
        $state.go('login');
    }
});

// Note: from the version 1.0.* of ui-rouiter API changes to:
// a state tree where all states which require authentication are children of a parent 'app' state.
$transitions.onStart( { to: 'app.**' }, function(trans) {
    var $state = trans.router.stateService;
    var authService = trans.injector().get('authService');

    // If the user is not authenticated
    if (!authService.isAuthorized()) {
        // Then return a promise for a successful login.
        // The transition will wait for this promise to settle

        return authService.authenticate().catch(function() {
            // If the authenticate() method failed for whatever reason,
            // redirect to a 'login' state which doesn't require auth.
            return $state.target("login");
        });
    }
});</xmp>
</code>
<p class="post-block">Another solution is to check authentication in <span class="highlight">resolve</span> method. It seems more declarative and flexible solution.
</p>
<code class="language-javascript" prism><xmp>.state('app', {
    component: app,
    resolve: {
        profile: function(authService, $state) {
            return authService.isAuthorized().then(function(tokenKey) {
                return !!tokenKey;
            }).catch(function() {
                $state.go('login', {redirect: $state.toState.name});
            });
        }
    }
});</xmp>
</code>
</div>
    <div class="post-title">Links</div>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="http://nicolovaligi.com/pratical-authentication-angularjs-uirouter.html" target="_blank">Authentication with Angular.JS </a></li>
      <li class="post-links-item"><a class="post-link" href="https://github.com/toddmotto/angular-1-5-components-app/tree/master/src/app/components/auth" target="_blank">Auth example in component-based application (Todd Motto)</a></li>
      <li class="post-links-item"><a class="post-link" href="https://ui-router.github.io/docs/latest/modules/ng1_state_events.html#_statechangestart" target="_blank">ui-router breaking changes</a></li>
      <li class="post-links-item"><a class="post-link" href="http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication" target="_blank">angular ui-router login authentication</a></li>
    </ul>
</div>`;

    angular.module('app').component('basicAuthentication', {
        template: template
    })

})();