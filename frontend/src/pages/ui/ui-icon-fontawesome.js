import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import Highlight from 'react-highlight';

function UIIcons() {
	const [code1, setCode1] = useState();
	const [code2, setCode2] = useState();
	const [code3, setCode3] = useState();
	const [code4, setCode4] = useState();
	const [code5, setCode5] = useState();
	const [code6, setCode6] = useState();
	const [code7, setCode7] = useState();
	
	useEffect(() => {
		fetch('/assets/data/ui-icon-fontawesome/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		fetch('/assets/data/ui-icon-fontawesome/code-2.json').then(function(response) { return response.text(); }).then((html) => { setCode2(html); });
		fetch('/assets/data/ui-icon-fontawesome/code-3.json').then(function(response) { return response.text(); }).then((html) => { setCode3(html); });
		fetch('/assets/data/ui-icon-fontawesome/code-4.json').then(function(response) { return response.text(); }).then((html) => { setCode4(html); });
		fetch('/assets/data/ui-icon-fontawesome/code-5.json').then(function(response) { return response.text(); }).then((html) => { setCode5(html); });
		fetch('/assets/data/ui-icon-fontawesome/code-6.json').then(function(response) { return response.text(); }).then((html) => { setCode6(html); });
		fetch('/assets/data/ui-icon-fontawesome/code-7.json').then(function(response) { return response.text(); }).then((html) => { setCode7(html); });
	});
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/ui/icons">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/ui/icons">UI Elements</Link></li>
				<li className="breadcrumb-item active">Icons</li>
			</ol>
			<h1 className="page-header">FontAwesome <small>v6.6.0 with 2,000+ Free Icons</small></h1>
			
			<div className="row">
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>Icon Sizes</PanelHeader>
						<div className="alert alert-info rounded-0 mb-0">
							Font Awesome css has been <b>compiled</b> into <code>vendor.min.css</code>. As long as you include the <code>vendor.min.css</code>, you should be able to use Font Awesome in your page.
						</div>
						<PanelBody className="text-dark">
							<i className="fas fa-camera-retro fa-xs me-1"></i>
							<i className="fas fa-camera-retro fa-sm me-1"></i>
							<i className="fas fa-camera-retro fa-lg me-1"></i>
							<i className="fas fa-camera-retro fa-2x me-1"></i>
							<i className="fas fa-camera-retro fa-3x me-1"></i>
							<i className="fas fa-camera-retro fa-5x me-1"></i>
							<i className="fas fa-camera-retro fa-7x me-1"></i>
							<i className="fas fa-camera-retro fa-10x me-1"></i>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code1}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Fixed Width Icons</PanelHeader>
						<PanelBody className="fs-14px">
							<i className="fas fa-home fa-fw"></i> Home<br />
							<i className="fas fa-info fa-fw"></i> Info<br />
							<i className="fas fa-book fa-fw"></i> Library<br />
							<i className="fas fa-pencil-alt fa-fw"></i> Applications<br />
							<i className="fas fa-cog fa-fw"></i> Settings
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code2}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Animated Icons</PanelHeader>
						<PanelBody>
							<div className="fa-3x">
								<i className="fas fa-spinner fa-spin me-1"></i>
								<i className="fas fa-circle-notch fa-spin me-1"></i>
								<i className="fas fa-sync fa-spin me-1"></i>
								<i className="fas fa-cog fa-spin me-1"></i>
								<i className="fas fa-spinner fa-pulse"></i>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code3}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Power Transforms: Rotating & Flipping</PanelHeader>
						<PanelBody className="fs-14px">
							<div className="fa-3x">
								<i className="fas fa-arrow-alt-circle-right me-1"></i>
								<i className="fas fa-arrow-alt-circle-right fa-rotate-90"></i>
								<i className="fas fa-arrow-alt-circle-right fa-rotate-180"></i>
								<i className="fas fa-arrow-alt-circle-right fa-rotate-270"></i>
								<i className="fas fa-arrow-alt-circle-right fa-flip-horizontal"></i>
								<i className="fas fa-arrow-alt-circle-right fa-flip-vertical"></i>
							</div>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code4}</Highlight>
						</div>
					</Panel>
				</div>
				<div className="col-xl-6">
					<Panel>
						<PanelHeader>List Icons</PanelHeader>
						<PanelBody className="fs-14px">
							<ul className="fa-ul">
								<li><span className="fa-li"><i className="fas fa-check-square text-primary"></i></span>List icons can</li>
								<li><span className="fa-li"><i className="fas fa-check-square text-muted"></i></span>be used to</li>
								<li><span className="fa-li"><i className="fas fa-spinner fa-pulse text-success"></i></span>replace bullets</li>
								<li><span className="fa-li"><i className="far fa-square text-dark"></i></span>in lists</li>
							</ul>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code5}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Bordered & Pulled Icons</PanelHeader>
						<PanelBody className="fs-14px">
							<i className="fas fa-quote-left fa-3x float-start me-3 fa-border"></i>
							Gatsby believed in the green light, the orgastic future that year by year recedes before us.
							It eluded us then, but that’s no matter — tomorrow we will run faster, stretch our arms further...
							And one fine morning — So we beat on, boats against the current, borne back ceaselessly into the past.
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code6}</Highlight>
						</div>
					</Panel>
					<Panel>
						<PanelHeader>Stacked Icons</PanelHeader>
						<PanelBody className="fs-14px">
							<span className="fa-stack fa-2x">
								<i className="far fa-square fa-stack-2x"></i>
								<i className="fab fa-twitter fa-stack-1x"></i>
							</span>
							<span className="fa-stack fa-2x">
								<i className="fa fa-circle fa-stack-2x"></i>
								<i className="fa fa-flag fa-stack-1x fa-inverse"></i>
							</span>
							<span className="fa-stack fa-2x">
								<i className="fa fa-square fa-stack-2x"></i>
								<i className="fa fa-terminal fa-stack-1x fa-inverse"></i>
							</span>
							<span className="fa-stack fa-2x">
								<i className="fa fa-camera fa-stack-1x"></i>
								<i className="fa fa-ban fa-stack-2x"></i>
							</span>
							<span className="fa-stack fa-2x">
								<i className="far fa-circle fa-stack-2x"></i>
								<i className="fa fa-cog fa-stack-1x"></i>
							</span>
						</PanelBody>
						<div className="hljs-wrapper">
							<Highlight className='html'>{code7}</Highlight>
						</div>
					</Panel>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-6">
					<h3 className="mb-10px"><b>Solid</b></h3>
					<p className="mb-20px">
						Solid type Font Awesome Icon prefix 
						<code>fas fa-*</code>
					</p>
					<div className="row mb-20px fs-13px">
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-0"></i> <span>0</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-1"></i> <span>1</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-2"></i> <span>2</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-3"></i> <span>3</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-4"></i> <span>4</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-5"></i> <span>5</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-6"></i> <span>6</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-7"></i> <span>7</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-8"></i> <span>8</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-9"></i> <span>9</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-a"></i> <span>a</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-address-book"></i> <span>address-book</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-address-card"></i> <span>address-card</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-align-center"></i> <span>align-center</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-align-justify"></i> <span>align-justify</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-align-left"></i> <span>align-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-align-right"></i> <span>align-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-anchor"></i> <span>anchor</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-angle-down"></i> <span>angle-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-angle-left"></i> <span>angle-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-angle-right"></i> <span>angle-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-angle-up"></i> <span>angle-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-angles-down"></i> <span>angles-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-angles-left"></i> <span>angles-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-angles-right"></i> <span>angles-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-angles-up"></i> <span>angles-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ankh"></i> <span>ankh</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-apple-whole"></i> <span>apple-whole</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-archway"></i> <span>archway</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-down"></i> <span>arrow-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-down-1-9"></i> <span>arrow-down-1-9</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-down-9-1"></i> <span>arrow-down-9-1</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-down-a-z"></i> <span>arrow-down-a-z</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-down-short-wide"></i> <span>arrow-down-short-wide</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-down-wide-short"></i> <span>arrow-down-wide-short</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-down-z-a"></i> <span>arrow-down-z-a</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-left"></i> <span>arrow-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-pointer"></i> <span>arrow-pointer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-right"></i> <span>arrow-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-rotate-left"></i> <span>arrow-rotate-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-rotate-right"></i> <span>arrow-rotate-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-trend-down"></i> <span>arrow-trend-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-trend-up"></i> <span>arrow-trend-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-up"></i> <span>arrow-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-up-1-9"></i> <span>arrow-up-1-9</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-up-9-1"></i> <span>arrow-up-9-1</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-up-a-z"></i> <span>arrow-up-a-z</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-up-from-bracket"></i> <span>arrow-up-from-bracket</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-up-short-wide"></i> <span>arrow-up-short-wide</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-up-wide-short"></i> <span>arrow-up-wide-short</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrow-up-z-a"></i> <span>arrow-up-z-a</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-arrows-rotate"></i> <span>arrows-rotate</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-asterisk"></i> <span>asterisk</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-at"></i> <span>at</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-atom"></i> <span>atom</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-audio-description"></i> <span>audio-description</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-austral-sign"></i> <span>austral-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-award"></i> <span>award</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-b"></i> <span>b</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-baby"></i> <span>baby</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-baby-carriage"></i> <span>baby-carriage</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-backward"></i> <span>backward</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-backward-fast"></i> <span>backward-fast</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-backward-step"></i> <span>backward-step</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bacon"></i> <span>bacon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bacteria"></i> <span>bacteria</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bacterium"></i> <span>bacterium</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bag-shopping"></i> <span>bag-shopping</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bahai"></i> <span>bahai</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-baht-sign"></i> <span>baht-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ban"></i> <span>ban</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ban-smoking"></i> <span>ban-smoking</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bandage"></i> <span>bandage</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bank"></i> <span>bank</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-barcode"></i> <span>barcode</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bars"></i> <span>bars</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bars-staggered"></i> <span>bars-staggered</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-baseball"></i> <span>baseball</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-basket-shopping"></i> <span>basket-shopping</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-basketball"></i> <span>basketball</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bath"></i> <span>bath</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-battery-empty"></i> <span>battery-empty</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-battery-full"></i> <span>battery-full</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-battery-half"></i> <span>battery-half</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-battery-quarter"></i> <span>battery-quarter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-battery-three-quarters"></i> <span>battery-three-quarters</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bed"></i> <span>bed</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bed-pulse"></i> <span>bed-pulse</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-beer-mug-empty"></i> <span>beer-mug-empty</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bell"></i> <span>bell</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bell-concierge"></i> <span>bell-concierge</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bell-slash"></i> <span>bell-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bezier-curve"></i> <span>bezier-curve</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bicycle"></i> <span>bicycle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-binoculars"></i> <span>binoculars</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-biohazard"></i> <span>biohazard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bitcoin-sign"></i> <span>bitcoin-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-blender"></i> <span>blender</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-blender-phone"></i> <span>blender-phone</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-blog"></i> <span>blog</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bold"></i> <span>bold</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bolt"></i> <span>bolt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bomb"></i> <span>bomb</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bone"></i> <span>bone</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bong"></i> <span>bong</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-book"></i> <span>book</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-book-atlas"></i> <span>book-atlas</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-book-bible"></i> <span>book-bible</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-book-journal-whills"></i> <span>book-journal-whills</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-book-medical"></i> <span>book-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-book-open"></i> <span>book-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-book-open-reader"></i> <span>book-open-reader</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-book-quran"></i> <span>book-quran</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-book-skull"></i> <span>book-skull</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bookmark"></i> <span>bookmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-border-all"></i> <span>border-all</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-border-none"></i> <span>border-none</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-border-top-left"></i> <span>border-top-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bowling-ball"></i> <span>bowling-ball</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-box"></i> <span>box</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-box-archive"></i> <span>box-archive</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-box-open"></i> <span>box-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-box-tissue"></i> <span>box-tissue</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-boxes-stacked"></i> <span>boxes-stacked</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-braille"></i> <span>braille</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-brain"></i> <span>brain</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bread-slice"></i> <span>bread-slice</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-briefcase"></i> <span>briefcase</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-briefcase-medical"></i> <span>briefcase-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-broom"></i> <span>broom</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-brush"></i> <span>brush</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bug"></i> <span>bug</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-building"></i> <span>building</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bullhorn"></i> <span>bullhorn</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bullseye"></i> <span>bullseye</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-burger"></i> <span>burger</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bus"></i> <span>bus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-bus-simple"></i> <span>bus-simple</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-business-time"></i> <span>business-time</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-c"></i> <span>c</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cake-candles"></i> <span>cake-candles</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-calculator"></i> <span>calculator</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-calendar"></i> <span>calendar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-calendar-check"></i> <span>calendar-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-calendar-day"></i> <span>calendar-day</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-calendar-days"></i> <span>calendar-days</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-calendar-minus"></i> <span>calendar-minus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-calendar-plus"></i> <span>calendar-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-calendar-week"></i> <span>calendar-week</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-calendar-xmark"></i> <span>calendar-xmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-camera"></i> <span>camera</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-camera-retro"></i> <span>camera-retro</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-camera-rotate"></i> <span>camera-rotate</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-campground"></i> <span>campground</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-candy-cane"></i> <span>candy-cane</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cannabis"></i> <span>cannabis</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-capsules"></i> <span>capsules</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-car"></i> <span>car</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-car-battery"></i> <span>car-battery</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-car-crash"></i> <span>car-crash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-car-rear"></i> <span>car-rear</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-car-side"></i> <span>car-side</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-caravan"></i> <span>caravan</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-caret-down"></i> <span>caret-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-caret-left"></i> <span>caret-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-caret-right"></i> <span>caret-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-caret-up"></i> <span>caret-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-carrot"></i> <span>carrot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cart-arrow-down"></i> <span>cart-arrow-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cart-flatbed"></i> <span>cart-flatbed</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cart-flatbed-suitcase"></i> <span>cart-flatbed-suitcase</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cart-plus"></i> <span>cart-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cart-shopping"></i> <span>cart-shopping</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cash-register"></i> <span>cash-register</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cat"></i> <span>cat</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cedi-sign"></i> <span>cedi-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cent-sign"></i> <span>cent-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-certificate"></i> <span>certificate</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chair"></i> <span>chair</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chalkboard"></i> <span>chalkboard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chalkboard-user"></i> <span>chalkboard-user</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-champagne-glasses"></i> <span>champagne-glasses</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-charging-station"></i> <span>charging-station</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chart-area"></i> <span>chart-area</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chart-bar"></i> <span>chart-bar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chart-gantt"></i> <span>chart-gantt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chart-line"></i> <span>chart-line</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chart-pie"></i> <span>chart-pie</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-check"></i> <span>check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-check-double"></i> <span>check-double</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-check-to-slot"></i> <span>check-to-slot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cheese"></i> <span>cheese</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chess"></i> <span>chess</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chess-bishop"></i> <span>chess-bishop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chess-board"></i> <span>chess-board</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chess-king"></i> <span>chess-king</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chess-knight"></i> <span>chess-knight</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chess-pawn"></i> <span>chess-pawn</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chess-queen"></i> <span>chess-queen</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chess-rook"></i> <span>chess-rook</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chevron-down"></i> <span>chevron-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chevron-left"></i> <span>chevron-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chevron-right"></i> <span>chevron-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-chevron-up"></i> <span>chevron-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-child"></i> <span>child</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-church"></i> <span>church</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle"></i> <span>circle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-arrow-down"></i> <span>circle-arrow-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-arrow-left"></i> <span>circle-arrow-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-arrow-right"></i> <span>circle-arrow-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-arrow-up"></i> <span>circle-arrow-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-check"></i> <span>circle-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-chevron-down"></i> <span>circle-chevron-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-chevron-left"></i> <span>circle-chevron-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-chevron-right"></i> <span>circle-chevron-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-chevron-up"></i> <span>circle-chevron-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-dollar-to-slot"></i> <span>circle-dollar-to-slot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-dot"></i> <span>circle-dot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-down"></i> <span>circle-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-exclamation"></i> <span>circle-exclamation</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-h"></i> <span>circle-h</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-half-stroke"></i> <span>circle-half-stroke</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-info"></i> <span>circle-info</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-left"></i> <span>circle-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-minus"></i> <span>circle-minus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-notch"></i> <span>circle-notch</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-pause"></i> <span>circle-pause</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-play"></i> <span>circle-play</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-plus"></i> <span>circle-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-question"></i> <span>circle-question</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-radiation"></i> <span>circle-radiation</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-right"></i> <span>circle-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-stop"></i> <span>circle-stop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-up"></i> <span>circle-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-user"></i> <span>circle-user</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-circle-xmark"></i> <span>circle-xmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-city"></i> <span>city</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-clapperboard"></i> <span>clapperboard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-clipboard"></i> <span>clipboard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-clipboard-check"></i> <span>clipboard-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-clipboard-list"></i> <span>clipboard-list</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-clock"></i> <span>clock</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-clock-rotate-left"></i> <span>clock-rotate-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-clone"></i> <span>clone</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-closed-captioning"></i> <span>closed-captioning</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cloud"></i> <span>cloud</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cloud-arrow-down"></i> <span>cloud-arrow-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cloud-arrow-up"></i> <span>cloud-arrow-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cloud-meatball"></i> <span>cloud-meatball</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cloud-moon"></i> <span>cloud-moon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cloud-moon-rain"></i> <span>cloud-moon-rain</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cloud-rain"></i> <span>cloud-rain</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cloud-showers-heavy"></i> <span>cloud-showers-heavy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cloud-sun"></i> <span>cloud-sun</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cloud-sun-rain"></i> <span>cloud-sun-rain</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-clover"></i> <span>clover</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-code"></i> <span>code</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-code-branch"></i> <span>code-branch</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-code-commit"></i> <span>code-commit</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-code-compare"></i> <span>code-compare</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-code-fork"></i> <span>code-fork</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-code-merge"></i> <span>code-merge</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-code-pull-request"></i> <span>code-pull-request</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-coins"></i> <span>coins</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-colon-sign"></i> <span>colon-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-comment"></i> <span>comment</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-comment-dollar"></i> <span>comment-dollar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-comment-dots"></i> <span>comment-dots</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-comment-medical"></i> <span>comment-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-comment-slash"></i> <span>comment-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-comment-sms"></i> <span>comment-sms</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-comments"></i> <span>comments</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-comments-dollar"></i> <span>comments-dollar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-compact-disc"></i> <span>compact-disc</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-compass"></i> <span>compass</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-compass-drafting"></i> <span>compass-drafting</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-compress"></i> <span>compress</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-computer-mouse"></i> <span>computer-mouse</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cookie"></i> <span>cookie</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cookie-bite"></i> <span>cookie-bite</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-copy"></i> <span>copy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-copyright"></i> <span>copyright</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-couch"></i> <span>couch</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-credit-card"></i> <span>credit-card</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-crop"></i> <span>crop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-crop-simple"></i> <span>crop-simple</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cross"></i> <span>cross</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-crosshairs"></i> <span>crosshairs</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-crow"></i> <span>crow</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-crown"></i> <span>crown</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-crutch"></i> <span>crutch</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cruzeiro-sign"></i> <span>cruzeiro-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cube"></i> <span>cube</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-cubes"></i> <span>cubes</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-d"></i> <span>d</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-database"></i> <span>database</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-delete-left"></i> <span>delete-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-democrat"></i> <span>democrat</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-desktop"></i> <span>desktop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dharmachakra"></i> <span>dharmachakra</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-diagram-project"></i> <span>diagram-project</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-diamond-turn-right"></i> <span>diamond-turn-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dice"></i> <span>dice</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dice-d20"></i> <span>dice-d20</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dice-d6"></i> <span>dice-d6</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dice-five"></i> <span>dice-five</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dice-four"></i> <span>dice-four</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dice-one"></i> <span>dice-one</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dice-six"></i> <span>dice-six</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dice-three"></i> <span>dice-three</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dice-two"></i> <span>dice-two</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-disease"></i> <span>disease</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-divide"></i> <span>divide</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dna"></i> <span>dna</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dog"></i> <span>dog</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dollar-sign"></i> <span>dollar-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dolly"></i> <span>dolly</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dong-sign"></i> <span>dong-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-door-closed"></i> <span>door-closed</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-door-open"></i> <span>door-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dove"></i> <span>dove</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-down-left-and-up-right-to-center"></i> <span>down-left-and-up-right-to-center</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-down-long"></i> <span>down-long</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-download"></i> <span>download</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dragon"></i> <span>dragon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-draw-polygon"></i> <span>draw-polygon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-droplet"></i> <span>droplet</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-droplet-slash"></i> <span>droplet-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-drum"></i> <span>drum</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-drum-steelpan"></i> <span>drum-steelpan</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-drumstick-bite"></i> <span>drumstick-bite</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dumbbell"></i> <span>dumbbell</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dumpster"></i> <span>dumpster</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dumpster-fire"></i> <span>dumpster-fire</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-dungeon"></i> <span>dungeon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-e"></i> <span>e</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ear-deaf"></i> <span>ear-deaf</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ear-listen"></i> <span>ear-listen</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-earth-africa"></i> <span>earth-africa</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-earth-americas"></i> <span>earth-americas</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-earth-asia"></i> <span>earth-asia</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-earth-europa"></i> <span>earth-europa</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-egg"></i> <span>egg</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-eject"></i> <span>eject</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-elevator"></i> <span>elevator</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ellipsis"></i> <span>ellipsis</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ellipsis-vertical"></i> <span>ellipsis-vertical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-envelope"></i> <span>envelope</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-envelope-open"></i> <span>envelope-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-envelope-open-text"></i> <span>envelope-open-text</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-envelopes-bulk"></i> <span>envelopes-bulk</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-equals"></i> <span>equals</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-eraser"></i> <span>eraser</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ethernet"></i> <span>ethernet</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-euro-sign"></i> <span>euro-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-exclamation"></i> <span>exclamation</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-expand"></i> <span>expand</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-eye"></i> <span>eye</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-eye-dropper"></i> <span>eye-dropper</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-eye-low-vision"></i> <span>eye-low-vision</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-eye-slash"></i> <span>eye-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-f"></i> <span>f</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-angry"></i> <span>face-angry</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-dizzy"></i> <span>face-dizzy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-flushed"></i> <span>face-flushed</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-frown"></i> <span>face-frown</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-frown-open"></i> <span>face-frown-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grimace"></i> <span>face-grimace</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin"></i> <span>face-grin</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-beam"></i> <span>face-grin-beam</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-beam-sweat"></i> <span>face-grin-beam-sweat</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-hearts"></i> <span>face-grin-hearts</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-squint"></i> <span>face-grin-squint</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-squint-tears"></i> <span>face-grin-squint-tears</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-stars"></i> <span>face-grin-stars</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-tears"></i> <span>face-grin-tears</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-tongue"></i> <span>face-grin-tongue</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-tongue-squint"></i> <span>face-grin-tongue-squint</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-tongue-wink"></i> <span>face-grin-tongue-wink</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-wide"></i> <span>face-grin-wide</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-grin-wink"></i> <span>face-grin-wink</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-kiss"></i> <span>face-kiss</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-kiss-beam"></i> <span>face-kiss-beam</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-kiss-wink-heart"></i> <span>face-kiss-wink-heart</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-laugh"></i> <span>face-laugh</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-laugh-beam"></i> <span>face-laugh-beam</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-laugh-squint"></i> <span>face-laugh-squint</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-laugh-wink"></i> <span>face-laugh-wink</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-meh"></i> <span>face-meh</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-meh-blank"></i> <span>face-meh-blank</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-rolling-eyes"></i> <span>face-rolling-eyes</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-sad-cry"></i> <span>face-sad-cry</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-sad-tear"></i> <span>face-sad-tear</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-smile"></i> <span>face-smile</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-smile-beam"></i> <span>face-smile-beam</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-smile-wink"></i> <span>face-smile-wink</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-surprise"></i> <span>face-surprise</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-face-tired"></i> <span>face-tired</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-fan"></i> <span>fan</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-faucet"></i> <span>faucet</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-fax"></i> <span>fax</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-feather"></i> <span>feather</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-feather-pointed"></i> <span>feather-pointed</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file"></i> <span>file</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-arrow-down"></i> <span>file-arrow-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-arrow-up"></i> <span>file-arrow-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-audio"></i> <span>file-audio</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-code"></i> <span>file-code</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-contract"></i> <span>file-contract</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-csv"></i> <span>file-csv</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-excel"></i> <span>file-excel</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-export"></i> <span>file-export</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-image"></i> <span>file-image</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-import"></i> <span>file-import</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-invoice"></i> <span>file-invoice</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-invoice-dollar"></i> <span>file-invoice-dollar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-lines"></i> <span>file-lines</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-medical"></i> <span>file-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-pdf"></i> <span>file-pdf</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-powerpoint"></i> <span>file-powerpoint</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-prescription"></i> <span>file-prescription</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-signature"></i> <span>file-signature</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-video"></i> <span>file-video</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-waveform"></i> <span>file-waveform</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-word"></i> <span>file-word</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-file-zipper"></i> <span>file-zipper</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-fill"></i> <span>fill</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-fill-drip"></i> <span>fill-drip</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-film"></i> <span>film</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-filter"></i> <span>filter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-filter-circle-dollar"></i> <span>filter-circle-dollar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-filter-circle-xmark"></i> <span>filter-circle-xmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-fingerprint"></i> <span>fingerprint</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-fire"></i> <span>fire</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-fire-extinguisher"></i> <span>fire-extinguisher</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-fire-flame-curved"></i> <span>fire-flame-curved</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-fire-flame-simple"></i> <span>fire-flame-simple</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-fish"></i> <span>fish</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-flag"></i> <span>flag</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-flag-checkered"></i> <span>flag-checkered</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-flag-usa"></i> <span>flag-usa</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-flask"></i> <span>flask</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-floppy-disk"></i> <span>floppy-disk</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-florin-sign"></i> <span>florin-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-folder"></i> <span>folder</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-folder-minus"></i> <span>folder-minus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-folder-open"></i> <span>folder-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-folder-plus"></i> <span>folder-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-folder-tree"></i> <span>folder-tree</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-font"></i> <span>font</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-font-awesome"></i> <span>font-awesome</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-football"></i> <span>football</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-forward"></i> <span>forward</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-forward-fast"></i> <span>forward-fast</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-forward-step"></i> <span>forward-step</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-franc-sign"></i> <span>franc-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-frog"></i> <span>frog</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-futbol"></i> <span>futbol</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-g"></i> <span>g</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gamepad"></i> <span>gamepad</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gas-pump"></i> <span>gas-pump</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gauge-simple"></i> <span>gauge-simple</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gavel"></i> <span>gavel</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gear"></i> <span>gear</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gears"></i> <span>gears</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gem"></i> <span>gem</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-genderless"></i> <span>genderless</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ghost"></i> <span>ghost</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gift"></i> <span>gift</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gifts"></i> <span>gifts</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-glasses"></i> <span>glasses</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-globe"></i> <span>globe</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-golf-ball-tee"></i> <span>golf-ball-tee</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gopuram"></i> <span>gopuram</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-graduation-cap"></i> <span>graduation-cap</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-greater-than"></i> <span>greater-than</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-greater-than-equal"></i> <span>greater-than-equal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-grip"></i> <span>grip</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-grip-lines"></i> <span>grip-lines</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-grip-lines-vertical"></i> <span>grip-lines-vertical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-grip-vertical"></i> <span>grip-vertical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-guarani-sign"></i> <span>guarani-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-guitar"></i> <span>guitar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-gun"></i> <span>gun</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-h"></i> <span>h</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hammer"></i> <span>hammer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hamsa"></i> <span>hamsa</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand"></i> <span>hand</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-back-fist"></i> <span>hand-back-fist</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-dots"></i> <span>hand-dots</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-fist"></i> <span>hand-fist</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-holding"></i> <span>hand-holding</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-holding-dollar"></i> <span>hand-holding-dollar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-holding-droplet"></i> <span>hand-holding-droplet</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-holding-heart"></i> <span>hand-holding-heart</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-holding-medical"></i> <span>hand-holding-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-lizard"></i> <span>hand-lizard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-middle-finger"></i> <span>hand-middle-finger</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-peace"></i> <span>hand-peace</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-point-down"></i> <span>hand-point-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-point-left"></i> <span>hand-point-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-point-right"></i> <span>hand-point-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-point-up"></i> <span>hand-point-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-pointer"></i> <span>hand-pointer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-scissors"></i> <span>hand-scissors</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-sparkles"></i> <span>hand-sparkles</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hand-spock"></i> <span>hand-spock</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hands"></i> <span>hands</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hands-asl-interpreting"></i> <span>hands-asl-interpreting</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hands-bubbles"></i> <span>hands-bubbles</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hands-clapping"></i> <span>hands-clapping</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hands-holding"></i> <span>hands-holding</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hands-praying"></i> <span>hands-praying</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-handshake"></i> <span>handshake</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-handshake-angle"></i> <span>handshake-angle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-handshake-simple-slash"></i> <span>handshake-simple-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-handshake-slash"></i> <span>handshake-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hanukiah"></i> <span>hanukiah</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hard-drive"></i> <span>hard-drive</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hashtag"></i> <span>hashtag</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hat-cowboy"></i> <span>hat-cowboy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hat-cowboy-side"></i> <span>hat-cowboy-side</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hat-wizard"></i> <span>hat-wizard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-head-side-cough"></i> <span>head-side-cough</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-head-side-cough-slash"></i> <span>head-side-cough-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-head-side-mask"></i> <span>head-side-mask</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-head-side-virus"></i> <span>head-side-virus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-heading"></i> <span>heading</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-headphones"></i> <span>headphones</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-headphones-simple"></i> <span>headphones-simple</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-headset"></i> <span>headset</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-heart"></i> <span>heart</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-heart-crack"></i> <span>heart-crack</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-heart-pulse"></i> <span>heart-pulse</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-helicopter"></i> <span>helicopter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-helmet-safety"></i> <span>helmet-safety</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-highlighter"></i> <span>highlighter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hippo"></i> <span>hippo</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hockey-puck"></i> <span>hockey-puck</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-holly-berry"></i> <span>holly-berry</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-horse"></i> <span>horse</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-horse-head"></i> <span>horse-head</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hospital"></i> <span>hospital</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hospital-user"></i> <span>hospital-user</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hospital-wide"></i> <span>hospital-wide</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hot-tub-person"></i> <span>hot-tub-person</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hotdog"></i> <span>hotdog</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hotel"></i> <span>hotel</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hourglass"></i> <span>hourglass</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hourglass-empty"></i> <span>hourglass-empty</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hourglass-end"></i> <span>hourglass-end</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hourglass-start"></i> <span>hourglass-start</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-house"></i> <span>house</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-house-chimney"></i> <span>house-chimney</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-house-crack"></i> <span>house-crack</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-house-laptop"></i> <span>house-laptop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-house-medical"></i> <span>house-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-house-user"></i> <span>house-user</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-hryvnia-sign"></i> <span>hryvnia-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-i"></i> <span>i</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-i-cursor"></i> <span>i-cursor</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ice-cream"></i> <span>ice-cream</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-icicles"></i> <span>icicles</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-icons"></i> <span>icons</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-id-badge"></i> <span>id-badge</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-id-card"></i> <span>id-card</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-id-card-clip"></i> <span>id-card-clip</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-igloo"></i> <span>igloo</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-image"></i> <span>image</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-image-portrait"></i> <span>image-portrait</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-images"></i> <span>images</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-inbox"></i> <span>inbox</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-indent"></i> <span>indent</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-indian-rupee-sign"></i> <span>indian-rupee-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-industry"></i> <span>industry</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-infinity"></i> <span>infinity</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-info"></i> <span>info</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-italic"></i> <span>italic</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-j"></i> <span>j</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-jedi"></i> <span>jedi</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-jet-fighter"></i> <span>jet-fighter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-joint"></i> <span>joint</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-k"></i> <span>k</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-kaaba"></i> <span>kaaba</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-key"></i> <span>key</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-keyboard"></i> <span>keyboard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-khanda"></i> <span>khanda</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-kip-sign"></i> <span>kip-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-kit-medical"></i> <span>kit-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-kiwi-bird"></i> <span>kiwi-bird</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-l"></i> <span>l</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-landmark"></i> <span>landmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-language"></i> <span>language</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-laptop"></i> <span>laptop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-laptop-code"></i> <span>laptop-code</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-laptop-medical"></i> <span>laptop-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-lari-sign"></i> <span>lari-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-layer-group"></i> <span>layer-group</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-leaf"></i> <span>leaf</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-left-long"></i> <span>left-long</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-left-right"></i> <span>left-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-lemon"></i> <span>lemon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-less-than"></i> <span>less-than</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-less-than-equal"></i> <span>less-than-equal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-life-ring"></i> <span>life-ring</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-lightbulb"></i> <span>lightbulb</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-link"></i> <span>link</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-link-slash"></i> <span>link-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-lira-sign"></i> <span>lira-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-list"></i> <span>list</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-list-check"></i> <span>list-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-list-ol"></i> <span>list-ol</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-list-ul"></i> <span>list-ul</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-litecoin-sign"></i> <span>litecoin-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-location-arrow"></i> <span>location-arrow</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-location-crosshairs"></i> <span>location-crosshairs</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-location-dot"></i> <span>location-dot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-location-pin"></i> <span>location-pin</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-lock"></i> <span>lock</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-lock-open"></i> <span>lock-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-lungs"></i> <span>lungs</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-lungs-virus"></i> <span>lungs-virus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-m"></i> <span>m</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-magnet"></i> <span>magnet</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-magnifying-glass"></i> <span>magnifying-glass</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-magnifying-glass-dollar"></i> <span>magnifying-glass-dollar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-magnifying-glass-location"></i> <span>magnifying-glass-location</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-magnifying-glass-minus"></i> <span>magnifying-glass-minus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-magnifying-glass-plus"></i> <span>magnifying-glass-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-manat-sign"></i> <span>manat-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-map"></i> <span>map</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-map-location"></i> <span>map-location</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-map-location-dot"></i> <span>map-location-dot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-map-pin"></i> <span>map-pin</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-marker"></i> <span>marker</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mars"></i> <span>mars</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mars-and-venus"></i> <span>mars-and-venus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mars-double"></i> <span>mars-double</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mars-stroke"></i> <span>mars-stroke</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mars-stroke-right"></i> <span>mars-stroke-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mars-stroke-up"></i> <span>mars-stroke-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-martini-glass"></i> <span>martini-glass</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-martini-glass-citrus"></i> <span>martini-glass-citrus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-martini-glass-empty"></i> <span>martini-glass-empty</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mask"></i> <span>mask</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mask-face"></i> <span>mask-face</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-masks-theater"></i> <span>masks-theater</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-maximize"></i> <span>maximize</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-medal"></i> <span>medal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-memory"></i> <span>memory</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-menorah"></i> <span>menorah</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mercury"></i> <span>mercury</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-message"></i> <span>message</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-meteor"></i> <span>meteor</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-microchip"></i> <span>microchip</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-microphone"></i> <span>microphone</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-microphone-lines"></i> <span>microphone-lines</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-microphone-lines-slash"></i> <span>microphone-lines-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-microphone-slash"></i> <span>microphone-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-microscope"></i> <span>microscope</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mill-sign"></i> <span>mill-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-minimize"></i> <span>minimize</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-minus"></i> <span>minus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mitten"></i> <span>mitten</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mobile-button"></i> <span>mobile-button</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mobile-screen-button"></i> <span>mobile-screen-button</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-money-bill"></i> <span>money-bill</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-money-bill-1"></i> <span>money-bill-1</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-money-bill-1-wave"></i> <span>money-bill-1-wave</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-money-bill-wave"></i> <span>money-bill-wave</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-money-check"></i> <span>money-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-money-check-dollar"></i> <span>money-check-dollar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-monument"></i> <span>monument</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-moon"></i> <span>moon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mortar-pestle"></i> <span>mortar-pestle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mosque"></i> <span>mosque</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-motorcycle"></i> <span>motorcycle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mountain"></i> <span>mountain</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mug-hot"></i> <span>mug-hot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-mug-saucer"></i> <span>mug-saucer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-music"></i> <span>music</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-n"></i> <span>n</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-naira-sign"></i> <span>naira-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-network-wired"></i> <span>network-wired</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-neuter"></i> <span>neuter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-newspaper"></i> <span>newspaper</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-not-equal"></i> <span>not-equal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-note-sticky"></i> <span>note-sticky</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-notes-medical"></i> <span>notes-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-o"></i> <span>o</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-object-group"></i> <span>object-group</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-object-ungroup"></i> <span>object-ungroup</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-oil-can"></i> <span>oil-can</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-om"></i> <span>om</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-otter"></i> <span>otter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-outdent"></i> <span>outdent</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-p"></i> <span>p</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pager"></i> <span>pager</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-paint-brush"></i> <span>paint-brush</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-paint-roller"></i> <span>paint-roller</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-palette"></i> <span>palette</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pallet"></i> <span>pallet</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-panorama"></i> <span>panorama</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-paper-plane"></i> <span>paper-plane</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-paperclip"></i> <span>paperclip</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-parachute-box"></i> <span>parachute-box</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-paragraph"></i> <span>paragraph</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-passport"></i> <span>passport</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-paste"></i> <span>paste</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pause"></i> <span>pause</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-paw"></i> <span>paw</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-peace"></i> <span>peace</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pen"></i> <span>pen</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pen-clip"></i> <span>pen-clip</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pen-fancy"></i> <span>pen-fancy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pen-nib"></i> <span>pen-nib</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pen-ruler"></i> <span>pen-ruler</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pen-to-square"></i> <span>pen-to-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pencil"></i> <span>pencil</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-people-arrows-left-right"></i> <span>people-arrows-left-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-people-carry-box"></i> <span>people-carry-box</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pepper-hot"></i> <span>pepper-hot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-percent"></i> <span>percent</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person"></i> <span>person</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-biking"></i> <span>person-biking</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-booth"></i> <span>person-booth</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-dots-from-line"></i> <span>person-dots-from-line</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-dress"></i> <span>person-dress</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-hiking"></i> <span>person-hiking</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-praying"></i> <span>person-praying</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-running"></i> <span>person-running</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-skating"></i> <span>person-skating</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-skiing"></i> <span>person-skiing</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-skiing-nordic"></i> <span>person-skiing-nordic</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-snowboarding"></i> <span>person-snowboarding</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-swimming"></i> <span>person-swimming</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-walking"></i> <span>person-walking</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-person-walking-with-cane"></i> <span>person-walking-with-cane</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-peseta-sign"></i> <span>peseta-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-peso-sign"></i> <span>peso-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-phone"></i> <span>phone</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-phone-flip"></i> <span>phone-flip</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-phone-slash"></i> <span>phone-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-phone-volume"></i> <span>phone-volume</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-photo-film"></i> <span>photo-film</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-piggy-bank"></i> <span>piggy-bank</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pills"></i> <span>pills</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pizza-slice"></i> <span>pizza-slice</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-place-of-worship"></i> <span>place-of-worship</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-plane"></i> <span>plane</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-plane-arrival"></i> <span>plane-arrival</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-plane-departure"></i> <span>plane-departure</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-plane-slash"></i> <span>plane-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-play"></i> <span>play</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-plug"></i> <span>plug</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-plus"></i> <span>plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-plus-minus"></i> <span>plus-minus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-podcast"></i> <span>podcast</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-poo"></i> <span>poo</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-poo-storm"></i> <span>poo-storm</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-poop"></i> <span>poop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-power-off"></i> <span>power-off</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-prescription"></i> <span>prescription</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-prescription-bottle"></i> <span>prescription-bottle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-prescription-bottle-medical"></i> <span>prescription-bottle-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-print"></i> <span>print</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pump-medical"></i> <span>pump-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-pump-soap"></i> <span>pump-soap</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-puzzle-piece"></i> <span>puzzle-piece</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-q"></i> <span>q</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-qrcode"></i> <span>qrcode</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-question"></i> <span>question</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-quidditch"></i> <span>quidditch</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-quote-left"></i> <span>quote-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-quote-right"></i> <span>quote-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-r"></i> <span>r</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-radiation"></i> <span>radiation</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-rainbow"></i> <span>rainbow</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-receipt"></i> <span>receipt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-record-vinyl"></i> <span>record-vinyl</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-rectangle-ad"></i> <span>rectangle-ad</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-rectangle-list"></i> <span>rectangle-list</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-rectangle-xmark"></i> <span>rectangle-xmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-recycle"></i> <span>recycle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-registered"></i> <span>registered</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-repeat"></i> <span>repeat</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-reply"></i> <span>reply</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-reply-all"></i> <span>reply-all</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-republican"></i> <span>republican</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-restroom"></i> <span>restroom</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-retweet"></i> <span>retweet</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ribbon"></i> <span>ribbon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-right-from-bracket"></i> <span>right-from-bracket</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-right-left"></i> <span>right-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-right-long"></i> <span>right-long</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-right-to-bracket"></i> <span>right-to-bracket</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ring"></i> <span>ring</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-road"></i> <span>road</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-robot"></i> <span>robot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-rocket"></i> <span>rocket</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-rotate"></i> <span>rotate</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-rotate-left"></i> <span>rotate-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-route"></i> <span>route</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-rss"></i> <span>rss</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ruble-sign"></i> <span>ruble-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ruler"></i> <span>ruler</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ruler-combined"></i> <span>ruler-combined</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ruler-horizontal"></i> <span>ruler-horizontal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ruler-vertical"></i> <span>ruler-vertical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-rupee-sign"></i> <span>rupee-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-rupiah-sign"></i> <span>rupiah-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-s"></i> <span>s</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sailboat"></i> <span>sailboat</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-satellite"></i> <span>satellite</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-satellite-dish"></i> <span>satellite-dish</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-scale-balanced"></i> <span>scale-balanced</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-scale-unbalanced"></i> <span>scale-unbalanced</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-scale-unbalanced-flip"></i> <span>scale-unbalanced-flip</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-school"></i> <span>school</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-scissors"></i> <span>scissors</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-screwdriver"></i> <span>screwdriver</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-screwdriver-wrench"></i> <span>screwdriver-wrench</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-scroll"></i> <span>scroll</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-scroll-torah"></i> <span>scroll-torah</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sd-card"></i> <span>sd-card</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-section"></i> <span>section</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-seedling"></i> <span>seedling</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-server"></i> <span>server</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shapes"></i> <span>shapes</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-share"></i> <span>share</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-share-from-square"></i> <span>share-from-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-share-nodes"></i> <span>share-nodes</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shekel-sign"></i> <span>shekel-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shield-blank"></i> <span>shield-blank</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shield-virus"></i> <span>shield-virus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ship"></i> <span>ship</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shirt"></i> <span>shirt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shoe-prints"></i> <span>shoe-prints</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shop"></i> <span>shop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shop-slash"></i> <span>shop-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shower"></i> <span>shower</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shuffle"></i> <span>shuffle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-shuttle-space"></i> <span>shuttle-space</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sign-hanging"></i> <span>sign-hanging</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-signal"></i> <span>signal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-signature"></i> <span>signature</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-signs-post"></i> <span>signs-post</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sim-card"></i> <span>sim-card</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sink"></i> <span>sink</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sitemap"></i> <span>sitemap</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-skull"></i> <span>skull</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-skull-crossbones"></i> <span>skull-crossbones</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-slash"></i> <span>slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sleigh"></i> <span>sleigh</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sliders"></i> <span>sliders</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-smog"></i> <span>smog</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-smoking"></i> <span>smoking</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-snowflake"></i> <span>snowflake</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-snowman"></i> <span>snowman</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-snowplow"></i> <span>snowplow</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-soap"></i> <span>soap</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-socks"></i> <span>socks</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-solar-panel"></i> <span>solar-panel</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sort"></i> <span>sort</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sort-down"></i> <span>sort-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sort-up"></i> <span>sort-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-spa"></i> <span>spa</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-spaghetti-monster-flying"></i> <span>spaghetti-monster-flying</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-spell-check"></i> <span>spell-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-spider"></i> <span>spider</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-spinner"></i> <span>spinner</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-splotch"></i> <span>splotch</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-spoon"></i> <span>spoon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-spray-can"></i> <span>spray-can</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-spray-can-sparkles"></i> <span>spray-can-sparkles</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square"></i> <span>square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-caret-down"></i> <span>square-caret-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-caret-left"></i> <span>square-caret-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-caret-right"></i> <span>square-caret-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-caret-up"></i> <span>square-caret-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-check"></i> <span>square-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-envelope"></i> <span>square-envelope</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-full"></i> <span>square-full</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-h"></i> <span>square-h</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-minus"></i> <span>square-minus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-parking"></i> <span>square-parking</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-pen"></i> <span>square-pen</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-phone"></i> <span>square-phone</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-phone-flip"></i> <span>square-phone-flip</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-plus"></i> <span>square-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-poll-horizontal"></i> <span>square-poll-horizontal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-poll-vertical"></i> <span>square-poll-vertical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-root-variable"></i> <span>square-root-variable</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-rss"></i> <span>square-rss</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-share-nodes"></i> <span>square-share-nodes</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-square-up-right"></i> <span>square-up-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-stairs"></i> <span>stairs</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-stamp"></i> <span>stamp</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-star"></i> <span>star</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-star-and-crescent"></i> <span>star-and-crescent</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-star-half"></i> <span>star-half</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-star-half-stroke"></i> <span>star-half-stroke</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-star-of-david"></i> <span>star-of-david</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-star-of-life"></i> <span>star-of-life</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sterling-sign"></i> <span>sterling-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-stethoscope"></i> <span>stethoscope</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-stop"></i> <span>stop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-stopwatch"></i> <span>stopwatch</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-stopwatch-20"></i> <span>stopwatch-20</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-store"></i> <span>store</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-store-slash"></i> <span>store-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-street-view"></i> <span>street-view</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-strikethrough"></i> <span>strikethrough</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-stroopwafel"></i> <span>stroopwafel</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-subscript"></i> <span>subscript</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-suitcase"></i> <span>suitcase</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-suitcase-medical"></i> <span>suitcase-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-suitcase-rolling"></i> <span>suitcase-rolling</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-sun"></i> <span>sun</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-superscript"></i> <span>superscript</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-swatchbook"></i> <span>swatchbook</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-synagogue"></i> <span>synagogue</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-syringe"></i> <span>syringe</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-t"></i> <span>t</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-table"></i> <span>table</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-table-cells"></i> <span>table-cells</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-table-cells-large"></i> <span>table-cells-large</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-table-columns"></i> <span>table-columns</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-table-list"></i> <span>table-list</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-table-tennis-paddle-ball"></i> <span>table-tennis-paddle-ball</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tablet-button"></i> <span>tablet-button</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tablet-screen-button"></i> <span>tablet-screen-button</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tablets"></i> <span>tablets</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tachograph-digital"></i> <span>tachograph-digital</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tag"></i> <span>tag</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tags"></i> <span>tags</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tape"></i> <span>tape</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-taxi"></i> <span>taxi</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-teeth"></i> <span>teeth</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-teeth-open"></i> <span>teeth-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-temperature-empty"></i> <span>temperature-empty</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-temperature-full"></i> <span>temperature-full</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-temperature-half"></i> <span>temperature-half</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-temperature-high"></i> <span>temperature-high</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-temperature-low"></i> <span>temperature-low</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-temperature-quarter"></i> <span>temperature-quarter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-temperature-three-quarters"></i> <span>temperature-three-quarters</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tenge-sign"></i> <span>tenge-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-terminal"></i> <span>terminal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-text-height"></i> <span>text-height</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-text-slash"></i> <span>text-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-text-width"></i> <span>text-width</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-thermometer"></i> <span>thermometer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-thumbs-down"></i> <span>thumbs-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-thumbs-up"></i> <span>thumbs-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-thumbtack"></i> <span>thumbtack</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-ticket-simple"></i> <span>ticket-simple</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-timeline"></i> <span>timeline</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-toggle-off"></i> <span>toggle-off</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-toggle-on"></i> <span>toggle-on</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-toilet"></i> <span>toilet</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-toilet-paper"></i> <span>toilet-paper</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-toilet-paper-slash"></i> <span>toilet-paper-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-toolbox"></i> <span>toolbox</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tooth"></i> <span>tooth</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-torii-gate"></i> <span>torii-gate</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tower-broadcast"></i> <span>tower-broadcast</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tractor"></i> <span>tractor</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-trademark"></i> <span>trademark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-traffic-light"></i> <span>traffic-light</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-trailer"></i> <span>trailer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-train"></i> <span>train</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-train-subway"></i> <span>train-subway</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-train-tram"></i> <span>train-tram</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-transgender"></i> <span>transgender</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-trash"></i> <span>trash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-trash-arrow-up"></i> <span>trash-arrow-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-trash-can"></i> <span>trash-can</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-trash-can-arrow-up"></i> <span>trash-can-arrow-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tree"></i> <span>tree</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-triangle-exclamation"></i> <span>triangle-exclamation</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-trophy"></i> <span>trophy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-truck"></i> <span>truck</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-truck-fast"></i> <span>truck-fast</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-truck-medical"></i> <span>truck-medical</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-truck-monster"></i> <span>truck-monster</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-truck-moving"></i> <span>truck-moving</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-truck-pickup"></i> <span>truck-pickup</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-truck-ramp-box"></i> <span>truck-ramp-box</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tty"></i> <span>tty</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-turkish-lira-sign"></i> <span>turkish-lira-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-turn-down"></i> <span>turn-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-turn-up"></i> <span>turn-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-tv"></i> <span>tv</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-u"></i> <span>u</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-umbrella"></i> <span>umbrella</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-umbrella-beach"></i> <span>umbrella-beach</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-underline"></i> <span>underline</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-universal-access"></i> <span>universal-access</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-unlock"></i> <span>unlock</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-unlock-keyhole"></i> <span>unlock-keyhole</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-up-down"></i> <span>up-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-up-down-left-right"></i> <span>up-down-left-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-up-long"></i> <span>up-long</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-up-right-and-down-left-from-center"></i> <span>up-right-and-down-left-from-center</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-up-right-from-square"></i> <span>up-right-from-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-upload"></i> <span>upload</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user"></i> <span>user</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-astronaut"></i> <span>user-astronaut</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-check"></i> <span>user-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-clock"></i> <span>user-clock</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-doctor"></i> <span>user-doctor</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-gear"></i> <span>user-gear</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-graduate"></i> <span>user-graduate</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-group"></i> <span>user-group</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-injured"></i> <span>user-injured</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-large"></i> <span>user-large</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-large-slash"></i> <span>user-large-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-lock"></i> <span>user-lock</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-minus"></i> <span>user-minus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-ninja"></i> <span>user-ninja</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-nurse"></i> <span>user-nurse</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-pen"></i> <span>user-pen</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-plus"></i> <span>user-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-secret"></i> <span>user-secret</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-shield"></i> <span>user-shield</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-slash"></i> <span>user-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-tag"></i> <span>user-tag</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-tie"></i> <span>user-tie</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-user-xmark"></i> <span>user-xmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-users"></i> <span>users</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-users-gear"></i> <span>users-gear</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-users-slash"></i> <span>users-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-utensils"></i> <span>utensils</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-v"></i> <span>v</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-van-shuttle"></i> <span>van-shuttle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-vault"></i> <span>vault</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-vector-square"></i> <span>vector-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-venus"></i> <span>venus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-venus-double"></i> <span>venus-double</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-venus-mars"></i> <span>venus-mars</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-vest"></i> <span>vest</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-vest-patches"></i> <span>vest-patches</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-vial"></i> <span>vial</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-vials"></i> <span>vials</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-video"></i> <span>video</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-video-slash"></i> <span>video-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-vihara"></i> <span>vihara</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-virus"></i> <span>virus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-virus-slash"></i> <span>virus-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-viruses"></i> <span>viruses</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-voicemail"></i> <span>voicemail</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-volleyball"></i> <span>volleyball</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-volume-high"></i> <span>volume-high</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-volume-low"></i> <span>volume-low</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-volume-off"></i> <span>volume-off</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-volume-xmark"></i> <span>volume-xmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-vr-cardboard"></i> <span>vr-cardboard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-w"></i> <span>w</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-wallet"></i> <span>wallet</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-wand-magic"></i> <span>wand-magic</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-warehouse"></i> <span>warehouse</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-water"></i> <span>water</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-water-ladder"></i> <span>water-ladder</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-wave-square"></i> <span>wave-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-weight-hanging"></i> <span>weight-hanging</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-weight-scale"></i> <span>weight-scale</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-wheelchair"></i> <span>wheelchair</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-whiskey-glass"></i> <span>whiskey-glass</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-wifi"></i> <span>wifi</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-wind"></i> <span>wind</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-window-maximize"></i> <span>window-maximize</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-window-minimize"></i> <span>window-minimize</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-window-restore"></i> <span>window-restore</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-wine-bottle"></i> <span>wine-bottle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-wine-glass"></i> <span>wine-glass</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-wine-glass-empty"></i> <span>wine-glass-empty</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-won-sign"></i> <span>won-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-wrench"></i> <span>wrench</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-x"></i> <span>x</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-x-ray"></i> <span>x-ray</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-xmark"></i> <span>xmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-y"></i> <span>y</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-yen-sign"></i> <span>yen-sign</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-yin-yang"></i> <span>yin-yang</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fas fa-lg fa-fw me-10px fa-z"></i> <span>z</span></div>
					</div>
				</div>
				<div className="col-xl-6">
					<h3 className="mb-10px"><b>Regular</b></h3>
					<p className="mb-20px">
						Regular type Font Awesome Icon prefix 
						<code>far fa-*</code>
					</p>
					<div className="row mb-20px fs-13px">
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-address-book"></i> <span>address-book</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-address-card"></i> <span>address-card</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-bell"></i> <span>bell</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-bell-slash"></i> <span>bell-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-bookmark"></i> <span>bookmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-building"></i> <span>building</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-calendar"></i> <span>calendar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-calendar-check"></i> <span>calendar-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-calendar-days"></i> <span>calendar-days</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-calendar-minus"></i> <span>calendar-minus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-calendar-plus"></i> <span>calendar-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-calendar-xmark"></i> <span>calendar-xmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-chart-bar"></i> <span>chart-bar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-chess-bishop"></i> <span>chess-bishop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-chess-king"></i> <span>chess-king</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-chess-knight"></i> <span>chess-knight</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-chess-pawn"></i> <span>chess-pawn</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-chess-queen"></i> <span>chess-queen</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-chess-rook"></i> <span>chess-rook</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle"></i> <span>circle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-check"></i> <span>circle-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-dot"></i> <span>circle-dot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-down"></i> <span>circle-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-left"></i> <span>circle-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-pause"></i> <span>circle-pause</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-play"></i> <span>circle-play</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-question"></i> <span>circle-question</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-right"></i> <span>circle-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-stop"></i> <span>circle-stop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-up"></i> <span>circle-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-user"></i> <span>circle-user</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-circle-xmark"></i> <span>circle-xmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-clipboard"></i> <span>clipboard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-clock"></i> <span>clock</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-clone"></i> <span>clone</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-closed-captioning"></i> <span>closed-captioning</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-comment"></i> <span>comment</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-comment-dots"></i> <span>comment-dots</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-comments"></i> <span>comments</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-compass"></i> <span>compass</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-copy"></i> <span>copy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-copyright"></i> <span>copyright</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-credit-card"></i> <span>credit-card</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-envelope"></i> <span>envelope</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-envelope-open"></i> <span>envelope-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-eye"></i> <span>eye</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-eye-slash"></i> <span>eye-slash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-angry"></i> <span>face-angry</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-dizzy"></i> <span>face-dizzy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-flushed"></i> <span>face-flushed</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-frown"></i> <span>face-frown</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-frown-open"></i> <span>face-frown-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grimace"></i> <span>face-grimace</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin"></i> <span>face-grin</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-beam"></i> <span>face-grin-beam</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-beam-sweat"></i> <span>face-grin-beam-sweat</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-hearts"></i> <span>face-grin-hearts</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-squint"></i> <span>face-grin-squint</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-squint-tears"></i> <span>face-grin-squint-tears</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-stars"></i> <span>face-grin-stars</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-tears"></i> <span>face-grin-tears</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-tongue"></i> <span>face-grin-tongue</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-tongue-squint"></i> <span>face-grin-tongue-squint</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-tongue-wink"></i> <span>face-grin-tongue-wink</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-wide"></i> <span>face-grin-wide</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-grin-wink"></i> <span>face-grin-wink</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-kiss"></i> <span>face-kiss</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-kiss-beam"></i> <span>face-kiss-beam</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-kiss-wink-heart"></i> <span>face-kiss-wink-heart</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-laugh"></i> <span>face-laugh</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-laugh-beam"></i> <span>face-laugh-beam</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-laugh-squint"></i> <span>face-laugh-squint</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-laugh-wink"></i> <span>face-laugh-wink</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-meh"></i> <span>face-meh</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-meh-blank"></i> <span>face-meh-blank</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-rolling-eyes"></i> <span>face-rolling-eyes</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-sad-cry"></i> <span>face-sad-cry</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-sad-tear"></i> <span>face-sad-tear</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-smile"></i> <span>face-smile</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-smile-beam"></i> <span>face-smile-beam</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-smile-wink"></i> <span>face-smile-wink</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-surprise"></i> <span>face-surprise</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-face-tired"></i> <span>face-tired</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file"></i> <span>file</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file-audio"></i> <span>file-audio</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file-code"></i> <span>file-code</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file-excel"></i> <span>file-excel</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file-image"></i> <span>file-image</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file-lines"></i> <span>file-lines</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file-pdf"></i> <span>file-pdf</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file-powerpoint"></i> <span>file-powerpoint</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file-video"></i> <span>file-video</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file-word"></i> <span>file-word</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-file-zipper"></i> <span>file-zipper</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-flag"></i> <span>flag</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-floppy-disk"></i> <span>floppy-disk</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-folder"></i> <span>folder</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-folder-open"></i> <span>folder-open</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-font-awesome"></i> <span>font-awesome</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-futbol"></i> <span>futbol</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-gem"></i> <span>gem</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand"></i> <span>hand</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand-back-fist"></i> <span>hand-back-fist</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand-lizard"></i> <span>hand-lizard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand-peace"></i> <span>hand-peace</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand-point-down"></i> <span>hand-point-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand-point-left"></i> <span>hand-point-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand-point-right"></i> <span>hand-point-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand-point-up"></i> <span>hand-point-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand-pointer"></i> <span>hand-pointer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand-scissors"></i> <span>hand-scissors</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hand-spock"></i> <span>hand-spock</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-handshake"></i> <span>handshake</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hard-drive"></i> <span>hard-drive</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-heart"></i> <span>heart</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hospital"></i> <span>hospital</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-hourglass"></i> <span>hourglass</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-id-badge"></i> <span>id-badge</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-id-card"></i> <span>id-card</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-image"></i> <span>image</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-images"></i> <span>images</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-keyboard"></i> <span>keyboard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-lemon"></i> <span>lemon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-life-ring"></i> <span>life-ring</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-lightbulb"></i> <span>lightbulb</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-map"></i> <span>map</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-message"></i> <span>message</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-money-bill-1"></i> <span>money-bill-1</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-moon"></i> <span>moon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-newspaper"></i> <span>newspaper</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-note-sticky"></i> <span>note-sticky</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-object-group"></i> <span>object-group</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-object-ungroup"></i> <span>object-ungroup</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-paper-plane"></i> <span>paper-plane</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-pen-to-square"></i> <span>pen-to-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-rectangle-list"></i> <span>rectangle-list</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-rectangle-xmark"></i> <span>rectangle-xmark</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-registered"></i> <span>registered</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-share-from-square"></i> <span>share-from-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-snowflake"></i> <span>snowflake</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-square"></i> <span>square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-square-caret-down"></i> <span>square-caret-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-square-caret-left"></i> <span>square-caret-left</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-square-caret-right"></i> <span>square-caret-right</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-square-caret-up"></i> <span>square-caret-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-square-check"></i> <span>square-check</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-square-full"></i> <span>square-full</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-square-minus"></i> <span>square-minus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-square-plus"></i> <span>square-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-star"></i> <span>star</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-star-half"></i> <span>star-half</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-sun"></i> <span>sun</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-thumbs-down"></i> <span>thumbs-down</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-thumbs-up"></i> <span>thumbs-up</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-trash-can"></i> <span>trash-can</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-user"></i> <span>user</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-window-maximize"></i> <span>window-maximize</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-window-minimize"></i> <span>window-minimize</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="far fa-lg fa-fw me-10px fa-window-restore"></i> <span>window-restore</span></div>
					</div>
				
					<h3 className="mb-10px"><b>Brands</b></h3>
					<p className="mb-20px">
						Brand type Font Awesome Icon prefix 
						<code>fab fa-*</code>
					</p>
					<div className="row mb-20px fs-13px">
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-42-group"></i> <span>42-group</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-500px"></i> <span>500px</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-accessible-icon"></i> <span>accessible-icon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-accusoft"></i> <span>accusoft</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-acquisitions-incorporated"></i> <span>acquisitions-incorporated</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-adn"></i> <span>adn</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-adversal"></i> <span>adversal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-affiliatetheme"></i> <span>affiliatetheme</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-airbnb"></i> <span>airbnb</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-algolia"></i> <span>algolia</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-alipay"></i> <span>alipay</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-amazon"></i> <span>amazon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-amazon-pay"></i> <span>amazon-pay</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-amilia"></i> <span>amilia</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-android"></i> <span>android</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-angellist"></i> <span>angellist</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-angrycreative"></i> <span>angrycreative</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-angular"></i> <span>angular</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-app-store"></i> <span>app-store</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-app-store-ios"></i> <span>app-store-ios</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-apper"></i> <span>apper</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-apple"></i> <span>apple</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-apple-pay"></i> <span>apple-pay</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-artstation"></i> <span>artstation</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-asymmetrik"></i> <span>asymmetrik</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-atlassian"></i> <span>atlassian</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-audible"></i> <span>audible</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-autoprefixer"></i> <span>autoprefixer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-avianex"></i> <span>avianex</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-aviato"></i> <span>aviato</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-aws"></i> <span>aws</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-bandcamp"></i> <span>bandcamp</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-battle-net"></i> <span>battle-net</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-behance"></i> <span>behance</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-behance-square"></i> <span>behance-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-bilibili"></i> <span>bilibili</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-bimobject"></i> <span>bimobject</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-bitbucket"></i> <span>bitbucket</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-bitcoin"></i> <span>bitcoin</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-bity"></i> <span>bity</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-black-tie"></i> <span>black-tie</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-blackberry"></i> <span>blackberry</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-blogger"></i> <span>blogger</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-blogger-b"></i> <span>blogger-b</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-bluetooth"></i> <span>bluetooth</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-bluetooth-b"></i> <span>bluetooth-b</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-bootstrap"></i> <span>bootstrap</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-bots"></i> <span>bots</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-btc"></i> <span>btc</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-buffer"></i> <span>buffer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-buromobelexperte"></i> <span>buromobelexperte</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-buy-n-large"></i> <span>buy-n-large</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-buysellads"></i> <span>buysellads</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-canadian-maple-leaf"></i> <span>canadian-maple-leaf</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cc-amazon-pay"></i> <span>cc-amazon-pay</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cc-amex"></i> <span>cc-amex</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cc-apple-pay"></i> <span>cc-apple-pay</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cc-diners-club"></i> <span>cc-diners-club</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cc-discover"></i> <span>cc-discover</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cc-jcb"></i> <span>cc-jcb</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cc-mastercard"></i> <span>cc-mastercard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cc-paypal"></i> <span>cc-paypal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cc-stripe"></i> <span>cc-stripe</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cc-visa"></i> <span>cc-visa</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-centercode"></i> <span>centercode</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-centos"></i> <span>centos</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-chrome"></i> <span>chrome</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-chromecast"></i> <span>chromecast</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cloudflare"></i> <span>cloudflare</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cloudscale"></i> <span>cloudscale</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cloudsmith"></i> <span>cloudsmith</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cloudversify"></i> <span>cloudversify</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cmplid"></i> <span>cmplid</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-codepen"></i> <span>codepen</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-codiepie"></i> <span>codiepie</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-confluence"></i> <span>confluence</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-connectdevelop"></i> <span>connectdevelop</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-contao"></i> <span>contao</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cotton-bureau"></i> <span>cotton-bureau</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cpanel"></i> <span>cpanel</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons"></i> <span>creative-commons</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-by"></i> <span>creative-commons-by</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-nc"></i> <span>creative-commons-nc</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-nc-eu"></i> <span>creative-commons-nc-eu</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-nc-jp"></i> <span>creative-commons-nc-jp</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-nd"></i> <span>creative-commons-nd</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-pd"></i> <span>creative-commons-pd</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-pd-alt"></i> <span>creative-commons-pd-alt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-remix"></i> <span>creative-commons-remix</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-sa"></i> <span>creative-commons-sa</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-sampling"></i> <span>creative-commons-sampling</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-sampling-plus"></i> <span>creative-commons-sampling-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-share"></i> <span>creative-commons-share</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-creative-commons-zero"></i> <span>creative-commons-zero</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-critical-role"></i> <span>critical-role</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-css3"></i> <span>css3</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-css3-alt"></i> <span>css3-alt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-cuttlefish"></i> <span>cuttlefish</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-d-and-d"></i> <span>d-and-d</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-d-and-d-beyond"></i> <span>d-and-d-beyond</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-dailymotion"></i> <span>dailymotion</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-dashcube"></i> <span>dashcube</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-deezer"></i> <span>deezer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-delicious"></i> <span>delicious</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-deploydog"></i> <span>deploydog</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-deskpro"></i> <span>deskpro</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-dev"></i> <span>dev</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-deviantart"></i> <span>deviantart</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-dhl"></i> <span>dhl</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-diaspora"></i> <span>diaspora</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-digg"></i> <span>digg</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-digital-ocean"></i> <span>digital-ocean</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-discord"></i> <span>discord</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-discourse"></i> <span>discourse</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-dochub"></i> <span>dochub</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-docker"></i> <span>docker</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-draft2digital"></i> <span>draft2digital</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-dribbble"></i> <span>dribbble</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-dribbble-square"></i> <span>dribbble-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-dropbox"></i> <span>dropbox</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-drupal"></i> <span>drupal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-dyalog"></i> <span>dyalog</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-earlybirds"></i> <span>earlybirds</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ebay"></i> <span>ebay</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-edge"></i> <span>edge</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-edge-legacy"></i> <span>edge-legacy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-elementor"></i> <span>elementor</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ello"></i> <span>ello</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ember"></i> <span>ember</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-empire"></i> <span>empire</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-envira"></i> <span>envira</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-erlang"></i> <span>erlang</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ethereum"></i> <span>ethereum</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-etsy"></i> <span>etsy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-evernote"></i> <span>evernote</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-expeditedssl"></i> <span>expeditedssl</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-facebook"></i> <span>facebook</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-facebook-f"></i> <span>facebook-f</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-facebook-messenger"></i> <span>facebook-messenger</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-facebook-square"></i> <span>facebook-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-fantasy-flight-games"></i> <span>fantasy-flight-games</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-fedex"></i> <span>fedex</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-fedora"></i> <span>fedora</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-figma"></i> <span>figma</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-firefox"></i> <span>firefox</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-firefox-browser"></i> <span>firefox-browser</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-first-order"></i> <span>first-order</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-first-order-alt"></i> <span>first-order-alt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-firstdraft"></i> <span>firstdraft</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-flickr"></i> <span>flickr</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-flipboard"></i> <span>flipboard</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-fly"></i> <span>fly</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-font-awesome"></i> <span>font-awesome</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-fonticons"></i> <span>fonticons</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-fonticons-fi"></i> <span>fonticons-fi</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-fort-awesome"></i> <span>fort-awesome</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-fort-awesome-alt"></i> <span>fort-awesome-alt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-forumbee"></i> <span>forumbee</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-foursquare"></i> <span>foursquare</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-free-code-camp"></i> <span>free-code-camp</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-freebsd"></i> <span>freebsd</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-fulcrum"></i> <span>fulcrum</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-galactic-republic"></i> <span>galactic-republic</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-galactic-senate"></i> <span>galactic-senate</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-get-pocket"></i> <span>get-pocket</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-gg"></i> <span>gg</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-gg-circle"></i> <span>gg-circle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-git"></i> <span>git</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-git-alt"></i> <span>git-alt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-git-square"></i> <span>git-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-github"></i> <span>github</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-github-alt"></i> <span>github-alt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-github-square"></i> <span>github-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-gitkraken"></i> <span>gitkraken</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-gitlab"></i> <span>gitlab</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-gitter"></i> <span>gitter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-glide"></i> <span>glide</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-glide-g"></i> <span>glide-g</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-gofore"></i> <span>gofore</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-golang"></i> <span>golang</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-goodreads"></i> <span>goodreads</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-goodreads-g"></i> <span>goodreads-g</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-google"></i> <span>google</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-google-drive"></i> <span>google-drive</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-google-pay"></i> <span>google-pay</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-google-play"></i> <span>google-play</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-google-plus"></i> <span>google-plus</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-google-plus-g"></i> <span>google-plus-g</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-google-plus-square"></i> <span>google-plus-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-google-wallet"></i> <span>google-wallet</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-gratipay"></i> <span>gratipay</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-grav"></i> <span>grav</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-gripfire"></i> <span>gripfire</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-grunt"></i> <span>grunt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-guilded"></i> <span>guilded</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-gulp"></i> <span>gulp</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-hacker-news"></i> <span>hacker-news</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-hacker-news-square"></i> <span>hacker-news-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-hackerrank"></i> <span>hackerrank</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-hips"></i> <span>hips</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-hire-a-helper"></i> <span>hire-a-helper</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-hive"></i> <span>hive</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-hooli"></i> <span>hooli</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-hornbill"></i> <span>hornbill</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-hotjar"></i> <span>hotjar</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-houzz"></i> <span>houzz</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-html5"></i> <span>html5</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-hubspot"></i> <span>hubspot</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ideal"></i> <span>ideal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-imdb"></i> <span>imdb</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-instagram"></i> <span>instagram</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-instagram-square"></i> <span>instagram-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-instalod"></i> <span>instalod</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-intercom"></i> <span>intercom</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-internet-explorer"></i> <span>internet-explorer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-invision"></i> <span>invision</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ioxhost"></i> <span>ioxhost</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-itch-io"></i> <span>itch-io</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-itunes"></i> <span>itunes</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-itunes-note"></i> <span>itunes-note</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-java"></i> <span>java</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-jedi-order"></i> <span>jedi-order</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-jenkins"></i> <span>jenkins</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-jira"></i> <span>jira</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-joget"></i> <span>joget</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-joomla"></i> <span>joomla</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-js"></i> <span>js</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-js-square"></i> <span>js-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-jsfiddle"></i> <span>jsfiddle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-kaggle"></i> <span>kaggle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-keybase"></i> <span>keybase</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-keycdn"></i> <span>keycdn</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-kickstarter"></i> <span>kickstarter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-kickstarter-k"></i> <span>kickstarter-k</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-korvue"></i> <span>korvue</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-laravel"></i> <span>laravel</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-lastfm"></i> <span>lastfm</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-lastfm-square"></i> <span>lastfm-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-leanpub"></i> <span>leanpub</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-less"></i> <span>less</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-line"></i> <span>line</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-linkedin"></i> <span>linkedin</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-linkedin-in"></i> <span>linkedin-in</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-linode"></i> <span>linode</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-linux"></i> <span>linux</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-lyft"></i> <span>lyft</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-magento"></i> <span>magento</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-mailchimp"></i> <span>mailchimp</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-mandalorian"></i> <span>mandalorian</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-markdown"></i> <span>markdown</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-mastodon"></i> <span>mastodon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-maxcdn"></i> <span>maxcdn</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-mdb"></i> <span>mdb</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-medapps"></i> <span>medapps</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-medium"></i> <span>medium</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-medrt"></i> <span>medrt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-meetup"></i> <span>meetup</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-megaport"></i> <span>megaport</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-mendeley"></i> <span>mendeley</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-microblog"></i> <span>microblog</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-microsoft"></i> <span>microsoft</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-mix"></i> <span>mix</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-mixcloud"></i> <span>mixcloud</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-mixer"></i> <span>mixer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-mizuni"></i> <span>mizuni</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-modx"></i> <span>modx</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-monero"></i> <span>monero</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-napster"></i> <span>napster</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-neos"></i> <span>neos</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-nimblr"></i> <span>nimblr</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-node"></i> <span>node</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-node-js"></i> <span>node-js</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-npm"></i> <span>npm</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ns8"></i> <span>ns8</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-nutritionix"></i> <span>nutritionix</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-octopus-deploy"></i> <span>octopus-deploy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-odnoklassniki"></i> <span>odnoklassniki</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-odnoklassniki-square"></i> <span>odnoklassniki-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-old-republic"></i> <span>old-republic</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-opencart"></i> <span>opencart</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-openid"></i> <span>openid</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-opera"></i> <span>opera</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-optin-monster"></i> <span>optin-monster</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-orcid"></i> <span>orcid</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-osi"></i> <span>osi</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-page4"></i> <span>page4</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pagelines"></i> <span>pagelines</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-palfed"></i> <span>palfed</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-patreon"></i> <span>patreon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-paypal"></i> <span>paypal</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-penny-arcade"></i> <span>penny-arcade</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-perbyte"></i> <span>perbyte</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-periscope"></i> <span>periscope</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-phabricator"></i> <span>phabricator</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-phoenix-framework"></i> <span>phoenix-framework</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-phoenix-squadron"></i> <span>phoenix-squadron</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-php"></i> <span>php</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pied-piper"></i> <span>pied-piper</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pied-piper-alt"></i> <span>pied-piper-alt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pied-piper-hat"></i> <span>pied-piper-hat</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pied-piper-pp"></i> <span>pied-piper-pp</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pied-piper-square"></i> <span>pied-piper-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pinterest"></i> <span>pinterest</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pinterest-p"></i> <span>pinterest-p</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pinterest-square"></i> <span>pinterest-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pix"></i> <span>pix</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-playstation"></i> <span>playstation</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-product-hunt"></i> <span>product-hunt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-pushed"></i> <span>pushed</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-python"></i> <span>python</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-qq"></i> <span>qq</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-quinscape"></i> <span>quinscape</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-quora"></i> <span>quora</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-r-project"></i> <span>r-project</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-raspberry-pi"></i> <span>raspberry-pi</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ravelry"></i> <span>ravelry</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-react"></i> <span>react</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-reacteurope"></i> <span>reacteurope</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-readme"></i> <span>readme</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-rebel"></i> <span>rebel</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-red-river"></i> <span>red-river</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-reddit"></i> <span>reddit</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-reddit-alien"></i> <span>reddit-alien</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-reddit-square"></i> <span>reddit-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-redhat"></i> <span>redhat</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-renren"></i> <span>renren</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-replyd"></i> <span>replyd</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-researchgate"></i> <span>researchgate</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-resolving"></i> <span>resolving</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-rev"></i> <span>rev</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-rocketchat"></i> <span>rocketchat</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-rockrms"></i> <span>rockrms</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-rust"></i> <span>rust</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-safari"></i> <span>safari</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-salesforce"></i> <span>salesforce</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-sass"></i> <span>sass</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-schlix"></i> <span>schlix</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-scribd"></i> <span>scribd</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-searchengin"></i> <span>searchengin</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-sellcast"></i> <span>sellcast</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-sellsy"></i> <span>sellsy</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-servicestack"></i> <span>servicestack</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-shirtsinbulk"></i> <span>shirtsinbulk</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-shopify"></i> <span>shopify</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-shopware"></i> <span>shopware</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-simplybuilt"></i> <span>simplybuilt</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-sistrix"></i> <span>sistrix</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-sith"></i> <span>sith</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-sitrox"></i> <span>sitrox</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-sketch"></i> <span>sketch</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-skyatlas"></i> <span>skyatlas</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-skype"></i> <span>skype</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-slack"></i> <span>slack</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-slideshare"></i> <span>slideshare</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-snapchat"></i> <span>snapchat</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-snapchat-square"></i> <span>snapchat-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-soundcloud"></i> <span>soundcloud</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-sourcetree"></i> <span>sourcetree</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-speakap"></i> <span>speakap</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-speaker-deck"></i> <span>speaker-deck</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-spotify"></i> <span>spotify</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-square-font-awesome"></i> <span>square-font-awesome</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-square-font-awesome-stroke"></i> <span>square-font-awesome-stroke</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-squarespace"></i> <span>squarespace</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-stack-exchange"></i> <span>stack-exchange</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-stack-overflow"></i> <span>stack-overflow</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-stackpath"></i> <span>stackpath</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-staylinked"></i> <span>staylinked</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-steam"></i> <span>steam</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-steam-square"></i> <span>steam-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-steam-symbol"></i> <span>steam-symbol</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-sticker-mule"></i> <span>sticker-mule</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-strava"></i> <span>strava</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-stripe"></i> <span>stripe</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-stripe-s"></i> <span>stripe-s</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-studiovinari"></i> <span>studiovinari</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-stumbleupon"></i> <span>stumbleupon</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-stumbleupon-circle"></i> <span>stumbleupon-circle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-superpowers"></i> <span>superpowers</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-supple"></i> <span>supple</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-suse"></i> <span>suse</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-swift"></i> <span>swift</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-symfony"></i> <span>symfony</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-teamspeak"></i> <span>teamspeak</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-telegram"></i> <span>telegram</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-tencent-weibo"></i> <span>tencent-weibo</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-the-red-yeti"></i> <span>the-red-yeti</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-themeco"></i> <span>themeco</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-themeisle"></i> <span>themeisle</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-think-peaks"></i> <span>think-peaks</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-tiktok"></i> <span>tiktok</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-trade-federation"></i> <span>trade-federation</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-trello"></i> <span>trello</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-tumblr"></i> <span>tumblr</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-tumblr-square"></i> <span>tumblr-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-twitch"></i> <span>twitch</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-twitter"></i> <span>twitter</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-twitter-square"></i> <span>twitter-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-typo3"></i> <span>typo3</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-uber"></i> <span>uber</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ubuntu"></i> <span>ubuntu</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-uikit"></i> <span>uikit</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-umbraco"></i> <span>umbraco</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-uncharted"></i> <span>uncharted</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-uniregistry"></i> <span>uniregistry</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-unity"></i> <span>unity</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-unsplash"></i> <span>unsplash</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-untappd"></i> <span>untappd</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ups"></i> <span>ups</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-usb"></i> <span>usb</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-usps"></i> <span>usps</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-ussunnah"></i> <span>ussunnah</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-vaadin"></i> <span>vaadin</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-viacoin"></i> <span>viacoin</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-viadeo"></i> <span>viadeo</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-viadeo-square"></i> <span>viadeo-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-viber"></i> <span>viber</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-vimeo"></i> <span>vimeo</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-vimeo-square"></i> <span>vimeo-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-vimeo-v"></i> <span>vimeo-v</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-vine"></i> <span>vine</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-vk"></i> <span>vk</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-vnv"></i> <span>vnv</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-vuejs"></i> <span>vuejs</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-watchman-monitoring"></i> <span>watchman-monitoring</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-waze"></i> <span>waze</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-weebly"></i> <span>weebly</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-weibo"></i> <span>weibo</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-weixin"></i> <span>weixin</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-whatsapp"></i> <span>whatsapp</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-whatsapp-square"></i> <span>whatsapp-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-whmcs"></i> <span>whmcs</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wikipedia-w"></i> <span>wikipedia-w</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-windows"></i> <span>windows</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wirsindhandwerk"></i> <span>wirsindhandwerk</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wix"></i> <span>wix</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wizards-of-the-coast"></i> <span>wizards-of-the-coast</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wodu"></i> <span>wodu</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wolf-pack-battalion"></i> <span>wolf-pack-battalion</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wordpress"></i> <span>wordpress</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wordpress-simple"></i> <span>wordpress-simple</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wpbeginner"></i> <span>wpbeginner</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wpexplorer"></i> <span>wpexplorer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wpforms"></i> <span>wpforms</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-wpressr"></i> <span>wpressr</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-xbox"></i> <span>xbox</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-xing"></i> <span>xing</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-xing-square"></i> <span>xing-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-y-combinator"></i> <span>y-combinator</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-yahoo"></i> <span>yahoo</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-yammer"></i> <span>yammer</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-yandex"></i> <span>yandex</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-yandex-international"></i> <span>yandex-international</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-yarn"></i> <span>yarn</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-yelp"></i> <span>yelp</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-yoast"></i> <span>yoast</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-youtube"></i> <span>youtube</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-youtube-square"></i> <span>youtube-square</span></div>
						<div className="col-md-6 col-sm-6 col-xs-6 mb-10px text-ellipsis"><i className="fab fa-lg fa-fw me-10px fa-zhihu"></i> <span>zhihu</span></div>
					</div>
				</div>
			</div>
		</div>	
	)
}

export default UIIcons;