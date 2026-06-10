import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/jsvectormap.min.css';
import Chart from 'react-apexcharts';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';

import * as bootstrap from 'bootstrap';

function DashboardV3() {

	function handleGetDate(minusDate) {
		var d = new Date();
				d = d.setDate(d.getDate() - minusDate);
		return d;
	};
	
	function convertNumberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	
	function handleDateApplyEvent(event, picker) {
		var startDate = picker.startDate;
		var endDate = picker.endDate;
		var gap = endDate.diff(startDate, 'days');
		
		var currentWeek = startDate.format('D MMMM YYYY') + ' - ' + endDate.format('D MMMM YYYY');
		var prevWeek = Moment(startDate).subtract('days', gap).format('D MMMM') + ' - ' + Moment(startDate).subtract('days', 1).format('D MMMM YYYY');
		
		dateRange.currentWeek = currentWeek;
		dateRange.prevWeek = prevWeek;
		
		dateRange = {
			currentWeek: currentWeek,
			prevWeek: prevWeek
		};
	}
	
	var blue = (getComputedStyle(document.body).getPropertyValue('--bs-blue')).trim();
	var indigo = (getComputedStyle(document.body).getPropertyValue('--bs-indigo')).trim();
	var red = (getComputedStyle(document.body).getPropertyValue('--bs-red')).trim();
	var orange = (getComputedStyle(document.body).getPropertyValue('--bs-orange')).trim();
	var lime = (getComputedStyle(document.body).getPropertyValue('--bs-lime')).trim();
	var cyan = (getComputedStyle(document.body).getPropertyValue('--bs-cyan')).trim();
	var teal = (getComputedStyle(document.body).getPropertyValue('--bs-teal')).trim();
	
	var startDate = Moment().subtract(7, 'days');
	var endDate = Moment();
	var dateRange = {
		currentWeek: Moment().subtract('days', 7).format('D MMMM YYYY') + ' - ' + Moment().format('D MMMM YYYY'),
		prevWeek: Moment().subtract('days', 15).format('D MMMM') + ' - ' + Moment().subtract('days', 8).format('D MMMM YYYY')
	}
	
	var visitorChartSeries = [{ 
		name: 'Unique Visitors', 
		data: [
			[handleGetDate(77), 13], [handleGetDate(76), 13], [handleGetDate(75), 6 ], 
			[handleGetDate(73), 6 ], [handleGetDate(72), 6 ], [handleGetDate(71), 5 ], [handleGetDate(70), 5 ], 
			[handleGetDate(69), 5 ], [handleGetDate(68), 6 ], [handleGetDate(67), 7 ], [handleGetDate(66), 6 ], 
			[handleGetDate(65), 9 ], [handleGetDate(64), 9 ], [handleGetDate(63), 8 ], [handleGetDate(62), 10], 
			[handleGetDate(61), 10], [handleGetDate(60), 10], [handleGetDate(59), 10], [handleGetDate(58), 9 ], 
			[handleGetDate(57), 9 ], [handleGetDate(56), 10], [handleGetDate(55), 9 ], [handleGetDate(54), 9 ], 
			[handleGetDate(53), 8 ], [handleGetDate(52), 8 ], [handleGetDate(51), 8 ], [handleGetDate(50), 8 ], 
			[handleGetDate(49), 8 ], [handleGetDate(48), 7 ], [handleGetDate(47), 7 ], [handleGetDate(46), 6 ], 
			[handleGetDate(45), 6 ], [handleGetDate(44), 6 ], [handleGetDate(43), 6 ], [handleGetDate(42), 5 ], 
			[handleGetDate(41), 5 ], [handleGetDate(40), 4 ], [handleGetDate(39), 4 ], [handleGetDate(38), 5 ], 
			[handleGetDate(37), 5 ], [handleGetDate(36), 5 ], [handleGetDate(35), 7 ], [handleGetDate(34), 7 ], 
			[handleGetDate(33), 7 ], [handleGetDate(32), 10], [handleGetDate(31), 9 ], [handleGetDate(30), 9 ], 
			[handleGetDate(29), 10], [handleGetDate(28), 11], [handleGetDate(27), 11], [handleGetDate(26), 8 ], 
			[handleGetDate(25), 8 ], [handleGetDate(24), 7 ], [handleGetDate(23), 8 ], [handleGetDate(22), 9 ], 
			[handleGetDate(21), 8 ], [handleGetDate(20), 9 ], [handleGetDate(19), 10], [handleGetDate(18), 9 ], 
			[handleGetDate(17), 10], [handleGetDate(16), 16], [handleGetDate(15), 17], [handleGetDate(14), 16], 
			[handleGetDate(13), 17], [handleGetDate(12), 16], [handleGetDate(11), 15], [handleGetDate(10), 14], 
			[handleGetDate(9) , 24], [handleGetDate(8) , 18], [handleGetDate(7) , 15], [handleGetDate(6) , 14], 
			[handleGetDate(5) , 16], [handleGetDate(4) , 16], [handleGetDate(3) , 17], [handleGetDate(2) , 7 ], 
			[handleGetDate(1) , 7 ], [handleGetDate(0) , 7 ]
		]
	}, { 
		name: 'Page Views', 
		data: [
			[handleGetDate(77), 14], [handleGetDate(76), 13], [handleGetDate(75), 15], 
			[handleGetDate(73), 14], [handleGetDate(72), 13], [handleGetDate(71), 15], [handleGetDate(70), 16], 
			[handleGetDate(69), 16], [handleGetDate(68), 14], [handleGetDate(67), 14], [handleGetDate(66), 13], 
			[handleGetDate(65), 12], [handleGetDate(64), 13], [handleGetDate(63), 13], [handleGetDate(62), 15], 
			[handleGetDate(61), 16], [handleGetDate(60), 16], [handleGetDate(59), 17], [handleGetDate(58), 17], 
			[handleGetDate(57), 18], [handleGetDate(56), 15], [handleGetDate(55), 15], [handleGetDate(54), 15], 
			[handleGetDate(53), 19], [handleGetDate(52), 19], [handleGetDate(51), 18], [handleGetDate(50), 18], 
			[handleGetDate(49), 17], [handleGetDate(48), 16], [handleGetDate(47), 18], [handleGetDate(46), 18], 
			[handleGetDate(45), 18], [handleGetDate(44), 16], [handleGetDate(43), 14], [handleGetDate(42), 14], 
			[handleGetDate(41), 13], [handleGetDate(40), 14], [handleGetDate(39), 13], [handleGetDate(38), 10], 
			[handleGetDate(37), 9 ], [handleGetDate(36), 10], [handleGetDate(35), 11], [handleGetDate(34), 11], 
			[handleGetDate(33), 11], [handleGetDate(32), 10], [handleGetDate(31), 9 ], [handleGetDate(30), 10], 
			[handleGetDate(29), 13], [handleGetDate(28), 14], [handleGetDate(27), 14], [handleGetDate(26), 13], 
			[handleGetDate(25), 12], [handleGetDate(24), 11], [handleGetDate(23), 13], [handleGetDate(22), 13], 
			[handleGetDate(21), 13], [handleGetDate(20), 13], [handleGetDate(19), 14], [handleGetDate(18), 13], 
			[handleGetDate(17), 13], [handleGetDate(16), 19], [handleGetDate(15), 21], [handleGetDate(14), 22],
			[handleGetDate(13), 25], [handleGetDate(12), 24], [handleGetDate(11), 24], [handleGetDate(10), 22], 
			[handleGetDate(9) , 16], [handleGetDate(8) , 15], [handleGetDate(7) , 12], [handleGetDate(6) , 12], 
			[handleGetDate(5) , 15], [handleGetDate(4) , 15], [handleGetDate(3) , 15], [handleGetDate(2) , 18], 
			[handleGetDate(2) , 18], [handleGetDate(0) , 17]
		] 
	}];
	var visitorChartOptions = {
		colors: ['#00acac', '#348fe2'],
		fill: { opacity: .75, type: 'solid' },
		legend: {
			position: 'top',
			horizontalAlign: 'right',
			offsetY: 15,
			offsetX: 500,
			labels: { colors: '#ffffff' }
		},
		xaxis: {
			type: 'datetime',
			tickAmount: 6,
			labels: { style: { colors: '#ffffff' } }
		},
		yaxis: { labels: { style: { colors: '#ffffff' } } },
		tooltip: { y: { formatter: function (val) { return "$ " + val + " thousands" } } },
		chart: { height: '100%', type: 'area', toolbar: { show: false }, stacked: true },
		plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
		dataLabels: { enabled: false },
		grid: { 
			show: true, borderColor: 'rgba(255,255,255, .15)',
			xaxis: { lines: { show: true } },   
			yaxis: { lines: { show: true } },
			padding: { top: -40, right: 3, bottom: 0, left: 10 }
		},
		stroke: {  show: false, curve: 'straight' }
	};
	
	var totalSalesChartOptions = {
		chart: {
			type: 'line',
			width: 200,
			height: 36,
			sparkline: { enabled: true },
			stacked: true
		},
		stroke: { curve: 'smooth', width: 3 },
		fill: {
			type: 'gradient',
			gradient: {
				opacityFrom: 1,
				opacityTo: 1,
				colorStops: [
					{ offset: 0, color: blue, opacity: 1 }, 
					{ offset: 100, color: indigo, opacity: 1 }
				]
			},
		},
		tooltip: {
			theme: 'dark',
			fixed: { enabled: false },
			x: { show: false },
			y: {
				title: { formatter: function (seriesName) { return '' } },
				formatter: (value) => { return '$'+ convertNumberWithCommas(value) },
			},
			marker: { show: false }
		},
		responsive: [
			{ breakpoint: 3000, options: { chart: { width: 130 } } },
			{ breakpoint: 1300, options: { chart: { width: 100 } } },
			{ breakpoint: 1200, options: { chart: { width: 200 } } },
			{ breakpoint: 576, options: { chart: { width: 180 } } },
			{ breakpoint: 400, options: { chart: { width: 120 } } }
		]
	};
	var totalSalesChartSeries = [{
		data: [9452.37, 11018.87, 7296.37, 6274.29, 7924.05, 6581.34, 12918.14]
	}];
	
	var conversionRateChartOptions = {
		chart: {
			type: 'line',
			width: 160,
			height: 28,
			sparkline: { enabled: true }
		},
		stroke: { curve: 'smooth', width: 3 },
		fill: {
			type: 'gradient',
			gradient: {
				opacityFrom: 1,
				opacityTo: 1,
				colorStops: [
				{ offset: 0, color: red, opacity: 1 },
				{ offset: 50, color: orange, opacity: 1 },
				{ offset: 100, color: lime, opacity: 1 }]
			},
		},
		labels: ['Jun 23', 'Jun 24', 'Jun 25', 'Jun 26', 'Jun 27', 'Jun 28', 'Jun 29'],
		xaxis: { crosshairs: { width: 1 } },
		tooltip: {
			theme: 'dark',
			fixed: { enabled: false },
			x: { show: false },
			y: {
				title: { formatter: function (seriesName) { return '' } },
				formatter: (value) => { return value + '%' },
			},
			marker: { show: false }
		},
		responsive: [
			{ breakpoint: 3000, options: { chart: { width: 120 } } },
			{ breakpoint: 1300, options: { chart: { width: 100 } } },
			{ breakpoint: 1200, options: { chart: { width: 160 } } },
			{ breakpoint: 900, options: { chart: { width: 120 } } },
			{ breakpoint: 576, options: { chart: { width: 180 } } },
			{ breakpoint: 400, options: { chart: { width: 120 } } }
		]
	};
	var conversionRateChartSeries = [{
		data: [2.68, 2.93, 2.04, 1.61, 1.88, 1.62, 2.80]
	}];
	
	var storeSessionChartOptions = {
		chart: {
			type: 'line',
			width: 160,
			height: 28,
			sparkline: { enabled: true },
			stacked: false
		},
		stroke: { curve: 'smooth', width: 3 },
		fill: {
			type: 'gradient',
			gradient: {
				opacityFrom: 1,
				opacityTo: 1,
				colorStops: [
					{ offset: 0, color: teal, opacity: 1 },
					{ offset: 50, color: blue, opacity: 1 },
					{ offset: 100, color: cyan, opacity: 1 }
				]
			},
		},
		labels: ['Jun 23', 'Jun 24', 'Jun 25', 'Jun 26', 'Jun 27', 'Jun 28', 'Jun 29'],
		xaxis: { crosshairs: { width: 1 } },
		tooltip: {
			theme: 'dark',
			fixed: { enabled: false },
			x: { show: false },
			y: {
				title: { formatter: function (seriesName) { return '' } },
				formatter: (value) => { return convertNumberWithCommas(value) },
			},
			marker: { show: false }
		},
		responsive: [
			{ breakpoint: 3000, options: { chart: { width: 120 } } },
			{ breakpoint: 1300, options: { chart: { width: 100 } } },
			{ breakpoint: 1200, options: { chart: { width: 160 } } },
			{ breakpoint: 900, options: { chart: { width: 120 } } },
			{ breakpoint: 576, options: { chart: { width: 180 } } },
			{ breakpoint: 400, options: { chart: { width: 120 } } }
		]
	};
	var storeSessionChartSeries = [{
		data: [10812, 11393, 7311, 6834, 9612, 11200, 13557]
	}];
	
	function renderMap() {
		var theme = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
		var gray600 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-600')).trim();
		var white = (getComputedStyle(document.body).getPropertyValue('--bs-white')).trim();
		var bodyFontFamily = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
		const map = document.getElementById('jvectorMap');
		const mapElm = document.querySelectorAll('.jvm-tooltip');
		
		if (map) {
			for (let i = 0; i < mapElm.length; i++) {
				mapElm[i].remove();
			}
			map.innerHTML = '';
		
			var markers = [
				{ name: "Egypt", coords: [26.8206, 30.8025] },
				{ name: "Russia", coords: [61.524, 105.3188] },
				{ name: "Canada", coords: [56.1304, -106.3468] },
				{ name: "Greenland", coords: [71.7069, -42.6043] },
				{ name: "Brazil", coords: [-14.235, -51.9253] }
			];
			new jsVectorMap({
				selector: '#jvectorMap',
				map: 'world',
				zoomButtons: false,
				normalizeFunction: 'polynomial',
				hoverOpacity: 0.5,
				hoverColor: false,
				zoomOnScroll: false,
				series: {
					regions: [{
						normalizeFunction: 'polynomial'
					}]
				},
				labels: {
					markers: {
						render: (marker) => marker.name
					}
				},
				focusOn: {
					x: 0.5,
					y: 0.5,
					scale: 1
				},
				markers: markers,
				markerStyle: {
					initial: {
						fill: theme,
						stroke: 'none',
						r: 5,
					},
					hover: {
						fill: theme
					}
				},
				markerLabelStyle: {
					initial: {
						fontFamily: bodyFontFamily,
						fontSize: '12px',
						fill: white
					},
				},
				regionStyle: {
					initial: {
						fill: gray600,
						fillOpacity: .5,
						stroke: 'none',
						strokeWidth: 0.4,
						strokeOpacity: 1
					},
					hover: {
						fillOpacity: 1
					}
				},
				backgroundColor: 'transparent',
			});
		}
	}
	
	useEffect(() => {
    // eslint-diable-next-line
    renderMap();
    
		const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
		if (popoverTriggerList) {
			popoverTriggerList.map(function(elm) {
				new bootstrap.Popover(elm);
				return true;
			});
		}
	}, []);
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/dashboard/v3">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/dashboard/v3">Dashboard</Link></li>
				<li className="breadcrumb-item active">Dashboard v3</li>
			</ol>
			<h1 className="page-header mb-3">Dashboard v3</h1>
			<div className="d-sm-flex align-items-center mb-3">
				<DateRangePicker startDate={startDate} endDate={endDate} onApply={handleDateApplyEvent}>
					<button className="btn btn-inverse me-2 text-truncate">
						<i className="fa fa-calendar fa-fw text-white text-opacity-50 ms-n1 me-1"></i> 
						<span>{dateRange.currentWeek}</span>
						<b className="caret ms-1 opacity-5"></b>
					</button>
				</DateRangePicker>
				<div className="text-gray-600 fw-bold mt-2 mt-sm-0">compared to <span>{dateRange.prevWeek}</span></div>
			</div>
			<div className="row">
				<div className="col-xl-6">
					<div className="card border-0 mb-3 overflow-hidden bg-gray-800 text-white">
						<div className="card-body">
							<div className="row">
								<div className="col-xl-7 col-lg-8">
									<div className="mb-3 text-gray-500">
										<b>TOTAL SALES</b>
										<span className="ms-2">
											<i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Total sales" data-bs-placement="top" data-bs-content="Net sales (gross sales minus discounts and returns) plus taxes and shipping. Includes orders from all sales channels."></i>
										</span>
									</div>
									<div className="d-flex mb-1">
										<h2 className="mb-0">$64,559.25</h2>
										<div className="ms-auto mt-n1 mb-n1">
											<Chart type="line" height={'36px'} width="100" options={totalSalesChartOptions} series={totalSalesChartSeries} />
										</div>
									</div>
									<div className="mb-3 text-gray-500">
										<i className="fa fa-caret-up"></i> 33.21% compare to last week
									</div>
									<hr className="bg-white-transparent-2" />
									<div className="row text-truncate">
										<div className="col-6">
											<div className="fs-12px text-gray-500">Total sales order</div>
											<div className="fs-18px mb-5px fw-bold">1,568</div>
											<div className="progress h-5px rounded-3 bg-gray-900 mb-5px">
												<div className="progress-bar progress-bar-striped rounded-right bg-teal" style={{width: '55%'}}></div>
											</div>
										</div>
										<div className="col-6">
											<div className="fs-12px text-gray-500">Avg. sales per order</div>
											<div className="fs-18px mb-5px fw-bold">$41.20</div>
											<div className="progress h-5px rounded-3 bg-gray-900 mb-5px">
												<div className="progress-bar progress-bar-striped rounded-right" style={{width: '55%'}}></div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-5 col-lg-4 align-items-center d-flex justify-content-center">
									<img src="/assets/img/svg/img-1.svg" alt="" height="150px" className="d-none d-lg-block" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="row">
						<div className="col-sm-6">
							<div className="card border-0 text-truncate mb-3 bg-gray-800 text-white">
								<div className="card-body">
									<div className="mb-3 text-gray-500">
										<b className="mb-3">CONVERSION RATE</b> 
										<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Conversion Rate" data-bs-placement="top" data-bs-content="Percentage of sessions that resulted in orders from total number of sessions." data-original-title="" title=""></i></span>
									</div>
									<div className="d-flex align-items-center mb-1">
										<h2 className="text-white mb-0">2.19%</h2>
										<div className="ms-auto">
											<Chart type="line" height={'28px'} options={conversionRateChartOptions} series={conversionRateChartSeries} />
										</div>
									</div>
									<div className="mb-4 text-gray-500 ">
										<i className="fa fa-caret-down"></i> 0.50% compare to last week
									</div>
									<div className="d-flex mb-2">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-red fs-8px me-2"></i>
											Added to cart
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 262%</div>
											<div className="w-50px text-end ps-2 fw-bold">3.79%</div>
										</div>
									</div>
									<div className="d-flex mb-2">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-warning fs-8px me-2"></i>
											Reached checkout
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 11%</div>
											<div className="w-50px text-end ps-2 fw-bold">3.85%</div>
										</div>
									</div>
									<div className="d-flex">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-lime fs-8px me-2"></i>
											Sessions converted
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 57%</div>
											<div className="w-50px text-end ps-2 fw-bold">2.19%</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="card border-0 text-truncate mb-3 bg-gray-800 text-white">
								<div className="card-body">
									<div className="mb-3 text-gray-500">
										<b className="mb-3">STORE SESSIONS</b> 
										<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Store Sessions" data-bs-placement="top" data-bs-content="Number of sessions on your online store. A session is a period of continuous activity from a visitor." data-original-title="" title=""></i></span>
									</div>
									<div className="d-flex align-items-center mb-1">
										<h2 className="text-white mb-0">70,719</h2>
										<div className="ms-auto">
											<Chart type="line" height={'28px'} options={storeSessionChartOptions} series={storeSessionChartSeries} />
										</div>
									</div>
									<div className="mb-4 text-gray-500 ">
										<i className="fa fa-caret-up"></i> 9.5% compare to last week
									</div>
									<div className="d-flex mb-2">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-teal fs-8px me-2"></i>
											Mobile
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 25.7%</div>
											<div className="w-50px text-end ps-2 fw-bold">53,210</div>
										</div>
									</div>
									<div className="d-flex mb-2">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-blue fs-8px me-2"></i>
											Desktop
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 16.0%</div>
											<div className="w-50px text-end ps-2 fw-bold">11,959</div>
										</div>
									</div>
									<div className="d-flex">
										<div className="d-flex align-items-center">
											<i className="fa fa-circle text-aqua fs-8px me-2"></i>
											Tablet
										</div>
										<div className="d-flex align-items-center ms-auto">
											<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 7.9%</div>
											<div className="w-50px text-end ps-2 fw-bold">5,545</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-8 col-lg-6">
					<div className="card border-0 mb-3 bg-gray-800 text-white">
						<div className="card-body">
							<div className="mb-3 text-gray-500">
								<b>VISITORS ANALYTICS</b>
								<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Top products with units sold" data-bs-placement="top" data-bs-content="Products with the most individual units sold. Includes orders from all sales channels." data-original-title="" title=""></i></span>
							</div>
							<div className="row">
								<div className="col-xl-3 col-4">
									<h3 className="mb-1">127.1K</h3>
									<div>New Visitors</div>
									<div className="text-gray-500 small text-truncate"><i className="fa fa-caret-up"></i> 25.5% from previous 7 days</div>
								</div>
								<div className="col-xl-3 col-4">
									<h3 className="mb-1">179.9K</h3>
									<div>Returning Visitors</div>
									<div className="text-gray-500 small text-truncate"><i className="fa fa-caret-up"></i> 5.33% from previous 7 days</div>
								</div>
								<div className="col-xl-3 col-4">
									<h3 className="mb-1">766.8K</h3>
									<div>Total Page Views</div>
									<div className="text-gray-500 small text-truncate"><i className="fa fa-caret-up"></i> 0.323% from previous 7 days</div>
								</div>
							</div>
						</div>
						<div className="card-body p-0">
							<div style={{height: '269px'}}>
								<div className="widget-chart-full-width pe-4" data-bs-theme="dark" style={{height: '254px'}}>
									<Chart type="area" height="254" width="100%" options={visitorChartOptions} series={visitorChartSeries} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-4 col-lg-6">
					<div className="card bg-gray-800 border-0 text-white mb-3">
						<div className="card-body">
							<div className="mb-2 text-grey">
								<b>SESSION BY LOCATION</b>
								<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Total sales" data-bs-placement="top" data-bs-content="Net sales (gross sales minus discounts and returns) plus taxes and shipping. Includes orders from all sales channels."></i></span>
							</div>
							<div className="mb-3" style={{height: '192px'}}>
								<div id="jvectorMap" style={{height: '192px'}}></div>
							</div>
							<div>
								<div className="d-flex align-items-center text-white mb-2">
									<div className="widget-img widget-img-xs rounded bg-inverse me-2 w-40px" style={{backgroundImage: 'url(/assets/img/flag/us.jpg)'}}></div>
									<div className="d-flex w-100">
										<div>United States</div>
										<div className="ms-auto text-gray-500">39.85%</div>
									</div>
								</div>
								<div className="d-flex align-items-center text-white mb-2">
									<div className="widget-img widget-img-xs rounded bg-inverse me-2 w-40px" style={{backgroundImage: 'url(/assets/img/flag/cn.jpg)'}}></div>
									<div className="d-flex w-100">
										<div>China</div>
										<div className="ms-auto text-gray-500">14.23%</div>
									</div>
								</div>
								<div className="d-flex align-items-center text-white mb-2">
									<div className="widget-img widget-img-xs rounded bg-inverse me-2 w-40px" style={{backgroundImage: 'url(/assets/img/flag/de.jpg)'}}></div>
									<div className="d-flex w-100">
										<div>Germany</div>
										<div className="ms-auto text-gray-500">12.83%</div>
									</div>
								</div>
								<div className="d-flex align-items-center text-white mb-2">
									<div className="widget-img widget-img-xs rounded bg-inverse me-2 w-40px" style={{backgroundImage: 'url(/assets/img/flag/fr.jpg)'}}></div>
									<div className="d-flex w-100">
										<div>France</div>
										<div className="ms-auto text-gray-500">11.14%</div>
									</div>
								</div>
								<div className="d-flex align-items-center text-white mb-0">
									<div className="widget-img widget-img-xs rounded bg-inverse me-2 w-40px" style={{backgroundImage: 'url(/assets/img/flag/jp.jpg)'}}></div>
									<div className="d-flex w-100">
										<div>Japan</div>
										<div className="ms-auto text-gray-500">10.75%</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-4 col-lg-6">
					<div className="card border-0 mb-3 bg-gray-900 text-white">
						<div className="card-body" style={{ background: 'no-repeat bottom right', backgroundImage: 'url(/assets/img/svg/img-4.svg)', backgroundSize: 'auto 60%'}}>
							<div className="mb-3 text-gray-500 ">
								<b>SALES BY SOCIAL SOURCE</b>
								<span className="text-gray-500 ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Sales by social source" data-bs-placement="top" data-bs-content="Total online store sales that came from a social referrer source."></i></span>
							</div>
							<h3 className="mb-10px">$55,547.89</h3>
							<div className="text-gray-500 mb-1px"><i className="fa fa-caret-up"></i> 45.76% increased</div>
						</div>
						<div className="widget-list rounded-bottom" data-bs-theme="dark">
							<Link to="/dashboard/v3" className="widget-list-item rounded-0 pt-3px">
								<div className="widget-list-media icon">
									<i className="fab fa-apple bg-indigo text-white"></i>
								</div>
								<div className="widget-list-content">
									<div className="widget-list-title">Apple Store</div>
								</div>
								<div className="widget-list-action text-nowrap text-gray-500">
									$34,840.17
								</div>
							</Link>
							<Link to="/dashboard/v3" className="widget-list-item">
								<div className="widget-list-media icon">
									<i className="fab fa-facebook-f bg-blue text-white"></i>
								</div>
								<div className="widget-list-content">
									<div className="widget-list-title">Facebook</div>
								</div>
								<div className="widget-list-action text-nowrap text-gray-500">
									$12,502.67
								</div>
							</Link>
							<Link to="/dashboard/v3" className="widget-list-item">
								<div className="widget-list-media icon">
									<i className="fab fa-twitter bg-info text-white"></i>
								</div>
								<div className="widget-list-content">
									<div className="widget-list-title">Twitter</div>
								</div>
								<div className="widget-list-action text-nowrap text-gray-500">
									$4,799.20
								</div>
							</Link>
							<Link to="/dashboard/v3" className="widget-list-item">
								<div className="widget-list-media icon">
									<i className="fab fa-google bg-red text-white"></i>
								</div>
								<div className="widget-list-content">
									<div className="widget-list-title">Google Adwords</div>
								</div>
								<div className="widget-list-action text-nowrap text-gray-500">
									$3,405.85
								</div>
							</Link>
							<Link to="/dashboard/v3" className="widget-list-item pb-3px rounded-bottom">
								<div className="widget-list-media icon">
									<i className="fab fa-instagram bg-pink text-white"></i>
								</div>
								<div className="widget-list-content">
									<div className="widget-list-title">Instagram</div>
								</div>
								<div className="widget-list-action text-nowrap text-gray-500">
									$0.00
								</div>
							</Link>
						</div>
					</div>
				</div>
				<div className="col-xl-4 col-lg-6">
					<div className="card border-0 mb-3 bg-gray-800 text-white">
						<div className="card-body">
							<div className="mb-3 text-gray-500">
								<b>TOP PRODUCTS BY UNITS SOLD</b>
								<span className="ms-2 "><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Top products with units sold" data-bs-placement="top" data-bs-content="Products with the most individual units sold. Includes orders from all sales channels."></i></span>
							</div>
							<div className="d-flex align-items-center mb-15px">
								<div className="widget-img rounded-3 me-10px bg-white p-3px w-30px">
									<div className="h-100 w-100" style={{background: 'url(/assets/img/product/product-8.jpg) center no-repeat', backgroundSize: 'auto 100%'}}></div>
								</div>
								<div className="text-truncate">
									<div>Apple iPhone XR (2024)</div>
									<div className="text-gray-500">$799.00</div>
								</div>
								<div className="ms-auto text-center">
									<div className="fs-13px">195</div>
									<div className="text-gray-500 fs-10px">sold</div>
								</div>
							</div>
							<div className="d-flex align-items-center mb-15px">
								<div className="widget-img rounded-3 me-10px bg-white p-3px w-30px">
									<div className="h-100 w-100" style={{background: 'url(/assets/img/product/product-9.jpg) center no-repeat', backgroundSize: 'auto 100%'}}></div>
								</div>
								<div className="text-truncate">
									<div>Apple iPhone XS (2024)</div>
									<div className="text-gray-500">$1,199.00</div>
								</div>
								<div className="ms-auto text-center">
									<div className="fs-13px">185</div>
									<div className="text-gray-500 fs-10px">sold</div>
								</div>
							</div>
							<div className="d-flex align-items-center mb-15px">
								<div className="widget-img rounded-3 me-10px bg-white p-3px w-30px">
									<div className="h-100 w-100" style={{background: 'url(/assets/img/product/product-10.jpg) center no-repeat', backgroundSize: 'auto 100%'}}></div>
								</div>
								<div className="text-truncate">
									<div>Apple iPhone XS Max (2024)</div>
									<div className="text-gray-500">$3,399</div>
								</div>
								<div className="ms-auto text-center">
									<div className="fs-13px">129</div>
									<div className="text-gray-500 fs-10px">sold</div>
								</div>
							</div>
							<div className="d-flex align-items-center mb-15px">
								<div className="widget-img rounded-3 me-10px bg-white p-3px w-30px">
									<div className="h-100 w-100" style={{background: 'url(/assets/img/product/product-11.jpg) center no-repeat', backgroundSize: 'auto 100%'}}></div>
								</div>
								<div className="text-truncate">
									<div>Huawei Y5 (2024)</div>
									<div className="text-gray-500">$99.00</div>
								</div>
								<div className="ms-auto text-center">
									<div className="fs-13px">96</div>
									<div className="text-gray-500 fs-10px">sold</div>
								</div>
							</div>
							<div className="d-flex align-items-center">
								<div className="widget-img rounded-3 me-10px bg-white p-3px w-30px">
									<div className="h-100 w-100" style={{background: 'url(/assets/img/product/product-12.jpg) center no-repeat', backgroundSize: 'auto 100%'}}></div>
								</div>
								<div className="text-truncate">
									<div>Huawei Nova 4 (2024)</div>
									<div className="text-gray-500">$499.00</div>
								</div>
								<div className="ms-auto text-center">
									<div className="fs-13px">55</div>
									<div className="text-gray-500 fs-10px">sold</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-4 col-lg-6">
					<div className="card border-0 mb-3 bg-gray-800 text-white">
						<div className="card-body">
							<div className="mb-3 text-gray-500">
								<b>MARKETING CAMPAIGN</b>
								<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Marketing Campaign" data-bs-placement="top" data-bs-content="Campaign that run for getting more returning customers."></i></span>
							</div>
							<div className="row align-items-center pb-1px">
								<div className="col-4">
									<div className="h-100px d-flex align-items-center justify-content-center">
										<img src="/assets/img/svg/img-2.svg" alt="" className="mw-100 mh-100" />
									</div>
								</div>
								<div className="col-8">
									<div className="mb-2px text-truncate">Email Marketing Campaign</div>
									<div className="mb-2px  text-gray-500  fs-11px">Mon 12/6 - Sun 18/6</div>
									<div className="d-flex align-items-center mb-2px">
										<div className="flex-grow-1">
											<div className="progress h-5px rounded-pill bg-white bg-opacity-10">
												<div className="progress-bar progress-bar-striped bg-indigo" style={{width: '80%'}}></div>
											</div>
										</div>
										<div className="ms-2 fs-11px w-30px text-center">80%</div>
									</div>
									<div className="text-gray-500 small mb-15px text-truncate">
										57.5% people click the email
									</div>
									<Link to="/dashboard/v3" className="btn btn-xs btn-indigo fs-10px ps-2 pe-2">View campaign</Link>
								</div>
							</div>
							<hr className="bg-white-transparent-2 mt-20px mb-20px" />
							<div className="row align-items-center">
								<div className="col-4">
									<div className="h-100px d-flex align-items-center justify-content-center">
										<img src="/assets/img/svg/img-3.svg" alt="" className="mw-100 mh-100" />
									</div>
								</div>
								<div className="col-8">
									<div className="mb-2px text-truncate">Facebook Marketing Campaign</div>
									<div className="mb-2px  text-gray-500  fs-11px">Sat 10/6 - Sun 18/6</div>
									<div className="d-flex align-items-center mb-2px">
										<div className="flex-grow-1">
											<div className="progress h-5px rounded-pill bg-white bg-opacity-10">
												<div className="progress-bar progress-bar-striped bg-warning" style={{width: '60%'}}></div>
											</div>
										</div>
										<div className="ms-2 fs-11px w-30px text-center">60%</div>
									</div>
									<div className="text-gray-500 small mb-15px text-truncate">
										+124k visitors from facebook
									</div>
									<Link to="/dashboard/v3" className="btn btn-xs btn-warning fs-10px ps-2 pe-2">View campaign</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
};

export default DashboardV3;