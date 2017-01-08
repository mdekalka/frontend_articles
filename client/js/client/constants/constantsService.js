
(function() {
    'use strict';

    angular.module('app').service('constantsService', function() {
        var constants = Object.freeze({
            MAIN_LINKS: [
                {
                    id: 0,
                    tag: 'Angular 1x',
                    label: 'angular',
                    title: 'Component overview',
                    ref: 'componentOverview',
                    info: 'Component overview / stateful, stateless, routed components / example'
                },
                {
                    id: 1,
                    tag: 'Angular 1x',
                    label: 'angular',
                    title: 'Lifecycle Hooks overview',
                    ref: 'lifecycleHooks',
                    info: 'Lifecycle Hooks overview / onInit, onChanges, onDestroy, postLink / example'
                },
                {
                    id: 2,
                    tag: 'Angular 1x',
                    label: 'angular',
                    title: 'Component tree app overview',
                    ref: 'componentTree',
                    info: 'Component-based application architecture / component tree /stateful, stateless components'
                },
                {
                    id: 3,
                    tag: 'Angular 1x',
                    label: 'angular',
                    title: '$onChanges overview',
                    ref: 'onChangesOverview',
                    info: '$onChanges lifecycle hook / example'
                },
                {
                    id: 4,
                    tag: 'Angular 1x',
                    label: 'angular',
                    title: 'Angular 1.6 changes',
                    ref: 'migrateTo16',
                    info: 'Angular 1.6 main changes'
                },
                {
                    id: 5,
                    tag: 'Angular 1x',
                    label: 'angular',
                    title: 'Basic authentication',
                    ref: 'basicAuthentication',
                    info: 'Authentication / routes'
                },
                {
                    id: 6,
                    tag: 'Redux',
                    label: 'redux',
                    title: 'Application structure',
                    ref: 'appStructure',
                    info: 'Application structure / react / redux'
                },
                {
                    id: 7,
                    tag: 'Redux',
                    label: 'redux',
                    title: 'Main principles of Redux',
                    ref: 'threePrinciples',
                    info: 'Redux principles / state'
                },
                {
                    id: 8,
                    tag: 'Redux',
                    label: 'redux',
                    title: 'Todo list example',
                    ref: 'threePrinciples',
                    info: 'Todo list / react / redux'
                },
                {
                    id: 9,
                    tag: 'React',
                    label: 'react',
                    title: 'Components lifecycle',
                    ref: 'componentLifecycle',
                    info: 'Lifecycle / state / componentWillMount / render / componentDidMount / componentWillReceiveProps / shouldComponentUpdate / componentWillUpdate / componentDidUpdate / componentWillUnmount'
                },
                {
                    id: 10,
                    tag: 'React',
                    label: 'react',
                    title: 'Communication between components',
                    ref: 'communicationBetweenComponents',
                    info: 'Component / event emitter / communication'
                },
                {
                    id: 11,
                    tag: 'React',
                    label: 'react',
                    title: 'Conditional statement',
                    ref: 'conditionalStatement',
                    info: 'Component / if-else'
                },
                {
                    id: 12,
                    tag: 'React',
                    label: 'react',
                    title: 'Container components',
                    ref: 'containerComponents',
                    info: 'container component / separation of concerns'
                },
                {
                    id: 13,
                    tag: 'React',
                    label: 'react',
                    title: 'React context',
                    ref: 'context',
                    info: 'context / passing props'
                }
            ]
        });

        this.constants = constants;
    });
})();