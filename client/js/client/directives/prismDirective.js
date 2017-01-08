(function() {
    'use strict';

    angular.module('app')
        .directive('prism', function($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element) {
                    $timeout(function() {
                        element.ready(function() {
                            Prism.highlightElement(element[0]);
                        });
                    }, 0);
                }
            }
        });
})();

