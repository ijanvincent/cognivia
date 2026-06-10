import React, { useEffect, useContext, useState } from 'react';
import { AppSettings } from './../../config/app-settings.js';
import { Icon } from '@iconify/react';
import PerfectScrollbar from 'react-perfect-scrollbar';

function ExtraMessengerPage() {
  const context = useContext(AppSettings);
  const [isMobileSidebarToggled, setIsMobileSidebarToggled] = useState(false);
  
  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarToggled(!isMobileSidebarToggled);
  };

  useEffect(() => {
    context.handleSetAppSidebarMinified(true);
    context.handleSetAppHeaderInverse(true);
    context.handleSetAppContentFullHeight(true);
    context.handleSetAppContentClass('p-0');

    return () => {
      context.handleSetAppSidebarMinified(false);
      context.handleSetAppHeaderInverse(false);
      context.handleSetAppContentFullHeight(false);
    context.handleSetAppContentClass('');
    };
		
		// eslint-disable-next-line
	}, []);

  return (
		<div className={'messenger '+ (isMobileSidebarToggled ? 'messenger-chat-content-mobile-toggled' : '')} id="messenger">
			<div className="messenger-menu">
				<div className="messenger-menu-item my-2">
					<a href="#/" className="messenger-menu-link">
						<div className="m-n1">
							<img alt="" src="/assets/img/user/user-13.jpg" className="w-100 d-block rounded-circle" />
						</div>
					</a>
				</div>
				<div className="messenger-menu-item active">
					<a href="#/" className="messenger-menu-link">
						<Icon className="iconify fs-30px" icon="solar:dialog-2-bold-duotone" />
					</a>
				</div>
				<div className="messenger-menu-item">
					<a href="#/" className="messenger-menu-link">
						<Icon className="iconify fs-30px" icon="solar:notebook-bold-duotone" />
					</a>
				</div>
				<div className="messenger-menu-item">
					<a href="#/" className="messenger-menu-link">
						<Icon className="iconify fs-30px" icon="solar:box-minimalistic-bold-duotone" />
					</a>
				</div>
				<div className="messenger-menu-item">
					<a href="#/" className="messenger-menu-link">
						<Icon className="iconify fs-30px" icon="solar:folder-with-files-bold-duotone" />
					</a>
				</div>
				<div className="messenger-menu-item">
					<a href="#/" className="messenger-menu-link">
						<Icon className="iconify fs-30px" icon="solar:clapperboard-play-bold-duotone" />
					</a>
				</div>
				<div className="messenger-menu-item">
					<a href="#/" className="messenger-menu-link">
						<Icon className="iconify fs-30px" icon="solar:settings-bold-duotone" />
					</a>
				</div>
			</div>
			<div className="messenger-chat">
				<div className="messenger-chat-header d-flex">
					<div className="flex-1 position-relative">
						<input type="text" className="form-control border-0 bg-light ps-30px" placeholder="Search" />
						<i className="fa fa-search position-absolute start-0 top-0 h-100 ps-2 ms-3px d-flex align-items-center justify-content-center"></i>
					</div>
					<div className="ps-2">
						<a href="#/" className="btn border-0 bg-light shadow-none">
							<i className="fa fa-plus"></i>
						</a>
					</div>
				</div>
				<div className="messenger-chat-body">
					<PerfectScrollbar className="h-100">
						<div className="messenger-chat-list">
							<div className="messenger-chat-item">
								<a href="#/" className="messenger-chat-link" onClick={handleMobileSidebarToggle}>
									<div className="messenger-chat-media">
										<img alt="" src="/assets/img/user/user-1.jpg" />
									</div>
									<div className="messenger-chat-content">
										<div className="messenger-chat-title">
											<div>Daniel</div>
											<div className="messenger-chat-time">09:15 AM</div>
										</div>
										<div className="messenger-chat-desc"> Hey, how was your weekend?</div>
									</div>
								</a>
							</div>
							<div className="messenger-chat-item active">
								<a href="#/" className="messenger-chat-link" onClick={handleMobileSidebarToggle}>
									<div className="messenger-chat-media flex-wrap overflow-hidden">
										<img alt="" src="/assets/img/user/user-1.jpg" width="14" className="rounded-0 me-1px mb-1px" />
										<img alt="" src="/assets/img/user/user-2.jpg" width="14" className="rounded-0 me-1px mb-1px" />
										<img alt="" src="/assets/img/user/user-3.jpg" width="14" className="rounded-0 me-0px mb-1px" />
										<img alt="" src="/assets/img/user/user-4.jpg" width="14" className="rounded-0 me-1px mb-1px" />
										<img alt="" src="/assets/img/user/user-5.jpg" width="14" className="rounded-0 me-1px mb-1px" />
										<img alt="" src="/assets/img/user/user-6.jpg" width="14" className="rounded-0 me-0px mb-1px" />
										<img alt="" src="/assets/img/user/user-7.jpg" width="14" className="rounded-0 me-1px mb-1px" />
										<img alt="" src="/assets/img/user/user-8.jpg" width="14" className="rounded-0 me-1px mb-1px" />
										<img alt="" src="/assets/img/user/user-9.jpg" width="14" className="rounded-0 me-0px mb-1px" />
									</div>
									<div className="messenger-chat-content">
										<div className="messenger-chat-title">
											<div>Company Discussion Group (9)</div>
											<div className="messenger-chat-time">10:30 AM</div>
										</div>
										<div className="messenger-chat-desc">Me: We need to prepare the project report by Friday. </div>
									</div>
								</a>
							</div>
							<div className="messenger-chat-item">
								<a href="#/" className="messenger-chat-link" onClick={handleMobileSidebarToggle}>
									<div className="messenger-chat-media bg-lime-900 text-lime">
										<Icon className="iconify" icon="solar:book-bold-duotone" />
									</div>
									<div className="messenger-chat-content">
										<div className="messenger-chat-title">
											<div>Online Course (12)</div>
											<div className="messenger-chat-time">11:45 AM</div>
										</div>
										<div className="messenger-chat-desc">Emily: Let's meet at the library at 1 PM to study. </div>
									</div>
								</a>
							</div>
							<div className="messenger-chat-item">
								<a href="#/" className="messenger-chat-link" onClick={handleMobileSidebarToggle}>
									<div className="messenger-chat-media bg-orange text-orange-900">
										<Icon className="iconify" icon="solar:oven-mitts-bold-duotone" />
									</div>
									<div className="messenger-chat-content">
										<div className="messenger-chat-title">
											<div>Pizza Lovers</div>
											<div className="messenger-chat-time">12:20 PM</div>
										</div>
										<div className="messenger-chat-desc"> I found a new pizzeria for our next meetup! </div>
									</div>
								</a>
							</div>
							<div className="messenger-chat-item">
								<a href="#/" className="messenger-chat-link" onClick={handleMobileSidebarToggle}>
									<div className="messenger-chat-media bg-blue-900 text-blue">
										<Icon className="iconify" icon="solar:gamepad-charge-bold-duotone" />
									</div>
									<div className="messenger-chat-content">
										<div className="messenger-chat-title">
											<div>Gaming Crew</div>
											<div className="messenger-chat-time">01:05 PM</div>
										</div>
										<div className="messenger-chat-desc"> Anyone up for a game of Among Us tonight? </div>
									</div>
								</a>
							</div>
							<div className="messenger-chat-item">
								<a href="#/" className="messenger-chat-link" onClick={handleMobileSidebarToggle}>
									<div className="messenger-chat-media row gx-0 overflow-hidden">
										<div className="col-6 d-flex flex-column">
											<img alt="" src="/assets/img/user/user-10.jpg" className="w-100 rounded-0" />
											<img alt="" src="/assets/img/user/user-11.jpg" className="w-100 rounded-0" />
										</div>
										<div className="col-6 d-flex flex-column">
											<img alt="" src="/assets/img/user/user-12.jpg" className="w-100 rounded-0" />
											<img alt="" src="/assets/img/user/user-13.jpg" className="w-100 rounded-0" />
										</div>
									</div>
									<div className="messenger-chat-content">
										<div className="messenger-chat-title">
											<div>Weekend Plans</div>
											<div className="messenger-chat-time">02:15 PM</div>
										</div>
										<div className="messenger-chat-desc"> How about a hike this Saturday morning? </div>
									</div>
								</a>
							</div>
							<div className="messenger-chat-item">
								<a href="#/" className="messenger-chat-link" onClick={handleMobileSidebarToggle}>
									<div className="messenger-chat-media">
										<Icon className="iconify text-red-600" icon="solar:calendar-bold-duotone" />
									</div>
									<div className="messenger-chat-content">
										<div className="messenger-chat-title">
											<div>Event Reminders</div>
											<div className="messenger-chat-time">03:00 PM</div>
										</div>
										<div className="messenger-chat-desc"> Don't forget Grandma's birthday tomorrow! </div>
									</div>
								</a>
							</div>
							<div className="messenger-chat-item">
								<a href="#/" className="messenger-chat-link" onClick={handleMobileSidebarToggle}>
									<div className="messenger-chat-media">
										<Icon className="iconify" icon="solar:clipboard-list-bold-duotone" />
									</div>
									<div className="messenger-chat-content">
										<div className="messenger-chat-title">
											<div>Party Planning</div>
											<div className="messenger-chat-time">03:45 PM</div>
										</div>
										<div className="messenger-chat-desc"> We need to finalize the decorations for the party. </div>
									</div>
								</a>
							</div>
							<div className="messenger-chat-item">
								<a href="#/" className="messenger-chat-link" onClick={handleMobileSidebarToggle}>
									<div className="messenger-chat-media">
										<Icon className="iconify" icon="solar:book-bold-duotone" />
									</div>
									<div className="messenger-chat-content">
										<div className="messenger-chat-title">
											<div>Book Club Discussions</div>
											<div className="messenger-chat-time">04:30 PM</div>
										</div>
										<div className="messenger-chat-desc"> What did you think of the last book's ending? </div>
									</div>
								</a>
							</div>
							<div className="messenger-chat-item">
								<a href="#/" className="messenger-chat-link" onClick={handleMobileSidebarToggle}>
									<div className="messenger-chat-media">
										<Icon className="iconify" icon="solar:bicycling-bold-duotone" />
									</div>
									<div className="messenger-chat-content">
										<div className="messenger-chat-title">
											<div>Road Trip Ideas</div>
											<div className="messenger-chat-time">05:15 PM</div>
										</div>
										<div className="messenger-chat-desc"> Let's plan our road trip route and stops! </div>
									</div>
								</a>
							</div>
						</div>
					</PerfectScrollbar>
				</div>
			</div>
			<div className="messenger-content">
				<div className="widget-chat">
					<div className="widget-chat-header">
						<div className="d-block d-lg-none">
							<button type="button" className="btn border-0 shadow-none" onClick={handleMobileSidebarToggle}>
								<i className="fa fa-chevron-left fa-lg"></i>
							</button>
						</div>
						<div className="widget-chat-header-content">
							<div className="fs-5 fw-bold">Company Discussion Group (9)</div>
						</div>
						<div className="">
							<button type="button" className="btn border-0 shadow-none" data-bs-toggle="dropdown">
								<i className="fa fa-ellipsis fa-lg"></i>
							</button>
							<ul className="dropdown-menu">
								<li>
									<a className="dropdown-item" href="#/">Action</a>
								</li>
								<li>
									<a className="dropdown-item" href="#/">Another action</a>
								</li>
								<li>
									<a className="dropdown-item" href="#/">Something else here</a>
								</li>
							</ul>
						</div>
					</div>
					<PerfectScrollbar className="widget-chat-body h-100">
						<div className="widget-chat-item with-media end">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-13.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-message"> Good morning, team! Just a reminder, we need to prepare the project report by Friday. Let's stay on track and meet our deadlines. </div>
									<div className="widget-chat-time">08:45AM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-1.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-blue">Daniel</div>
									<div className="widget-chat-message"> Morning! I'm on it and will start compiling the data today. </div>
									<div className="widget-chat-time">09:02AM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-2.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-indigo">Mark</div>
									<div className="widget-chat-message"> Thanks for the heads up! I'll make sure the design elements are ready for the report. </div>
									<div className="widget-chat-time">09:20AM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-3.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-red">Alexander</div>
									<div className="widget-chat-message"> Got it. I'll review the financial data and ensure all the numbers are accurate. </div>
									<div className="widget-chat-time">09:35AM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media end">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-13.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-message"> Great! Let's have a progress check-in at 2 PM today to see how things are going. Keep up the good work, team! </div>
									<div className="widget-chat-time">10:10AM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-1.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-blue">Daniel</div>
									<div className="widget-chat-message"> Sounds good! See you at the meeting. </div>
									<div className="widget-chat-time">10:30AM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-2.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-indigo">Mark</div>
									<div className="widget-chat-message"> Looking forward to it. We'll have everything ready. </div>
									<div className="widget-chat-time">10:50AM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-3.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-red">Alexander</div>
									<div className="widget-chat-message"> Count me in. I'll be prepared with the financial figures. </div>
									<div className="widget-chat-time">11:15AM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media end">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-13.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-orange"></div>
									<div className="widget-chat-message"> Excellent teamwork, everyone! We're making great progress. </div>
									<div className="widget-chat-time">11:45AM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-1.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-blue">Daniel</div>
									<div className="widget-chat-message"> Thank you! It's a team effort. </div>
									<div className="widget-chat-time">12:20PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-2.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-indigo">Mark</div>
									<div className="widget-chat-message"> Absolutely, we've got a strong team. </div>
									<div className="widget-chat-time">01:05PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-3.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-red">Alexander</div>
									<div className="widget-chat-message"> Agreed, we're all working towards the same goal. </div>
									<div className="widget-chat-time">02:00PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media end">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-13.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-message"> That's the spirit! Let's keep the communication flowing. If you have any questions or face any challenges, don't hesitate to reach out. </div>
									<div className="widget-chat-time">02:45PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-1.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-blue">Daniel</div>
									<div className="widget-chat-message"> Will do, Manager. </div>
									<div className="widget-chat-time">03:10PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-2.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-indigo">Mark</div>
									<div className="widget-chat-message"> Understood, we'll collaborate closely. </div>
									<div className="widget-chat-time">03:35PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-3.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-red">Alexander</div>
									<div className="widget-chat-message"> Thanks for the support, Manager. </div>
									<div className="widget-chat-time">04:00PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media end">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-13.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-message"> Alexander, can you also provide an update on the budget allocation? </div>
									<div className="widget-chat-time">04:25PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-3.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-red">Alexander</div>
									<div className="widget-chat-message"> Sure, I'll get that information for you by the end of the day. </div>
									<div className="widget-chat-time">04:50PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media end">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-13.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-message"> Perfect. And Mark, how's the visual design coming along? </div>
									<div className="widget-chat-time">05:15PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-2.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-indigo">Mark</div>
									<div className="widget-chat-message"> It's going smoothly. I'll share the mockups with you later today. </div>
									<div className="widget-chat-time">05:40PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media end">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-13.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-message"> Sounds great, Mark. Looking forward to it. </div>
									<div className="widget-chat-time">06:05PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-1.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-blue">Daniel</div>
									<div className="widget-chat-message"> Should we discuss the presentation format for the report? </div>
									<div className="widget-chat-time">06:30AM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media end">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-13.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-message"> Good point, Daniel. Let's have a quick discussion on that during the meeting today. </div>
									<div className="widget-chat-time">07:00PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-3.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-red">Alexander</div>
									<div className="widget-chat-message"> I'll make sure the financial data is presented in a clear and concise manner. </div>
									<div className="widget-chat-time">07:25PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media end">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-13.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-message"> Thank you, Alexander. That will be essential for our stakeholders. </div>
									<div className="widget-chat-time">07:50PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-2.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-indigo">Mark</div>
									<div className="widget-chat-message"> Do we have all the necessary data and information for the report? </div>
									<div className="widget-chat-time">08:15PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-4.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-blue">Daniel</div>
									<div className="widget-chat-message"> I've collected most of it, but I'm waiting on a few figures from the sales team. </div>
									<div className="widget-chat-time">08:40PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-3.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-red">Alexander</div>
									<div className="widget-chat-message"> I'll follow up with them to expedite the process. </div>
									<div className="widget-chat-time">09:05PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media end">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-13.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-message"> Great teamwork, everyone. Keep up the good work. Our client will be impressed! </div>
									<div className="widget-chat-time">09:30PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-4.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-blue">Daniel</div>
									<div className="widget-chat-message"> We won't disappoint! </div>
									<div className="widget-chat-time">09:55PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-2.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-indigo">Mark</div>
									<div className="widget-chat-message"> Let's make it a stellar report! </div>
									<div className="widget-chat-time">10:20PM</div>
								</div>
							</div>
						</div>
						<div className="widget-chat-item with-media start">
							<div className="widget-chat-media">
								<img alt="" src="/assets/img/user/user-3.jpg" />
							</div>
							<div className="widget-chat-info">
								<div className="widget-chat-info-container">
									<div className="widget-chat-name text-red">Alexander</div>
									<div className="widget-chat-message"> Agreed, let's do our best! </div>
									<div className="widget-chat-time">10:45PM</div>
								</div>
							</div>
						</div>
					</PerfectScrollbar>
					<div className="widget-chat-input">
						<div className="widget-chat-toolbar">
							<a href="#/" className="widget-chat-toolbar-link">
								<Icon className="iconify fs-26px" icon="solar:smile-circle-outline" />
							</a>
							<a href="#/" className="widget-chat-toolbar-link">
								<Icon className="iconify fs-26px" icon="solar:folder-with-files-outline" />
							</a>
							<a href="#/" className="widget-chat-toolbar-link">
								<Icon className="iconify fs-26px" icon="solar:scissors-square-outline" />
							</a>
							<a href="#/" className="widget-chat-toolbar-link">
								<Icon className="iconify fs-26px" icon="solar:chat-round-dots-outline" />
							</a>
							<a href="#/" className="widget-chat-toolbar-link ms-auto">
								<Icon className="iconify fs-26px" icon="solar:phone-calling-outline" />
							</a>
							<a href="#/" className="widget-chat-toolbar-link">
								<Icon className="iconify fs-26px" icon="solar:videocamera-record-outline" />
							</a>
						</div>
						<textarea className="form-control"></textarea>
					</div>
				</div>
			</div>
		</div>
  );
}

export default ExtraMessengerPage;