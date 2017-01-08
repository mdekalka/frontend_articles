(function() {
    'use strict';

    var template = `
<div class="post-wrapper">
    <div class="content">
        <div><a ui-sref="root" class="back-link post-title">❮ Back</a></div>
        <div class="header">Communication between components</div>
<code class="language-javascript" prism><xmp>// If you need to communication with unrelated components or related but too further
// you have at least 3 patterns:
// Event Emitter/Target/Dispatcher
// Publish / Subscribe
// Signals

// See example of eventEmitter use: 
class Communication extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: []
        };

        this._addToListThis = this._addToList.bind(this);
    }

    _addToList(item) {
        if (item) {
            var list = this.state.list;
            list.push(item);

            this.setState({list: list});
        }
    }

    componentDidMount() {
        // add listener and callback
        eventEmitter.addListener('add_item', this._addToListThis);
    }

    componentWillUnmount() {
        // remove listener and callback
        eventEmitter.removeListener('add_item', this._addToListThis)
    }

    render() {
        var list = this.state.list.map((item)=> {
            return <div>{item.name}</div>
        });

        return (
            <div>
                <div>{list}</div>
            </div>
        )
    }
}

// Some another component will trigger an event with data
class CommunicationComponent extends Component {
    constructor(props) {
        super(props);
    }

    onClickHandler(item) {
        // emit the event with item object
        eventEmitter.emit('add_item', item);
    }

    render() {
        return (
            <div onClick={()=> this.onClickHandler({name: 'item'})}>Add item</div>
        )
    }
}</xmp>
</code>
    <ul class="post-links">
      <li class="post-links-item"><a class="post-link" href="https://ctheu.com/2015/02/12/how-to-communicate-between-react-components/" target="_blank">How to communicate between React components</a></li>
      <li class="post-links-item"><a class="post-link" href="http://stackoverflow.com/questions/21285923/reactjs-two-components-communicating" target="_blank">ReactJS Two components communicating</a></li>
      <li class="post-links-item"><a class="post-link" href="https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations" target="_blank">Comparison between different Observer Pattern implementations</a></li>
    </ul>
    </div>
</div>`;

    angular.module('app').component('communicationBetweenComponents', {
        template: template
    });

})();
  