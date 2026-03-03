import React from 'react';
import 'lity';
import 'lity/dist/lity.min.css';

function ExtraTimeline() {
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><a href="#/">Home</a></li>
				<li className="breadcrumb-item"><a href="#/">Extra</a></li>
				<li className="breadcrumb-item active">Timeline</li>
			</ol>
			<h1 className="page-header">Timeline <small>header small text goes here...</small></h1>
			<div className="timeline">
				<div className="timeline-item">
					<div className="timeline-time">
						<span className="date">today</span>
						<span className="time">04:20</span>
					</div>
					<div className="timeline-icon">
						<a href="#/">&nbsp;</a>
					</div>
					<div className="timeline-content">
						<div className="timeline-header">
							<div className="userimage"><img src="/assets/img/user/user-1.jpg" alt="" /></div>
							<div className="username">
								<a href="#/">John Smith <i className="fa fa-check-circle text-blue ms-1"></i></a>
								<div className="text-muted fs-12px">8 mins <i className="fa fa-globe-americas opacity-5 ms-1"></i></div>
							</div>
							<div>
								<a href="#/" className="btn btn-lg border-0 rounded-pill w-40px h-40px p-0 d-flex align-items-center justify-content-center" data-bs-toggle="dropdown">
									<i className="fa fa-ellipsis-h text-gray-600"></i>
								</a>
								<div className="dropdown-menu dropdown-menu-end">
									<a href="#/" className="dropdown-item d-flex align-items-center">
										<i className="fa fa-fw fa-bookmark fa-lg"></i> 
										<div className="flex-1 ps-1">
											<div>Save Post</div>
											<div className="mt-n1 text-gray-500"><small>Add this to your saved items</small></div>
										</div>
									</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-edit fa-lg me-1"></i> Edit post</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-user fa-lg me-1"></i> Edit audience</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-bell fa-lg me-1"></i> Turn off notifications for this post</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-language fa-lg me-1"></i> Turn off translations</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-calendar-alt fa-lg me-1"></i> Turn date</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-archive fa-lg me-1"></i> Move to archive</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-trash-alt fa-lg me-1"></i> Move to Recycle bin</a>
								</div>
							</div>
						</div>
						<div className="timeline-body">
							<div className="mb-3">
								<div className="mb-2">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus turpis quis tincidunt luctus.
									Nam sagittis dui in nunc consequat, in imperdiet nunc sagittis.
								</div>
								<div className="row gx-1">
									<div className="col-6">
										<div className="ratio ratio-4x3">
											<a href="/assets/img/gallery/gallery-14.jpg" data-lity className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-14.jpg)'}}> </a>
										</div>
									</div>
									<div className="col-3">
										<div className="ratio ratio-4x3 mb-3px">
											<a href="/assets/img/gallery/gallery-12.jpg" data-lity className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-12.jpg)'}}> </a>
										</div>
										<div className="ratio ratio-4x3">
											<a href="/assets/img/gallery/gallery-16.jpg" data-lity className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-16.jpg)'}}> </a>
										</div>
									</div>
									<div className="col-3">
										<div className="ratio ratio-4x3 mb-3px">
											<a href="/assets/img/gallery/gallery-15.jpg" data-lity className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-15.jpg)'}}> </a>
										</div>
										<div className="ratio ratio-4x3">
											<a href="/assets/img/gallery/gallery-11.jpg" data-lity className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-11.jpg)'}}> </a>
										</div>
									</div>
								</div>
							</div>
			
							<div className="d-flex align-items-center text-dark mb-2">
								<div className="d-flex align-items-center">
									<span className="fa-stack fs-10px">
										<i className="fa fa-circle fa-stack-2x text-danger"></i>
										<i className="fa fa-heart fa-stack-1x fa-inverse fs-11px"></i>
									</span>
									<span className="fa-stack fs-10px">
										<i className="fa fa-circle fa-stack-2x text-blue"></i>
										<i className="fa fa-thumbs-up fa-stack-1x fa-inverse fs-11px bottom-0 mb-1px"></i>
									</span>
									<span className="ms-1">4.3k</span>
								</div>
								<div className="d-flex align-items-center ms-auto">
									<div>259 Shares</div>
									<div className="ms-3">21 Comments</div>
								</div>
							</div>
			
							<hr className="my-10px" />
							<div className="d-flex align-items-center fw-bold">
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-thumbs-up fa-fw me-3px"></i> Like
								</a>
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-comments fa-fw me-3px"></i> Comment
								</a> 
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-share fa-fw me-3px"></i> Share
								</a>
							</div>
							<hr className="mt-10px mb-3" />
			
							<form action="" className="d-flex align-items-center">
								<div><img src="/assets/img/user/user-13.jpg" alt="" height="35" className="rounded-pill" /></div>
								<div className="ps-2 flex-1">
									<div className="position-relative">
										<input type="text" className="form-control rounded-pill ps-3 py-2 fs-13px bg-light" placeholder="Write a comment..." />
										<div className="position-absolute end-0 top-0 bottom-0 d-flex align-items-center px-2">
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="far fa-smile fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="fa fa-camera fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="fa fa-film fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="far fa-sticky-note fa-fw fa-lg d-block"></i></a>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="timeline-item">
					<div className="timeline-time">
						<span className="date">yesterday</span>
						<span className="time">20:17</span>
					</div>
					<div className="timeline-icon">
						<a href="#/">&nbsp;</a>
					</div>
					<div className="timeline-content">
						<div className="timeline-header">
							<div className="userimage"><img src="/assets/img/user/user-2.jpg" alt="" /></div>
							<div className="username">
								<a href="#/">Darren Parrase</a>
								<div className="text-muted fs-12px">24 mins <i className="fa fa-globe-americas opacity-5 ms-1"></i></div>
							</div>
							<div>
								<a href="#/" className="btn btn-lg border-0 rounded-pill w-40px h-40px p-0 d-flex align-items-center justify-content-center" data-bs-toggle="dropdown">
									<i className="fa fa-ellipsis-h text-gray-600"></i>
								</a>
								<div className="dropdown-menu dropdown-menu-end">
									<a href="#/" className="dropdown-item d-flex align-items-center">
										<i className="fa fa-fw fa-bookmark fa-lg"></i> 
										<div className="flex-1 ps-1">
											<div>Save Post</div>
											<div className="mt-n1 text-gray-500"><small>Add this to your saved items</small></div>
										</div>
									</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-edit fa-lg me-1"></i> Edit post</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-user fa-lg me-1"></i> Edit audience</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-bell fa-lg me-1"></i> Turn off notifications for this post</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-language fa-lg me-1"></i> Turn off translations</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-calendar-alt fa-lg me-1"></i> Turn date</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-archive fa-lg me-1"></i> Move to archive</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-trash-alt fa-lg me-1"></i> Move to Recycle bin</a>
								</div>
							</div>
						</div>
						<div className="timeline-body">
							<div className="mb-3">
								<div className="mb-2">Location: United States</div>
								<div className="ratio ratio-21x9">
									<iframe title="location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.5242683789525!2d-84.36843278503017!3d33.772957280682846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f50410c04ff6d9%3A0x2710fc547d72ec83!2sTwitter%20Headquarters!5e0!3m2!1sen!2smy!4v1623766084359!5m2!1sen!2smy" width="600" height="450" style={{border:0}} allowFullScreen loading="lazy"></iframe>
								</div>
							</div>
			
							<div className="d-flex align-items-center text-dark mb-2">
								<div className="d-flex align-items-center">
									<span className="fa-stack fs-10px">
										<i className="fa fa-circle fa-stack-2x text-danger"></i>
										<i className="fa fa-heart fa-stack-1x fa-inverse fs-11px"></i>
									</span>
									<span className="fa-stack fs-10px">
										<i className="fa fa-circle fa-stack-2x text-blue"></i>
										<i className="fa fa-thumbs-up fa-stack-1x fa-inverse fs-11px bottom-0 mb-1px"></i>
									</span>
									<span className="ms-1">269</span>
								</div>
								<div className="d-flex align-items-center ms-auto">
									<div>2 Shares</div>
									<div className="ms-3">9 Comments</div>
								</div>
							</div>
			
							<hr className="my-10px" />
							<div className="d-flex align-items-center fw-bold">
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-thumbs-up fa-fw me-3px"></i> Like
								</a>
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-comments fa-fw me-3px"></i> Comment</a> 
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-share fa-fw me-3px"></i> Share
								</a>
							</div>
							<hr className="mt-10px mb-3" />
			
							<form action="" className="d-flex align-items-center">
								<div><img src="/assets/img/user/user-13.jpg" alt="" height="35" className="rounded-pill" /></div>
								<div className="ps-2 flex-1">
									<div className="position-relative">
										<input type="text" className="form-control rounded-pill ps-3 py-2 fs-13px bg-light" placeholder="Write a comment..." />
										<div className="position-absolute end-0 top-0 bottom-0 d-flex align-items-center px-2">
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="far fa-smile fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="fa fa-camera fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="fa fa-film fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="far fa-sticky-note fa-fw fa-lg d-block"></i></a>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="timeline-item">
					<div className="timeline-time">
						<span className="date">24 February 2024</span>
						<span className="time">08:17</span>
					</div>
					<div className="timeline-icon">
						<a href="#/">&nbsp;</a>
					</div>
					<div className="timeline-content">
						<div className="timeline-header">
							<div className="userimage"><img src="/assets/img/user/user-3.jpg" alt="" /></div>
							<div className="username">
								<a href="#/">Richard Leong <i className="fa fa-check-circle text-blue ms-1"></i></a>
								<div className="text-muted fs-12px">12 hours <i className="fa fa-globe-americas opacity-5 ms-1"></i></div>
							</div>
							<div>
								<a href="#/" className="btn btn-lg border-0 rounded-pill w-40px h-40px p-0 d-flex align-items-center justify-content-center" data-bs-toggle="dropdown">
									<i className="fa fa-ellipsis-h text-gray-600"></i>
								</a>
								<div className="dropdown-menu dropdown-menu-end">
									<a href="#/" className="dropdown-item d-flex align-items-center">
										<i className="fa fa-fw fa-bookmark fa-lg"></i> 
										<div className="flex-1 ps-1">
											<div>Save Post</div>
											<div className="mt-n1 text-gray-500"><small>Add this to your saved items</small></div>
										</div>
									</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-edit fa-lg me-1"></i> Edit post</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-user fa-lg me-1"></i> Edit audience</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-bell fa-lg me-1"></i> Turn off notifications for this post</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-language fa-lg me-1"></i> Turn off translations</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-calendar-alt fa-lg me-1"></i> Turn date</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-archive fa-lg me-1"></i> Move to archive</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-trash-alt fa-lg me-1"></i> Move to Recycle bin</a>
								</div>
							</div>
						</div>
						<div className="timeline-body">
							<div className="lead mb-3">
								<i className="fa fa-quote-left fa-fw float-start opacity-5 me-3 mb-3 mt-3 fa-lg"></i>
								Quisque sed varius nisl. Nulla facilisi. Phasellus consequat sapien sit amet nibh molestie placerat. Donec nulla quam, ullamcorper ut velit vitae, lobortis condimentum magna. Suspendisse mollis in sem vel mollis.
								<i className="fa fa-quote-right fa-fw float-end opacity-5 ms-3 mt-n3 fa-lg"></i>
							</div>
			
							<div className="d-flex align-items-center text-dark mb-2">
								<div className="d-flex align-items-center">
									<span className="fa-stack fs-10px">
										<i className="fa fa-circle fa-stack-2x text-danger"></i>
										<i className="fa fa-heart fa-stack-1x fa-inverse fs-11px"></i>
									</span>
									<span className="fa-stack fs-10px">
										<i className="fa fa-circle fa-stack-2x text-blue"></i>
										<i className="fa fa-thumbs-up fa-stack-1x fa-inverse fs-11px bottom-0 mb-1px"></i>
									</span>
									<span className="ms-1">550</span>
								</div>
								<div className="d-flex align-items-center ms-auto">
									<div>121 Shares</div>
									<div className="ms-3">40 Comments</div>
								</div>
							</div>
			
							<hr className="my-10px" />
							<div className="d-flex align-items-center fw-bold">
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-thumbs-up fa-fw me-3px"></i> Like
								</a>
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-comments fa-fw me-3px"></i> Comment
								</a> 
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-share fa-fw me-3px"></i> Share
								</a>
							</div>
							<hr className="mt-10px mb-3" />
			
							<form action="" className="d-flex align-items-center">
								<div><img src="/assets/img/user/user-13.jpg" alt="" height="35" className="rounded-pill" /></div>
								<div className="ps-2 flex-1">
									<div className="position-relative">
										<input type="text" className="form-control rounded-pill ps-3 py-2 fs-13px bg-light" placeholder="Write a comment..." />
										<div className="position-absolute end-0 top-0 bottom-0 d-flex align-items-center px-2">
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="far fa-smile fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="fa fa-camera fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="fa fa-film fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="far fa-sticky-note fa-fw fa-lg d-block"></i></a>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="timeline-item">
					<div className="timeline-time">
						<span className="date">10 January 2024</span>
						<span className="time">20:43</span>
					</div>
					<div className="timeline-icon">
						<a href="#/">&nbsp;</a>
					</div>
					<div className="timeline-content">
						<div className="timeline-header">
							<div className="userimage"><img src="/assets/img/user/user-4.jpg" alt="" /></div>
							<div className="username">
								<a href="#/">Lelouch Wong <i className="fa fa-check-circle text-blue ms-1"></i></a>
								<div className="text-muted fs-12px">1 days ago <i className="fa fa-globe-americas opacity-5 ms-1"></i></div>
							</div>
							<div>
								<a href="#/" className="btn btn-lg border-0 rounded-pill w-40px h-40px p-0 d-flex align-items-center justify-content-center" data-bs-toggle="dropdown">
									<i className="fa fa-ellipsis-h text-gray-600"></i>
								</a>
								<div className="dropdown-menu dropdown-menu-end">
									<a href="#/" className="dropdown-item d-flex align-items-center">
										<i className="fa fa-fw fa-bookmark fa-lg"></i> 
										<div className="flex-1 ps-1">
											<div>Save Post</div>
											<div className="mt-n1 text-gray-500"><small>Add this to your saved items</small></div>
										</div>
									</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-edit fa-lg me-1"></i> Edit post</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-user fa-lg me-1"></i> Edit audience</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-bell fa-lg me-1"></i> Turn off notifications for this post</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-language fa-lg me-1"></i> Turn off translations</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-calendar-alt fa-lg me-1"></i> Turn date</a>
									<div className="dropdown-divider"></div>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-archive fa-lg me-1"></i> Move to archive</a>
									<a href="#/" className="dropdown-item"><i className="fa fa-fw fa-trash-alt fa-lg me-1"></i> Move to Recycle bin</a>
								</div>
							</div>
						</div>
						<div className="timeline-body">
							<div className="mb-3">
								<h4 className="mb-1">
									795 Folsom Ave, Suite 600 San Francisco, CA 94107
								</h4>
								<div className="mb-2">In hac habitasse platea dictumst. Pellentesque bibendum id sem nec faucibus. Maecenas molestie, augue vel accumsan rutrum, massa mi rutrum odio, id luctus mauris nibh ut leo.</div>
								<div className="row gx-1">
									<div className="col-6">
										<a href="/assets/img/gallery/gallery-4.jpg" data-lity><img src="/assets/img/gallery/gallery-4.jpg" alt="" className="mw-100 d-block" /></a>
									</div>
									<div className="col-6">
										<a href="/assets/img/gallery/gallery-5.jpg" data-lity><img src="/assets/img/gallery/gallery-5.jpg" alt="" className="mw-100 d-block" /></a>
									</div>
								</div>
							</div>
			
							<hr className="my-10px" />
							<div className="d-flex align-items-center fw-bold">
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-thumbs-up fa-fw me-3px"></i> Like
								</a>
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-comments fa-fw me-3px"></i> Comment</a> 
								<a href="#/" className="flex-fill text-decoration-none text-center text-gray-600">
									<i className="fa fa-share fa-fw me-3px"></i> Share
								</a>
							</div>
							<hr className="mt-10px mb-3" />
			
							<form action="" className="d-flex align-items-center">
								<div><img src="/assets/img/user/user-13.jpg" alt="" height="35" className="rounded-pill" /></div>
								<div className="ps-2 flex-1">
									<div className="position-relative">
										<input type="text" className="form-control rounded-pill ps-3 py-2 fs-13px bg-light" placeholder="Write a comment..." />
										<div className="position-absolute end-0 top-0 bottom-0 d-flex align-items-center px-2">
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="far fa-smile fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="fa fa-camera fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="fa fa-film fa-fw fa-lg d-block"></i></a>
											<a href="#/" className="btn bg-none text-gray-600 shadow-none px-1"><i className="far fa-sticky-note fa-fw fa-lg d-block"></i></a>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="timeline-item">
					<div className="timeline-icon">
						<a href="#/">&nbsp;</a>
					</div>
					<div className="timeline-content">
						<div className="timeline-body">
							<div className="d-flex align-items-center">
								<div className="spinner-border spinner-border-sm me-3" role="status">
									<span className="visually-hidden">Loading...</span>
								</div>
								Loading...
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ExtraTimeline;