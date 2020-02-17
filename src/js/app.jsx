import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  render () {
    return (
        <div>
            <div className="sample1"></div>
            <div className="container"></div>
        </div>
    );
  }
}

// '#app' => render React.Component/App
render(<App/>, document.getElementById('app'));