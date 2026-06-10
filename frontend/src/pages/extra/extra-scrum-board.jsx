import React from 'react';
import { Panel, PanelHeader } from './../../components/panel/panel.jsx';

function ExtraScrumBoard() {
	return (
		<div style={{minHeight: '100vh', backgroundImage: 'url(../assets/img/cover/cover-scrum-board.png)', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', backgroundSize: '360px', backgroundPosition: 'right bottom'}}>
			<div className="d-flex align-items-center mb-3">
				<div>
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><a href="#/">Home</a></li>
						<li className="breadcrumb-item"><a href="#/">Extra</a></li>
						<li className="breadcrumb-item active">Scrum Board </li>
					</ol>
					<h1 className="page-header mb-0">
						Scrum Board 
					</h1>
				</div>
			
				<div className="ms-auto">
					<a href="#modalAddTask" data-bs-toggle="modal" className="btn btn-success btn-rounded px-4 rounded-pill"><i className="fa fa-plus fa-lg me-2 ms-n2 text-success-900"></i> Add Task</a>
				</div>
			</div>
		
			<div className="mb-3 d-md-flex fw-bold">
				<div className="dropdown-toggle">
					<a href="#/" data-bs-toggle="dropdown" className="text-decoration-none text-dark"><i className="far fa-folder fa-fw text-dark text-opacity-50 me-1"></i> project/color-admin <b className="caret"></b></a>
					<div className="dropdown-menu dropdown-menu-start">
						<a href="#/" className="dropdown-item"><i className="far fa-folder fa-fw fa-lg text-gray-500 me-1"></i> project/mobile-app-dev</a>
						<a href="#/" className="dropdown-item"><i className="far fa-folder fa-fw fa-lg text-gray-500 me-1"></i> project/bootstrap-5</a>
						<a href="#/" className="dropdown-item"><i className="far fa-folder fa-fw fa-lg text-gray-500 me-1"></i> project/mvc-version</a>
						<a href="#/" className="dropdown-item"><i className="far fa-folder fa-fw fa-lg text-gray-500 me-1"></i> project/ruby-version</a>
					</div>
				</div>
				<div className="ms-md-4 mt-md-0 mt-2"><i className="fa fa-code-branch fa-fw me-1 text-dark text-opacity-50"></i> 1,392 pull request</div>
				<div className="ms-md-4 mt-md-0 mt-2"><i className="fa fa-users-cog fa-fw me-1 text-dark text-opacity-50"></i> 52 participant</div>
				<div className="ms-md-4 mt-md-0 mt-2"><i className="far fa-clock fa-fw me-1 text-dark text-opacity-50"></i> 14 day(s)</div>
			</div>
		
			<div className="row">
				<div className="col-xl-4 col-lg-6">
					<Panel>
						<PanelHeader>To do (5)</PanelHeader>
						<div className="list-group list-group-flush rounded-bottom overflow-hidden panel-body p-0">
							<div className="list-group-item d-flex border-top-0">
								<div className="me-3 fs-16px">
									<i className="far fa-question-circle text-gray-500 fa-fw"></i> 
								</div>
								<div className="flex-fill">
									<div className="fs-14px lh-12 mb-2px fw-bold text-dark">Enable open search</div>
									<div className="mb-1 fs-12px">
										<div className="text-gray-600 flex-1">#29949 opened yesterday by Terry</div>
									</div>
									<div className="mb-1">
										<span className="badge bg-blue me-1">docs</span>
										<span className="badge bg-success">feature</span>
									</div>
									<hr className="mb-10px bg-gray-600" />
									<div className="d-flex align-items-center mb-5px">
										<div className="fs-12px me-2 text-dark fw-bold">
											Task (2/3)
										</div>
										<div className="progress h-5px w-100px mb-0 me-2">
											<div className="progress-bar progress-bar-striped" style={{width: '66%'}}></div>
										</div>
										<div className="fs-10px fw-bold">66%</div>
										<div className="ms-auto">
											<a href="#/" className="btn btn-outline-default text-gray-600 btn-xs rounded-pill fs-10px px-2" data-bs-toggle="collapse" data-bs-target="#todoBoard">
												collapse
											</a>
										</div>
									</div>
									<div className="form-group mb-1">
										<div className="collapse show" id="todoBoard">
											<div className="form-check mb-1">
												<input type="checkbox" className="form-check-input" id="customCheck1" defaultChecked />
												<label className="form-check-label" htmlFor="customCheck1">create ui for autocomplete</label>
											</div>
											<div className="form-check mb-1">
												<input type="checkbox" className="form-check-input" id="customCheck2" defaultChecked />
												<label className="form-check-label" htmlFor="customCheck2">integrate jquery autocomplete with ui</label>
											</div>
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="customCheck3" />
												<label className="form-check-label" htmlFor="customCheck3">backend search return as json data</label>
											</div>
										</div>
									</div>
								</div>
							</div>
							<a href="#/" className="list-group-item d-flex">
								<div className="me-3 fs-16px">
									<i className="far fa-question-circle text-gray-500 fa-fw"></i> 
								</div>
								<div className="flex-fill">
									<div className="fs-14px lh-12 mb-2px fw-bold text-dark">Investigate adding markdownlint</div>
									<div className="mb-1 fs-12px">
										<div className="text-gray-600 flex-1">#29919 opened 9 days ago by xMediaKron</div>
									</div>
									<div className="mb-1">
										<span className="badge bg-gray-300 me-1 text-gray-900">build</span>
										<span className="badge bg-indigo">v5</span>
									</div>
								</div>
							</a>
							<a href="#/" className="list-group-item d-flex">
								<div className="me-3 fs-16px">
									<i className="far fa-question-circle text-gray-500 fa-fw"></i> 
								</div>
								<div className="flex-fill">
									<div className="fs-14px lh-12 mb-2px fw-bold text-dark">Add a "Submit a Resource" form</div>
									<div className="mb-1 fs-12px">
										<div className="text-gray-600 flex-1">#29916 opened 9 days ago by Wasbbok</div>
									</div>
									<div className="mb-1 d-flex align-items-center">
										<div className="me-2"><span className="badge bg-success">enhancement</span></div>
										<div className="d-flex">
											<div className="widget-img widget-img-xs rounded-circle bg-dark me-n2" style={{backgroundImage: 'url(../assets/img/user/user-1.jpg)'}}>
											</div>
											<div className="widget-img widget-img-xs rounded-circle bg-dark me-n2" style={{backgroundImage: 'url(../assets/img/user/user-2.jpg)'}}>
											</div>
											<div className="widget-img widget-img-xs rounded-circle bg-dark me-n2" style={{backgroundImage: 'url(../assets/img/user/user-3.jpg)'}}>
											</div>
											<div className="widget-icon widget-icon-xs rounded-circle bg-muted text-white fs-10px">
												+2
											</div>
										</div>
									</div>
								</div>
							</a>
							<a href="#/" className="list-group-item d-flex">
								<div className="me-3 fs-16px">
									<i className="far fa-question-circle text-gray-500 fa-fw"></i> 
								</div>
								<div className="flex-fill">
									<div className="fs-14px lh-12 mb-2px fw-bold text-dark">Custom control border color missing on focus</div>
									<div className="mb-1 fs-12px">
										<div className="text-gray-600 flex-1">#29796 opened 29 days ago by mdo</div>
									</div>
									<div className="mb-1">
										<span className="badge bg-pink">docs</span>
									</div>
								</div>
							</a>
							<a href="#/" className="list-group-item d-flex">
								<div className="me-3 fs-16px">
									<i className="far fa-question-circle text-gray-500 fa-fw"></i> 
								</div>
								<div className="flex-fill">
									<div className="fs-14px lh-12 mb-2px fw-bold text-dark">New design for corporate page</div>
									<div className="mb-1 fs-12px">
										<div className="text-gray-600 flex-1">#29919 opened 19 days ago by sean</div>
									</div>
									<div className="mb-1">
										<span className="badge bg-gray-300 me-1 text-gray-900">design</span>
										<span className="badge bg-primary">v5</span>
									</div>
								</div>
							</a>
						</div>
					</Panel>
				</div>
				<div className="col-xl-4 col-lg-6">
					<Panel>
						<PanelHeader>In Progress (2)</PanelHeader>
						<div className="list-group list-group-flush rounded-bottom overflow-hidden panel-body p-0">
							<div className="list-group-item d-flex border-top-0">
								<div className="me-3 fs-16px">
									<i className="fa fa-tools text-gray-500 fa-fw"></i> 
								</div>
								<div className="flex-fill">
									<div className="fs-14px lh-12 mb-2px fw-bold text-dark">HTML5 flexbox old browser compatibility</div>
									<div className="mb-1 fs-12px">
										<div className="text-gray-600 flex-1">#29982 handled by Sean</div>
									</div>
									<div className="mb-1">
										<span className="badge bg-indigo">enhancement</span>
									</div>
									<hr className="mb-10px bg-gray-600" />
									<div className="d-flex align-items-center mb-5px">
										<div className="fs-12px d-flex align-items-center text-dark fw-bold">
											Task (1/2)
										</div>
										<div className="progress progress-xs w-100px mb-0 mx-2 h-5px">
											<div className="progress-bar progress-bar-striped bg-warning" style={{width: '50%'}}></div>
										</div>
										<div className="fs-10px">50%</div>
										<div className="ms-auto">
											<a href="#/" className="btn btn-outline-default text-gray-600 btn-xs rounded-pill fs-10px px-2" data-bs-toggle="collapse" data-bs-target="#inProgressBoard">
												collapse
											</a>
										</div>
									</div>
									<div className="form-group mb-1">
										<div className="collapse show" id="inProgressBoard">
											<div className="form-check mb-1">
												<input type="checkbox" className="form-check-input" id="customCheck4" defaultChecked />
												<label className="form-check-label" htmlFor="customCheck4">check all browser compatibility for HTML5 flexbox</label>
											</div>
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="customCheck5" />
												<label className="form-check-label" htmlFor="customCheck5">fallback integration by using other display property</label>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="list-group-item d-flex">
								<div className="me-3 fs-16px">
									<i className="fa fa-bug text-danger fa-fw"></i> 
								</div>
								<div className="flex-fill">
									<div className="fs-14px lh-12 mb-2px fw-bold text-dark">Mobile app autoclose on iOS</div>
									<div className="mb-1 fs-12px">
										<div className="text-gray-600 flex-1">#29953 handled by Ken</div>
									</div>
									<div className="mb-1">
										<span className="badge bg-gray-300 me-1 text-gray-900">issue</span>
										<span className="badge bg-danger">bug</span>
									</div>
									<hr className="mb-10px bg-gray-600" />
									<div className="d-flex align-items-center mb-5px">
										<div className="fs-12px d-flex align-items-center text-dark fw-bold">
											Task (0/1)
										</div>
										<div className="progress progress-xs w-100px mb-0 mx-2 h-5px">
											<div className="progress-bar progress-bar-striped bg-danger" style={{width: '5%'}}></div>
										</div>
										<div className="fs-10px fw-bold">0%</div>
										<div className="ms-auto">
											<a href="#/" className="btn btn-outline-default text-gray-600 btn-xs rounded-pill fs-10px px-2" data-bs-toggle="collapse" data-bs-target="#inProgress2Board">
												collapse
											</a>
										</div>
									</div>
									<div className="form-group mb-1">
										<div className="collapse show" id="inProgress2Board">
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="customCheck6" />
												<label className="form-check-label" htmlFor="customCheck6">debug and fix mobile auto close while using GPS issue</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Panel>
				</div>
				<div className="col-xl-4 col-lg-6">
					<Panel>
						<PanelHeader>Done (1)</PanelHeader>
						<div className="list-group list-group-flush rounded-bottom overflow-hidden panel-body p-0">
							<div className="list-group-item  d-flex border-top-0">
								<div className="me-3 fs-16px">
									<i className="far fa-check-circle text-success fa-fw"></i> 
								</div>
								<div className="flex-fill">
									<div className="fs-14px lh-12 mb-2px fw-bold text-dark">React version missing daterangepicker</div>
									<div className="mb-1 fs-12px">
										<div className="text-gray-600 flex-1">#29930 closed yesterday by Sean</div>
									</div>
									<div className="mb-1">
										<span className="badge bg-gray-300 me-1 text-gray-900">build</span>
										<span className="badge bg-success">feature</span>
									</div>
									<hr className="mb-10px bg-gray-600" />
									<div className="d-flex align-items-center mb-5px">
										<div className="fs-12px text-dark fw-bold">
											Task (3/3)
										</div>
										<div className="progress progress-xs w-100px mb-0 mx-2 h-5px">
											<div className="progress-bar progress-bar-striped bg-success" style={{width: '100%'}}></div>
										</div>
										<div className="fs-10px fw-bold">100%</div>
										<div className="ms-auto">
											<a href="#/" className="btn btn-outline-default text-gray-600 btn-xs rounded-pill fs-10px px-2" data-bs-toggle="collapse" data-bs-target="#completedBoard">
												collapse
											</a>
										</div>
									</div>
									<div className="form-group mb-1">
										<div className="collapse show" id="completedBoard">
											<div className="form-check mb-1">
												<input type="checkbox" className="form-check-input" id="customCheck7" defaultChecked />
												<label className="form-check-label" htmlFor="customCheck7">install react-daterangepicker</label>
											</div>
											<div className="form-check mb-1">
												<input type="checkbox" className="form-check-input" id="customCheck8" defaultChecked />
												<label className="form-check-label" htmlFor="customCheck8">customize ui with scss</label>
											</div>
											<div className="form-check">
												<input type="checkbox" className="form-check-input" id="customCheck9" defaultChecked />
												<label className="form-check-label" htmlFor="customCheck9">backend integration for data filter with daterange input</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	)
}

export default ExtraScrumBoard;