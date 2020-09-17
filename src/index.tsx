import * as React from 'react';
import { render } from 'react-dom';
import { BackendService } from './backend';
import App from './app';
import './style.css';

const backend = new BackendService();

render(<App backend={backend}/>, document.getElementById('root'));
