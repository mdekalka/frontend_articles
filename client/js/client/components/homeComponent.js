(function() {
    'use strict';

    var template = `<div class="home-component">
    <h2 class="home-header">Articles of things that mostly shouldn't exist.</h2>
    <table class="home-table">
        <tr class="home-table-row">
            <th class="home-table-head">Tag</th>
            <th class="home-table-head">Link</th>
            <th class="home-table-head">Description</th>
        </tr>
        <tr class="home-table-row" ng-repeat="item in ::$ctrl.items track by item.id">
            <td class="home-table-cell {{::item.label}}">{{::item.tag}}</td>
            <td class="home-table-cell"><a class="link" ui-sref="{{::item.ref}}">{{::item.title}}</a></td>
            <td class="home-table-cell"><div class="tags">{{::item.info}}</div></td>
        </tr>
    </table> 
</div>`;

    angular.module('app').component('homeComponent', {
        template: template,
        controller: function(constantsService) {
            var Constants = constantsService.constants;

            this.items = Constants.MAIN_LINKS;
        }
    });

})();
  