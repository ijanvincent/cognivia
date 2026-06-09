import React, { useEffect, useState }  from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { Link } from 'react-router-dom';

function Calendar() {
	const plugins = [ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, bootstrapPlugin ];
	const headerToolbar = {
		left: 'dayGridMonth,timeGridWeek,timeGridDay',
		center: 'title',
		right: 'prev,next today'
	};
	const buttonText = {
		today:    'Today',
		month:    'Month',
		week:     'Week',
		day:      'Day'
	};
	const views = {
		timeGrid: {
			eventLimit: 6
		}
	};
	const [events, setEvents] = useState();
	
	useEffect(() => {
		var containerEl = document.getElementById('external-events');
		new Draggable(containerEl, {
			itemSelector: '.fc-event',
			eventData: function(eventEl) {
				return {
					title: eventEl.innerText,
					color: eventEl.getAttribute('data-color')
				};
			}
		});
		
		var date = new Date();
		var currentYear = date.getFullYear();
		var currentMonth = date.getMonth() + 1;
				currentMonth = (currentMonth < 10) ? '0' + currentMonth : currentMonth;
		
		setEvents([{
			title: 'Trip to London',
			start: currentYear + '-'+ currentMonth +'-01',
			end: currentYear + '-'+ currentMonth +'-05',
			color: '#00acac'
		},{
			title: 'Meet with Irene Wong',
			start: currentYear + '-'+ currentMonth +'-02T06:00:00',
			color: '#348fe2'
		},{
			title: 'Mobile Apps Brainstorming',
			start: currentYear + '-'+ currentMonth +'-10',
			end: currentYear + '-'+ currentMonth +'-12',
			color: '#fb5597'
		},{
			title: 'Stonehenge, Windsor Castle, Oxford',
			start: currentYear + '-'+ currentMonth +'-05T08:45:00',
			end: currentYear + '-'+ currentMonth +'-06T18:00',
			color: '#8753de'
		},{
			title: 'Paris Trip',
			start: currentYear + '-'+ currentMonth +'-12',
			end: currentYear + '-'+ currentMonth +'-16'
		},{
			title: 'Domain name due',
			start: currentYear + '-'+ currentMonth +'-15',
			color: '#348fe2'
		},{
			title: 'Cambridge Trip',
			start: currentYear + '-'+ currentMonth +'-19'
		},{
			title: 'Visit Apple Company',
			start: currentYear + '-'+ currentMonth +'-22T05:00:00',
			color: '#00ACAC'
		},{
			title: 'Exercise Class',
			start: currentYear + '-'+ currentMonth +'-22T07:30:00',
			color: '#f59c1a'
		},{
			title: 'Live Recording',
			start: currentYear + '-'+ currentMonth +'-22T03:00:00',
			color: '#348fe2'
		},{
			title: 'Announcement',
			start: currentYear + '-'+ currentMonth +'-22T15:00:00',
			color: '#ff5b57'
		},{
			title: 'Dinner',
			start: currentYear + '-'+ currentMonth +'-22T18:00:00'
		},{
			title: 'New Android App Discussion',
			start: currentYear + '-'+ currentMonth +'-25T08:00:00',
			end: currentYear + '-'+ currentMonth +'-25T10:00:00',
			color: '#ff5b57'
		},{
			title: 'Marketing Plan Presentation',
			start: currentYear + '-'+ currentMonth +'-25T12:00:00',
			end: currentYear + '-'+ currentMonth +'-25T14:00:00',
			color: '#348fe2'
		},{
			title: 'Chase due',
			start: currentYear + '-'+ currentMonth +'-26T12:00:00',
			color: '#f59c1a'
		},{
			title: 'Heartguard',
			start: currentYear + '-'+ currentMonth +'-26T08:00:00',
			color: '#f59c1a'
		},{
			title: 'Lunch with Richard',
			start: currentYear + '-'+ currentMonth +'-28T14:00:00',
			color: '#348fe2'
		},{
			title: 'Web Hosting due',
			start: currentYear + '-'+ currentMonth +'-30',
			color: '#348fe2'
		}]);
		
		// eslint-disable-next-line
	}, []);
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/calendar">Home</Link></li>
				<li className="breadcrumb-item active">Calendar</li>
			</ol>
			<h1 className="page-header">Calendar <small>header small text goes here...</small></h1>
			<hr />
			
			<div className="row">
				<div className="d-none d-lg-block" style={{width: '215px'}}>
					<div id="external-events" className="fc-event-list">
						<h5 className="mb-3">Draggable Events</h5>
						<div className="fc-event" data-color="#00acac">
							<div className="fc-event-text">Meeting with Client</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-success"></i></div>
						</div>
						<div className="fc-event" data-color="#348fe2">
							<div className="fc-event-text">IOS App Development</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-blue"></i></div>
						</div>
						<div className="fc-event" data-color="#f59c1a">
							<div className="fc-event-text">Group Discussion</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-warning"></i></div>
						</div>
						<div className="fc-event" data-color="#ff5b57">
							<div className="fc-event-text">New System Briefing</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-danger"></i></div>
						</div>
						<div className="fc-event">
							<div className="fc-event-text">Brainstorming</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-dark"></i></div>
						</div>
						<hr className="my-3" />
						<h5 className="mb-3">Other Events</h5>
						<div className="fc-event" data-color="#b6c2c9">
							<div className="fc-event-text">Other Event 1</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-gray-500"></i></div>
						</div>
						<div className="fc-event" data-color="#b6c2c9">
							<div className="fc-event-text">Other Event 2</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-gray-500"></i></div>
						</div>
						<div className="fc-event" data-color="#b6c2c9">
							<div className="fc-event-text">Other Event 3</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-gray-500"></i></div>
						</div>
						<div className="fc-event" data-color="#b6c2c9">
							<div className="fc-event-text">Other Event 4</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-gray-500"></i></div>
						</div>
						<div className="fc-event" data-color="#b6c2c9">
							<div className="fc-event-text">Other Event 5</div>
							<div className="fc-event-icon"><i className="fas fa-circle fa-fw fs-9px text-gray-500"></i></div>
						</div>
					</div>
				</div>
				<div className="col-lg">
					<FullCalendar 
						plugins={plugins}
						initialView="dayGridMonth"
						themeSystem="bootstrap"
						headerToolbar={headerToolbar}
						buttonText={buttonText}
						events={events}
						views={views}
					/>
				</div>
			</div>
		</div>
	)
}

export default Calendar;