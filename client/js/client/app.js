(function() {
    'use strict';

    var mainModule = angular.module('app', ['ui.router']);

    mainModule.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('root', {
                url: '/',
                component: 'homeComponent'
            })
            .state('componentOverview', {
                url: '/componentOverview',
                component: 'componentOverview'
            })
            .state('lifecycleHooks', {
                url: '/lifecycleHooks',
                component: 'lifecycleHooks'
            })
            .state('componentTree', {
                url: '/componentTree',
                component: 'componentTree'
            })
            .state('onChangesOverview', {
                url: '/onChangesOverview',
                component: 'onChangesOverview'
            })
            .state('migrateTo16', {
                url: '/migrateTo16',
                component: 'migrateTo16'
            })
            .state('basicAuthentication', {
                url: '/basicAuthentication',
                component: 'basicAuthentication'
            })
            .state('appStructure', {
                url: '/appStructure',
                component: 'appStructure'
            })
            .state('threePrinciples', {
                url: '/threePrinciples',
                component: 'threePrinciples'
            })
            .state('todoList', {
                url: '/todoList',
                component: 'todoList'
            })
            .state('componentLifecycle', {
                url: '/componentLifecycle',
                component: 'componentLifecycle'
            })
            .state('communicationBetweenComponents', {
                url: '/communicationBetweenComponents',
                component: 'communicationBetweenComponents'
            })
            .state('conditionalStatement', {
                url: '/conditionalStatement',
                component: 'conditionalStatement'
            })
            .state('containerComponents', {
                url: '/containerComponents',
                component: 'containerComponents'
            })
            .state('context', {
                url: '/context',
                component: 'context'
            });

            


        $urlRouterProvider.otherwise('/')
    });

})();