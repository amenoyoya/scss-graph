import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  render () {
    return <div class="sample1"></div>;
  }
}

// '#app' => render React.Component/App
render(<App/>, document.getElementById('app'));