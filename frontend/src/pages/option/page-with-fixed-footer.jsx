import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Highlight from 'react-highlight';

function PageWithFooter() {
  const context = React.useContext(AppSettings);
	const [code1, setCode1] = useState();

  useEffect(() => {
    context.handleSetAppContentFullHeight(true);
    context.handleSetAppContentClass('p-0 d-flex flex-column');

		fetch('/assets/data/page-with-fixed-footer/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		
    return () => {
      context.handleSetAppContentFullHeight(false);
      context.handleSetAppContentClass('');
    };
		// eslint-disable-next-line
	}, []);

  return (
    <div className="h-100 d-flex flex-column">
      <PerfectScrollbar className="app-content-padding flex-grow-1 overflow-hidden" options={{ suppressScrollX: true }}>
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item"><Link to="/page-option/with-fixed-footer">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/page-option/with-fixed-footer">Page Options</Link></li>
          <li className="breadcrumb-item active">Page with Footer</li>
        </ol>
        <h1 className="page-header">Page with Fixed Footer <small>header small text goes here...</small></h1>
        <Panel>
          <PanelHeader>Installation Settings</PanelHeader>
          <PanelBody>
            <p>
              Add the following settings into your individual page or change the variable value from <code>app.jsx</code> to make it globally affected in your app.
            </p>
          </PanelBody>
          <div className="hljs-wrapper">
            <Highlight className='typescript'>{code1}</Highlight>
          </div>
        </Panel>
      </PerfectScrollbar>

      <div id="footer" className="app-footer m-0">
        &copy; 2024 Color Admin Responsive Admin Template - Sean Ngu All Rights Reserved
      </div>
    </div>
  );
}

export default PageWithFooter;