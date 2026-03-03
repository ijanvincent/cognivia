import React, { useEffect, useContext, useState } from 'react';
import { AppSettings } from './../../config/app-settings.js';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { Link } from 'react-router-dom';
import Highlight from 'react-highlight';

function PageFullHeight() {
  const context = useContext(AppSettings);
	const [code1, setCode1] = useState();

  useEffect(() => {
    context.handleSetAppContentFullHeight(true);
    context.handleSetAppContentClass('p-0');
		
		fetch('/assets/data/page-full-height/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		
    return () => {
      context.handleSetAppContentFullHeight(false);
      context.handleSetAppContentClass('');
    };
		// eslint-disable-next-line
	}, []);

  return (
    <div className="overflow-hidden h-100">
      <PerfectScrollbar className="app-content-padding h-100">
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item"><Link to="/page-option/full-height">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/page-option/full-height">Page Options</Link></li>
          <li className="breadcrumb-item active">Full Height Content</li>
        </ol>
        <h1 className="page-header">Full Height Content <small>header small text goes here...</small></h1>
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

				Content Area with scrollbar. Try to scroll down.
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				You got the bottom
      </PerfectScrollbar>
    </div>
  );
}

export default PageFullHeight;
