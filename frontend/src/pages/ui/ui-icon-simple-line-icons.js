import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { Link } from 'react-router-dom';
import Highlight from 'react-highlight';
import 'simple-line-icons/css/simple-line-icons.css';

function UISimpleLineIcons() {
	const [code1, setCode1] = useState();
	
	useEffect(() => {
		fetch('/assets/data/ui-icon-simple-line-icons/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
	});
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/ui/simple-line-icons">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/ui/simple-line-icons">UI Elements</Link></li>
				<li className="breadcrumb-item active">Simple Line Icons</li>
			</ol>
			<h1 className="page-header">Simple Line Icons <small>162 beautifully crafted webfont icons</small></h1>
			<Panel>
				<PanelHeader>Installation</PanelHeader>
				<PanelBody>
					<div className="row pt-2">
						<div className="col-xl-3 col-lg-4 col-md-6 col-12">
							<div className="mb-3 d-flex align-items-center"><i className="icon-user h3 d-block"></i><div className="ms-3">icon-user</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-user-female h3 d-block"></i><div className="ms-3">icon-user-female</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-user h3 d-block"></i><div className="ms-3">icon-user</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-user-follow h3 d-block"></i><div className="ms-3">icon-user-follow</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-user-following h3 d-block"></i><div className="ms-3">icon-user-following</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-user-unfollow h3 d-block"></i><div className="ms-3">icon-user-unfollow</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-trophy h3 d-block"></i><div className="ms-3">icon-trophy</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-speedometer h3 d-block"></i><div className="ms-3">icon-speedometer</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-social-youtube h3 d-block"></i><div className="ms-3">icon-social-youtube</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-social-twitter h3 d-block"></i><div className="ms-3">icon-social-twitter</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-social-tumblr h3 d-block"></i><div className="ms-3">icon-social-tumblr</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-social-facebook h3 d-block"></i><div className="ms-3">icon-social-facebook</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-social-dropbox h3 d-block"></i><div className="ms-3">icon-social-dropbox</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-social-dribbble h3 d-block"></i><div className="ms-3">icon-social-dribbble</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-shield h3 d-block"></i><div className="ms-3">icon-shield</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-screen-tablet h3 d-block"></i><div className="ms-3">icon-screen-tablet</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-screen-smartphone h3 d-block"></i><div className="ms-3">icon-screen-smartphone</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-screen-desktop h3 d-block"></i><div className="ms-3">icon-screen-desktop</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-plane h3 d-block"></i><div className="ms-3">icon-plane</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-notebook h3 d-block"></i><div className="ms-3">icon-notebook</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-mustache h3 d-block"></i><div className="ms-3">icon-mustache</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-mouse h3 d-block"></i><div className="ms-3">icon-mouse</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-magnet h3 d-block"></i><div className="ms-3">icon-magnet</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-magic-wand h3 d-block"></i><div className="ms-3">icon-magic-wand</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-hourglass h3 d-block"></i><div className="ms-3">icon-hourglass</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-graduation h3 d-block"></i><div className="ms-3">icon-graduation</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-ghost h3 d-block"></i><div className="ms-3">icon-ghost</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-music-tone-alt h3 d-block"></i><div className="ms-3">icon-music-tone-alt</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-note h3 d-block"></i><div className="ms-3">icon-note</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-pencil h3 d-block"></i><div className="ms-3">icon-pencil</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-pie-chart h3 d-block"></i><div className="ms-3">icon-pie-chart</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-question h3 d-block"></i><div className="ms-3">icon-question</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-rocket h3 d-block"></i><div className="ms-3">icon-rocket</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-share h3 d-block"></i><div className="ms-3">icon-share</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-share-alt h3 d-block"></i><div className="ms-3">icon-share-alt</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-shuffle h3 d-block"></i><div className="ms-3">icon-shuffle</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-size-actual h3 d-block"></i><div className="ms-3">icon-size-actual</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-size-fullscreen h3 d-block"></i><div className="ms-3">icon-size-fullscreen</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-support h3 d-block"></i><div className="ms-3">icon-support</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-tag h3 d-block"></i><div className="ms-3">icon-tag</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-trash h3 d-block"></i><div className="ms-3">icon-trash</div></div>
						</div>
						<div className="col-xl-3 col-lg-4 col-md-6 col-12">
							<div className="mb-3 d-flex align-items-center"><i className="icon-game-controller h3 d-block"></i><div className="ms-3">icon-game-controller</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-fire h3 d-block"></i><div className="ms-3">icon-fire</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-eyeglass h3 d-block"></i><div className="ms-3">icon-eyeglass</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-envelope-open h3 d-block"></i><div className="ms-3">icon-envelope-open</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-envelope-letter h3 d-block"></i><div className="ms-3">icon-envelope-letter</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-energy h3 d-block"></i><div className="ms-3">icon-energy</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-emotsmile h3 d-block"></i><div className="ms-3">icon-emotsmile</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-disc h3 d-block"></i><div className="ms-3">icon-disc</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-cursor-move h3 d-block"></i><div className="ms-3">icon-cursor-move</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-crop h3 d-block"></i><div className="ms-3">icon-crop</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-credit-card h3 d-block"></i><div className="ms-3">icon-credit-card</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-chemistry h3 d-block"></i><div className="ms-3">icon-chemistry</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-bell h3 d-block"></i><div className="ms-3">icon-bell</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-badge h3 d-block"></i><div className="ms-3">icon-badge</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-anchor h3 d-block"></i><div className="ms-3">icon-anchor</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-action-redo h3 d-block"></i><div className="ms-3">icon-action-redo</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-action-undo h3 d-block"></i><div className="ms-3">icon-action-undo</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-bag h3 d-block"></i><div className="ms-3">icon-bag</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-basket h3 d-block"></i><div className="ms-3">icon-basket</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-basket-loaded h3 d-block"></i><div className="ms-3">icon-basket-loaded</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-book-open h3 d-block"></i><div className="ms-3">icon-book-open</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-briefcase h3 d-block"></i><div className="ms-3">icon-briefcase</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-bubbles h3 d-block"></i><div className="ms-3">icon-bubbles</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-calculator h3 d-block"></i><div className="ms-3">icon-calculator</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-call-end h3 d-block"></i><div className="ms-3">icon-call-end</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-call-in h3 d-block"></i><div className="ms-3">icon-call-in</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-call-out h3 d-block"></i><div className="ms-3">icon-call-out</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-umbrella h3 d-block"></i><div className="ms-3">icon-umbrella</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-wrench h3 d-block"></i><div className="ms-3">icon-wrench</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-ban h3 d-block"></i><div className="ms-3">icon-ban</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-bubble h3 d-block"></i><div className="ms-3">icon-bubble</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-camrecorder h3 d-block"></i><div className="ms-3">icon-camrecorder</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-camera h3 d-block"></i><div className="ms-3">icon-camera</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-check h3 d-block"></i><div className="ms-3">icon-check</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-clock h3 d-block"></i><div className="ms-3">icon-clock</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-close h3 d-block"></i><div className="ms-3">icon-close</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-cloud-download h3 d-block"></i><div className="ms-3">icon-cloud-download</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-cloud-upload h3 d-block"></i><div className="ms-3">icon-cloud-upload</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-doc h3 d-block"></i><div className="ms-3">icon-doc</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-envelope h3 d-block"></i><div className="ms-3">icon-envelope</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-eye h3 d-block"></i><div className="ms-3">icon-eye</div></div>
						</div>
						<div className="col-xl-3 col-lg-4 col-md-6 col-12">
							<div className="mb-3 d-flex align-items-center"><i className="icon-compass h3 d-block"></i><div className="ms-3">icon-compass</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-cup h3 d-block"></i><div className="ms-3">icon-cup</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-diamond h3 d-block"></i><div className="ms-3">icon-diamond</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-direction h3 d-block"></i><div className="ms-3">icon-direction</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-directions h3 d-block"></i><div className="ms-3">icon-directions</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-docs h3 d-block"></i><div className="ms-3">icon-docs</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-drawer h3 d-block"></i><div className="ms-3">icon-drawer</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-drop h3 d-block"></i><div className="ms-3">icon-drop</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-earphones h3 d-block"></i><div className="ms-3">icon-earphones</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-earphones-alt h3 d-block"></i><div className="ms-3">icon-earphones-alt</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-feed h3 d-block"></i><div className="ms-3">icon-feed</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-film h3 d-block"></i><div className="ms-3">icon-film</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-folder-alt h3 d-block"></i><div className="ms-3">icon-folder-alt</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-frame h3 d-block"></i><div className="ms-3">icon-frame</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-globe h3 d-block"></i><div className="ms-3">icon-globe</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-globe-alt h3 d-block"></i><div className="ms-3">icon-globe-alt</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-handbag h3 d-block"></i><div className="ms-3">icon-handbag</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-layers h3 d-block"></i><div className="ms-3">icon-layers</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-map h3 d-block"></i><div className="ms-3">icon-map</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-picture h3 d-block"></i><div className="ms-3">icon-picture</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-pin h3 d-block"></i><div className="ms-3">icon-pin</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-playlist h3 d-block"></i><div className="ms-3">icon-playlist</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-present h3 d-block"></i><div className="ms-3">icon-present</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-printer h3 d-block"></i><div className="ms-3">icon-printer</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-puzzle h3 d-block"></i><div className="ms-3">icon-puzzle</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-speech h3 d-block"></i><div className="ms-3">icon-speech</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-vector h3 d-block"></i><div className="ms-3">icon-vector</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-flag h3 d-block"></i><div className="ms-3">icon-flag</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-folder h3 d-block"></i><div className="ms-3">icon-folder</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-heart h3 d-block"></i><div className="ms-3">icon-heart</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-info h3 d-block"></i><div className="ms-3">icon-info</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-key h3 d-block"></i><div className="ms-3">icon-key</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-link h3 d-block"></i><div className="ms-3">icon-link</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-lock h3 d-block"></i><div className="ms-3">icon-lock</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-lock-open h3 d-block"></i><div className="ms-3">icon-lock-open</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-magnifier h3 d-block"></i><div className="ms-3">icon-magnifier</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-magnifier-add h3 d-block"></i><div className="ms-3">icon-magnifier-add</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-magnifier-remove h3 d-block"></i><div className="ms-3">icon-magnifier-remove</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-paper-clip h3 d-block"></i><div className="ms-3">icon-paper-clip</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-paper-plane h3 d-block"></i><div className="ms-3">icon-paper-plane</div></div>
						</div>
						<div className="col-xl-3 col-lg-4 col-md-6 col-12">
							<div className="mb-3 d-flex align-items-center"><i className="icon-wallet h3 d-block"></i><div className="ms-3">icon-wallet</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-arrow-down h3 d-block"></i><div className="ms-3">icon-arrow-down</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-arrow-left h3 d-block"></i><div className="ms-3">icon-arrow-left</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-arrow-right h3 d-block"></i><div className="ms-3">icon-arrow-right</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-arrow-up h3 d-block"></i><div className="ms-3">icon-arrow-up</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-chart h3 d-block"></i><div className="ms-3">icon-chart</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-bulb h3 d-block"></i><div className="ms-3">icon-bulb</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-calendar h3 d-block"></i><div className="ms-3">icon-calendar</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-control-end h3 d-block"></i><div className="ms-3">icon-control-end</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-control-forward h3 d-block"></i><div className="ms-3">icon-control-forward</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-control-pause h3 d-block"></i><div className="ms-3">icon-control-pause</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-control-play h3 d-block"></i><div className="ms-3">icon-control-play</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-control-rewind h3 d-block"></i><div className="ms-3">icon-control-rewind</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-control-start h3 d-block"></i><div className="ms-3">icon-control-start</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-cursor h3 d-block"></i><div className="ms-3">icon-cursor</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-dislike h3 d-block"></i><div className="ms-3">icon-dislike</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-equalizer h3 d-block"></i><div className="ms-3">icon-equalizer</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-graph h3 d-block"></i><div className="ms-3">icon-graph</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-grid h3 d-block"></i><div className="ms-3">icon-grid</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-home h3 d-block"></i><div className="ms-3">icon-home</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-like h3 d-block"></i><div className="ms-3">icon-like</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-list h3 d-block"></i><div className="ms-3">icon-list</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-login h3 d-block"></i><div className="ms-3">icon-login</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-logout h3 d-block"></i><div className="ms-3">icon-logout</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-loop h3 d-block"></i><div className="ms-3">icon-loop</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-microphone h3 d-block"></i><div className="ms-3">icon-microphone</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-music-tone h3 d-block"></i><div className="ms-3">icon-music-tone</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-plus h3 d-block"></i><div className="ms-3">icon-plus</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-location-pin h3 d-block"></i><div className="ms-3">icon-location-pin</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-power h3 d-block"></i><div className="ms-3">icon-power</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-refresh h3 d-block"></i><div className="ms-3">icon-refresh</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-reload h3 d-block"></i><div className="ms-3">icon-reload</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-settings h3 d-block"></i><div className="ms-3">icon-settings</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-star h3 d-block"></i><div className="ms-3">icon-star</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-symbol-female h3 d-block"></i><div className="ms-3">icon-symbol-female</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-symbol-male h3 d-block"></i><div className="ms-3">icon-symbol-male</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-target h3 d-block"></i><div className="ms-3">icon-target</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-volume-1 h3 d-block"></i><div className="ms-3">icon-volume-1</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-volume-2 h3 d-block"></i><div className="ms-3">icon-volume-2</div></div>
							<div className="mb-3 d-flex align-items-center"><i className="icon-volume-off h3 d-block"></i><div className="ms-3">icon-volume-off</div></div>
						</div>
					</div>
				</PanelBody>
				<div className="hljs-wrapper">
					<Highlight className='html'>{code1}</Highlight>
				</div>
			</Panel>
		</div>
	)
}

export default UISimpleLineIcons;