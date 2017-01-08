(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Component-based application</div>
        <div class="post-title">Components only control their own View and Data:</div>
        <p class="post-block">Components should never modify any data or DOM that is out of their own scope. Normally, in Angular it is possible to modify data anywhere in the application through scope inheritance and watches. This is practical, but can also lead to problems when it is not clear which part of the application is responsible for modifying the data. That is why component directives use an isolate scope, so a whole class of scope manipulation is not possible..
        </p>
        <div class="post-title">Components have a well-defined public API - Inputs and Outputs:</div>
        <p class="post-block">However, scope isolation only goes so far, because Angular uses two-way binding. So if you pass an object to a component like this - bindings: {item: '='}, and modify one of its properties, the change will be reflected in the parent component. For components however, only the component that owns the data should modify it, to make it easy to reason about what data is changed, and when.</p>
        <div class="post-title">Code overview</div>
        <p class="post-block">Рассмотрим подробней на примере небольшое component-base only приложение:</p>
<code class="language-javascript" prism><xmp>// Сервис для хранения стейта записей
.service('heroService', function() {
        this.heroes = [
            {
                id: 0,
                name: 'Batman',
                location: 'Wayne Manor'
            },
            {
                id: 1,
                name: 'Superman',
                location: 'Unknown'
            },
            {
                id: 2,
                name: 'Spider-Man',
                location: 'Forest Hills'
            }
        ];

        this.getHeroes = function() {
            return this.heroes;
        };

        this.removeHero = function(hero) {
            var index = this.heroes.indexOf(hero);

            if (index >= 0) {
                this.heroes.splice(index, 1);
            }
        };

        this.updateHero = function(hero, prop, value) {
            hero[prop] = value;
        };
    });
// container statefull component  
.component('heroList', {
        template: '<div>
                    // через аттрибуты передаем записи и методы в дочерние stateless компоненты
                    <hero-detail ng-repeat="hero in $ctrl.heroes track by $index"
                        hero="hero"
                        on-delete="$ctrl.deleteHero($event)"
                        on-update="$ctrl.updateHero($event)"
                        >
                    </hero-detail>
                  </div>',
        controller: function(heroService) {
            var _this = this;
            // все операции с мутацией стейта делаем через сервис

            // получение записей из сервиса
            function getHeroes() {
                _this.heroes = heroService.getHeroes();
            }
            // удаление записей
            this.deleteHero = function(event) {
                heroService.removeHero(event.hero);
            };
            // обновление
            this.updateHero = function(event) {
                heroService.updateHero(event.hero, event.prop, event.value);
            };

            this.$onInit = function() {
                this.heroes = [];
                // получение начального стейта
                getHeroes();
            };
        }
    });
// stateless component
.component('heroDetail', {
        bindings: {
            hero: '<',
            onDelete: '&',
            onUpdate: '&'
        },
        template: '<div>
                    <div>Name: {{$ctrl.hero.name}}</div>
                    <div>Location: 
                    <hero-edit location="$ctrl.hero.location" type="'text'" on-delete="$ctrl.delete();" on-update="$ctrl.update('location', value)">
                    </hero-edit></div>
                  </div>',
        controller: function() {
            this.delete = function() {
                // вызываем родительский метод компонента
                this.onDelete({
                    $event: {
                        hero: this.hero
                    }
                });
            };

            this.update = function(prop, value) {
                // вызываем родительский метод компонента
                this.onUpdate({
                    $event: {
                        hero: this.hero,
                        prop: prop,
                        value: value
                    }
                });
            };
        }
    });
// semi-stateless (wut?) component
.component('heroEdit', {
        bindings: {
            location: '<',
            type: '@?',
            onUpdate: '&',
            onDelete: '&'
        },
        template: '<div>
                    <span ng-switch="$ctrl.state.isEditMode">
                      <input class="input input-text" ng-switch-when="true" type="{{$ctrl.type}}" ng-model="$ctrl.location">
                      <span ng-switch-default>{{$ctrl.location}}</span>
                    </span>
                    <button class="btn" ng-click="$ctrl.handleModeChange()">{{$ctrl.state.isEditMode ? 'Save' : 'Edit'}}</button>
                    <button class="btn" ng-if="$ctrl.state.isEditMode" ng-click="$ctrl.reset()">Reset</button>
                    <button class="btn" ng-click="$ctrl.delete()">Delete</button>
                  </div>',
        controller: function() {
            this.handleModeChange = function() {
                if (this.state.isEditMode) {
                    this.onUpdate({value: this.location});

                    this.locationOrigin = angular.copy(this.location);
                }
                this.state.isEditMode = !this.state.isEditMode;
            };

            this.reset = function() {
                this.location = this.locationOrigin;
            };

            this.delete = function() {
                this.onDelete();
            };

            this.$onInit = function() {
                // По определению stateless компонент не может хранить никакого data стейта, но UI state может
                this.state = {
                    isEditMode: false
                };

                this.locationOrigin = angular.copy(this.location);

                if (!this.type) {
                    this.type = 'text';
                }
            };
        }
    });</xmp>
</code>

<div class="post-title">Demo</div>
<hero-list></hero-list>
    <div class="post-title">Links</div>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="https://docs.angularjs.org/guide/component" target="_blank">Component-based application architecture</a></li>
      <li class="post-links-item"><a class="post-link" href="https://github.com/toddmotto/angular-1-5-components-app" target="_blank">Angular 1.5 component architecture app</a></li>
      <li class="post-links-item"><a class="post-link" href="http://blog.thoughtram.io/angularjs/2016/03/29/exploring-angular-1.5-lifecycle-hooks.html" target="_blank">Exploring Lifecycle hooks</a></li>
      <li class="post-links-item"><a class="post-link" href="https://scotch.io/tutorials/understanding-angular-1-5-lifecycle-hooks" target="_blank">Understanding Angular 1.5 Lifecycle Hooks</a></li>
      <li class="post-links-item"><a class="post-link" href="http://www.codelord.net/2016/04/14/angular-1-dot-5-new-component-lifecycle-hooks/" target="_blank">New component lifecycle hooks</a></li>
    </ul>
    </div>
</div>`;

    angular.module('app').component('componentTree', {
        template: template
    }).service('heroService', function() {
        this.heroes = [
            {
                id: 0,
                name: 'Batman',
                location: 'Wayne Manor'
            },
            {
                id: 1,
                name: 'Superman',
                location: 'Unknown'
            },
            {
                id: 2,
                name: 'Spider-Man',
                location: 'Forest Hills'
            }
        ];

        this.getHeroes = function() {
            return this.heroes;
        };

        this.removeHero = function(hero) {
            var index = this.heroes.indexOf(hero);

            if (index >= 0) {
                this.heroes.splice(index, 1);
            }
        };

        this.updateHero = function(hero, prop, value) {
            hero[prop] = value;
        };
    }).component('heroList', {
        template: `<div>
                    <hero-detail ng-repeat="hero in $ctrl.heroes track by $index"
                        hero="hero"
                        on-delete="$ctrl.deleteHero($event)"
                        on-update="$ctrl.updateHero($event)"
                        >
                    </hero-detail>
                  </div>`,
        controller: function(heroService) {
            var _this = this;

            function getHeroes() {
                _this.heroes = heroService.getHeroes();
            }

            this.deleteHero = function(event) {
                heroService.removeHero(event.hero);
            };

            this.updateHero = function(event) {
                heroService.updateHero(event.hero, event.prop, event.value);
            };

            this.$onInit = function() {
                this.heroes = [];

                getHeroes();
            };
        }
    }).component('heroDetail', {
        bindings: {
            hero: '<',
            onDelete: '&',
            onUpdate: '&'
        },
        template: `<div>
                    <div>Name: {{$ctrl.hero.name}}</div>
                    <div>Location: 
                    <hero-edit location="$ctrl.hero.location" type="'text'" on-delete="$ctrl.delete();" on-update="$ctrl.update('location', value)">
                    </hero-edit></div>
                  </div>`,
        controller: function() {
            this.delete = function() {
                this.onDelete({
                    $event: {
                        hero: this.hero
                    }
                });
            };

            this.update = function(prop, value) {
                this.onUpdate({
                    $event: {
                        hero: this.hero,
                        prop: prop,
                        value: value
                    }
                });
            };
        }
    }).component('heroEdit', {
        bindings: {
            location: '<',
            type: '@?',
            onUpdate: '&',
            onDelete: '&'
        },
        template: `<div>
                    <span ng-switch="$ctrl.state.isEditMode">
                      <input class="input input-text" ng-switch-when="true" type="{{$ctrl.type}}" ng-model="$ctrl.location">
                      <span ng-switch-default>{{$ctrl.location}}</span>
                    </span>
                    <button class="btn" ng-click="$ctrl.handleModeChange()">{{$ctrl.state.isEditMode ? 'Save' : 'Edit'}}</button>
                    <button class="btn" ng-if="$ctrl.state.isEditMode" ng-click="$ctrl.reset()">Reset</button>
                    <button class="btn" ng-click="$ctrl.delete()">Delete</button>
                  </div>`,
        controller: function() {
            this.handleModeChange = function() {
                if (this.state.isEditMode) {
                    this.onUpdate({value: this.location});

                    this.locationOrigin = angular.copy(this.location);
                }
                this.state.isEditMode = !this.state.isEditMode;
            };

            this.reset = function() {
                this.location = this.locationOrigin;
            };

            this.delete = function() {
                this.onDelete();
            };

            this.$onInit = function() {
                this.state = {
                    isEditMode: false
                };

                this.locationOrigin = angular.copy(this.location);

                if (!this.type) {
                    this.type = 'text';
                }
            };
        }
    });
})();
