import React from 'react';

function DropdownLanguage() {
	return (
		<div className="navbar-item dropdown">
			<a href="#/" className="navbar-link dropdown-toggle" data-bs-toggle="dropdown">
				<span className="fi fi-us" title="us"></span>
				<span className="d-none d-sm-inline ms-1">EN</span> <b className="caret"></b>
			</a>
			<div className="dropdown-menu dropdown-menu-end">
				<a href="#/" className="dropdown-item"><span className="fi fi-us me-2" title="us"></span> English</a>
				<a href="#/" className="dropdown-item"><span className="fi fi-cn me-2" title="cn"></span> Chinese</a>
				<a href="#/" className="dropdown-item"><span className="fi fi-jp me-2" title="jp"></span> Japanese</a>
				<a href="#/" className="dropdown-item"><span className="fi fi-be me-2" title="be"></span> Belgium</a>
				<div className="dropdown-divider"></div>
				<a href="#/" className="dropdown-item text-center">more options</a>
			</div>
		</div>
	);
};

export default DropdownLanguage;
