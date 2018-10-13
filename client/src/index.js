import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { initMiddleware } from 'devise-axios';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from 'styled-components'
import theme from './theme';
import Loadable from 'react-loadable'

const Loader = () => null

const CssLoader = Loadable({
  loader: () => import('./components/CssLoader'),
  loading: Loader
})

initMiddleware()

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ScrollToTop>
          <CssLoader />
          <App />
        </ScrollToTop>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

