import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';
import Highlight from 'react-highlight';
import 'flag-icons/css/flag-icons.min.css';

function UILanguageBarIcon() {
	const [code1, setCode1] = useState();
	
  const context = useContext(AppSettings);
	
	useEffect(() => {
		context.handleSetAppHeaderLanguageBar(true);
		
		fetch('/assets/data/ui-language-bar-icon/code-1.json').then(function(response) { return response.text(); }).then((html) => { setCode1(html); });
		
		return () => {
      context.handleSetAppHeaderLanguageBar(false);
    };
    // eslint-disable-next-line
	}, []);
	
	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/ui/language-bar-icon">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/ui/language-bar-icon">UI Elements</Link></li>
				<li className="breadcrumb-item active">UI Language Bar & Icon</li>
			</ol>
			<h1 className="page-header">UI Language Bar & Icon <small>header small text goes here...</small></h1>
			<Panel>
				<PanelHeader>Installation</PanelHeader>
				<PanelBody>
					<div className="row">
						<div className="col-lg col-md-3 col-sm-4 col-6">
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ad h1 rounded mb-0" title="ad" id="ad"></div> <div className="ps-2 fw-bold">AD</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ae h1 rounded mb-0" title="ae" id="ae"></div> <div className="ps-2 fw-bold">AE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-af h1 rounded mb-0" title="af" id="af"></div> <div className="ps-2 fw-bold">AF</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ag h1 rounded mb-0" title="ag" id="ag"></div> <div className="ps-2 fw-bold">AG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ai h1 rounded mb-0" title="ai" id="ai"></div> <div className="ps-2 fw-bold">AU</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-al h1 rounded mb-0" title="al" id="al"></div> <div className="ps-2 fw-bold">AL</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-am h1 rounded mb-0" title="am" id="am"></div> <div className="ps-2 fw-bold">AM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ao h1 rounded mb-0" title="ao" id="ao"></div> <div className="ps-2 fw-bold">AO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-aq h1 rounded mb-0" title="aq" id="aq"></div> <div className="ps-2 fw-bold">AQ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ar h1 rounded mb-0" title="ar" id="ar"></div> <div className="ps-2 fw-bold">AR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-as h1 rounded mb-0" title="as" id="as"></div> <div className="ps-2 fw-bold">AS</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-at h1 rounded mb-0" title="at" id="at"></div> <div className="ps-2 fw-bold">AT</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-au h1 rounded mb-0" title="au" id="au"></div> <div className="ps-2 fw-bold">AU</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-aw h1 rounded mb-0" title="aw" id="aw"></div> <div className="ps-2 fw-bold">AW</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ax h1 rounded mb-0" title="ax" id="ax"></div> <div className="ps-2 fw-bold">AX</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-az h1 rounded mb-0" title="az" id="az"></div> <div className="ps-2 fw-bold">AZ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ba h1 rounded mb-0" title="ba" id="ba"></div> <div className="ps-2 fw-bold">BA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bb h1 rounded mb-0" title="bb" id="bb"></div> <div className="ps-2 fw-bold">BB</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bd h1 rounded mb-0" title="bd" id="bd"></div> <div className="ps-2 fw-bold">BD</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-be h1 rounded mb-0" title="be" id="be"></div> <div className="ps-2 fw-bold">BE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bf h1 rounded mb-0" title="bf" id="bf"></div> <div className="ps-2 fw-bold">BF</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bg h1 rounded mb-0" title="bg" id="bg"></div> <div className="ps-2 fw-bold">BG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bh h1 rounded mb-0" title="bh" id="bh"></div> <div className="ps-2 fw-bold">BH</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bi h1 rounded mb-0" title="bi" id="bi"></div> <div className="ps-2 fw-bold">BI</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bj h1 rounded mb-0" title="bj" id="bj"></div> <div className="ps-2 fw-bold">BJ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bl h1 rounded mb-0" title="bl" id="bl"></div> <div className="ps-2 fw-bold">BL</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bm h1 rounded mb-0" title="bm" id="bm"></div> <div className="ps-2 fw-bold">BM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bn h1 rounded mb-0" title="bn" id="bn"></div> <div className="ps-2 fw-bold">BN</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bo h1 rounded mb-0" title="bo" id="bo"></div> <div className="ps-2 fw-bold">BO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bq h1 rounded mb-0" title="bq" id="bq"></div> <div className="ps-2 fw-bold">BQ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-br h1 rounded mb-0" title="br" id="br"></div> <div className="ps-2 fw-bold">BR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bs h1 rounded mb-0" title="bs" id="bs"></div> <div className="ps-2 fw-bold">BS</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bt h1 rounded mb-0" title="bt" id="bt"></div> <div className="ps-2 fw-bold">BT</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bv h1 rounded mb-0" title="bv" id="bv"></div> <div className="ps-2 fw-bold">BV</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bw h1 rounded mb-0" title="bw" id="bw"></div> <div className="ps-2 fw-bold">BW</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-by h1 rounded mb-0" title="by" id="by"></div> <div className="ps-2 fw-bold">BY</div></div>
						</div>
						<div className="col-lg col-md-3 col-sm-4 col-6">
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-bz h1 rounded mb-0" title="bz" id="bz"></div> <div className="ps-2 fw-bold">BZ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ca h1 rounded mb-0" title="ca" id="ca"></div> <div className="ps-2 fw-bold">CA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cc h1 rounded mb-0" title="cc" id="cc"></div> <div className="ps-2 fw-bold">CC</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cd h1 rounded mb-0" title="cd" id="cd"></div> <div className="ps-2 fw-bold">CD</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cf h1 rounded mb-0" title="cf" id="cf"></div> <div className="ps-2 fw-bold">CF</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cg h1 rounded mb-0" title="cg" id="cg"></div> <div className="ps-2 fw-bold">CG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ch h1 rounded mb-0" title="ch" id="ch"></div> <div className="ps-2 fw-bold">CH</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ci h1 rounded mb-0" title="ci" id="ci"></div> <div className="ps-2 fw-bold">CI</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ck h1 rounded mb-0" title="ck" id="ck"></div> <div className="ps-2 fw-bold">CK</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cl h1 rounded mb-0" title="cl" id="cl"></div> <div className="ps-2 fw-bold">CL</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cm h1 rounded mb-0" title="cm" id="cm"></div> <div className="ps-2 fw-bold">CM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cn h1 rounded mb-0" title="cn" id="cn"></div> <div className="ps-2 fw-bold">CN</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-co h1 rounded mb-0" title="co" id="co"></div> <div className="ps-2 fw-bold">CO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cr h1 rounded mb-0" title="cr" id="cr"></div> <div className="ps-2 fw-bold">CR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cu h1 rounded mb-0" title="cu" id="cu"></div> <div className="ps-2 fw-bold">CU</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cv h1 rounded mb-0" title="cv" id="cv"></div> <div className="ps-2 fw-bold">CV</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cw h1 rounded mb-0" title="cw" id="cw"></div> <div className="ps-2 fw-bold">CW</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cx h1 rounded mb-0" title="cx" id="cx"></div> <div className="ps-2 fw-bold">CX</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cy h1 rounded mb-0" title="cy" id="cy"></div> <div className="ps-2 fw-bold">CY</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-cz h1 rounded mb-0" title="cz" id="cz"></div> <div className="ps-2 fw-bold">CZ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-de h1 rounded mb-0" title="de" id="de"></div> <div className="ps-2 fw-bold">DE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-dj h1 rounded mb-0" title="dj" id="dj"></div> <div className="ps-2 fw-bold">DJ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-dk h1 rounded mb-0" title="dk" id="dk"></div> <div className="ps-2 fw-bold">DK</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-dm h1 rounded mb-0" title="dm" id="dm"></div> <div className="ps-2 fw-bold">DM</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-do h1 rounded mb-0" title="do" id="do"></div> <div className="ps-2 fw-bold">DO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-dz h1 rounded mb-0" title="dz" id="dz"></div> <div className="ps-2 fw-bold">DZ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ec h1 rounded mb-0" title="ec" id="ec"></div> <div className="ps-2 fw-bold">EC</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ee h1 rounded mb-0" title="ee" id="ee"></div> <div className="ps-2 fw-bold">EE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-eg h1 rounded mb-0" title="eg" id="eg"></div> <div className="ps-2 fw-bold">EG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-eh h1 rounded mb-0" title="eh" id="eh"></div> <div className="ps-2 fw-bold">EH</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-er h1 rounded mb-0" title="er" id="er"></div> <div className="ps-2 fw-bold">ER</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-es h1 rounded mb-0" title="es" id="es"></div> <div className="ps-2 fw-bold">ES</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-et h1 rounded mb-0" title="et" id="et"></div> <div className="ps-2 fw-bold">ET</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-fi h1 rounded mb-0" title="fi" id="fi"></div> <div className="ps-2 fw-bold">FI</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-fj h1 rounded mb-0" title="fj" id="fj"></div> <div className="ps-2 fw-bold">FJ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-fk h1 rounded mb-0" title="fk" id="fk"></div> <div className="ps-2 fw-bold">FK</div></div>
						</div>
						<div className="col-lg col-md-3 col-sm-4 col-6">
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-fm h1 rounded mb-0" title="fm" id="fm"></div> <div className="ps-2 fw-bold">FM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-fo h1 rounded mb-0" title="fo" id="fo"></div> <div className="ps-2 fw-bold">FO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-fr h1 rounded mb-0" title="fr" id="fr"></div> <div className="ps-2 fw-bold">FR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ga h1 rounded mb-0" title="ga" id="ga"></div> <div className="ps-2 fw-bold">GA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gb h1 rounded mb-0" title="gb" id="gb"></div> <div className="ps-2 fw-bold">GB</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gd h1 rounded mb-0" title="gd" id="gd"></div> <div className="ps-2 fw-bold">GD</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ge h1 rounded mb-0" title="ge" id="ge"></div> <div className="ps-2 fw-bold">GE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gf h1 rounded mb-0" title="gf" id="gf"></div> <div className="ps-2 fw-bold">GF</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gg h1 rounded mb-0" title="gg" id="gg"></div> <div className="ps-2 fw-bold">GG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gh h1 rounded mb-0" title="gh" id="gh"></div> <div className="ps-2 fw-bold">GH</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gi h1 rounded mb-0" title="gi" id="gi"></div> <div className="ps-2 fw-bold">GI</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gl h1 rounded mb-0" title="gl" id="gl"></div> <div className="ps-2 fw-bold">GL</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gm h1 rounded mb-0" title="gm" id="gm"></div> <div className="ps-2 fw-bold">GM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gn h1 rounded mb-0" title="gn" id="gn"></div> <div className="ps-2 fw-bold">GN</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gp h1 rounded mb-0" title="gp" id="gp"></div> <div className="ps-2 fw-bold">GP</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gq h1 rounded mb-0" title="gq" id="gq"></div> <div className="ps-2 fw-bold">GQ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gr h1 rounded mb-0" title="gr" id="gr"></div> <div className="ps-2 fw-bold">GR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gs h1 rounded mb-0" title="gs" id="gs"></div> <div className="ps-2 fw-bold">GS</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gt h1 rounded mb-0" title="gt" id="gt"></div> <div className="ps-2 fw-bold">GT</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gu h1 rounded mb-0" title="gu" id="gu"></div> <div className="ps-2 fw-bold">GU</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gw h1 rounded mb-0" title="gw" id="gw"></div> <div className="ps-2 fw-bold">GW</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-gy h1 rounded mb-0" title="gy" id="gy"></div> <div className="ps-2 fw-bold">GY</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-hk h1 rounded mb-0" title="hk" id="hk"></div> <div className="ps-2 fw-bold">HK</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-hm h1 rounded mb-0" title="hm" id="hm"></div> <div className="ps-2 fw-bold">HM</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-hn h1 rounded mb-0" title="hn" id="hn"></div> <div className="ps-2 fw-bold">HN</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-hr h1 rounded mb-0" title="hr" id="hr"></div> <div className="ps-2 fw-bold">HR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ht h1 rounded mb-0" title="ht" id="ht"></div> <div className="ps-2 fw-bold">HT</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-hu h1 rounded mb-0" title="hu" id="hu"></div> <div className="ps-2 fw-bold">HU</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-id h1 rounded mb-0" title="id" id="id"></div> <div className="ps-2 fw-bold">ID</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ie h1 rounded mb-0" title="ie" id="ie"></div> <div className="ps-2 fw-bold">IE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-il h1 rounded mb-0" title="il" id="il"></div> <div className="ps-2 fw-bold">IL</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-im h1 rounded mb-0" title="im" id="im"></div> <div className="ps-2 fw-bold">IM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-in h1 rounded mb-0" title="in" id="in"></div> <div className="ps-2 fw-bold">IN</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-io h1 rounded mb-0" title="io" id="io"></div> <div className="ps-2 fw-bold">IO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-iq h1 rounded mb-0" title="iq" id="iq"></div> <div className="ps-2 fw-bold">IQ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ir h1 rounded mb-0" title="ir" id="ir"></div> <div className="ps-2 fw-bold">IR</div></div>
						</div>
						<div className="col-lg col-md-3 col-sm-4 col-6">
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-is h1 rounded mb-0" title="is" id="is"></div> <div className="ps-2 fw-bold">IS</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-it h1 rounded mb-0" title="it" id="it"></div> <div className="ps-2 fw-bold">IT</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-je h1 rounded mb-0" title="je" id="je"></div> <div className="ps-2 fw-bold">JE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-jm h1 rounded mb-0" title="jm" id="jm"></div> <div className="ps-2 fw-bold">JM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-jo h1 rounded mb-0" title="jo" id="jo"></div> <div className="ps-2 fw-bold">JO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-jp h1 rounded mb-0" title="jp" id="jp"></div> <div className="ps-2 fw-bold">JP</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ke h1 rounded mb-0" title="ke" id="ke"></div> <div className="ps-2 fw-bold">KE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-kg h1 rounded mb-0" title="kg" id="kg"></div> <div className="ps-2 fw-bold">KG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-kh h1 rounded mb-0" title="kh" id="kh"></div> <div className="ps-2 fw-bold">KH</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ki h1 rounded mb-0" title="ki" id="ki"></div> <div className="ps-2 fw-bold">KI</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-km h1 rounded mb-0" title="km" id="km"></div> <div className="ps-2 fw-bold">KM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-kn h1 rounded mb-0" title="kn" id="kn"></div> <div className="ps-2 fw-bold">KN</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-kp h1 rounded mb-0" title="kp" id="kp"></div> <div className="ps-2 fw-bold">KP</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-kr h1 rounded mb-0" title="kr" id="kr"></div> <div className="ps-2 fw-bold">KR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-kw h1 rounded mb-0" title="kw" id="kw"></div> <div className="ps-2 fw-bold">KW</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ky h1 rounded mb-0" title="ky" id="ky"></div> <div className="ps-2 fw-bold">KY</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-kz h1 rounded mb-0" title="kz" id="kz"></div> <div className="ps-2 fw-bold">KZ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-la h1 rounded mb-0" title="la" id="la"></div> <div className="ps-2 fw-bold">LA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-lb h1 rounded mb-0" title="lb" id="lb"></div> <div className="ps-2 fw-bold">LB</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-lc h1 rounded mb-0" title="lc" id="lc"></div> <div className="ps-2 fw-bold">LC</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-li h1 rounded mb-0" title="li" id="li"></div> <div className="ps-2 fw-bold">LI</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-lk h1 rounded mb-0" title="lk" id="lk"></div> <div className="ps-2 fw-bold">LK</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-lr h1 rounded mb-0" title="lr" id="lr"></div> <div className="ps-2 fw-bold">LR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ls h1 rounded mb-0" title="ls" id="ls"></div> <div className="ps-2 fw-bold">LS</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-lt h1 rounded mb-0" title="lt" id="lt"></div> <div className="ps-2 fw-bold">LT</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-lu h1 rounded mb-0" title="lu" id="lu"></div> <div className="ps-2 fw-bold">LU</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-lv h1 rounded mb-0" title="lv" id="lv"></div> <div className="ps-2 fw-bold">LV</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ly h1 rounded mb-0" title="ly" id="ly"></div> <div className="ps-2 fw-bold">LY</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ma h1 rounded mb-0" title="ma" id="ma"></div> <div className="ps-2 fw-bold">MA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mc h1 rounded mb-0" title="mc" id="mc"></div> <div className="ps-2 fw-bold">MC</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-md h1 rounded mb-0" title="md" id="md"></div> <div className="ps-2 fw-bold">MD</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-me h1 rounded mb-0" title="me" id="me"></div> <div className="ps-2 fw-bold">ME</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mf h1 rounded mb-0" title="mf" id="mf"></div> <div className="ps-2 fw-bold">MF</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mg h1 rounded mb-0" title="mg" id="mg"></div> <div className="ps-2 fw-bold">MG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mh h1 rounded mb-0" title="mh" id="mh"></div> <div className="ps-2 fw-bold">MH</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mk h1 rounded mb-0" title="mk" id="mk"></div> <div className="ps-2 fw-bold">MK</div></div>
						</div>
						<div className="col-lg col-md-3 col-sm-4 col-6">
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ml h1 rounded mb-0" title="ml" id="ml"></div> <div className="ps-2 fw-bold">ML</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mm h1 rounded mb-0" title="mm" id="mm"></div> <div className="ps-2 fw-bold">MM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mn h1 rounded mb-0" title="mn" id="mn"></div> <div className="ps-2 fw-bold">MN</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mo h1 rounded mb-0" title="mo" id="mo"></div> <div className="ps-2 fw-bold">MO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mp h1 rounded mb-0" title="mp" id="mp"></div> <div className="ps-2 fw-bold">MP</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mq h1 rounded mb-0" title="mq" id="mq"></div> <div className="ps-2 fw-bold">MQ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mr h1 rounded mb-0" title="mr" id="mr"></div> <div className="ps-2 fw-bold">MR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ms h1 rounded mb-0" title="ms" id="ms"></div> <div className="ps-2 fw-bold">MS</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mt h1 rounded mb-0" title="mt" id="mt"></div> <div className="ps-2 fw-bold">MT</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mu h1 rounded mb-0" title="mu" id="mu"></div> <div className="ps-2 fw-bold">MU</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mv h1 rounded mb-0" title="mv" id="mv"></div> <div className="ps-2 fw-bold">MV</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mw h1 rounded mb-0" title="mw" id="mw"></div> <div className="ps-2 fw-bold">MW</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mx h1 rounded mb-0" title="mx" id="mx"></div> <div className="ps-2 fw-bold">MX</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-my h1 rounded mb-0" title="my" id="my"></div> <div className="ps-2 fw-bold">MY</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-mz h1 rounded mb-0" title="mz" id="mz"></div> <div className="ps-2 fw-bold">MZ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-na h1 rounded mb-0" title="na" id="na"></div> <div className="ps-2 fw-bold">NA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-nc h1 rounded mb-0" title="nc" id="nc"></div> <div className="ps-2 fw-bold">NC</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ne h1 rounded mb-0" title="ne" id="ne"></div> <div className="ps-2 fw-bold">NE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-nf h1 rounded mb-0" title="nf" id="nf"></div> <div className="ps-2 fw-bold">NF</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ng h1 rounded mb-0" title="ng" id="ng"></div> <div className="ps-2 fw-bold">NG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ni h1 rounded mb-0" title="ni" id="ni"></div> <div className="ps-2 fw-bold">NI</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-nl h1 rounded mb-0" title="nl" id="nl"></div> <div className="ps-2 fw-bold">NL</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-no h1 rounded mb-0" title="no" id="no"></div> <div className="ps-2 fw-bold">NO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-np h1 rounded mb-0" title="np" id="np"></div> <div className="ps-2 fw-bold">NP</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-nr h1 rounded mb-0" title="nr" id="nr"></div> <div className="ps-2 fw-bold">NR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-nu h1 rounded mb-0" title="nu" id="nu"></div> <div className="ps-2 fw-bold">NU</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-nz h1 rounded mb-0" title="nz" id="nz"></div> <div className="ps-2 fw-bold">NZ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-om h1 rounded mb-0" title="om" id="om"></div> <div className="ps-2 fw-bold">OM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pa h1 rounded mb-0" title="pa" id="pa"></div> <div className="ps-2 fw-bold">PA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pe h1 rounded mb-0" title="pe" id="pe"></div> <div className="ps-2 fw-bold">PE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pf h1 rounded mb-0" title="pf" id="pf"></div> <div className="ps-2 fw-bold">PF</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pg h1 rounded mb-0" title="pg" id="pg"></div> <div className="ps-2 fw-bold">PG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ph h1 rounded mb-0" title="ph" id="ph"></div> <div className="ps-2 fw-bold">PH</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pk h1 rounded mb-0" title="pk" id="pk"></div> <div className="ps-2 fw-bold">PK</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pl h1 rounded mb-0" title="pl" id="pl"></div> <div className="ps-2 fw-bold">PL</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pm h1 rounded mb-0" title="pm" id="pm"></div> <div className="ps-2 fw-bold">PM</div></div>
						</div>
						<div className="col-lg col-md-3 col-sm-4 col-6">
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pn h1 rounded mb-0" title="pn" id="pn"></div> <div className="ps-2 fw-bold">PN</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pr h1 rounded mb-0" title="pr" id="pr"></div> <div className="ps-2 fw-bold">PR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ps h1 rounded mb-0" title="ps" id="ps"></div> <div className="ps-2 fw-bold">PS</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pt h1 rounded mb-0" title="pt" id="pt"></div> <div className="ps-2 fw-bold">PT</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-pw h1 rounded mb-0" title="pw" id="pw"></div> <div className="ps-2 fw-bold">PW</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-py h1 rounded mb-0" title="py" id="py"></div> <div className="ps-2 fw-bold">PY</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-qa h1 rounded mb-0" title="qa" id="qa"></div> <div className="ps-2 fw-bold">QA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-re h1 rounded mb-0" title="re" id="re"></div> <div className="ps-2 fw-bold">RE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ro h1 rounded mb-0" title="ro" id="ro"></div> <div className="ps-2 fw-bold">RO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-rs h1 rounded mb-0" title="rs" id="rs"></div> <div className="ps-2 fw-bold">RS</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ru h1 rounded mb-0" title="ru" id="ru"></div> <div className="ps-2 fw-bold">RU</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-rw h1 rounded mb-0" title="rw" id="rw"></div> <div className="ps-2 fw-bold">RW</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sa h1 rounded mb-0" title="sa" id="sa"></div> <div className="ps-2 fw-bold">SA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sb h1 rounded mb-0" title="sb" id="sb"></div> <div className="ps-2 fw-bold">SB</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sc h1 rounded mb-0" title="sc" id="sc"></div> <div className="ps-2 fw-bold">SC</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sd h1 rounded mb-0" title="sd" id="sd"></div> <div className="ps-2 fw-bold">SD</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-se h1 rounded mb-0" title="se" id="se"></div> <div className="ps-2 fw-bold">SE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sg h1 rounded mb-0" title="sg" id="sg"></div> <div className="ps-2 fw-bold">SG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sh h1 rounded mb-0" title="sh" id="sh"></div> <div className="ps-2 fw-bold">SH</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-si h1 rounded mb-0" title="si" id="si"></div> <div className="ps-2 fw-bold">SI</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sj h1 rounded mb-0" title="sj" id="sj"></div> <div className="ps-2 fw-bold">SJ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sk h1 rounded mb-0" title="sk" id="sk"></div> <div className="ps-2 fw-bold">SK</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sl h1 rounded mb-0" title="sl" id="sl"></div> <div className="ps-2 fw-bold">SL</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sm h1 rounded mb-0" title="sm" id="sm"></div> <div className="ps-2 fw-bold">SM</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sn h1 rounded mb-0" title="sn" id="sn"></div> <div className="ps-2 fw-bold">SN</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-so h1 rounded mb-0" title="so" id="so"></div> <div className="ps-2 fw-bold">SO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sr h1 rounded mb-0" title="sr" id="sr"></div> <div className="ps-2 fw-bold">SR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ss h1 rounded mb-0" title="ss" id="ss"></div> <div className="ps-2 fw-bold">SS</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-st h1 rounded mb-0" title="st" id="st"></div> <div className="ps-2 fw-bold">ST</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sv h1 rounded mb-0" title="sv" id="sv"></div> <div className="ps-2 fw-bold">SV</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sx h1 rounded mb-0" title="sx" id="sx"></div> <div className="ps-2 fw-bold">SX</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sy h1 rounded mb-0" title="sy" id="sy"></div> <div className="ps-2 fw-bold">SY</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-sz h1 rounded mb-0" title="sz" id="sz"></div> <div className="ps-2 fw-bold">SZ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tc h1 rounded mb-0" title="tc" id="tc"></div> <div className="ps-2 fw-bold">TC</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-td h1 rounded mb-0" title="td" id="td"></div> <div className="ps-2 fw-bold">TD</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tf h1 rounded mb-0" title="tf" id="tf"></div> <div className="ps-2 fw-bold">TF</div></div>
						</div>
						<div className="col-lg col-md-3 col-sm-4 col-6">
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tg h1 rounded mb-0" title="tg" id="tg"></div> <div className="ps-2 fw-bold">TG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-th h1 rounded mb-0" title="th" id="th"></div> <div className="ps-2 fw-bold">TH</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tj h1 rounded mb-0" title="tj" id="tj"></div> <div className="ps-2 fw-bold">TJ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tk h1 rounded mb-0" title="tk" id="tk"></div> <div className="ps-2 fw-bold">TK</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tl h1 rounded mb-0" title="tl" id="tl"></div> <div className="ps-2 fw-bold">TL</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tm h1 rounded mb-0" title="tm" id="tm"></div> <div className="ps-2 fw-bold">TM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tn h1 rounded mb-0" title="tn" id="tn"></div> <div className="ps-2 fw-bold">TN</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-to h1 rounded mb-0" title="to" id="to"></div> <div className="ps-2 fw-bold">TO</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tr h1 rounded mb-0" title="tr" id="tr"></div> <div className="ps-2 fw-bold">TR</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tt h1 rounded mb-0" title="tt" id="tt"></div> <div className="ps-2 fw-bold">TT</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tv h1 rounded mb-0" title="tv" id="tv"></div> <div className="ps-2 fw-bold">TV</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tw h1 rounded mb-0" title="tw" id="tw"></div> <div className="ps-2 fw-bold">TW</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-tz h1 rounded mb-0" title="tz" id="tz"></div> <div className="ps-2 fw-bold">TZ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ua h1 rounded mb-0" title="ua" id="ua"></div> <div className="ps-2 fw-bold">UA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ug h1 rounded mb-0" title="ug" id="ug"></div> <div className="ps-2 fw-bold">UG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-um h1 rounded mb-0" title="um" id="um"></div> <div className="ps-2 fw-bold">UM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-us h1 rounded mb-0" title="us" id="us"></div> <div className="ps-2 fw-bold">US</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-uy h1 rounded mb-0" title="uy" id="uy"></div> <div className="ps-2 fw-bold">UY</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-uz h1 rounded mb-0" title="uz" id="uz"></div> <div className="ps-2 fw-bold">UZ</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-va h1 rounded mb-0" title="va" id="va"></div> <div className="ps-2 fw-bold">VA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-vc h1 rounded mb-0" title="vc" id="vc"></div> <div className="ps-2 fw-bold">VC</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ve h1 rounded mb-0" title="ve" id="ve"></div> <div className="ps-2 fw-bold">VE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-vg h1 rounded mb-0" title="vg" id="vg"></div> <div className="ps-2 fw-bold">VG</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-vi h1 rounded mb-0" title="vi" id="vi"></div> <div className="ps-2 fw-bold">VI</div></div>
					
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-vn h1 rounded mb-0" title="vn" id="vn"></div> <div className="ps-2 fw-bold">VN</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-vu h1 rounded mb-0" title="vu" id="vu"></div> <div className="ps-2 fw-bold">VU</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-wf h1 rounded mb-0" title="wf" id="wf"></div> <div className="ps-2 fw-bold">WF</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ws h1 rounded mb-0" title="ws" id="ws"></div> <div className="ps-2 fw-bold">WS</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-ye h1 rounded mb-0" title="ye" id="ye"></div> <div className="ps-2 fw-bold">YE</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-yt h1 rounded mb-0" title="yt" id="yt"></div> <div className="ps-2 fw-bold">YT</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-za h1 rounded mb-0" title="za" id="za"></div> <div className="ps-2 fw-bold">ZA</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-zm h1 rounded mb-0" title="zm" id="zm"></div> <div className="ps-2 fw-bold">ZM</div></div>
							<div className="mb-3 d-flex align-items-center"><div className="fi fi-zw h1 rounded mb-0" title="zw" id="zw"></div> <div className="ps-2 fw-bold">ZW</div></div>
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

export default UILanguageBarIcon;