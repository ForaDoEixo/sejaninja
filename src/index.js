import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import PixiApp from './pixi'

const app = PixiApp()
document.getElementById('pixi').appendChild (app.view)
console.log('app', app)

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
