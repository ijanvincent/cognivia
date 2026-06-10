import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import Highlight from 'react-highlight';

function PageWithFooter() {
	const [code1, setCode1] = useState();
	
	useEffect(() => {
		fetch('/assets/data/page-with-footer/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		
		// eslint-disable-next-line
	}, []);
	
  return (
    <div>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item"><Link to="/page-option/with-footer">Home</Link></li>
        <li className="breadcrumb-item"><Link to="/page-option/with-footer">Page Options</Link></li>
        <li className="breadcrumb-item active">Page with Footer</li>
      </ol>
      <h1 className="page-header">Page with Footer <small>header small text goes here...</small></h1>

      <Panel>
        <PanelHeader>Installation Settings</PanelHeader>
        <PanelBody>
          <p>
            Add the <code>.app-footer</code> element to <code>.app-content</code> container for footer page element.
          </p>
        </PanelBody>
        <div className="hljs-wrapper">
          <Highlight className='typescript'>{code1}</Highlight>
        </div>
      </Panel>

      <div id="footer" className="app-footer mx-0 px-0">
        &copy; 2024 Color Admin Responsive Admin Template - Sean Ngu All Rights Reserved
      </div>
    </div>
  );
}

export default PageWithFooter;