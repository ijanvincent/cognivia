import React from 'react';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AppSettings } from './../../config/app-settings.js';

function SidebarRight() {
	return (
		<AppSettings.Consumer>
			{({appSidebarTwo, toggleAppSidebarEndMobile}) => (
				<React.Fragment>
					{appSidebarTwo && (
						<React.Fragment>
							<div id="sidebar-right" className="app-sidebar app-sidebar-end" data-bs-theme="dark">
								<PerfectScrollbar className="app-sidebar-content h-100" options={{suppressScrollX: true}}>
									<div className="p-20px text-white">
										<p className="fw-bold mb-2">Accordion</p>
										<div className="accordion" id="accordionSidebar">
											<div className="accordion-item bg-gray-700 text-white border-0 rounded-0">
												<h2 className="accordion-header bg-gray-900 rounded-0 d-flex align-items-center" id="heading1">
													<button className="accordion-button bg-gray-900 rounded-0 text-white pointer-cursor d-flex align-items-center py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
														Accordion #1
													</button>
												</h2>
												<div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#accordionSidebar">
													<div className="accordion-body py-2 p-3">
														Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
													</div>
												</div>
											</div>
											<div className="accordion-item bg-gray-700 text-white border-0 rounded-0">
												<h2 className="accordion-header bg-gray-900 rounded-0 d-flex align-items-center" id="heading2">
													<button className="accordion-button bg-gray-900 rounded-0 text-white pointer-cursor d-flex align-items-center py-2 px-3 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
														Accordion #2
													</button>
												</h2>
												<div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
													<div className="accordion-body py-2 p-3">
														Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
													</div>
												</div>
											</div>
											<div className="accordion-item bg-gray-700 text-white border-0 rounded-0">
												<h2 className="accordion-header bg-gray-900 rounded-0 d-flex align-items-center" id="heading3">
													<button className="accordion-button bg-gray-900 rounded-0 text-white pointer-cursor d-flex align-items-center py-2 px-3 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
														Accordion #3
													</button>
												</h2>
												<div id="collapse3" className="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
													<div className="accordion-body py-2 p-3">
														Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
													</div>
												</div>
											</div>
											<div className="accordion-item bg-gray-700 text-white border-0 rounded-0">
												<h2 className="accordion-header bg-gray-900 rounded-0 d-flex align-items-center" id="heading4">
													<button className="accordion-button bg-gray-900 rounded-0 text-white pointer-cursor d-flex align-items-center py-2 px-3 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4">
														Accordion #4
													</button>
												</h2>
												<div id="collapse4" className="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
													<div className="accordion-body py-2 p-3">
														Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
													</div>
												</div>
											</div>
											<div className="accordion-item bg-gray-700 text-white border-0 rounded-0">
												<h2 className="accordion-header bg-gray-900 rounded-0 d-flex align-items-center" id="heading5">
													<button className="accordion-button bg-gray-900 rounded-0 text-white pointer-cursor d-flex align-items-center py-2 px-3 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5">
														Accordion #5
													</button>
												</h2>
												<div id="collapse5" className="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
													<div className="accordion-body py-2 p-3">
														Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
													</div>
												</div>
											</div>
											<div className="accordion-item bg-gray-700 text-white border-0 rounded-0">
												<h2 className="accordion-header bg-gray-900 rounded-0 d-flex align-items-center" id="heading6">
													<button className="accordion-button bg-gray-900 rounded-0 text-white pointer-cursor d-flex align-items-center py-2 px-3 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6">
														Accordion #6
													</button>
												</h2>
												<div id="collapse6" className="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
													<div className="accordion-body py-2 p-3">
														Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
													</div>
												</div>
											</div>
											<div className="accordion-item bg-gray-700 text-white border-0 rounded-0">
												<h2 className="accordion-header bg-gray-900 rounded-0 d-flex align-items-center" id="heading7">
													<button className="accordion-button bg-gray-900 rounded-0 text-white pointer-cursor d-flex align-items-center py-2 px-3 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse7">
														Accordion #7
													</button>
												</h2>
												<div id="collapse7" className="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
													<div className="accordion-body py-2 p-3">
														Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
													</div>
												</div>
											</div>
											<div className="accordion-item bg-gray-700 text-white border-0 rounded-0">
												<h2 className="accordion-header bg-gray-900 rounded-0 d-flex align-items-center" id="heading8">
													<button className="accordion-button bg-gray-900 rounded-0 text-white pointer-cursor d-flex align-items-center py-2 px-3 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse8">
														Accordion #8
													</button>
												</h2>
												<div id="collapse8" className="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
													<div className="accordion-body py-2 p-3">
														Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
													</div>
												</div>
											</div>
										</div>
									</div>
								</PerfectScrollbar>
							</div>
							<div className="app-sidebar-bg app-sidebar-end" data-bs-theme="dark"></div>
							<div className="app-sidebar-mobile-backdrop app-sidebar-end">
								<Link to="/" onClick={toggleAppSidebarEndMobile} className="stretched-link"></Link>
							</div>
						</React.Fragment>
					)}
				</React.Fragment>
			)}
		</AppSettings.Consumer>
	)
}


export default SidebarRight;
