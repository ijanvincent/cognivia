import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import PerfectScrollbar from 'react-perfect-scrollbar';

function EmailDetail() {
	const context = useContext(AppSettings);
	const [isMobileEmailNavOn, setIsMobileEmailNavOn] = useState(false);
	
	useEffect(() => {
    context.handleSetAppContentFullHeight(true);
    context.handleSetAppContentClass('p-0');
    
    return () => {
			context.handleSetAppContentFullHeight(false);
			context.handleSetAppContentClass('');
    };
    // eslint-disable-next-line
  }, []);
	
	function toggleMobileEmailNav() {
		setIsMobileEmailNavOn(!isMobileEmailNavOn);
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
					<div className="btn-toolbar">
						<div className="btn-group me-2">
							<Link to="/email/detail" className="btn btn-white btn-sm"><i className="fa fa-fw fa-reply"></i> <span className="d-none d-lg-inline">Reply</span></Link>
						</div>
						<div className="btn-group me-2">
							<Link to="/email/detail" className="btn btn-white btn-sm"><i className="fa fa-fw fa-trash"></i> <span className="d-none d-lg-inline">Delete</span></Link>
							<Link to="/email/detail" className="btn btn-white btn-sm"><i className="fa fa-fw fa-archive"></i> <span className="d-none d-lg-inline">Archive</span></Link>
						</div>
						<div className="btn-group ms-auto me-2">
							<Link to="/email/inbox" className="btn btn-white btn-sm disabled"><i className="fa fa-fw fa-arrow-up"></i></Link>
							<Link to="/email/inbox" className="btn btn-white btn-sm"><i className="fa fa-fw fa-arrow-down"></i></Link>
						</div>
						<div className="btn-group">
							<Link to="/email/inbox" className="btn btn-white btn-sm"><i className="fa fa-fw fa-times"></i></Link>
						</div>
					</div>
				</div>
				<div className="mailbox-content-body">
					<PerfectScrollbar className="h-100" options={{suppressScrollX: true}}>
						<div className="p-3">
							<h3 className="mb-3">Bootstrap v5.0 is coming soon</h3>
							<div className="d-flex mb-3">
								<Link to="/email/detail">
									<img className="rounded-pill" width="48" alt="" src="/assets/img/user/user-12.jpg" />
								</Link>
								<div className="ps-3">
									<div className="email-from text-dark fs-14px mb-3px fw-bold">
										from support@wrapbootstrap.com
									</div>
									<div className="mb-3px"><i className="fa fa-clock fa-fw"></i> Today, 8:30 AM</div>
									<div className="email-to">
										To: nguoksiong@live.co.uk
									</div>
								</div>
							</div>
							<hr className="bg-gray-500" />
							<ul className="attached-document clearfix">
								<li className="fa-file">
									<div className="document-file">
										<Link to="/email/detail">
											<i className="fa fa-file-pdf"></i>
										</Link>
									</div>
									<div className="document-name"><Link to="/email/detail" className="text-decoration-none">flight_ticket.pdf</Link></div>
								</li>
								<li className="fa-camera">
									<div className="document-file">
										<Link to="/email/detail">
											<img src="/assets/img/gallery/gallery-11.jpg" alt="" />
										</Link>
									</div>
									<div className="document-name"><Link to="/email/detail" className="text-decoration-none">front_end_mockup.jpg</Link></div>
								</li>
							</ul>

							<p className="text-dark"> 
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel auctor nisi, vel auctor orci. <br />
								Aenean in pretium odio, ut lacinia tellus. Nam sed sem ac enim porttitor vestibulum vitae at erat.
							</p>
							<p className="text-dark">
								Curabitur auctor non orci a molestie. Nunc non justo quis orci viverra pretium id ut est. <br />
								Nullam vitae dolor id enim consequat fermentum. Ut vel nibh tellus. <br />
								Duis finibus ante et augue fringilla, vitae scelerisque tortor pretium. <br />
								Phasellus quis eros erat. Nam sed justo libero.
							</p>
							<p className="text-dark">
								Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.<br /> 
								Sed tempus dapibus libero ac commodo.
							</p>
							<br />
							<br />
							<p className="text-dark">
								Best Regards,<br />
								Sean.<br /><br />
								Information Technology Department,<br />
								Senior Front End Designer<br />
							</p>
						</div>
					</PerfectScrollbar>
				</div>
				<div className="mailbox-content-footer d-flex align-items-center justify-content-end">
					<div className="btn-group me-2">
						<Link to="/email/inbox" className="btn btn-white btn-sm disabled"><i className="fa fa-fw fa-arrow-up"></i></Link>
						<Link to="/email/inbox" className="btn btn-white btn-sm"><i className="fa fa-fw fa-arrow-down"></i></Link>
					</div>
					<div className="btn-group">
						<Link to="/email/inbox" className="btn btn-white btn-sm"><i className="fa fa-fw fa-times"></i></Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EmailDetail;