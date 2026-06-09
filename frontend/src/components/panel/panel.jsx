import React, { useState } from 'react';

const PanelStat = React.createContext();

function Panel(props) {
  const [reload, setReload] = useState(false);

  const toggleReload = () => {
    if (!reload) {
      setReload(true);
      setTimeout(() => setReload(false), 2000);
    }
  };

  return (
    <PanelStat.Provider value={{ reload, toggleReload }}>
      <div className={`panel panel-${props.theme ? props.theme : 'inverse'} ${reload ? 'panel-loading' : ''} ${props.className ? props.className : ''}`}>
        {props.children}
      </div>
    </PanelStat.Provider>
  );
}

function PanelHeader(props) {
  return (
    <div className={`panel-heading ${props.className || ''}`}>
      <h4 className="panel-title">{props.children}</h4>
    </div>
  );
}

function PanelBody(props) {
  return (
    <PanelStat.Consumer>
      {({ reload }) => (
        <div className={`panel-body ${props.className || ''}`}>
          {props.children}
          {reload && (
            <div className="panel-loader">
              <span className="spinner spinner-sm"></span>
            </div>
          )}
        </div>
      )}
    </PanelStat.Consumer>
  );
}

function PanelFooter(props) {
  return <div className={`panel-footer ${props.className || ''}`}>{props.children}</div>;
}

export { Panel, PanelHeader, PanelBody, PanelFooter };
