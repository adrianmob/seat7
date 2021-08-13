import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { getUserType, getToken, getUserId } from "../../services/auth";
import api from '../../services/api';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Header from '../../components/header';
import TitlePage from '../../components/title-page';
import Upload from '../../components/upload';
import LandingPageT1 from '../../components/themes/theme-1/body-lp';

export default class CreateProject extends Component {
	state = {
		user_type: "",
		project_id: 0,
		projectTemplate_id: 0,
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
		banner_file_upload: "",
		inputFileBanner: "",
		about_company: "",
		file_title: "",
		file_description: "",
		file_url: "",
		links: [
		],
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
		project_type: "none",
		modal_project_type: 'opened',
		confidentiality: 'opened',
		fillName: false,
		fillLogo: false,
		fillFileTitle: false,
		fillFileDescription: false,
		fillFileUrl: false,
		check_save_default: "",
		cancel: false
	}

	componentDidMount() {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

		const company_id = this.props.match.params.company_id;
		const project_id = this.props.match.params.project_id;
		const user_type = getUserType();
		const selectedCompany = localStorage.getItem("company_selected");

		if(parseInt(project_id) === 0) {
			if(user_type === "admin") {
				this.setState({user_type: "admin"});
				this.loadApiCompany(selectedCompany);
			} else {
				this.setState({user_type: "normal"});
				this.loadApiUser();
			}
		} else {
			this.setState({company_id: company_id});
			this.loadApiProject(company_id, project_id);
		}
	}

	loadApiCompany = async (selectedCompany) => {
		try {
			const response = await api.get(`app_users?filter[include]=companies`);
			const list = [];
			response.data.map(company => {
				if (company.active) {
					company.companies.map(companie => (
						list.push(companie)
					))
				}
			});

			if(selectedCompany === null)
				selectedCompany = 0;

			let selected_item = [];
			if(selectedCompany !== 0) {
				selected_item = list.filter( item =>{
					if(parseInt(item.id) === parseInt(selectedCompany)) {
						return item;
					}
				});
				selected_item = selected_item[0];
			} else {
				selected_item = list[0];
			}

			this.setState({
				company_list: list,
				company_id: selected_item.id,
				company_name: selected_item.name,
				company_selected: selected_item.id
			})
		} catch(error) {
			console.log(error);
		}
	}

	loadApiUser = async () => {
		const token = getToken();
		const userId = getUserId();

		try {
			const response = await api.get(`app_users/${userId}?filter[include]=companies&access_token=${token}`);
			this.setState({
				company_id: response.data.companies[0].id,
				company_name: response.data.companies[0].name
			})
		} catch(error) {
			console.log(error);
		}
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
			
			console.log(response);
			await this.setState({
				company_name_field: response.data.company_name,
				project_name: response.data.title,
				about_company: response.data.company_description,
				banner_title: response2.data.title,
				banner_text: response2.data.description,
				links: response3.data,
				oiginal_links: originalFiles
			});

			// if(response.data.logo_url) {
			// 	await this.setState({
			// 		logo_src: 'https://seat7-uploads.s3.amazonaws.com/'+response.data.logo_url,
			// 	})
			// }

			// if(response2.data.image_url) {
			// 	await this.setState({
			// 		banner_src: 'https://seat7-uploads.s3.amazonaws.com/'+response2.data.image_url,
			// 	})
			// }
		} catch (error) {
			console.log(error);
		}
	}

	onChange = (e) => {
		this.setState({
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

	modalCancel = (status) => {
		if(status === "redirect") {
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

			this.setState({
				file_title: "",
				file_description: "",
				file_url: "",
				links: tempLinks
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

		this.setState({
			file_title: "",
			file_description: "",
			file_url: "",
			links: tempLinks
		});
	}

	deleteLink = (id) => {
		const tempLinks = this.state.links;
		let newArray = tempLinks.filter(link => link.id !== id);
		console.log(newArray);

		this.setState({
			links: newArray
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
			logo_src: file,
			logo_file_upload: file_upload
		})
	}

	uploadBanner = (file, file_upload) => {
		this.setState({
			banner_src: file,
			banner_file_upload: file_upload
		})
	}

	hendleSave = async (e) => {
		const { company_id, project_name, logo_src, company_name_field, about_company, check_save_default, project_type } = this.state;

		const is_template = check_save_default === "checked" ? true : false;

		this.setState({fillName: false});
		this.setState({fillLogo: false});

		if(!company_id || !project_name || !logo_src) {
			console.log('fill all fileds');
			if(!project_name) {
				this.setState({fillName: true})
				document.getElementById("project_name").focus();
			}

			if(!logo_src) {
				this.setState({fillLogo: true})
			}

			scrollToTop(100);
		} else {
			if(!project_name) {
				this.setState({fillName: false})
			}

			if(!logo_src) {
				this.setState({fillLogo: false})
			}

			try {
				document.querySelector('.actions .btn-save').classList.add("load");
				const response = await api.post(`companies/${company_id}/projects`, {
					'title': project_name,
					'company_name': company_name_field,
					'company_description': about_company,
					'is_template': false,
					'project_type': project_type
				});

				const project = response.data || null;
				if (!project || !project.id) {
					throw new Error('Ops! Unknown error when saving the project.')
				}

				await this.setState({ project_id : project.id });
				await this.insertLogo(this.state.project_id);
				await this.insertBanner(this.state.project_id);
				await this.insertFiles(this.state.project_id);

				if(is_template) {
					const responseTemplate = await api.post(`companies/${company_id}/projects`, {
						'title': project_name,
						'company_name': company_name_field,
						'company_description': about_company,
						'is_template': true,
						'project_type': project_type
					});
					const projectTemplate = responseTemplate.data || null;
					if (!projectTemplate || !projectTemplate.id) {
						throw new Error('Ops! Unknown error when saving the project template.')
					}

					await this.setState({ projectTemplate_id : projectTemplate.id });
					await this.insertLogo(this.state.projectTemplate_id);
					await this.insertBanner(this.state.projectTemplate_id);
					await this.insertFiles(this.state.projectTemplate_id);
				}
				
				//TODO: implement redirect to projects list, show success message
				await this.setState({ register_complete: true });

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

	insertLogo = async (project_id) => {
		try {
			const { company_id, logo_file_upload } = this.state
			const form = new FormData();
			form.append('file', logo_file_upload);

			return await api.put(`companies/${company_id}/projects/${project_id}/logo/upload`, form);
		} catch (error) {
			console.log("insertLogoImageError", error);
			throw error
		}
	}

	insertBanner = async (project_id) => {
		const { company_id, banner_title, banner_text, banner_file_upload } = this.state
		console.log('insert banner id project= ' + project_id);
		try {
			await api.put(`companies/${company_id}/projects/${project_id}/banner_data`, {
				'title': banner_title,
				'description': banner_text
			});

			if(banner_file_upload){
				return await this.insertBannerImage(project_id);
			}
		} catch (error) {
			console.log("insertBannerError", error);
			throw error
		}
	}

	insertBannerImage = async (project_id) => {
		try {
			const { company_id, banner_file_upload } = this.state
			const form = new FormData();
			form.append('file', banner_file_upload);

			return await api.put(`companies/${company_id}/projects/${project_id}/banner/upload`, form);
		} catch (error) {
			console.log("insertBannerImageError", error);
			throw error
		}
	}

	insertFiles = (project_id) => {
		const { company_id, links } = this.state
		console.log('insert files id project= ' + project_id);
		
		const linksPromises = links.map(link => {
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

	saveAsDefault = () => {
		this.setState({
			check_save_default: this.state.check_save_default === "checked" ? "" : "checked"
		})
	}

	modalProjectType = (status) => {
		this.setState({modal_project_type: status});
	}

	projectTypeSelect = (type) => {
		this.setState({
			project_type: type,
			modal_project_type: "closed"
		});
	}

	render() {
		if (this.state.cancel) {
			return <Redirect to='/projects' />
		}

		if (this.state.register_complete) {
			return <Redirect to='/projects' />
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

				<div className="company-list">
					{this.state.company_list.map(company => (
						<button className={`company-item ${this.state.company_id === company.id ? "active" : ''}`} key={`collaborator-${company.id}`} onClick={e => this.changeCompany(company.id)}>
							{company.name}
						</button>
					))}
				</div>
			</div>
		}
		// } else {
		// 	companies = <span className="company-name">{this.state.company_name}:</span>
		// }

		return (
			<div data-page="create-project">
				<Header />

				<TitlePage title="Projects / New Projects"/>

				<div className="container-fluid" data-component="create-project-content">
					<div className="container">
						<div className="actions-top">
							<Link to="/projects" className="btn blue-light">Back</Link>
							{/* <button onClick={e => this.modal('opened')} className="btn blue-light preview-button">Preview</button> */}
						</div>

						<div className="container-content">
							<div className="content">
								<div className="field-project-type">
									<button className="btn blue change-type" onClick={e => this.modalProjectType('opened')}>Change Project Type</button>
								</div>

								<div className="field-name-container">
									<p className="title">Project title</p>
									<div className={`field-name ${this.state.fillName === true ? "required" : ""}`}>
										{companies}
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
											{/* {this.state.logo_src &&
												<div className="current-logo">
													<img src={this.state.logo_src} alt={this.state.company_name}/>

													<p className="text">Change Logo</p>
												</div>
											} */}

											<Upload title="" id="logoImage" size="500x100" imgPreview={this.state.logo_src ? this.state.logo_src : ""} handleClick={this.uploadLogo.bind(this)} />

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
													<p className="text">Please insert a logo for this project</p>
												</div>
											}
										</div>
									</div>

									<div className={`accordion-item ${this.state.accordion[1] === true ? 'opened' : ''}`}  id="1">
										<button className="accordion-button" onClick={e => this.acorddion(e)}>About the game</button>
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

											{/* {this.state.banner_src &&
												<div className="current-banner">
													<div className="current-banner-thumb">
														<img src={this.state.banner_src} alt={this.state.company_name}/>
													</div>

													<p className="text">Change banner</p>
												</div>
											} */}

                      <Upload title="Banner Image" id="bannerImage" size="1920x650" imgPreview={this.state.banner_src ? this.state.banner_src : ""} handleClick={this.uploadBanner.bind(this)}/>

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

								<div className="save-as-default">
									<button onClick={(e) => this.saveAsDefault()} className={`${this.state.check_save_default}`}>
										<p className="text"> Save project as default </p>
									</button>

									<div className="filed-infos">
										<div className="text-container">
											<b className="title">Obs:</b>
											<p className="text">By checking this field, you can set up this page as a template. The fields will be already be filled in with the information above to create new projects quicker and more efficiently.</p>
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

				<div data-component="modal" className={`modal-project-type ${this.state.modal_project_type}`}>
					<div className="content">
						<button onClick={e => this.modalProjectType('closed')} className="close-modal"></button>

						<p className="text">Select the type of project you are creating</p>
						<div className="content-buttons">
							<button onClick={e => this.projectTypeSelect("production")} className={`btn blue ${this.state.project_type === "production" ? "active" : ""}`}>In Production</button>
							<button onClick={e => this.projectTypeSelect("finished")} className={`btn blue ${this.state.project_type === "finished" ? "active" : ""}`}>Finished Game</button>
						</div>
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
