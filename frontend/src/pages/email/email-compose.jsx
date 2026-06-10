import React, { useEffect, useContext, useState } from 'react';
import { ReactTags } from 'react-tag-autocomplete';
import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import PerfectScrollbar from 'react-perfect-scrollbar';

function EmailCompose() {
	const context = useContext(AppSettings);
	const [isMobileEmailNavOn, setIsMobileEmailNavOn] = useState(false);
	const [cc, setCc] = useState(false);
	const [bcc, setBcc] = useState(false);
	const [tags, setTags] = useState([]);
	const [tagsCc, setTagsCc] = useState([]);
	const [tagsBcc, setTagsBcc] = useState([]);
	const [suggestions, setSuggestions] = useState([]);
	const [text, setText] = useState('');
	const [editorHeight, setEditorHeight] = useState(0);
	
	useEffect(() => {
    context.handleSetAppContentFullHeight(true);
    context.handleSetAppContentClass('p-0');
    
    setTags([
			{ value: 1, label: 'bootstrap@gmail.com' },
			{ value: 2, label: 'google@gmail.com' }
		]);
		
		setSuggestions([
			{ value: 1, label: 'bootstrap@gmail.com' },
			{ value: 2, label: 'google@gmail.com' },
			{ value: 3, label: 'programmer@gmail.com' },
			{ value: 4, label: 'uxui@gmail.com' },
			{ value: 5, label: 'designer@gmail.com' },
			{ value: 6, label: 'android@gmail.com' }
		]);
		
		setEditorHeight((window.innerHeight > 600) ? window.innerHeight - 315 : 300);
		
    return () => {
			context.handleSetAppContentFullHeight(false);
			context.handleSetAppContentClass('');
    };
    // eslint-disable-next-line
  }, []);
	
	function toggleMobileEmailNav() {
		setIsMobileEmailNavOn(!isMobileEmailNavOn);
	}
  
  function handleTagAdd(newTag) {
		setTags([...tags, newTag]);
	}
  
  function handleTagDelete(tagIndex) {
		setTags(tags.filter((_, i) => i !== tagIndex))
	}

  function handleTagCcAdd(newTag) {
		setTagsCc([...tagsCc, newTag]);
  };
  
  function handleTagCcDelete(tagIndex) {
		setTagsCc(tagsCc.filter((_, i) => i !== tagIndex))
	}

  function handleTagBccAdd(newTag) {
		setTagsBcc([...tagsBcc, newTag]);
  };
  
  function handleTagBccDelete(tagIndex) {
		setTagsBcc(tagsBcc.filter((_, i) => i !== tagIndex))
	}

	function handleCc(e) {
		setCc(true);
	}

	function handleBcc(e) {
		setBcc(true);
	}

	function handleChange(value) {
		setText(value);
	}
  
	return (
		<div className="mailbox">
			<div className="mailbox-sidebar">
				<div className="mailbox-sidebar-header d-flex justify-content-center">
					<button onClick={toggleMobileEmailNav} className="btn btn-dark btn-sm me-auto d-block d-lg-none">
						<i className="fa fa-cog"></i>
					</button>
					<Link to="/email/compose" className="btn btn-dark ps-40px pe-40px btn-sm">
						Compose
					</Link>
				</div>
				<div className={'mailbox-sidebar-content collapse d-lg-block ' + (isMobileEmailNavOn ? 'show' : '') }>
					<PerfectScrollbar className="h-100" options={{suppressScrollX: true}}>
						<div className="nav-title"><b>FOLDERS</b></div>
						<ul className="nav nav-inbox">
							<li className="active"><Link to="/email/inbox"><i className="fa fa-hdd fa-lg fa-fw me-2"></i> Inbox <span className="badge bg-gray-600 fs-10px rounded-pill ms-auto fw-bolder pt-4px pb-5px px-8px">52</span></Link></li>
							<li><Link to="/email/inbox"><i className="fa fa-flag fa-lg fa-fw me-2"></i> Important</Link></li>
							<li><Link to="/email/inbox"><i className="fa fa-envelope fa-lg fa-fw me-2"></i> Sent</Link></li>
							<li><Link to="/email/inbox"><i className="fa fa-save fa-lg fa-fw me-2"></i> Drafts</Link></li>
							<li><Link to="/email/inbox"><i className="fa fa-trash-alt fa-lg fa-fw me-2"></i> Trash</Link></li>
						</ul>
						<div className="nav-title"><b>LABEL</b></div>
						<ul className="nav nav-inbox">
							<li><Link to="/email/detail"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-dark"></i> Admin</Link></li>
							<li><Link to="/email/detail"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-blue"></i> Designer & Employer</Link></li>
							<li><Link to="/email/detail"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-success"></i> Staff</Link></li>
							<li><Link to="/email/detail"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-warning"></i> Sponsorer</Link></li>
							<li><Link to="/email/detail"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-danger"></i> Client</Link></li>
						</ul>
					</PerfectScrollbar>
				</div>
			</div>
			<div className="mailbox-content">
				<div className="mailbox-content-header">
					<div className="btn-toolbar align-items-center">
						<div className="btn-group me-2">
							<Link to="/email/compose" className="btn btn-white btn-sm"><i className="fa fa-fw fa-envelope"></i> <span className="hidden-xs">Send</span></Link>
							<Link to="/email/compose" className="btn btn-white btn-sm"><i className="fa fa-fw fa-paperclip"></i> <span className="hidden-xs">Attach</span></Link>
						</div>
						<div>
							<a href="#/" className="btn btn-white btn-sm" data-bs-toggle="dropdown"><i className="fa fa-fw fa-ellipsis-h"></i></a>
							<div className="dropdown-menu dropdown-menu-end">
								<a href="#/" className="dropdown-item">Save draft</a>
								<a href="#/" className="dropdown-item">Show From</a>
								<a href="#/" className="dropdown-item">Check names</a>
								<a href="#/" className="dropdown-item">Switch to plain text</a>
								<a href="#/" className="dropdown-item">Check for accessibility issues</a>
							</div>
						</div>
						<div className="ms-auto">
							<Link to="/email/inbox" className="btn btn-white btn-sm"><i className="fa fa-fw fa-times"></i> <span className="hidden-xs">Discard</span></Link>
						</div>
					</div>
				</div>
				<div className="mailbox-content-body">
					<PerfectScrollbar className="h-100" options={{suppressScrollX: true}}>
						<form action="/" method="POST" name="email_to_form" className="mailbox-form">
							<div className="mailbox-to">
								<label className="control-label">To:</label>
								<ReactTags placeholderText="Add Email" allowNew={true} selected={tags} suggestions={suggestions} onDelete={handleTagDelete} onAdd={handleTagAdd} />
								<span className="mailbox-float-link">
									{!cc && <Link to="/email/compose" onClick={handleCc} className="me-5px">Cc</Link>}
									{!bcc && <Link to="/email/compose" onClick={handleBcc}>Bcc</Link>}
								</span>
							</div>
							{cc &&
								<div className="mailbox-to">
									<label className="control-label">Cc:</label>
									<ReactTags placeholderText="Add Cc Email" allowNew={true} selected={tagsCc} suggestions={suggestions} onDelete={handleTagCcDelete} onAdd={handleTagCcAdd} />
								</div>
							}
							{bcc &&
								<div className="mailbox-to">
									<label className="control-label">Bcc:</label>
									<ReactTags placeholderText="Add Bcc Email" allowNew={true} selected={tagsBcc} suggestions={suggestions} onDelete={handleTagBccDelete} onAdd={handleTagBccAdd} />
								</div>
							}
							<div className="mailbox-subject">
								<input type="text" className="form-control" placeholder="Subject" />
							</div>
							<div className="mailbox-input">
								<ReactQuill value={text} className="border-0" onChange={handleChange} style={{ height: editorHeight + 'px', marginBottom: '20px' }} />
							</div>
						</form>
					</PerfectScrollbar>
				</div>
				<div className="mailbox-content-footer d-flex align-items-center justify-content-end">
					<button type="submit" className="btn btn-white ps-40px pe-40px me-5px">Discard</button>
					<button type="submit" className="btn btn-primary ps-40px pe-40px">Send</button>
				</div>
			</div>
		</div>
	)
}

export default EmailCompose;