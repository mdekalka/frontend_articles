(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Directive/Component usage</div>
        <div class="post-title">Directive vs Component</div>
        <p class="post-block">
            Now, when <span class="highlight">component</span> comes to party,
            <span class="highlight">directives</span> should be used solely for decorating the DOM. If you need a sensible amount of DOM manipulation,
             there is also the <span class="highlight">$postLink lifecycle</span> hook to consider, however this is not a place to migrate all your DOM manipulation to, so use <span class="highlight">directive</span> when you will have a middle+ DOM manipulation.
        </p>

<code class="language-javascript" prism><xmp>// Old style directive usage:
.directive('oldCounter', function() {
    return {
        scope: {
            count: '<'
        },
        template: "<div><button ng-click="incCount();">increase</button>{{count}}</div>",
        link: function(scope) {
            scope.incCount = function() {
                scope.count++;
            };
        }
    }
});

// New styles directive usage:
.directive('newCounter', function() {
    return {
        scope: {},
        bindToController: {
            count: '<' // binds values from outer to controller
        },
        template: '<div><button ng-click="countCtrl.incCount();">increase</button>{{countCtrl.count}}</div>',
        controllerAs: 'countCtrl', // use instance of controller (default name is $ctrl)
        controller: function() {
            // bind all to this inside controller
            this.incCount = function() {
                this.count++;
            };
        }
    }
});

// Component usage:
.component('counter', {
        // no restrict property, always E - element
        // no priority property
        // no compile/link function (you can use $postLink lifecycle method for it)
        // no scope (scope is always isolate)
        bindings: {
            count: '<' // all bindings here
        },
        template: '<div><button ng-click="countCtrl.incCount();">increase</button>{{countCtrl.count}}</div>',
        controllerAs: 'countCtrl',
        controller: function() {
            this.incCount = function() {
                this.count++;
            };
        }
    });</xmp>
</code>
    </div>
    <div class="post-title">Component overview</div>
    <p class="post-block">
        Теперь, когда мы медленно идем к переходе на Angular 2x, где, больше нет контроллеров, основной единицей модульного кода становится 
        <span class="highlight">component</span>. Юзать их можно как <span class="highlight">stateful</span>, <span class="highlight">stateless</span>, <span class="highlight">routed</span> components.
    </p>
    <p class="post-block">
        У компонента есть следющий свойства:
        <table class="post-table">
            <tr  class="post-table-row">
                <th class="post-table-head">Property</th>
                <th class="post-table-head">Support</th>
            </tr>
            <tr class="post-table-row"><td class="post-table-cell">bindings</td><td class="post-table-cell">Yes, <span class="highlight"> use '@', '<', '&' only </span>(two-way binding '=' still works, </br> but it's not how we roll now</td></tr>
            <tr class="post-table-row"><td class="post-table-cell">controller</td><td class="post-table-cell">Yes</td></tr>
            <tr class="post-table-row"><td class="post-table-cell">controllerAs</td><td class="post-table-cell">Yes</td></tr>
            <tr class="post-table-row"><td class="post-table-cell">require</td><td class="post-table-cell">Yes</td></tr>
            <tr class="post-table-row"><td class="post-table-cell">template/templateUrl</td><td class="post-table-cell">Yes</td></tr>
            <tr class="post-table-row"><td class="post-table-cell">transclude</td><td class="post-table-cell">Yes</td></tr>
        </table>
    </p>
    <div class="post-title">Stateful component</div>
    <ul class="post-list">
        <li class="post-item">HTTP запросы к API через сервисы</li>
        <li class="post-item">Получение стейта </li>
        <li class="post-item">Передача параметров в дочерние компоненты и их рендер</li>
    </ul>
    <p class="post-block">
        Рассмотрим <span class="highlight">stateful</span> компонент на примере этого кода:
    </p>
<code class="language-javascript" prism><xmp>.component('todoListComponent', {
    template: "<div>
                // делегируем метод добавление новой записи отдельному компоненту
                <todo-list-add add="$ctrl.add($event)"></todo-list-add>
                // передаем стейт записей отдельному компоненту для рендера
                <todo-list todos="$ctrl.todos"></todo-list>
              </div>",
    controller: function(todoListService) {
        var _this = this;
        // Imagine async API call for fetching data here
        function getTodos() {
            // достаем данные из сервиса и обновляем состояние
            _this.todos = todoListService.getTodos();
        }

        this.add = function($event) {
            // функция добавления
            this.todos.push($event.todo);
        };

        this.$onInit = function() {
            // хранение стейта
            this.todos = [];

            getTodos();
        };
    }
});</xmp>
</code>
<div class="post-title">Stateless component</div>
<ul class="post-list">
    <li class="post-item">Получает данные и методы через bindings</li>
    <li class="post-item">Рендерит данные, который получил через bindings</li>
    <li class="post-item">Можно легко повторно использовать, т.к. у компонента нет собственного стейта</li>
</ul>
<p class="post-block">
    Рассмотрим <span class="highlight">stateless</span> компоненты на примере этого кода:
</p>
<code class="language-javascript" prism><xmp>.component('todoListAdd', {
    bindings: {
        add: '&' // метод добавления из stateful компонента
        // мы не передаем todos через two-way binding '=' и не добавляем запись внутри
        // stateless компонента - это работа stateful компонента
    },
    controller: function() {
        this.addTodo = function() {
            // создаем новую запись
            var newTodo = {
                name: this.state.model
            };
            // и вызываем метод родительского компонента не мутируя состояние напрямую
            this.add({$event: {
                todo: newTodo
            }});

            this.state.model = '';
        };

        this.$onInit = function() {
            this.state = {
                model: ''
            };
        };
    },
    template: "<div>
                <input class="input-text input-post" type="text" ng-model="$ctrl.state.model">
                <button class="btn" ng-disabled="!$ctrl.state.model.length" ng-click="$ctrl.addTodo();">Add todo</button>
              </div>"
});

// рендерим переданные данные
.component('todoList', {
    bindings: {
        todos: '<' // получение записей
    },
    // рендер записей
    template: "<ul class="post-list">
                <li class="post-item" ng-repeat="todo in $ctrl.todos track by $index">{{::todo.name}}</li>
                </ul>"
});</xmp>
</code>
<div class="post-title">Routed component</div>
<ul class="post-list">
    <li class="post-item">Stateful компонент c routing definition</li>
    <li class="post-item">Опредение собственной routing logic</li>
    <li class="post-item">Внешние данные получаем через сервисы в route <span class="highlight">resolve</span> (или же внутри обращаемся к сервисам внутри контроллера)</li>
</ul>
<code class="language-javascript" prism><xmp>// app.js
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('todos', {
            url: '/todos',
            component: 'todoListRoute',
            resolve: {
                todos: function(todoListService) {
                    return todoListService.getTodos();
                }
            };
    });

    $urlRouterProvider.otherwise('/');
});

.component('todoListRoute', {
    bindings: {
        todos: '<'
    },
    // rest of definition
    ...</xmp>
</code>
    <div class="post-title">Demo</div>
    <todo-list-component></todo-list-component>
    <div class="post-title">Links</div>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="https://github.com/toddmotto/angular-styleguide#components" target="_blank">Component styleguide from Todd Motto</a></li>
      <li class="post-links-item"><a class="post-link" href="https://toddmotto.com/exploring-the-angular-1-5-component-method/" target="_blank">Exploring Components (Todd Motto)</a></li>
      <li class="post-links-item"><a class="post-link" href="https://github.com/toddmotto/angular-1-5-components-app" target="_blank">Components based app (Todd Motto)</a></li>
      <li class="post-links-item"><a class="post-link" href="https://medium.com/@learnreact/container-components-c0e67432e005#.5m4emvfbb" target="_blank">Containers components (React example)</a></li>
      <li class="post-links-item"><a class="post-link" href="https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.m481979ir" target="_blank">Presentational and Container Components</a></li>
    </ul>
</div>`;

    angular.module('app').component('componentOverview', {
        template: template
    }).service('todoListService', function() {
        this.getTodos = function() {
            return [{ name: 'Default todo item'}];
        };
    }).component('todoListComponent', {
        template: `<div>
                    <todo-list-add add="$ctrl.add($event)"></todo-list-add>
                    <todo-list-render todos="$ctrl.todos"></todo-list-render>
                  </div>`,
        controller: function(todoListService) {
            var _this = this;
            // Imagine async API call for fetching data here
            function getTodos() {
                // todos state
                _this.todos = todoListService.getTodos();
            }

            this.add = function($event) {
                this.todos.push($event.todo);
            };

            this.$onInit = function() {
                this.todos = [];

                getTodos();
            };
        }
    }).component('todoListAdd', {
        bindings: {
            add: '&'
        },
        controller: function() {
            this.addTodo = function() {
                var newTodo = {
                    name: this.state.model
                };

                this.add({$event: {
                    todo: newTodo
                }});

                this.state.model = '';
            };

            this.$onInit = function() {
                this.state = {
                    model: ''
                };
            };
        },
        template: '<div><input class="input-text input-post" type="text" ng-model="$ctrl.state.model"><button class="btn" ng-disabled="!$ctrl.state.model.length" ng-click="$ctrl.addTodo();">Add todo</button></div>'

    }).component('todoListRender', {
        bindings: {
            todos: '<'
        },
        template: '<ul class="post-list"><li class="post-item" ng-repeat="todo in $ctrl.todos track by $index">{{::todo.name}}</li></ul>'
    });
})();