
(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">$onChanges overview</div>
        <p class="post-block"><span class="highlight">$onChanges</span> is called in the local component controller from changes that occurred in the parent controller.</p>
        <div class="post-title">Triggered time</div>
        <p class="post-block">The <span class="highlight">$onChanges</span> lifecycle hook gets called for a two reasons. 1) is on component initialisation, it passes down that initial changes object at runtime. 2)it gets called is only when changes occur to <span class="highlight">'<'</span> (one-way databinding) and <span class="highlight">'@'</span> (for evaluated DOM attribute values) that are being bound to from the parent component. Once $onChanges gets called, you’ll get a special changes object back that you can hook into.</p>
        <div class="post-title">Primitive type</div>
        <p class="post-block">Если мы передаем в child компонент primitive type, то  <span class="highlight">$onChanges</span> будет срабатывать на каждое изменение значения. Мы <span></span> присвоили новое значение строке(модель) - значение изменилось - запустился <span class="highlight">$digest cycle</span> : он видит что <span class="highlight">$watch</span> expression is dirty и регистрирует callback <span class="highlight">$onChanges</span>, который будет вызван на <span class="highlight">$$postDigest phase</span>.
        </p>
<code class="language-javascript" prism><xmp>.component('onChangesParent', {
    template: '</div>
                // изменение модели
                <div><span class="highlight">Primitive type: </span><input class="input input-text" ng-model="$ctrl.primitive" />
                <on-changes-child primitive="$ctrl.primitive" ></on-changes-child>
                </div>
                </div>',
    controller: function() {
        this.$onInit = function() {
            this.primitive = '';
        };
    }
    });

.component('onChangesChild', {
        template: '<div>Number of times the $onChanges is invoked: {{$ctrl.changes}}</div>',
        bindings: {
            primitive: '<'
        },
        controller: function() {
            // при любом изменении модели - onChanges будет вызван
            this.$onChanges = function(changes) {
                this.changes++;
            };

            this.changes = 0;
        }
    });</xmp>
</code>
    <div class="post-title">Reference type</div>
    <p class="post-block">При изменении(мутации) объекта, <span class="highlight">$onChanges</span> child компоненты не будет вызван, потому что когда создается <span class="highlight">$watch</span> на binding '<' он проверяет <span class="highlight">equality via reference!</span>(это логично, ведь проверять каждый раз deep compare пропертей может доставить перфоманс на самое дно). Т.е. любая мутация исходного объекта не будт вызывать <span class="highlight">$onChanges</span>, но так как это reference type, child component все равно будет ссылаться на обновленную версию. Если же оригинальному объекту изменить ссылку, то <span class="highlight">$onChanges</span> сработает.
    </p>
<code class="language-javascript" prism><xmp>.component('onChangesParent', {
        template: '</div>
                    <div><span class="highlight">Reference type:</span> {{$ctrl.arr}}
                    <button class="btn" ng-click="$ctrl.addValue();">Push value</button>
                    <button class="btn" ng-click="$ctrl.changeReference();">Change reference</button>
                    <on-changes-child ref="$ctrl.arr"></on-changes-child>
                    </div>
                  </div>',
        controller: function() {
            this.$onInit = function() {
                // оригинальный объект
                this.arr = [1, 2, 3];
            };

            this.changeReference = function() {
                // если меняем ссылку - onChanges сработает
                this.arr = [];
            };

            this.addValue = function() {
                var a = this.arr[this.arr.length - 1] || 0;
                // но при любой мутации объекта onChanges не будет вызван
                this.arr.push(++a);
            };
        }
    });
    
.component('onChangesChild', {
        template: '<div>Number of times the $onChanges is invoked: {{$ctrl.changes}}</div>',
        bindings: {
            ref: '<'
        },
        controller: function() {
            this.$onChanges = function(changes) {
                this.changes++;
            };

            this.changes = 0;
        }
    });</xmp>
</code>
    <div class="post-title">Immutable data?</div>
    <p class="post-block">Да, да, да... Я знаю, что на тебе майка c надписями "React+Redux <3" и ты знаешь про immutable data в JS. Так что, если ты хочешь, чтобы <span class="highlight">$onChanges</span> все таки вызывался на любую мутацию объекта, нам надо менять ссылку на новый объект.</p>
<code class="language-javascript" prism><xmp>.component('onChangesParent', {
        template: '</div>
                    <span class="highlight">Immutable.js: </span> {{$ctrl.immutableArr}}
                    <button class="btn" ng-click="$ctrl.addToImmutable();">Push to immutable</button>
                    <on-changes-child immut="$ctrl.immutableArr"></on-changes-child>
                  </div>',
        controller: function() {
            this.$onInit = function() {
                // создаем неизменяемый объект с помощью Immutable.js
                this.immutableArr = Immutable.List.of(1, 2, 3);
            };

            this.addToImmutable = function() {
                // добавляем запись в объект, но при этом Immutable.js вернет новый объект
                this.immutableArr = this.immutableArr.push(1);
            };
        }
    });

.component('onChangesChild', {
        template: '<div>Number of times the $onChanges is invoked: {{$ctrl.changes}}</div>',
        bindings: {
            immut: '<'
        },
        controller: function() {
            this.$onChanges = function(changes) {
                this.changes++;
            };

            this.changes = 0;
        }
    });</xmp>
</code>
    </div>
    <div class="post-title">Demo</div>
    <on-changes-parent></on-changes-parent>
    <div class="post-title">Links</div>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="http://blog.kwintenp.com/the-onchanges-lifecycle-hook/" target="_blank">The $onChanges lifecycle-hook in depth</a></li>
      <li class="post-links-item"><a class="post-link" href="https://toddmotto.com/angular-1-5-lifecycle-hooks#onchanges" target="_blank">$onChanges lifecycle hook (Todd Motto)</a></li>
      <li class="post-links-item"><a class="post-link" href="https://facebook.github.io/immutable-js/" target="_blank">Immutable collections for JavaScript</a></li>
    </ul>
</div>
`;
   

    angular.module('app').component('onChangesOverview', {
        template: template
    }).component('onChangesParent', {
        template: `</div>
                    <div><span class="highlight">Primitive type: </span><input class="input input-text" ng-model="$ctrl.primitive" />
                    <on-changes-child primitive="$ctrl.primitive" ></on-changes-child>
                    </div>
                    <div><span class="highlight">Reference type:</span> {{$ctrl.arr}}
                    <button class="btn" ng-click="$ctrl.addValue();">Push value</button>
                    <button class="btn" ng-click="$ctrl.changeReference();">Change reference</button>
                    <on-changes-child ref="$ctrl.arr"></on-changes-child>
                    </div>
                    <div>
                        <span class="highlight">Immutable.js: </span> {{$ctrl.immutableArr}}
                        <button class="btn" ng-click="$ctrl.addToImmutable();">Push to immutable</button>
                        <on-changes-child immut="$ctrl.immutableArr"></on-changes-child>
                    </div>
                  </div>`,
        controller: function() {
            this.$onInit = function() {
                this.primitive = '';
                this.arr = [1, 2, 3];
                this.immutableArr = Immutable.List.of(1, 2, 3);
            };

            this.addToImmutable = function() {
                this.immutableArr = this.immutableArr.push(1);
            };

            this.changeReference = function() {
                this.arr = [];
            };

            this.addValue = function() {
                var a = this.arr[this.arr.length - 1] || 0;

                this.arr.push(++a);
            };
        }
    }).component('onChangesChild', {
        template: '<div>Number of times the $onChanges is invoked: {{$ctrl.changes}}</div>',
        bindings: {
            primitive: '<',
            ref: '<',
            immut: '<'
        },
        controller: function() {
            this.$onChanges = function(changes) {
                this.changes++;
            };

            this.changes = 0;
        }
    });
})();
  