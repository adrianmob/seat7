import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Markup } from 'interweave';

import Upload from '../../components/upload';

export default class ProjectEdit extends Component {
	state = {
		loadingPage: true,
		company_id: 0,
		project_id: 0,
		project_title: "",
		new_project_title: "",
		company_name: "",
		new_company_name: "",
		company_description: "",
		new_company_description: "",
		logo_src: "",
		new_logo_src: "",
		banner_title: "",
		new_banner_title: "",
		banner_description: "",
		new_banner_description: "",
		banner_src: "",
		new_banner_src: "",
		links: [],
		new_file_id: "",
		new_file_title: "",
		new_file_url: "",
		new_file_description: "",
		modal_logo: "closed",
		modal_banner: "closed",
		modal_delete_banner: "closed",
		modal_description: "closed",
		modal_about: "closed",
		modal_file: "closed",
		modal_delete_file: "closed",
		file_to_delete: "",
		logoField: false,
		bannerField: false,
		titleBannerField: false,
		descriptionBannerField: false,
		aboutField: false,
		companyNameField: false,
		fileTitleField: false,
		fileDescriptionField: false,
		fileUrlField: false,
	}

	componentDidMount() {
		//if page reloads without close any modal
		// document.querySelector('body').classList.remove("no-scroll");
		document.querySelector('body').classList.add("no-scroll");

		const company_id = this.props.match.params.company_id;
		const project_id = this.props.match.params.project_id;
		this.setState({ company_id, project_id });
		this.loadApiProject(company_id, project_id);
	}

	loadApiProject = async (company_id, project_id) => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

		try {
			const response = await api.get(`companies/${company_id}/projects/${project_id}`);
			const response2 = await api.get(`companies/${company_id}/projects/${project_id}/banner`);
			const response3 = await api.get(`companies/${company_id}/projects/${project_id}/files`);

			this.setState({
				project_title: response.data.title,
				new_project_title: response.data.title,
				company_name: response.data.company_name,
				new_company_name: response.data.company_name,
				company_description: response.data.company_description,
				new_company_description: response.data.company_description,
				banner_title: response2.data.title,
				new_banner_title: response2.data.title,
				banner_description: response2.data.description,
				new_banner_description: response2.data.description,
				links: response3.data,
				loadingPage: false
			});

			if(response.data.logo_url) {
				this.setState({
					logo_src: 'https://seat7-uploads.s3.amazonaws.com/'+response.data.logo_url,
				})
			}

			if(response2.data.image_url) {
				this.setState({
					banner_src: 'https://seat7-uploads.s3.amazonaws.com/'+response2.data.image_url,
				})
			}

			document.querySelector('body').classList.remove("no-scroll");
		} catch (error) {
			console.log(error);
		}
	}

	modal = (id ,status, file_id) => {
		if(id === "modal_logo")
			this.setState({modal_logo: status})

		if(id === "modal_banner")
			this.setState({modal_banner: status})

		if(id === "modal_description")
			this.setState({modal_description: status})

		if(id === "modal_about"){
			this.setState({modal_about: status})
		}

		if(id === "modal_file"){
			if (file_id === 0) {
				this.setState({
					modal_file: status,
					new_file_id: file_id,
					new_file_title: "",
					new_file_url: "",
					new_file_description: ""
				})
			} else {
				let temp_title, temp_url, temp_description;

				this.state.links.forEach(link => {
					if(link.id === file_id) {
						temp_title = link.title;
						temp_url = link.file_url;
						temp_description = link.description;
					}
				});
				this.setState({
					modal_file: status,
					new_file_id: file_id,
					new_file_title: temp_title,
					new_file_url: temp_url,
					new_file_description: temp_description
				})
			}
		}

		if(id === "modal_delete_file"){
			this.setState({
				modal_delete_file: status,
				file_to_delete: file_id
			})
		}

		if(id === "modal_delete_banner") {
			this.setState({
				modal_delete_banner: status
			})
		}

		this.setState({
			logoField: false,
			bannerField: false,
			titleBannerField: false,
			descriptionBannerField: false,
			aboutField: false,
			companyNameField: false,
			fileTitleField: false,
			fileDescriptionField: false,
			fileUrlField: false
		})

		if(status === "opened") {
			document.querySelector('body').classList.add("no-scroll");
		} else {
			document.querySelector('body').classList.remove("no-scroll");
		}
	}

	uploadLogo = (file, file_upload) => {
		this.setState({
			new_logo_src: file,
			logo_file_upload: file_upload
		})
	}

	uploadBanner = (file, file_upload) => {
		this.setState({
			new_banner_src: file,
			banner_file_upload: file_upload
		})
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	saveLogo = async (e) => {
		e.preventDefault();

		const {company_id, project_id, new_logo_src, logo_file_upload} = this.state;
		if(!new_logo_src) {
			this.setState({logoField: true});
		} else {
			this.setState({
				logoField: false
			});

			document.querySelector('.modal-edit-logo .btn-save').classList.add("load");

			try {
				
				const form = new FormData();
				form.append('file', logo_file_upload);
				
				await api.put(`companies/${company_id}/projects/${project_id}/logo/upload`, form);
				this.modal('modal_logo', 'closed');

				this.setState({
					logo_src: new_logo_src,
					new_logo_src: ''
				});
				document.querySelector('.modal-edit-logo .btn-save').classList.remove("load");
			} catch (error) {
				console.log(error);
			}
		}
	}

	saveBanner = async (e) => {
		e.preventDefault();

		const {company_id, project_id, new_banner_src, banner_file_upload} = this.state;
		if(!new_banner_src) {
			this.setState({bannerField: true});
		} else {
			this.setState({
				bannerField: false
			});

			try {
				document.querySelector('.modal-edit-banner .btn-save').classList.add("load");
				
				const form = new FormData();
				form.append('file', banner_file_upload);
				
				await api.put(`companies/${company_id}/projects/${project_id}/banner/upload`, form);
				
				document.querySelector('.modal-edit-banner .btn-save').classList.remove("load");
				this.setState({
					banner_src: new_banner_src,
					new_banner_src: ''
				});

				this.modal('modal_banner', 'closed');
			} catch (error) {
				console.log(error);
			}
		}
	}

	hendleDeleteBanner = async (e) => {
		const { company_id, project_id } = this.state;
		try {
			document.querySelector('.modal-cancel .btn-delete').classList.add("load");
			console.log('delete banner');

			await api.delete(`companies/${company_id}/projects/${project_id}/banner/file`);
			await this.setState({
				banner_src: ""
			});
			await this.modal('modal_delete_banner', 'closed');
			await document.querySelector('.modal-cancel .btn-delete').classList.remove("load");
		} catch (error) {
			console.log(error);
		}
	}

	saveBannerDescription = async (e) => {
		e.preventDefault();
		
		const {company_id, project_id, new_banner_title, new_banner_description} = this.state;
		if(new_banner_title === "" || new_banner_description === "") {
			if(new_banner_title === "") {
				this.setState({
					titleBannerField: true
				})
			}
 
			if(!new_banner_description) {
				this.setState({
					descriptionBannerField: true,
				})
			}
		} else {
			this.setState({
				titleBannerField: false,
				descriptionBannerField: false
			})
			
			try {
				document.querySelector('.modal-edit-description .btn-save').classList.add("load");
				this.setState({
					banner_title: new_banner_title,
					banner_description: new_banner_description
				});

				await api.put(`companies/${company_id}/projects/${project_id}/banner_data`, {
					'title': new_banner_title,
					'description': new_banner_description
				});

				this.modal('modal_description', 'closed');
				document.querySelector('.modal-edit-description .btn-save').classList.remove("load");
			} catch (error) {
				console.log(error);
			}
		}
	}

	saveAboutUs = async (e) => {
		e.preventDefault();
		
		const {company_id, project_id, new_company_name, new_company_description} = this.state;
		if(new_company_description === "" || new_company_name === "") {
			if(new_company_description === "") {
				this.setState({
					aboutField: true
				})
			}
			if(new_company_name === "") {
				this.setState({
					companyNameField: true
				})
			}
		} else {
			this.setState({
				aboutField: false,
				companyNameField: false
			})

			try {
				document.querySelector('.modal-edit-about .btn-save').classList.add("load");
				this.setState({
					company_name: new_company_name,
					company_description: new_company_description
				});

				await api.put(`companies/${company_id}/projects/${project_id}`, {
					'title': this.state.project_title,
					'company_name': new_company_name,
					'company_description': new_company_description,
					'is_template': false
				});

				this.modal('modal_about', 'closed');
				document.querySelector('.modal-edit-about .btn-save').classList.remove("load");
			} catch (error) {
				console.log(error);
			}
		}
	}

	saveFile = async (e) => {
		e.preventDefault();

		const {company_id, project_id, new_file_id, new_file_title, new_file_url, new_file_description} = this.state;
		if(new_file_title === "" || new_file_url === "" || new_file_description === "") {
			if(new_file_title === "") {
				this.setState({
					fileTitleField: true
				})
			}
			if(new_file_url === "") {
				this.setState({
					fileDescriptionField: true
				})
			}
			if(new_file_description === "") {
				this.setState({
					fileUrlField: true
				})
			}
		} else {
			this.setState({
				fileTitleField: false,
				fileDescriptionField: false,
				fileUrlField: false
			})

			try {
				document.querySelector('.modal-edit-files .btn-save').classList.add("load");
				const url = new_file_url.includes('http') || new_file_url.includes('HTTP') ?  new_file_url : "https://"+new_file_url;

				if(new_file_id === 0) {
					const tempLinks = this.state.links;
					let newLink = {
						title: new_file_title,
						file_url: url,
						description: new_file_description
					};
					tempLinks.push(newLink);
					this.setState({
						links: tempLinks
					});

					await api.post(`companies/${company_id}/projects/${project_id}/files`,
						{
							"title": new_file_title,
							"file_url": url,
							"description": new_file_description
						}
					);
				} else {
					const tempLinks = this.state.links.map(item => {
						if(item.id === new_file_id) {
							item.title = new_file_title;
							item.description = new_file_description;
							item.fileUrl = url;
						}

						return item;
					});

					this.setState({
						links: tempLinks
					});

					await api.put(`companies/${company_id}/projects/${project_id}/files/${new_file_id}`, 
						{
							"title": new_file_title,
							"file_url": url,
							"description": new_file_description
						}
					);
				}
				this.modal('modal_file', 'closed');
				document.querySelector('.modal-edit-files .btn-save').classList.remove("load");
			} catch (error) {
				console.log(error);
			}
		}
	}

	hendleDeleteFile = async (e) => {
		document.querySelector('.modal-cancel .btn-delete').classList.add("load");
		const { company_id, project_id, file_to_delete } = this.state;
		try {
			let newLinks = this.state.links.filter( function(link) {
				return link.id !== file_to_delete;
			});

			console.log(newLinks);

			this.setState({
				links: newLinks
			});

			await api.delete(`companies/${company_id}/projects/${project_id}/files/${file_to_delete}`);

			this.modal('modal_delete_file', 'closed');
			document.querySelector('.modal-cancel .btn-delete').classList.remove("load");
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		let logo;
		if(this.state.logo_src) {
			logo = <img src={this.state.logo_src} alt={this.state.company_name}/>
		} else {
			logo = <img src="https://via.placeholder.com/200x60?text=Logo" alt={this.state.company_name}/>
		}

		let banner;
		if(this.state.banner_src) {
			banner = <img src={this.state.banner_src} alt={this.state.banner_title}/>
		}

		return (
			<div data-page="landing-page" className="project-edit">
				<div className={`loading-page ${this.state.loadingPage === true ? 'loading' : ''}`}></div>

				<header className="project-title">
					<div className="container">
						<div className="content">
							<div className="title-container">
								<h1 className="title">{this.state.project_title}</h1>
								<p className="text">This is your project page.<br />Here you can edit the project information before it is sent to publishers</p>
							</div>

							<Link to={`/projects`} className="btn blue-light">Back to projects list</Link>
						</div>
					</div>
				</header>

				<div className="landing-page-header">
					<div className="logo-partner">
						<div className="logo-content">
							{logo}

							<button className="edit-button" onClick={e => this.modal('modal_logo', 'opened')}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352.459 220c0-11.046-8.954-20-20-20h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20zM126.459 280c-11.046 0-20 8.954-20 20s8.954 20 20 20H251.57c11.046 0 20-8.954 20-20s-8.954-20-20-20H126.459z"/><path d="M173.459 472H106.57c-22.056 0-40-17.944-40-40V80c0-22.056 17.944-40 40-40h245.889c22.056 0 40 17.944 40 40v123c0 11.046 8.954 20 20 20s20-8.954 20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112 0-80 35.888-80 80v352c0 44.112 35.888 80 80 80h66.889c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/><path d="M467.884 289.572c-23.394-23.394-61.458-23.395-84.837-.016l-109.803 109.56a20.005 20.005 0 00-5.01 8.345l-23.913 78.725a20 20 0 0024.476 25.087l80.725-22.361a19.993 19.993 0 008.79-5.119l109.573-109.367c23.394-23.394 23.394-61.458-.001-84.854zM333.776 451.768l-40.612 11.25 11.885-39.129 74.089-73.925 28.29 28.29-73.652 73.514zM439.615 346.13l-3.875 3.867-28.285-28.285 3.862-3.854c7.798-7.798 20.486-7.798 28.284 0 7.798 7.798 7.798 20.486.014 28.272zM332.459 120h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/></svg>
							</button>
						</div>
					</div>

					<div className={`banner ${!this.state.banner_src ? "empty-banner" : ""}`}>
						<div className="banner-content">
							{banner}

								{ this.state.banner_src &&
									<button className="edit-button delete-button" onClick={e => this.modal('modal_delete_banner', 'opened')}>
										<svg height="427pt" viewBox="-40 0 427 427.001" width="427pt" xmlns="http://www.w3.org/2000/svg"><path d="M232.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0M114.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/><path d="M28.398 127.121V373.5c0 14.563 5.34 28.238 14.668 38.05A49.246 49.246 0 0078.796 427H268a49.233 49.233 0 0035.73-15.45c9.329-9.812 14.668-23.487 14.668-38.05V127.121c18.543-4.922 30.559-22.836 28.079-41.863-2.485-19.024-18.692-33.254-37.88-33.258h-51.199V39.5a39.289 39.289 0 00-11.539-28.031A39.288 39.288 0 00217.797 0H129a39.288 39.288 0 00-28.063 11.469A39.289 39.289 0 0089.398 39.5V52H38.2C19.012 52.004 2.805 66.234.32 85.258c-2.48 19.027 9.535 36.941 28.078 41.863zM268 407H78.797c-17.098 0-30.399-14.688-30.399-33.5V128h250v245.5c0 18.813-13.3 33.5-30.398 33.5zM109.398 39.5a19.25 19.25 0 015.676-13.895A19.26 19.26 0 01129 20h88.797a19.26 19.26 0 0113.926 5.605 19.244 19.244 0 015.675 13.895V52h-128zM38.2 72h270.399c9.941 0 18 8.059 18 18s-8.059 18-18 18H38.199c-9.941 0-18-8.059-18-18s8.059-18 18-18zm0 0"/><path d="M173.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/></svg>
									</button>
								}
								<button className="edit-button" onClick={e => this.modal('modal_banner', 'opened')}>
									{ this.state.banner_src &&
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352.459 220c0-11.046-8.954-20-20-20h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20zM126.459 280c-11.046 0-20 8.954-20 20s8.954 20 20 20H251.57c11.046 0 20-8.954 20-20s-8.954-20-20-20H126.459z"/><path d="M173.459 472H106.57c-22.056 0-40-17.944-40-40V80c0-22.056 17.944-40 40-40h245.889c22.056 0 40 17.944 40 40v123c0 11.046 8.954 20 20 20s20-8.954 20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112 0-80 35.888-80 80v352c0 44.112 35.888 80 80 80h66.889c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/><path d="M467.884 289.572c-23.394-23.394-61.458-23.395-84.837-.016l-109.803 109.56a20.005 20.005 0 00-5.01 8.345l-23.913 78.725a20 20 0 0024.476 25.087l80.725-22.361a19.993 19.993 0 008.79-5.119l109.573-109.367c23.394-23.394 23.394-61.458-.001-84.854zM333.776 451.768l-40.612 11.25 11.885-39.129 74.089-73.925 28.29 28.29-73.652 73.514zM439.615 346.13l-3.875 3.867-28.285-28.285 3.862-3.854c7.798-7.798 20.486-7.798 28.284 0 7.798 7.798 7.798 20.486.014 28.272zM332.459 120h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/></svg>
									}
									{ !this.state.banner_src &&
										"Insert a banner"
									}
								</button>
						</div>

						<div className="bannner-description">
							<div className="container">
								<h1 className="title">{this.state.banner_title}</h1>
								<div className="text white" data-component="text-editor">
									<Markup content={this.state.banner_description} />
								</div>

								<button className="edit-button" onClick={e => this.modal('modal_description', 'opened')}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352.459 220c0-11.046-8.954-20-20-20h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20zM126.459 280c-11.046 0-20 8.954-20 20s8.954 20 20 20H251.57c11.046 0 20-8.954 20-20s-8.954-20-20-20H126.459z"/><path d="M173.459 472H106.57c-22.056 0-40-17.944-40-40V80c0-22.056 17.944-40 40-40h245.889c22.056 0 40 17.944 40 40v123c0 11.046 8.954 20 20 20s20-8.954 20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112 0-80 35.888-80 80v352c0 44.112 35.888 80 80 80h66.889c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/><path d="M467.884 289.572c-23.394-23.394-61.458-23.395-84.837-.016l-109.803 109.56a20.005 20.005 0 00-5.01 8.345l-23.913 78.725a20 20 0 0024.476 25.087l80.725-22.361a19.993 19.993 0 008.79-5.119l109.573-109.367c23.394-23.394 23.394-61.458-.001-84.854zM333.776 451.768l-40.612 11.25 11.885-39.129 74.089-73.925 28.29 28.29-73.652 73.514zM439.615 346.13l-3.875 3.867-28.285-28.285 3.862-3.854c7.798-7.798 20.486-7.798 28.284 0 7.798 7.798 7.798 20.486.014 28.272zM332.459 120h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/></svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="about-us">
					<div className="container">
						<h2 className="title">{this.state.company_name}</h2>
						<div className="text black" data-component="text-editor">
							<Markup content={this.state.company_description} />
						</div>
					</div>

					<button className="edit-button" onClick={e => this.modal('modal_about', 'opened')}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352.459 220c0-11.046-8.954-20-20-20h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20zM126.459 280c-11.046 0-20 8.954-20 20s8.954 20 20 20H251.57c11.046 0 20-8.954 20-20s-8.954-20-20-20H126.459z"/><path d="M173.459 472H106.57c-22.056 0-40-17.944-40-40V80c0-22.056 17.944-40 40-40h245.889c22.056 0 40 17.944 40 40v123c0 11.046 8.954 20 20 20s20-8.954 20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112 0-80 35.888-80 80v352c0 44.112 35.888 80 80 80h66.889c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/><path d="M467.884 289.572c-23.394-23.394-61.458-23.395-84.837-.016l-109.803 109.56a20.005 20.005 0 00-5.01 8.345l-23.913 78.725a20 20 0 0024.476 25.087l80.725-22.361a19.993 19.993 0 008.79-5.119l109.573-109.367c23.394-23.394 23.394-61.458-.001-84.854zM333.776 451.768l-40.612 11.25 11.885-39.129 74.089-73.925 28.29 28.29-73.652 73.514zM439.615 346.13l-3.875 3.867-28.285-28.285 3.862-3.854c7.798-7.798 20.486-7.798 28.284 0 7.798 7.798 7.798 20.486.014 28.272zM332.459 120h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/></svg>
					</button>
				</div>

				<div className="links-container">
					<div className="container">
						<h3 className="title">Download</h3>

						<div className="links">
							<div className="link-header">
								<div className="col flex align-center sm-12 lg-3">
									<p className="title">Title</p>
								</div>
								<div className="col flex align-center sm-12 lg-6">
									<p className="title">Description</p>
								</div>
								<div className="col flex align-center sm-12 lg-3"></div>
							</div>

							{this.state.links.map(link => (
								<div className="link-container" key={`collaborator-${link.id}`}>
									<div className="col flex align-center sm-12 md-3 lg-3">
										<div className="link-col"><p className="text">{link.title}</p></div>
									</div>
									<div className="col flex align-center sm-12 md-7 lg-7">
										<div className="link-col"><p className="text">{link.description}</p></div>
									</div>
									<div className="col flex align-center sm-7 md-2 lg-2">
										<div className="link-col action">
											<button className="btn" onClick={e => this.modal('modal_delete_file', 'opened', link.id)}>Delete</button>

											<button className="btn" onClick={e => this.modal('modal_file', 'opened', link.id)} >Edit</button>
										</div>
									</div>
								</div>
							))}

							<button className="btn blue add-new-file" onClick={e => this.modal('modal_file', 'opened', 0)} >Add new file</button>
						</div>
					</div>
				</div>

				{/* ------------------------------------------------
					MODAIS -------------------------------------------
				  ---------------------------------------------- */}
				<div data-component="modal" className={`modal-project-edit h-auto ${this.state.modal_logo}`}>
					<div className="modal-container">
						<div className="modal-header">
							<p className="text">Logo</p>
							<button onClick={e => this.modal('modal_logo', 'closed')} className="btn btn-close"></button>
						</div>

						<div className={`modal-content modal-edit-logo ${this.state.logoField ? 'required-image' : ''}`}>
							{ this.state.logoField &&
								<span className="required-field">Insert a new logo</span>
							}
							<Upload title="" id="logoImage" size="500x100" imgPreview={this.state.new_logo_src ? this.state.new_logo_src : ""} handleClick={this.uploadLogo.bind(this)} />

							<div className="filed-infos">
								<div className="text-container">
									<b className="title">Recommended sizes:</b>
									<p className="text">
										Max height: 100px <br/>
										Max width: 500px
									</p>
								</div>
							</div>

							<button className="btn blue btn-save" onClick={e => this.saveLogo(e)}>Save</button>
						</div>
					</div>
				</div>

				<div data-component="modal" className={`modal-project-edit h-auto ${this.state.modal_banner}`}>
					<div className="modal-container">
						<div className="modal-header">
							<p className="text">Banner</p>
							<button onClick={e => this.modal('modal_banner', 'closed')} className="btn btn-close"></button>
						</div>

						<div className={`modal-content modal-edit-banner ${this.state.bannerField ? 'required-image' : ''}`}>
							{ this.state.bannerField &&
								<span className="required-field">Insert a new banner</span>
							}
							<Upload title="" id="bannerImage" size="1920x650" imgPreview={this.state.new_banner_src ? this.state.new_banner_src : ""} handleClick={this.uploadBanner.bind(this)} />

							<div className="filed-infos">
								<div className="text-container">
									<b className="title">Recommended sizes:</b>
									<p className="text">										
										Width: 1920px <br/>
										Height: 650px
									</p>
								</div>
							</div>

							<button className="btn blue btn-save" onClick={e => this.saveBanner(e)}>Save</button>
						</div>
					</div>
				</div>

				<div data-component="modal" className={`modal-cancel ${this.state.modal_delete_banner}`}>
					<div className="content">
						<p className="text">If you continue you will delete the banner from this project.<br /><b>Are you sure you want to delete this banner?</b></p>
						<button onClick={e => this.modal('modal_delete_banner', 'closed')} className="btn grey">No</button>
						<button onClick={(e) => this.hendleDeleteBanner()} to="/projects" className="btn blue-light btn-delete">Yes</button>
					</div>
				</div>

				<div data-component="modal" className={`modal-project-edit ${this.state.modal_description}`}>
					<div className="modal-container">
						<div className="modal-header">
							<p className="text">About the game</p>
							<button onClick={e => this.modal('modal_description', 'closed')} className="btn btn-close"></button>
						</div>

						<div className="modal-content modal-edit-description">
							<form action="">
								<input
									className={`${this.state.titleBannerField ? 'required-input' : ''}`}
									id="new_banner_title"
									name="new_banner_title"
									type="text"
									placeholder="Title"
									value={this.state.new_banner_title}
									onChange={e => this.onChange(e)}
								/>

								<CKEditor
									className={`${this.state.descriptionBannerField ? 'required-input' : ''}`}
									editor={ ClassicEditor }
									data={this.state.new_banner_description}
									onInit={ editor => {
										// You can store the "editor" and use when it is needed.
										console.log( 'Editor is ready to use!', editor );
									}}
									onChange={ ( event, editor ) => {
										const data = editor.getData();
										this.setState({new_banner_description: data});
										{/* console.log( { event, editor, data } ); */}
									}}
									onBlur={ ( event, editor ) => {
										console.log( 'Blur.', editor );
									}}
									onFocus={ ( event, editor ) => {
										console.log( 'Focus.', editor );
									}}
								/>
								{/* <textarea
									className={`${this.state.descriptionBannerField ? 'required-input' : ''}`}
									id="new_banner_description"
									name="new_banner_description"
									type="text"
									placeholder="Description"
									value={this.state.new_banner_description}
									onChange={e => this.onChange(e)}
								></textarea> */}

								<button type="submit" className="btn blue btn-save" onClick={(e) => this.saveBannerDescription(e)}>Save</button>
							</form>
						</div>
					</div>
				</div>

				<div data-component="modal" className={`modal-project-edit ${this.state.modal_about}`}>
					<div className="modal-container">
						<div className="modal-header">
							<p className="text">About us</p>
							<button onClick={e => this.modal('modal_about', 'closed')} className="btn btn-close"></button>
						</div>

						<div className="modal-content modal-edit-about">
							<form action="">
								<input
									className={`${this.state.companyNameField ? 'required-input' : ''}`}
									id="new_company_name"
									name="new_company_name"
									type="text"
									placeholder={this.state.company_name}
									value={this.state.new_company_name}
									onChange={e => this.onChange(e)}
								/>

								<CKEditor
									className={`${this.state.aboutField ? 'required-input' : ''}`}
									editor={ ClassicEditor }
									data={this.state.new_company_description}
									onInit={ editor => {
										// You can store the "editor" and use when it is needed.
										console.log( 'Editor is ready to use!', editor );
									}}
									onChange={ ( event, editor ) => {
										const data = editor.getData();
										this.setState({new_company_description: data});
										{/* console.log( { event, editor, data } ); */}
									}}
									onBlur={ ( event, editor ) => {
										console.log( 'Blur.', editor );
									}}
									onFocus={ ( event, editor ) => {
										console.log( 'Focus.', editor );
									}}
								/>
								{/* <textarea
									className={`${this.state.aboutField ? 'required-input' : ''}`}
									id="new_company_description"
									name="new_company_description"
									type="text"
									placeholder="Company description"
									value={this.state.new_company_description}
									onChange={e => this.onChange(e)}
								></textarea> */}

								<button type="submit" className="btn blue btn-save" onClick={(e) => this.saveAboutUs(e)}>Save</button>
							</form>
						</div>
					</div>
				</div>

				<div data-component="modal" className={`modal-project-edit h-auto ${this.state.modal_file}`}>
					<div className="modal-container">
						<div className="modal-header">
							<p className="text">File</p>
							<button onClick={e => this.modal('modal_file', 'closed')} className="btn btn-close"></button>
						</div>

						<div className="modal-content modal-edit-files">
							<form action="">
								<input
									className={`${this.state.fileTitleField ? 'required-input' : ''}`}
									autoComplete="off"
									name="new_file_title"
									type="text"
									placeholder="File name"
									value={this.state.new_file_title}
									onChange={e => this.onChange(e)}
								/>
								<input
									className={`${this.state.fileDescriptionField ? 'required-input' : ''}`}
									autoComplete="off"
									name="new_file_description"
									type="text"
									placeholder="Short description"
									value={this.state.new_file_description}
									onChange={e => this.onChange(e)}
								/>
								<input
									className={`${this.state.fileUrlField ? 'required-input' : ''}`}
									autoComplete="off"
									name="new_file_url"
									type="text"
									placeholder="url"
									value={this.state.new_file_url}
									onChange={e => this.onChange(e)}
								/>

								<button type="submit" className="btn blue btn-save" onClick={(e) => this.saveFile(e)}>Save</button>
							</form>
						</div>
					</div>
				</div>

				<div data-component="modal" className={`modal-cancel ${this.state.modal_delete_file}`}>
					<div className="content">
						<p className="text">If you continue you will delete all information contained in this item.<br /><b>Are you sure you want to delete this item?</b></p>
						<button onClick={e => this.modal('modal_delete_file', 'closed')} className="btn grey">No</button>
						<button onClick={(e) => this.hendleDeleteFile()} to="/projects" className="btn blue-light btn-delete">Yes</button>
					</div>
				</div>

				<footer className="preview-page">
					<div className="container">
						<Link to={`/projects`} className="btn blue-light">Back to projects list</Link>
					</div>
				</footer>
			</div>
		)
	};
}