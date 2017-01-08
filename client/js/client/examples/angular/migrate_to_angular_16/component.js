(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Migrate to Angular 1.6</div>
        <div class="post-title">Init logic</div>
    <p class="post-block">Теперь если ты захочешь получить доступ к переменной, которая передана из parent scope через <span class="highlight">binding</span>, ты сможешь это сделать только внутри <span class="highlight">$onInit</span>, в самом контроллере она будет <span class="highlight">undefined</span>.</p>
<code class="language-javascript" prism><xmp>.component('migrate16Parent', {
        bindings: {
            app: '<'
        },
        controller: function() {
            console.log(this.app) // well shit. This is undefined now

            if (this.app === 'Super puper app') {
                // недоступно, надо юзать $onInit
            }

            // Использование $onInit гарантирует что bindings уже присвоены
            this.$onInit = function() {
                console.log(this.app) // you can access bindings variables only here
            }
        }
    });

// Можно отключить это изменение в confige
...
.config(function($compileProvider) {
    $compileProvider.preAssignBindingsEnabled(true);
});</xmp>
</code>
    <div class="post-title">$http success() / error()</div>
    <p class="post-block">The <span class="highlight">.success()</span> and <span class="highlight">.error()</span> methods have been removed - upgrade your applications to align with the new Promise API.</p>
<code class="language-javascript" prism><xmp>...
// from this
$http.get('url').success(function(response) {}, function(err) {});
// to this
$http.get('url').then(function(response) {}).catch(function(err) {});</xmp>
</code>
    <div class="post-title">$location</div>
    <p class="post-block">The default hash-prefix used for $location hash-bang URLs has changed from the <span class="highlight">empty string ('') to the bang ('!')</span>. If your application does not use HTML5 mode or is being run on browsers that do not support HTML5 mode, and you have not specified your own hash-prefix then client side URLs will now contain a <span class="highlight">! prefix</span>. For example, rather than mydomain.com/#/a/b/c the URL will become mydomain.com/#!/a/b/c.</p>
    <p class="post-block">If you actually want to have no hash-prefix, then you can restore the previous behavior by adding a configuration block to you application:</p>
<code class="language-javascript" prism><xmp>appModule.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);</xmp>
</code>
<div class="post-title">Inheriting options of ngModelOptions</div>
<p class="post-block">You can specify that an <span class="highlight">ngModelOptions</span> setting should be inherited from a parent <span class="highlight">ngModelOptions</span> directive by giving it the value of <span class="highlight">"$inherit"</span>. Then it will inherit that setting from the first <span class="highlight">ngModelOptions</span> directive found by traversing up the DOM tree. If there is no ancestor element containing an <span class="highlight">ngModelOptions</span> directive then default settings will be used.</p>
<code class="language-javascript" prism><xmp><div ng-model-options="{ allowInvalid: true, debounce: 200 }">
    <form ng-model-options="{ updateOn: 'blur', allowInvalid: '$inherit' }">
        <input ng-model-options="{ updateOn: 'default', allowInvalid: '$inherit' }" />
    </form>
</div>
// input will have the following settings
// Note: the debounce setting was not inherited and used the default value instead
{ allowInvalid: true, updateOn: 'default', debounce: 0 }</xmp>
</code>
<p class="post-block">You can specify that all undefined settings are automatically inherited from an ancestor by including a property with key of <span class="highlight">"*"</span> and value of <span class="highlight">$inherit"</span>.</p>
<code class="language-javascript" prism><xmp><div ng-model-options="{ allowInvalid: true, debounce: 200 }">
    <input ng-model-options="{ updateOn: 'default', "*": '$inherit' }" />
</div>
// input will have the following settings
{ allowInvalid: true, updateOn: 'default', debounce: 200 }</xmp>
</code>
    <migrate16-parent app="'name'"></migrate16-parent>
    </div>
    <div class="post-title">Links</div>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="https://docs.angularjs.org/guide/migration#migrating-from-1-5-to-1-6" target="_blank">Migrating from 1.5 to 1.6 (official)</a></li>
      <li class="post-links-item"><a class="post-link" href="https://toddmotto.com/angular-1-6-is-here#component-and-oninit" target="_blank">Main parts of Angular 1.6 (Todd Motto)</a></li>
    </ul>
</div>
`;

    angular.module('app').component('migrateTo16', {
        template: template
    });
})();