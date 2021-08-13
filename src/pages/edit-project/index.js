import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { getUserType } from "../../services/auth";
import api from '../../services/api';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Header from '../../components/header';
import TitlePage from '../../components/title-page';
import Upload from '../../components/upload';
import LandingPageT1 from '../../components/themes/theme-1/body-lp';

export default class EditProject extends Component {
	state = {
		user_type: "",
		project_id: 0,
		company_list: [],
		company_list_opened: false,
		company_selected: 0,
		company_id: "",
		company_name: "",
		company_name_field: "",
		project_name: "",
		logo_src: "",
		logo_file_upload: "",
		banner_title: "",
		banner_text: "",
		banner_src: "",
		current_banner: false,
		banner_file_upload: "",
		inputFileBanner: "",
		about_company: "",
		file_title: "",
		file_description: "",
		file_url: "",
		oiginal_links: [],
		links: [],
		id_link_edit: 0,
		accordion: [
			true,
			false,
			false,
			false
		],
		firstClickAccordion: true,
		modal_status: 'closed',
		modal_cancel: 'closed',
		modal_delete_banner: 'closed',
		confidentiality: 'opened',
		fillName: false,
		fillLogo:  false,
		fillFileTitle: false,
		fillFileDescription: false,
		fillFileUrl: false,
		nothing_changed: true,
		cancel: false,
		new_files: [],
		edit_files: [],
		delete_files: [],
		loadingPage: true
	}

	componentDidMount() {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

		const company_id = this.props.match.params.company_id;
		const project_id = this.props.match.params.project_id;
		const user_type = getUserType();

		this.setState({user_type: user_type});
		this.setState({ company_id, project_id });
		this.loadApiProject(company_id, project_id);
	}

	loadApiProject = async (company_id, project_id) => {
		try {
			const response = await api.get(`companies/${company_id}/projects/${project_id}`);
			const response2 = await api.get(`companies/${company_id}/projects/${project_id}/banner`);
			const response3 = await api.get(`companies/${company_id}/projects/${project_id}/files`);

			let originalFiles = []
			response3.data.map(item => {
				originalFiles.push(item.id);
			})

			await this.setState({
				company_name_field: response.data.company_name,
				project_name: response.data.title,
				about_company: response.data.company_description,
				banner_title: response2.data.title,
				banner_text: response2.data.description,
				links: response3.data,
				oiginal_links: originalFiles,
				loadingPage: false
			});
			
			if(response.data.logo_url) {
				this.setState({
					logo_src: 'https://seat7-uploads.s3.amazonaws.com/'+response.data.logo_url,
				})
			}

			if(response2.data.image_url) {
				this.setState({
					current_banner: true,
					banner_src: 'https://seat7-uploads.s3.amazonaws.com/'+response2.data.image_url,
				})
			}
		} catch (error) {
			console.log(error);
		}
	}

	onChange = (e) => {
		this.setState({
			nothing_changed: false,
			[e.target.name]: e.target.value,
		});
	}

	modal = (status) => {
		this.setState({modal_status: status})

		if(status === "opened") {
			document.querySelector('body').classList.add("no-scroll");
		} else {
			document.querySelector('body').classList.remove("no-scroll");
		}
	}

	modalBannerDelete = (status) => {
		this.setState({modal_delete_banner: status})

		if(status === "opened") {
			document.querySelector('body').classList.add("no-scroll");
		} else {
			document.querySelector('body').classList.remove("no-scroll");
		}
	}

	modalCancel = (status) => {
		if(status === "redirect" || this.state.nothing_changed) {
			document.querySelector('body').classList.remove("no-scroll");
			this.setState({cancel: true});
		} else {
			this.setState({modal_cancel: status});
			if(status === "opened") {
				document.querySelector('body').classList.add("no-scroll");
			} else {
				document.querySelector('body').classList.remove("no-scroll");
			}
		}
	}

	addLink = (e) => {
		this.setState({
			nothing_changed: false,
			fillFileTitle: false,
			fillFileDescription: false,
			fillFileUrl: false
		});

		const {file_title, file_description, file_url} = this.state;
		if(!file_title || !file_description || !file_url) {
			if(!file_title) {
				this.setState({
					fillFileTitle: true
				})
			}
			if(!file_description) {
				this.setState({
					fillFileDescription: true
				})
			}
			if(!file_url) {
				this.setState({
					fillFileUrl: true
				})
			}
		} else {
			let tempNewFiles = this.state.new_files;
			const tempLinks = this.state.links;
			const id = tempLinks.length > 0 ? tempLinks[tempLinks.length-1].id + 1 : 0;
			
			const url = file_url.includes('http') || file_url.includes('HTTP') ?  file_url : "https://"+file_url;
			const link = {
				id: id,
				title: file_title,
				description: file_description,
				file_url: url
			};
			tempLinks.push(link);
			tempNewFiles.push(id);

			this.setState({
				file_title: "",
				file_description: "",
				file_url: "",
				links: tempLinks,
				new_files: tempNewFiles
			});

			//Fix height accordion
			setTimeout(() => {
				const elAccordion = document.querySelector('.accordion-item.files');
				const height = parseFloat(getComputedStyle(elAccordion.querySelector('.accordion-content'), null).height.replace("px", "")) + 46;
				elAccordion.style.height = height+'px';
			}, 100);
		}
	}

	selectEditLink = (id) => {
		document.querySelector('.add-link-bt').classList.add("inactive");
		document.querySelector('.edit-link-bt').classList.remove("inactive");
		document.querySelector('.accordion-item.files .accordion-content .label:nth-child(2) input').focus();

		this.setState({
			fillFileTitle: false,
			fillFileDescription: false,
			fillFileUrl: false
		});

		let linkEdit;
		this.state.links.forEach(function (link) {
			if(link.id === id) {
				linkEdit = link;
			}
		});

		const tempUrl = linkEdit.file_url.includes('http') || linkEdit.file_url.includes('HTTP') ?  linkEdit.file_url : "https://"+linkEdit.file_url;
		this.setState({
			file_title: linkEdit.title,
			file_description: linkEdit.description,
			file_url: tempUrl,
			id_link_edit: id
		});
	}

	editLink = (id) => {
		document.querySelector('.add-link-bt').classList.remove("inactive");
		document.querySelector('.edit-link-bt').classList.add("inactive");

		let tempEditFiles = this.state.edit_files;
		let tempOriginalFiles = this.state.oiginal_links;
		const tempLinks = this.state.links;
		const tempTitle = this.state.file_title;
		const tempDescription = this.state.file_description;
		const tempUrl = this.state.file_url.includes('http') || this.state.file_url.includes('HTTP') ?  this.state.file_url : "https://"+this.state.file_url;

		tempLinks.forEach(function (link) {
			if(link.id === id) {
				link.title = tempTitle;
				link.description = tempDescription;
				link.file_url = tempUrl;
			}
		});

		tempOriginalFiles.map( link => {
			if(link === id) {
				let flag = true;
				tempEditFiles.map(item =>{
					if(item == id){
						flag = false;
					}
				})

				if(flag){
					tempEditFiles.push(id);
				}
			}
		})

		this.setState({
			nothing_changed: false,
			file_title: "",
			file_description: "",
			file_url: "",
			original_file: tempOriginalFiles,
			links: tempLinks,
			edit_files: tempEditFiles
		});
	}

	deleteLink = (id) => {
		let tempDeleteFiles = this.state.delete_files;
		const tempLinks = this.state.links;
		let newArray = tempLinks.filter(link => link.id !== id);

		this.state.oiginal_links.map( link => {
			if(link === id) {
				let flag = true;
				tempDeleteFiles.map(item =>{
					if(item == id){
						flag = false;
					}
				})

				if(flag){
					tempDeleteFiles.push(id);
				}
			}
		})

		this.setState({
			nothing_changed: false,
			links: newArray,
			delete_files: tempDeleteFiles
		});

		//Fix height accordion
		setTimeout(() => {
			const elAccordion = document.querySelector('.accordion-item.files');
			const height = parseFloat(getComputedStyle(elAccordion.querySelector('.accordion-content'), null).height.replace("px", "")) + 46;
			elAccordion.style.height = height+'px';
		}, 100);
	}

	acorddion = (e) => {
		const el = e.target.parentElement;
		const id = parseInt(el.id);
		let temp = this.state.accordion;

		if (temp[id] === true){
			if (this.state.firstClickAccordion) {
				//add height on first render
				const height = parseFloat(getComputedStyle(el.querySelector('.accordion-content'), null).height.replace("px", "")) + 46;
				el.style.height = height+'px';
				this.setState({firstClickAccordion: false});

				setTimeout(() => {
					el.style.height = '45px';
				}, 100);
			} else {
				el.style.height = '45px';
			}

			temp[id] = false;
		}else {
			const height = parseFloat(getComputedStyle(el.querySelector('.accordion-content'), null).height.replace("px", "")) + 46;
			el.style.height = height+'px';
			temp[id] = true;
		}
			
		this.setState({accordion: temp});
	}

	openCompanyList = () => {
		if(this.state.company_list_opened) {
			this.setState({company_list_opened: false})

		} else {
			this.setState({company_list_opened: true})
		}
	}

	changeCompany = (id) => {
		let company_name = "";

		this.state.company_list.forEach(function (company) {
			if(company.id === id) {
				company_name = company.name;
			}
		});

		this.setState({
			company_selected: id,
			company_id: id,
			company_name: company_name,
		})
	}

	uploadLogo = (file, file_upload) => {
		this.setState({
			nothing_changed: false,
			logo_src: file,
			logo_file_upload: file_upload
		})
	}

	uploadBanner = (file, file_upload) => {
		this.setState({
			nothing_changed: false,
			banner_src: file,
			banner_file_upload: file_upload
		})
	}

	hendleSave = async (e) => {
		const { project_id, company_id, project_name, logo_file_upload, banner_file_upload, company_name_field, about_company, new_files, edit_files, delete_files } = this.state;

		this.setState({fillName: false});
		this.setState({fillLogo: false});

		// if(!company_id || !project_name || !logo_src) {
		if(!company_id || !project_name) {
			if(!project_name) {
				this.setState({fillName: true})
				document.getElementById("project_name").focus();
			}

			scrollToTop(100);
		} else {
			if(!project_name) {
				this.setState({fillName: false})
			}

			try {
				document.querySelector('.actions .btn-save').classList.add("load");
				const response = await api.put(`companies/${company_id}/projects/${project_id}`, {
						'title': project_name,
						'company_name': company_name_field,
						'company_description': about_company
				});

				const project = response.data || null;
				if (!project || !project.id) {
						throw new Error('Ops! Unknown error when saving the project.')
				}

				if(logo_file_upload) {
					await this.insertLogo();
				}

				await this.insertBanner();

				if(edit_files.length > 0){
					await this.editFilesDataBase();
				}
				if(new_files.length > 0){
					await this.insertFiles();
				}
				if(delete_files.length > 0) {
					await this.deleteFiles();
				}

				await this.setState({
					nothing_changed: true,
					register_complete: true
				})
				//TODO: implement redirect to projects list, show success message
				return true
			} catch (error) {
					//TODO: add error alert message
				console.log(error);
			}
		}

		function scrollToTop(scrollDuration) {
			const scrollStep = -window.scrollY / (scrollDuration / 15);
				const scrollInterval = setInterval( _ => {
				if ( window.scrollY !== 0 ) {
					window.scrollBy( 0, scrollStep );
				} else {
					clearInterval(scrollInterval); 
				}
			}, 15);
		}
	}

	insertLogo = async _ => {
		try {
			const { company_id, project_id, logo_file_upload } = this.state
			const form = new FormData();
			form.append('file', logo_file_upload);
			console.log('insert logo for project:' + project_id);

			return await api.put(`companies/${company_id}/projects/${project_id}/logo/upload`, form);
		} catch (error) {
			console.log("insertLogoImageError", error);
			throw error
		}
	}

	insertBanner = async _ => {
		const { company_id, project_id, banner_title, banner_text, banner_file_upload } = this.state
		console.log('indert banner id project= ' + project_id);
		try {
			await api.put(`companies/${company_id}/projects/${project_id}/banner_data`, {
				'title': banner_title,
				'description': banner_text
			});

			if(banner_file_upload){
				return await this.insertBannerImage();
			}
		} catch (error) {
			console.log("insertBannerError", error);
			throw error
		}
	}

	insertBannerImage = async _ => {
		try {
			const { company_id, project_id, banner_file_upload } = this.state
			const form = new FormData();
			form.append('file', banner_file_upload);
			console.log("insert banner file");
            
			return await api.put(`companies/${company_id}/projects/${project_id}/banner/upload`, form);
		} catch (error) {
			console.log("insertBannerImageError", error);
			throw error
		}
	}

	editFilesDataBase = () => {
		console.log("edit files");
		const { company_id, project_id, links, edit_files } = this.state
		
		let editLinks = [];
		links.map( link => {
			edit_files.map(item => {
				if(link.id === item) {
					editLinks.push(link);
				}
			})
		})

		const linksPromisesEdit = editLinks.map(link => {
			const url = link.file_url.includes('http') || link.file_url.includes('HTTP') ?  link.file_url : "https://"+link.file_url;

			return api.put(
				`companies/${company_id}/projects/${project_id}/files/${link.id}`, 
				{
					"title": link.title,
					"file_url": url,
					"description": link.description
				}
			);
		})

		return Promise.all(linksPromisesEdit);
	}

	insertFiles = () => {
		console.log("insert files");
		const { company_id, project_id, links, new_files } = this.state;

		let newLinks = [];
		links.map( link => {
			new_files.map(item => {
				if(link.id === item) {
					newLinks.push(link);
				}
			})
		})

		const linksPromises = newLinks.map(link => {
			const url = link.file_url.includes('http') || link.file_url.includes('HTTP') ?  link.file_url : "https://"+link.file_url;

			return api.post(
				`companies/${company_id}/projects/${project_id}/files`,
				{
					"title": link.title,
					"file_url": url,
					"description": link.description
				}
			);
		})

		return Promise.all(linksPromises);
	}

	deleteFiles = () => {
		console.log("delete files");
		const { company_id, project_id, delete_files } = this.state;

		const linksPromises = delete_files.map(link => {
			return api.delete(`companies/${company_id}/projects/${project_id}/files/${link}`);
		})

		return Promise.all(linksPromises);
	}	

	hendleDeleteBanner = async (e) => {
		const { company_id, project_id } = this.state;
		try {
			document.querySelector('.modal-cancel .btn-delete').classList.add("load");

			await api.delete(`companies/${company_id}/projects/${project_id}/banner/file`);
			await this.setState({
				current_banner: false,
				banner_src: ""
			});
			await this.modalBannerDelete('closed');
			await document.querySelector('.modal-cancel .btn-delete').classList.remove("load");
			
			//Fix height accordion
			setTimeout(() => {
				const elAccordion = document.querySelector('.accordion-item.banner');
				const height = parseFloat(getComputedStyle(elAccordion.querySelector('.accordion-content'), null).height.replace("px", "")) + 46;
				elAccordion.style.height = height+'px';
			}, 100);
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		if (this.state.cancel) {
			return <Redirect to={`/shipping-management/${this.state.company_id}/${this.state.project_id}`} />
		}

		if (this.state.register_complete) {
			return <Redirect to={`/shipping-management/${this.state.company_id}/${this.state.project_id}`} />
		}

		let logo;
		if(this.state.logo_src) {
			logo = <img src={this.state.logo_src} alt={this.state.company_name}/>
		} else {
			logo = <img src="https://via.placeholder.com/200x60?text=Logo" alt="logo"/>
		}

		let banner;
		if(this.state.banner_src) {
			banner = <img src={this.state.banner_src} alt={this.state.banner_title}/>
		}

		let companies;
		if(this.state.user_type === "admin") {
			companies = <div data-component="company-selection" className={`company-list-container ${this.state.company_list_opened === true ? "active" : ""}`} onClick={(e) => this.openCompanyList()}>
				{this.state.company_name} :
			</div>
		} else {
			companies = <span className="company-name">{this.state.company_name}:</span>
		}

		return (
			<div data-page="create-project" className="edit-project">
				<div className={`loading-page ${this.state.loadingPage === true ? 'loading' : ''}`}></div>
				<Header />

				<TitlePage title="Projects / New Projects"/>

				<div className="container-fluid" data-component="create-project-content">
					<div className="container">
						<div className="actions-top">
							<button className="btn blue-light" onClick={e => this.modalCancel('opened')}>Back</button>
							{/* <Link to="/projects" className="btn blue-light">Back</Link> */}
							{/* <button onClick={e => this.modal('opened')} className="btn blue-light preview-button">Preview</button> */}
						</div>

						<div className="container-content">
							<div className="content">
								<div className="field-name-container">
									<div className={`field-name ${this.state.fillName === true ? "required" : ""}`}>
										{/* {companies} */}
										<input
											autoComplete="off"
											id="project_name"
											name="project_name"
											type="text"
											placeholder="Insert a project name"
											value={this.state.project_name}
											onChange={e => this.onChange(e)}
										/>
									</div>

									{this.state.fillName &&
										<div className="required-field">
											<p className="text">Please give your project a name</p>
										</div>
									}
								</div>

								<div className="accordion">
									<div className={`accordion-item ${this.state.accordion[0] === true ? 'opened' : ''}`}  id="0">
										<button className="accordion-button" onClick={e => this.acorddion(e)}>Insert Logo</button>
										<div className="accordion-content">
											{this.state.logo_src &&
												<div className="current-logo">
													<img src={this.state.logo_src} alt={this.state.company_name}/>

													<p className="text">Change Logo</p>
												</div>
											}

											<Upload title="" id="logoImage" size="500x100" imgPreview={this.state.logo_file_upload ? this.state.logo_src : ""} handleClick={this.uploadLogo.bind(this)} />

											<div className="filed-infos">
												<div className="text-container">
													<b className="title">Recommended sizes:</b>
													<p className="text">
														Max height: 100px <br/>
														Max width: 500px
													</p>
												</div>
											</div>

											{this.state.fillLogo &&
												<div className="required-field">
													<p className="text">Please insert your company logo</p>
												</div>
											}
										</div>
									</div>

									<div className={`accordion-item banner ${this.state.accordion[1] === true ? 'opened' : ''}`}  id="1">
										<button className="accordion-button" onClick={e => this.acorddion(e)}>Banner</button>
										<div className="accordion-content">
											<div className="label">
												<p className="label-text">Title</p>
												<input
													autoComplete="off"
													name="banner_title"
													type="text"
													placeholder="Title"
													value={this.state.banner_title}
													onChange={e => this.onChange(e)}
												/>
											</div>
											<div className="label">
												<p className="label-text">Text</p>
												<CKEditor
													editor={ ClassicEditor }
													data={this.state.banner_text}
													onInit={ editor => {
														// You can store the "editor" and use when it is needed.
														console.log( 'Editor is ready to use!', editor );
													}}
													onChange={ ( event, editor ) => {
														const data = editor.getData();
														this.setState({banner_text: data});
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
													autoComplete="off"
													name="banner_text"
													type="text"
													placeholder="Game description"
													value={this.state.banner_text}
													onChange={e => this.onChange(e)}
												></textarea> */}
											</div>

											{this.state.current_banner &&
												<div className="current-banner">
													<div className="current-banner-thumb">
														<img src={this.state.banner_src} alt={this.state.company_name}/>

														<button className="edit-button delete-button" onClick={e => this.modalBannerDelete('opened')}>
															<svg height="427pt" viewBox="-40 0 427 427.001" width="427pt" xmlns="http://www.w3.org/2000/svg"><path d="M232.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0M114.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/><path d="M28.398 127.121V373.5c0 14.563 5.34 28.238 14.668 38.05A49.246 49.246 0 0078.796 427H268a49.233 49.233 0 0035.73-15.45c9.329-9.812 14.668-23.487 14.668-38.05V127.121c18.543-4.922 30.559-22.836 28.079-41.863-2.485-19.024-18.692-33.254-37.88-33.258h-51.199V39.5a39.289 39.289 0 00-11.539-28.031A39.288 39.288 0 00217.797 0H129a39.288 39.288 0 00-28.063 11.469A39.289 39.289 0 0089.398 39.5V52H38.2C19.012 52.004 2.805 66.234.32 85.258c-2.48 19.027 9.535 36.941 28.078 41.863zM268 407H78.797c-17.098 0-30.399-14.688-30.399-33.5V128h250v245.5c0 18.813-13.3 33.5-30.398 33.5zM109.398 39.5a19.25 19.25 0 015.676-13.895A19.26 19.26 0 01129 20h88.797a19.26 19.26 0 0113.926 5.605 19.244 19.244 0 015.675 13.895V52h-128zM38.2 72h270.399c9.941 0 18 8.059 18 18s-8.059 18-18 18H38.199c-9.941 0-18-8.059-18-18s8.059-18 18-18zm0 0"/><path d="M173.398 154.703c-5.523 0-10 4.477-10 10v189c0 5.52 4.477 10 10 10 5.524 0 10-4.48 10-10v-189c0-5.523-4.476-10-10-10zm0 0"/></svg>
														</button>
													</div>

													<p className="text">Change banner</p>
												</div>
											}

											<Upload title="Image" id="bannerImage" size="1920x650" imgPreview={this.state.banner_file_upload ? this.state.banner_src : ""} handleClick={this.uploadBanner.bind(this)}/>

											<div className="filed-infos">
												<div className="text-container">
													<b className="title">Recommended sizes:</b>
													<p className="text">
														Width: 1920px <br/>
														Height: 650px
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className={`accordion-item ${this.state.accordion[2] === true ? 'opened' : ''}`}  id="2">
										<button className="accordion-button" onClick={e => this.acorddion(e)}>About company</button>
										<div className="accordion-content">
											<div className="label">
												<p className="label-text">Company name</p>
												<input
													autoComplete="off"
													name="company_name_field"
													type="text"
													placeholder="Title"
													value={this.state.company_name_field}
													onChange={e => this.onChange(e)}
												/>
											</div>
											<div className="label">
												<p className="label-text">About company</p>
												<CKEditor
													editor={ ClassicEditor }
													data={this.state.about_company}
													onInit={ editor => {
														// You can store the "editor" and use when it is needed.
														console.log( 'Editor is ready to use!', editor );
													}}
													onChange={ ( event, editor ) => {
														const data = editor.getData();
														this.setState({about_company: data});
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
													autoComplete="off"
													name="about_company"
													type="text"
													placeholder="Company description"
													value={this.state.about_company}
													onChange={e => this.onChange(e)}
												></textarea> */}
											</div>
										</div>
									</div>
									
									<div className={`accordion-item files ${this.state.accordion[3] === true ? 'opened' : ''}`} id="3">
										<button className="accordion-button" onClick={e => this.acorddion(e)}>Files</button>
										<div className="accordion-content">
											<p className="title-accordion-item">Insert file links</p>

											<div className={`label ${this.state.fillFileTitle ? "required-field" : ''}`}>
												<p className="label-text">Title</p>
												<input
													autoComplete="off"
													name="file_title"
													type="text"
													placeholder="File name"
													value={this.state.file_title}
													onChange={e => this.onChange(e)}
												/>
											</div>
											<div className={`label ${this.state.fillFileDescription ? "required-field" : ''}`}>
												<p className="label-text">Description</p>
												<input
													autoComplete="off"
													name="file_description"
													type="text"
													placeholder="Short description"
													value={this.state.file_description}
													onChange={e => this.onChange(e)}
												/>
											</div>
											<div className={`label ${this.state.fillFileUrl ? "required-field" : ''}`}>
												<p className="label-text">URL</p>
												<input
													autoComplete="off"
													name="file_url"
													type="text"
													placeholder="url"
													value={this.state.file_url}
													onChange={e => this.onChange(e)}
												/>
											</div>

											<div className="label label-button">
												<button className="btn blue-light add-link-bt" onClick={(e) => this.addLink()}>Add</button>
												<button className="btn blue-light edit-link-bt inactive" onClick={(e) => this.editLink(this.state.id_link_edit)}>Edit</button>
											</div>

											{this.state.links.length > 0 &&
												<div className="list-links">
													<div className="link-header">
														<div className="col flex align-center sm-12 md-3 lg-3">
															<p className="title">Title</p>
														</div>
														<div className="col flex align-center sm-12 md-5 lg-5">
															<p className="title">Description</p>
														</div>
														<div className="col flex align-center sm-12 md-4 lg-4 table-actions">
															<p className="title">Actions</p>
														</div>
													</div>

													{this.state.links.map(link => (
														<div className="link-container" key={`collaborator-${link.id}`}>
															<div className="col flex align-center sm-12 md-3 lg-3">
																<div className="link-col"><p className="text">{link.title}</p></div>
															</div>
															<div className="col flex align-center sm-12 md-5 lg-5">
																<div className="link-col"><p className="text">{link.description}</p></div>
															</div>
															<div className="col flex align-center sm-12 md-4 lg-4 table-actions">
																<div className="link-col">
																	<button target="blank" className="btn grey" onClick={(e) => this.selectEditLink(link.id)}>EDIT</button>
																	<button target="blank" className="btn grey" onClick={(e) => this.deleteLink(link.id)}>DELETE</button>
																</div>
															</div>
														</div>
													))}
												</div>
											}
										</div>
									</div>
								</div>

								<div className="actions">
									<button onClick={e => this.modal('opened')} className="btn blue-light preview-button preview-button-mobile">Preview</button>

									<button onClick={e => this.modalCancel('opened')}  className="btn dark-grey">Cancel</button>
									<button onClick={e => this.hendleSave()} className="btn blue-light btn-save">Save</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				

				<div data-component="modal" className={`modal-cancel ${this.state.modal_delete_banner}`}>
					<div className="content">
						<p className="text">If you continue you will delete the banner from this project.<br /><b>Are you sure you want to delete this banner?</b></p>
						<button onClick={e => this.modalBannerDelete('closed')} className="btn grey">No</button>
						<button onClick={(e) => this.hendleDeleteBanner()} to="/projects" className="btn blue-light btn-delete">Yes</button>
					</div>
				</div>

				<div data-component="modal" className={`modal-cancel ${this.state.modal_cancel}`}>
					<div className="content">
						<p className="text">If you proceed without save you will lose the entire process!<br /><b>Are you sure you want to cancel?</b></p>
						<button onClick={e => this.modalCancel('closed')} className="btn grey">No</button>
						<button onClick={e => this.modalCancel('redirect')} to="/projects" className="btn blue-light">Yes</button>
					</div>
				</div>



				{/* ---------------------------
				MODAL LANDING PAGE-------------
				--------------------------- */}
				<div data-component="modal" className={`${this.state.modal_status}`}>
					<button onClick={e => this.modal('closed')} className="close-modal"></button>

					<LandingPageT1
						logo={logo}
						banner={banner}
						bannerTitle={this.state.banner_title}
						bannerText={this.state.banner_text}
						companyName={this.state.company_name}
						aboutCompany={this.state.about_company}
						links={this.state.links}
					/>
				</div>
			</div>
		)
	};
}
