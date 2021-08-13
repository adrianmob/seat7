import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Markup } from 'interweave';
import { Facebook, Twitter, Email } from 'react-sharingbuttons';
import Helmet from 'react-helmet';

import FooterLP from '../footer-lp';

export default class LandingPageT1 extends Component {
	state = {
		modal_confidentiality: "opened",
		modal_share: "closed",
		url: "",
		share_subject: "",
		share_text: ""
	}

	componentDidMount() {
		const url = window.location.href;
		this.setState({
			url
		});
	}

	modalConfidentiality = (status) => {
		this.setState({modal_confidentiality: status});
	}

	modalMessage = (status) => {
		this.setState({modal_share: status});
	}
	
	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}


	render() {
		return (
			<div data-page="landing-page">
				<Helmet>
					<title>Seat 7</title>
					<meta name="theme-color" content="#0056a7"/>
					{/* <meta http-equiv='cache-control' content='no-cache' />
					<meta http-equiv='expires' content='0' />
					<meta http-equiv='pragma' content='no-cache' /> */}
				</Helmet>

				<div className={`loading-page ${this.props.loadingPage === true ? 'loading' : ''}`}></div>

				{ this.props.modalConfidentiality && 
					<div data-component="modal" className={`modal-confidentiality ${this.state.modal_confidentiality}`}>
						<div className="content">
							<p className="text">
								PLEASE BE ADVISED you are about to access material that is CONFIDENTIAL and that by accessing this website, you agree to keep confidential, and not use, copy or disseminate, any and all materials and information contained therein (“Confidential Material”).
							</p>
							{/* <Link to="/without-permission" className="btn grey">No</Link> */}
							<button onClick={e => this.modalConfidentiality('closed')} className="btn blue-light">Enter</button>
						</div>
					</div>
				}

				{ this.props.isPreview && 
					<div className="preview-page">
						<div className="container">
							<p className="text">This is just a preview page of the project.</p>
							<Link to={`/shipping-management/${this.props.companyId}/${this.props.projectId}`} className="btn blue-light">Back to project management</Link>
						</div>
					</div>
				}

				<header className="landing-page-header">
					<div className="logo-partner">
						{this.props.logo}
					</div>

					<div className="banner">
						{this.props.banner}

						<div className="bannner-description">
							<div className="container">
								<h1 className="title">{this.props.banner_title !== "" ? this.props.banner_title : "Banner Title"}</h1>
								<div className="text white" data-component="text-editor">
									{this.props.bannerText &&
										<Markup content={this.props.bannerText} />
									}
									{!this.props.bannerText &&
										"Short description"
									}
								</div>
							</div>
						</div>
					</div>
				</header>

				<div className="about-us">
					<div className="container">
						<h2 className="title">{this.props.companyName !== "" ? this.props.companyName : "About us"}</h2>
						<div className="text black" data-component="text-editor">
							{this.props.aboutCompany &&
								<Markup content={this.props.aboutCompany} />
							}
							{!this.props.aboutCompany &&
								"Short company description"
							}
						</div>
					</div>
				</div>

				{this.props.links.length > 0 &&
					<div className="links-container">
						<div className="container">
							<h3 className="title">Download</h3>
							<p className="text">Click download to access the files</p>
							<div className="links">
								<div className="link-header">
									<div className="col flex align-center sm-12 md-3 lg-3">
										<p className="title">Title</p>
									</div>
									<div className="col flex align-center sm-12 md-6 lg-6">
										<p className="title">Description</p>
									</div>
									<div className="col flex align-center sm-12 md-3 lg-3"></div>
								</div>

								{this.props.links.map(link => (
									<div className="link-container" key={`collaborator-${link.id}`}>
										<div className="col flex align-center sm-12 md-3 lg-3">
											<div className="link-col"><p className="text">{link.title}</p></div>
										</div>
										<div className="col flex align-center sm-12 md-6 lg-6">
											<div className="link-col"><p className="text">{link.description}</p></div>
										</div>
										<div className="col flex align-center sm-12 md-3 lg-3">
											<div className="link-col">
												<a href={link.file_url} target="blank" className="btn with-icon">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#fff" d="M412.907 214.08C398.4 140.693 333.653 85.333 256 85.333c-61.653 0-115.093 34.987-141.867 86.08C50.027 178.347 0 232.64 0 298.667c0 70.72 57.28 128 128 128h277.333C464.213 426.667 512 378.88 512 320c0-56.32-43.84-101.973-99.093-105.92zM256 384L149.333 277.333h64V192h85.333v85.333h64L256 384z"/></svg>
													<p className="text">Download</p>
												</a>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				}
				

				{this.props.project_type === "finished" && 
					<div className="share-button">
						<button className="btn with-icon blue-light" onClick={(e) => this.modalMessage("opened")}>
							<svg height="512pt" viewBox="-21 0 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="m389.332031 160c-44.09375 0-80-35.882812-80-80s35.90625-80 80-80c44.097657 0 80 35.882812 80 80s-35.902343 80-80 80zm0-128c-26.453125 0-48 21.523438-48 48s21.546875 48 48 48 48-21.523438 48-48-21.546875-48-48-48zm0 0"/><path d="m389.332031 512c-44.09375 0-80-35.882812-80-80s35.90625-80 80-80c44.097657 0 80 35.882812 80 80s-35.902343 80-80 80zm0-128c-26.453125 0-48 21.523438-48 48s21.546875 48 48 48 48-21.523438 48-48-21.546875-48-48-48zm0 0"/><path d="m80 336c-44.097656 0-80-35.882812-80-80s35.902344-80 80-80 80 35.882812 80 80-35.902344 80-80 80zm0-128c-26.453125 0-48 21.523438-48 48s21.546875 48 48 48 48-21.523438 48-48-21.546875-48-48-48zm0 0"/><path d="m135.703125 240.425781c-5.570313 0-10.988281-2.902343-13.910156-8.0625-4.375-7.679687-1.707031-17.453125 5.972656-21.824219l197.953125-112.855468c7.65625-4.414063 17.449219-1.726563 21.800781 5.976562 4.375 7.679688 1.707031 17.449219-5.972656 21.824219l-197.953125 112.851563c-2.496094 1.40625-5.203125 2.089843-7.890625 2.089843zm0 0"/><path d="m333.632812 416.425781c-2.6875 0-5.398437-.683593-7.894531-2.109375l-197.953125-112.855468c-7.679687-4.371094-10.34375-14.144532-5.972656-21.824219 4.351562-7.699219 14.125-10.367188 21.804688-5.972657l197.949218 112.851563c7.679688 4.375 10.347656 14.144531 5.976563 21.824219-2.945313 5.183594-8.363281 8.085937-13.910157 8.085937zm0 0"/></svg>
							<p className="text">Share this project</p>
						</button>
					</div>
				}

				{this.props.links.length <= 0 && this.props.project_type === "production" &&
					<span className="divider"></span>
				}

				{this.state.modal_share === 'opened' &&
					<div data-component="modal" className={`modal-project-management opened`}>				
						<div className="modal-container">
							<div className="modal-header">
								<p className="text">Share options</p>
								<button onClick={e => this.modalMessage("closed")} className="btn btn-close"></button>
							</div>

							<div className="modal-content modal-share">
								<form action="">
									<input
										id="share_subject"
										name="share_subject"
										type="text"
										placeholder="Share Subject"
										value={this.state.share_subject}
										onChange={e => this.onChange(e)}
									/>

									<textarea
										id="share_text"
										name="share_text"
										type="text"
										placeholder="Share Text"
										value={this.state.share_text}
										onChange={e => this.onChange(e)}
									></textarea>
								</form>

								<div className="share-options">
									<Facebook url={this.state.url} />
									<Twitter url={this.state.url} shareText={this.state.share_text} />
									{/* <WhatsApp url={url} message={shareText} /> */}
									<Email url={this.state.url} subject={this.state.share_subject} />
								</div>
							</div>
						</div>
					</div>
				}

				<FooterLP />

				{ this.props.isPreview && 
					<div className="preview-page">
						<div className="container">
							<p className="text">This is just a preview page of the project.</p>
							<Link to={`/project/${this.props.companyId}/${this.props.projectId}`} className="btn blue-light">Back to project management</Link>
						</div>
					</div>
				}
			</div>
		)
	};
}
