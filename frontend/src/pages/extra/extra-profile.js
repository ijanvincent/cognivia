import React, { useEffect, useContext, useRef } from 'react';
import { AppSettings } from './../../config/app-settings.js';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import 'lity';
import 'lity/dist/lity.min.css';

function ExtraProfile() {
  const context = useContext(AppSettings);
  let lightboxRef = useRef(null);

  useEffect(() => {
    context.handleSetAppContentClass('p-0');

    if (!lightboxRef.current) {
      lightboxRef.current = new PhotoSwipeLightbox({
        gallery: '.gallery-v2',
        children: 'a',
        pswpModule: () => import('photoswipe'),
      });
      lightboxRef.current.init();
    }
		
		return () => {
      context.handleSetAppContentClass('');
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
		};
		
		// eslint-disable-next-line
	}, []);

  return (
		<div>
			<div className="profile">
				<div className="profile-header">
					<div className="profile-header-cover"></div>
					<div className="profile-header-content">
						<div className="profile-header-img">
							<img src="/assets/img/user/user-13.jpg" alt="" />
						</div>
						<div className="profile-header-info">
							<h4 className="mt-0 mb-1">Sean Ngu</h4>
							<p className="mb-2">UXUI + Frontend Developer</p>
							<a href="#/" className="btn btn-xs btn-yellow">Edit Profile</a>
						</div>
					</div>
					<ul className="profile-header-tab nav nav-tabs">
						<li className="nav-item"><a href="#profile-post" className="nav-link active" data-bs-toggle="tab">POSTS</a></li>
						<li className="nav-item"><a href="#profile-about" className="nav-link" data-bs-toggle="tab">ABOUT</a></li>
						<li className="nav-item"><a href="#profile-photos" className="nav-link" data-bs-toggle="tab">PHOTOS</a></li>
						<li className="nav-item"><a href="#profile-videos" className="nav-link" data-bs-toggle="tab">VIDEOS</a></li>
						<li className="nav-item"><a href="#profile-friends" className="nav-link" data-bs-toggle="tab">FRIENDS</a></li>
					</ul>
				</div>
			</div>
			<div className="profile-content">
				<div className="tab-content p-0">
					<div className="tab-pane fade show active" id="profile-post">
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
											<div><img src="/assets/img/user/user-13.jpg" height="35" alt="" className="rounded-pill" /></div>
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
											<div><img src="/assets/img/user/user-13.jpg" height="35" alt="" className="rounded-pill" /></div>
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
											<div><img src="/assets/img/user/user-13.jpg" height="35" alt="" className="rounded-pill" /></div>
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
					<div className="tab-pane fade" id="profile-about">
						<div className="table-responsive form-inline">
							<table className="table table-profile align-middle">
								<thead>
									<tr>
										<th></th>
										<th>
											<h4>Sean Ngu <small>UXUI + Frontend Developer</small></h4>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className="highlight">
										<td className="field">Mood</td>
										<td><a href="#/" className="text-decoration-none fw-bold"><i className="fa fa-plus fa-fw"></i> Add Mood Message</a></td>
									</tr>
									<tr className="divider">
										<td colSpan="2"></td>
									</tr>
									<tr>
										<td className="field">Mobile</td>
										<td><i className="fa fa-mobile fa-lg me-5px"></i> +1-(847)- 367-8924 <a href="#/" className="ms-5px text-decoration-none fw-bold"><i className="fa fa-plus fa-fw"></i> Edit</a></td>
									</tr>
									<tr>
										<td className="field">Home</td>
										<td><a href="#/" className="text-decoration-none fw-bold"><i className="fa fa-plus fa-fw"></i> Add Number</a></td>
									</tr>
									<tr>
										<td className="field">Office</td>
										<td><a href="#/" className="text-decoration-none fw-bold"><i className="fa fa-plus fa-fw"></i> Add Number</a></td>
									</tr>
									<tr className="divider">
										<td colSpan="2"></td>
									</tr>
									<tr className="highlight">
										<td className="field">About Me</td>
										<td><a href="#/" className="text-decoration-none fw-bold"><i className="fa fa-plus fa-fw"></i> Add Description</a></td>
									</tr>
									<tr className="divider">
										<td colSpan="2"></td>
									</tr>
									<tr>
										<td className="field">Country/Region</td>
										<td>
											<select className="form-select w-200px" name="region">
												<option value="US" defaultValue>United State</option>
												<option value="AF">Afghanistan</option>
												<option value="AL">Albania</option>
												<option value="DZ">Algeria</option>
												<option value="AS">American Samoa</option>
												<option value="AD">Andorra</option>
												<option value="AO">Angola</option>
												<option value="AI">Anguilla</option>
												<option value="AQ">Antarctica</option>
												<option value="AG">Antigua and Barbuda</option>
											</select>
										</td>
									</tr>
									<tr>
										<td className="field">City</td>
										<td>Los Angeles</td>
									</tr>
									<tr>
										<td className="field">State</td>
										<td><a href="#/" className="text-decoration-none fw-bold"><i className="fa fa-plus fa-fw"></i> Add State</a></td>
									</tr>
									<tr>
										<td className="field">Website</td>
										<td><a href="#/" className="text-decoration-none fw-bold"><i className="fa fa-plus fa-fw"></i> Add Webpage</a></td>
									</tr>
									<tr>
										<td className="field">Gender</td>
										<td>
											<select className="form-select w-200px" name="gender">
												<option value="male">Male</option>
												<option value="female">Female</option>
											</select>
										</td>
									</tr>
									<tr>
										<td className="field">Birthdate</td>
										<td>
											<div className="d-flex align-items-center">
												<select className="form-select w-80px" name="day">
													<option value="04" defaultValue>04</option>
												</select>
												<span className="mx-2">-</span>
												<select className="form-select w-80px" name="month">
													<option value="11" defaultValue>11</option>
												</select>
												<span className="mx-2">-</span>
												<select className="form-select w-100px" name="year">
													<option value="1989" defaultValue>1989</option>
												</select>
											</div>
										</td>
									</tr>
									<tr>
										<td className="field">Language</td>
										<td className="with-form-control">
											<select className="form-select w-200px" name="language">
												<option value="" defaultValue>English</option>
											</select>
										</td>
									</tr>
									<tr className="divider">
										<td colSpan="2"></td>
									</tr>
									<tr className="highlight">
										<td className="field">&nbsp;</td>
										<td className="">
											<button type="submit" className="btn btn-primary w-150px">Update</button>
											<button type="submit" className="btn border-0 w-150px ms-5px">Cancel</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div className="tab-pane fade" id="profile-photos">
						<h4 className="mb-3">Photos (70)</h4>
						<div className="gallery-v2" id="gallery">
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-1.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-1-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-2.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-2-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-3.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-3-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-4.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-4-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-5.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-5-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-6.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-6-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-7.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-7-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-8.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-8-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-9.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-9-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-10.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-10-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-11.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-11-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-12.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-12-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-13.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-13-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-14.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-14-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-15.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-15-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-16.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-16-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-17.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-17-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-18.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-18-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-19.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-19-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-20.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-20-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-21.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-21-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-22.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-22-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-23.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-23-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-24.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-24-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-25.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-25-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-26.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-26-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-27.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-27-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-28.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-28-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-29.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-29-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-30.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-30-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-31.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-31-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-32.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-32-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-33.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-33-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-34.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-34-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-35.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-35-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-36.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-36-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-37.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-37-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-38.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-38-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-39.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-39-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-40.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-40-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-41.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-41-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-42.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-42-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-43.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-43-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-44.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-44-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-45.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-45-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-46.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-46-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-47.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-47-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-48.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-48-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-49.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-49-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-50.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-50-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-51.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-51-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-52.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-52-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-53.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-53-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-54.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-54-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-55.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-55-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-56.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-56-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-57.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-57-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-58.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-58-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-59.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-59-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-60.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-60-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-61.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-61-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-62.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-62-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-63.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-63-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-64.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-64-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-65.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-65-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-66.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-66-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-67.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-67-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-68.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-68-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-69.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-69-thumb.jpg)'}}></div>
								</a>
							</div>
							<div className="gallery">
								<a href="#/" className="ratio ratio-4x3" data-pswp-src="/assets/img/gallery/gallery-70.jpg" data-pswp-width="1200" data-pswp-height="800">
									<div className="bg-size-cover bg-position-center" style={{backgroundImage: 'url(/assets/img/gallery/gallery-70-thumb.jpg)'}}></div>
								</a>
							</div>
						</div>
					</div>
					<div className="tab-pane fade" id="profile-videos">
						<h4 className="mb-3">Videos (16)</h4>
						<div className="row gx-1">
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=RQ5ljyGg-ig" data-lity>
									<img src="https://img.youtube.com/vi/RQ5ljyGg-ig/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=5lWkZ-JaEOc" data-lity>
									<img src="https://img.youtube.com/vi/5lWkZ-JaEOc/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=9ZfN87gSjvI" data-lity>
									<img src="https://img.youtube.com/vi/9ZfN87gSjvI/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=w2H07DRv2_M" data-lity>
									<img src="https://img.youtube.com/vi/w2H07DRv2_M/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=PntG8KEVjR8" data-lity>
									<img src="https://img.youtube.com/vi/PntG8KEVjR8/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=q8kxKvSQ7MI" data-lity>
									<img src="https://img.youtube.com/vi/q8kxKvSQ7MI/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=cutu3Bw4ep4" data-lity>
									<img src="https://img.youtube.com/vi/cutu3Bw4ep4/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=gCspUXGrraM" data-lity>
									<img src="https://img.youtube.com/vi/gCspUXGrraM/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=COtpTM1MpAA" data-lity>
									<img src="https://img.youtube.com/vi/COtpTM1MpAA/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=8NVkGHVOazc" data-lity>
									<img src="https://img.youtube.com/vi/8NVkGHVOazc/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=ZtT3jaTcCsY" data-lity>
									<img src="https://img.youtube.com/vi/ZtT3jaTcCsY/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=Dmw0ucCv8aQ" data-lity>
									<img src="https://img.youtube.com/vi/Dmw0ucCv8aQ/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=r1d7ST2TG2U" data-lity>
									<img src="https://img.youtube.com/vi/r1d7ST2TG2U/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=WUR-XWBcHvs" data-lity>
									<img src="https://img.youtube.com/vi/WUR-XWBcHvs/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=A7sQ8RWj0Cw" data-lity>
									<img src="https://img.youtube.com/vi/A7sQ8RWj0Cw/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
							<div className="col-md-3 col-sm-4 mb-1">
								<a href="https://www.youtube.com/watch?v=IMN2VfiXls4" data-lity>
									<img src="https://img.youtube.com/vi/IMN2VfiXls4/mqdefault.jpg" alt="" className="d-block w-100" />
								</a>
							</div>
						</div>
					</div>
					<div className="tab-pane fade" id="profile-friends">
						<h4 className="mb-3">Friend List (14)</h4>
						<div className="row gx-1">
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-1.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">James Pittman</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-2.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Mitchell Ashcroft</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-3.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Ella Cabena</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-4.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Declan Dyson</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-5.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">George Seyler</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-6.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Patrick Musgrove</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-7.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Taj Connal</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-8.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Laura Pollock</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-9.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Dakota Mannix</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-10.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Timothy Woolley</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-11.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Benjamin Congreve</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-12.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Mariam Maddock</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-13.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Blake Gerrald</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-6 mb-1">
								<div className="p-2 d-flex align-items-center card flex-row border-0 rounded">
									<a href="#/">
										<img src="/assets/img/user/user-14.jpg" alt="" className="rounded" width="64" />
									</a>
									<div className="flex-1 ps-3">
										<b className="text-dark">Gabrielle Bunton</b>
									</div>
									<div>
										<a href="#/" className="btn border-0 w-40px h-40px text-gray-500 rounded-pill d-flex align-items-center justify-content-center" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-h fa-lg"></i></a>
										<div className="dropdown-menu dropdown-menu-end">
											<a href="#/" className="dropdown-item">Action 1</a>
											<a href="#/" className="dropdown-item">Action 2</a>
											<a href="#/" className="dropdown-item">Action 3</a>
											<div className="dropdown-divider"></div>
											<a href="#/" className="dropdown-item">Action 4</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
  );
}

export default ExtraProfile;