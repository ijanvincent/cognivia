import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import PerfectScrollbar from 'react-perfect-scrollbar';

function EmailInbox() {
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
	
	function handleOnChange() {
	
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
							<li><Link to="/email/inbox"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-dark"></i> Admin</Link></li>
							<li><Link to="/email/inbox"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-blue"></i> Designer & Employer</Link></li>
							<li><Link to="/email/inbox"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-success"></i> Staff</Link></li>
							<li><Link to="/email/inbox"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-warning"></i> Sponsorer</Link></li>
							<li><Link to="/email/inbox"><i className="fa fa-fw fa-lg fs-12px me-2 fa-circle text-danger"></i> Client</Link></li>
						</ul>
					</PerfectScrollbar>
				</div>
			</div>
			<div className="mailbox-content">
				<div className="mailbox-content-header">
					<div className="btn-toolbar align-items-center">
						<div className="form-check me-2">
							<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailSelectAll" data-change="email-select-all" />
							<label className="form-check-label" htmlFor="emailSelectAll"></label>
						</div>
						<div className="dropdown me-2">
							<button className="btn btn-white btn-sm" data-bs-toggle="dropdown">
								View All <span className="caret ms-3px"></span>
							</button>
							<div className="dropdown-menu">
								<a href="#/" className="dropdown-item"><i className="fa fa-circle fs-9px fa-fw me-2"></i> All</a>
								<a href="#/" className="dropdown-item"><i className="fa fa-circle fs-9px fa-fw me-2 text-muted"></i> Unread</a>
								<a href="#/" className="dropdown-item"><i className="fa fa-circle fs-9px fa-fw me-2 text-blue"></i> Contacts</a>
								<a href="#/" className="dropdown-item"><i className="fa fa-circle fs-9px fa-fw me-2 text-success"></i> Groups</a>
								<a href="#/" className="dropdown-item"><i className="fa fa-circle fs-9px fa-fw me-2 text-warning"></i> Newsletters</a>
								<a href="#/" className="dropdown-item"><i className="fa fa-circle fs-9px fa-fw me-2 text-danger"></i> Social updates</a>
								<a href="#/" className="dropdown-item"><i className="fa fa-circle fs-9px fa-fw me-2 text-indigo"></i> Everything else</a>
							</div>
						</div>
						<button className="btn btn-sm btn-white me-2"><i className="fa fa-redo"></i></button>
						<div className="w-100 d-sm-none d-block mb-2 hide" data-email-action="divider"></div>
						<div className="btn-group">
							<button className="btn btn-sm btn-white hide" data-email-action="delete"><i className="fa fa-times me-1"></i> <span className="hidden-xs">Delete</span></button>
							<button className="btn btn-sm btn-white hide" data-email-action="archive"><i className="fa fa-folder me-1"></i> <span className="hidden-xs">Archive</span></button>
							<button className="btn btn-sm btn-white hide" data-email-action="archive"><i className="fa fa-trash me-1"></i> <span className="hidden-xs">Junk</span></button>
						</div>
						<div className="btn-group ms-auto">
							<button className="btn btn-white btn-sm">
								<i className="fa fa-chevron-left"></i>
							</button>
							<button className="btn btn-white btn-sm">
								<i className="fa fa-chevron-right"></i>
							</button>
						</div>
					</div>
				</div>
				<div className="mailbox-content-body">
					<PerfectScrollbar className="h-100" options={{suppressScrollX: true}}>
						<ul className="list-group list-group-lg no-radius list-email">
							<li className="list-group-item unread">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox1" />
										<label className="form-check-label" htmlFor="emailCheckbox1"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user bg-blue">
									<span className="text-white">F</span>
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Facebook Blueprint</span>
										<span className="email-title">Newly released courses, holiday marketing tips, how-to video, and more!</span>
										<span className="email-desc">Sed scelerisque dui lacus, quis pellentesque lorem tincidunt rhoncus. Nulla accumsan elit pharetra, lacinia turpis nec, varius erat.</span>
										<span className="email-time">Today</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item unread">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox2" />
										<label className="form-check-label" htmlFor="emailCheckbox2"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user bg-indigo">
									<span className="text-white">C</span>
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Color Admin</span>
										<span className="email-title">Color Admin dashboard v2 is ready for live</span>
										<span className="email-desc">Proin interdum aliquam urna, quis lobortis magna tincidunt ac. Integer sed pulvinar neque...</span>
										<span className="email-time">Today</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item unread">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox3" />
										<label className="form-check-label" htmlFor="emailCheckbox3"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user bg-grey">
									<span className="text-white">W</span>
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">support@wrapbootstrap.com</span>
										<span className="email-title">Bootstrap v5.0 is coming soon</span>
										<span className="email-desc">Praesent id pulvinar orci. Donec ac metus non ligula faucibus venenatis. Suspendisse tortor est, placerat eu dui sed...</span>
										<span className="email-time">Today</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox4" />
										<label className="form-check-label" htmlFor="emailCheckbox4"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user bg-grey">
									<i className="fab fa-github-alt text-white"></i>
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Github</span>
										<span className="email-title">Sidebar animation bugfix</span>
										<span className="email-desc">Nam sit amet lacinia massa, sit amet blandit urna. Duis pharetra ex id ipsum posuere...</span>
										<span className="email-time">2 days ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox5" />
										<label className="form-check-label" htmlFor="emailCheckbox5"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user bg-grey">
									<span className="text-white">W</span>
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Wrapbootstrap</span>
										<span className="email-title">Bootstrap Framework is awesome</span>
										<span className="email-desc">Etiam enim ipsum, malesuada in consectetur interdum, malesuada et lacus. Aenean faucibus turpis lorem...</span>
										<span className="email-time">1 week ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox6" />
										<label className="form-check-label" htmlFor="emailCheckbox6"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user">
									<img src="../assets/img/user/user-12.jpg" alt="" />
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Gerald Huff</span>
										<span className="email-title">Handlebars help you to build semantic template </span>
										<span className="email-desc">Proin consectetur accumsan rhoncus. Nulla porta orci ultricies lectus consequat fringilla. Vestibulum ante ipsum primis in faucibus...</span>
										<span className="email-time">2 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox7" />
										<label className="form-check-label" htmlFor="emailCheckbox7"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user">
									<img src="../assets/img/user/user-1.jpg" alt="" />
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Rick	Hopkins</span>
										<span className="email-title">jQuery 2++ no longer compatibility with the old browser</span>
										<span className="email-desc">Suspendisse ut urna orci. Vivamus ac diam sollicitudin, consequat mauris id, facilisis ipsum. Nam feugiat nisl a justo...</span>
										<span className="email-time">2 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox8" />
										<label className="form-check-label" htmlFor="emailCheckbox8"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user">
									<img src="../assets/img/user/user-13.jpg" alt="" />
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Jan Scott</span>
										<span className="email-title">LESS & SASS, which one is good?</span>
										<span className="email-desc">Nam vulputate cursus imperdiet. Sed sodales urna vitae ipsum iaculis, at fermentum...</span>
										<span className="email-time">2 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox9" />
										<label className="form-check-label" htmlFor="emailCheckbox9"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user">
									<img src="../assets/img/user/user-14.jpg" alt="" />
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Nadine Barnes</span>
										<span className="email-title">Simple Line Icons is available on Color Admin v5.0</span>
										<span className="email-desc">Maecenas auctor dui sit amet tristique congue. Pellentesque lobortis nulla quam. Etiam in vulputate magna...</span>
										<span className="email-time">3 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox10" />
										<label className="form-check-label" htmlFor="emailCheckbox10"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user bg-grey">
									<span className="text-white">E</span>
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Ellen Underwood</span>
										<span className="email-title">Font Awesome 5 is available now</span>
										<span className="email-desc">Proin consectetur accumsan rhoncus. Nulla porta orci ultricies lectus consequat fringilla. Vestibulum ante ipsum primis in faucibus...</span>
										<span className="email-time">3 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox11" />
										<label className="form-check-label" htmlFor="emailCheckbox11"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user bg-grey">
									<span className="text-white">W</span>
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">newsletter@wrapbootstrap.com</span>
										<span className="email-title">Cyber week sale! Save up to 45%</span>
										<span className="email-desc">Praesent id pulvinar orci. Donec ac metus non ligula faucibus venenatis. Suspendisse tortor est, placerat eu dui sed...</span>
										<span className="email-time">3 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox12" />
										<label className="form-check-label" htmlFor="emailCheckbox12"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user bg-grey">
									<span className="text-white">S</span>
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Starbucks</span>
										<span className="email-title">Get your favorite Grande handcrafted beverage at $13</span>
										<span className="email-desc">Nam vulputate cursus imperdiet. Sed sodales urna vitae ipsum iaculis, at fermentum...</span>
										<span className="email-time">3 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox13" />
										<label className="form-check-label" htmlFor="emailCheckbox13"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user bg-grey">
									<i className="fab fa-github-alt text-white"></i>
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Github</span>
										<span className="email-title">Sidebar animation bugfix</span>
										<span className="email-desc">Nam sit amet lacinia massa, sit amet blandit urna. Duis pharetra ex id ipsum posuere...</span>
										<span className="email-time">3 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox14" />
										<label className="form-check-label" htmlFor="emailCheckbox14"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user bg-grey">
									<span className="text-white">W</span>
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Wrapbootstrap</span>
										<span className="email-title">Bootstrap Framework is awesome</span>
										<span className="email-desc">Etiam enim ipsum, malesuada in consectetur interdum, malesuada et lacus. Aenean faucibus turpis lorem...</span>
										<span className="email-time">3 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox15" />
										<label className="form-check-label" htmlFor="emailCheckbox15"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user">
									<img src="../assets/img/user/user-2.jpg" alt="" />
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Gerald Huff</span>
										<span className="email-title">Handlebars help you to build semantic template </span>
										<span className="email-desc">Proin consectetur accumsan rhoncus. Nulla porta orci ultricies lectus consequat fringilla. Vestibulum ante ipsum primis in faucibus...</span>
										<span className="email-time">3 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox16" />
										<label className="form-check-label" htmlFor="emailCheckbox16"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user">
									<img src="../assets/img/user/user-3.jpg" alt="" />
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Rick	Hopkins</span>
										<span className="email-title">jQuery 2++ no longer compatibility with the old browser</span>
										<span className="email-desc">Suspendisse ut urna orci. Vivamus ac diam sollicitudin, consequat mauris id, facilisis ipsum. Nam feugiat nisl a justo...</span>
										<span className="email-time">3 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox17" />
										<label className="form-check-label" htmlFor="emailCheckbox17"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user">
									<img src="../assets/img/user/user-4.jpg" alt="" />
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Jan Scott</span>
										<span className="email-title">LESS & SASS, which one is good?</span>
										<span className="email-desc">Nam vulputate cursus imperdiet. Sed sodales urna vitae ipsum iaculis, at fermentum...</span>
										<span className="email-time">3 months ago</span>
									</Link>
								</div>
							</li>
							<li className="list-group-item">
								<div className="email-checkbox">
									<div className="form-check">
										<input onChange={handleOnChange} type="checkbox" className="form-check-input" data-checked="email-checkbox" id="emailCheckbox18" />
										<label className="form-check-label" htmlFor="emailCheckbox18"></label>
									</div>
								</div>
								<Link to="/email/detail" className="email-user">
									<img src="../assets/img/user/user-5.jpg" alt="" />
								</Link>
								<div className="email-info">
									<Link to="/email/detail">
										<span className="email-sender">Nadine Barnes</span>
										<span className="email-title">Simple Line Icons is available on Color Admin v5.0</span>
										<span className="email-desc">Maecenas auctor dui sit amet tristique congue. Pellentesque lobortis nulla quam. Etiam in vulputate magna...</span>
										<span className="email-time">3 months ago</span>
									</Link>
								</div>
							</li>
						</ul>
					</PerfectScrollbar>
				</div>
				<div className="mailbox-content-footer d-flex align-items-center">
					<div className="text-dark fw-bold">1,232 messages</div>
					<div className="btn-group ms-auto">
						<button className="btn btn-white btn-sm">
							<i className="fa fa-fw fa-chevron-left"></i>
						</button>
						<button className="btn btn-white btn-sm">
							<i className="fa fa-fw fa-chevron-right"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EmailInbox;