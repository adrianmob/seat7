import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import api from '../../services/api';
import { getToken, getUserType, getUserId, logout, isAuthenticated } from "../../services/auth";

import Header from '../../components/header';
import TitlePage from '../../components/title-page';
// import Search from '../../components/search';

export default class Main extends Component {
	state = {
		redirect: false, 
		loadingPage: true,
		user_type: "",
		search: "",
		company_list: [],
		company_list_opened: false,
		company_selected: "",
		company_id: "",
		company_name: "",
		projects: [],
		loading_projects: true,
		modal_delete: "closed",
		modal_beta: "closed",
		selected_project: ""
	}

	constructor(props){
    super(props);
		this.escFunction = this.escFunction.bind(this);
	}

	componentDidMount() {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

		const currentUser = getUserType();
		const selectedCompany = localStorage.getItem("company_selected");

		const beta_already_shown = localStorage.getItem("beta");
		
		if(beta_already_shown === null) {
			this.modalBeta("opened");
		}

		if(currentUser === "admin") {
			this.setState({user_type: "admin"});
			this.loadApiCompany(selectedCompany);
		} else {
			this.setState({user_type: "normal"});
			this.loadApiUser();
		}

		document.addEventListener("keydown", this.escFunction, false);
	}

  componentWillUnmount(){
		document.removeEventListener("keydown", this.escFunction, false);
  }

  escFunction(event){
    if(event.keyCode === 27) {
			const elements = document.querySelectorAll(".card-container .options");
			elements.forEach( element => {
				if(element.classList.contains('opened')) {
					element.classList.remove("opened");
					element.classList.add("closed");
				}
			});

			this.setState({company_list_opened: false})
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

			this.loadApiProject(selected_item.id);
		} catch(error) {
			if (error == "Error: Request failed with status code 401"){
				logout();

				setTimeout(() => {
					this.setState({redirect: true})
				}, 1000);
			} else {
				localStorage.removeItem("company_selected");
				const selectedCompany = localStorage.getItem("company_selected");
				this.loadApiCompany(selectedCompany);
				console.log(error);
			}
		}
	}

	loadApiUser = async () => {
		const token = getToken();
		const userId = getUserId();

		try {
			const response = await api.get(`app_users/${userId}?filter[include]=companies&access_token=${token}`);
			this.setState({
				company_id: response.data.companies[0].id
			})

			this.loadApiProject(response.data.companies[0].id);
		} catch(error) {
			logout();

			setTimeout(() => {
				this.setState({redirect: true})
			}, 1000);
		}
	}

	loadApiProject = async (company_id) => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

		this.setState({loading_projects: true});

		try {
			const response = await api.get(`companies/${company_id}/projects`);

			if(response.data.length > 0) {
				let tempProjects = response.data;
				await tempProjects.map(async item => {
					const response2 = await api.get(`companies/${company_id}/projects/${item.id}/banner`);
					item.banner_src = response2.data.image_url ? 'https://seat7-uploads.s3.amazonaws.com/'+response2.data.image_url : null;
					
					return this.setState({
						projects: tempProjects
					});
				});

				await this.setState({
					loadingPage: false,
					loading_projects: false
				});
			} else {
				await this.setState({
					loadingPage: false,
					loading_projects: false,
					projects: []
				});
			}


		} catch (error) {
			logout();

			setTimeout(() => {
				this.setState({redirect: true})
			}, 1000);
		}
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	hendleSearch = (e) => {
		e.preventDefault();
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

		localStorage.setItem("company_selected", id);

		this.loadApiProject(id);
	}

	openOptions = (e) => {
		if(e.target.nextSibling.classList.contains("closed")) {
			const elements = document.querySelectorAll(".card-container .options");
			elements.forEach( element => {
				if(element.classList.contains('opened')) {
					element.classList.remove("opened");
					element.classList.add("closed");
				}
			})

			e.target.nextSibling.classList.remove("closed");
			e.target.nextSibling.classList.add("opened");
		} else {
			e.target.nextSibling.classList.remove("opened");
			e.target.nextSibling.classList.add("closed");
		}
	}

	
	modalBeta (status) {
		this.setState({
			modal_beta: status
		});

		localStorage.setItem('beta', true);
	}

	modalDelete (status, id) {
		this.setState({
			selected_project: id,
			modal_delete: status
		});
	}

	deletePoject = async (status, id) => {
		const tempProjects = this.state.projects.filter(item => {
			return item.id !== id
		});

		this.setState({
			projects: tempProjects,
			modal_delete: status
		});
 
		try {
			await api.delete(`companies/${this.state.company_id}/projects/${id}`);
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to='/Login' />
		}

		let link;
		let editLink;
		if(this.state.user_type === "admin") {
			link = "shipping-management";
			editLink = "edit-project"
		} else {
			link = "project-edit"
			editLink = "project-edit"
		}

		let company_selection;
		if(this.state.user_type === "admin") {
			company_selection =
				<div className="company-selection">
					<p className="text">Projects listed for</p>
					<div data-component="company-selection" className={`company-list-container ${this.state.company_list_opened === true ? "active" : ""}`} onClick={(e) => this.openCompanyList()}>
						<p className="company-text"> {this.state.company_name} </p>

						<div className="company-list">
							{this.state.company_list.map(company => (
								<button className={`company-item ${this.state.company_id === company.id ? "active" : ''}`} key={`company-${company.id}`} onClick={e => this.changeCompany(company.id)}>
									{company.name}
								</button>
							))}
						</div>
					</div>
				</div>
			;
		}

		const projectsTemplates = this.state.projects.filter(item => {
			return item.is_template === true;
		})

		let templates;
		if(projectsTemplates.length > 0){
			templates = projectsTemplates.map( project => {
				return <div className="card-container" key={project.id}>
					<Link to={`/create-project/${this.state.company_id}/${project.id}`} className="card">
						<span className="image">
							{ project.banner_src &&
								<img src={project.banner_src} alt={project.title}/>
							}
						</span>
						<p className="title-card">Template: {project.title}</p>
					</Link>

					<button className="options-button" onClick={(e) => this.openOptions(e)}></button>
					<div className="options closed">
						<Link className="btn" to={`/${editLink}/${this.state.company_id}/${project.id}`}>Edit</Link>
						<button className="btn" onClick={(e) => this.modalDelete("opened", project.id)}>Delete</button>
					</div>
				</div>
			})
		}

		let link_project;
		const projectsTemp = this.state.projects.filter(item => {
			return item.is_template === false;
		});

		const recentProjects = projectsTemp.filter(item => {
			return item.sent_to_publishers === false;
		});

		if(recentProjects.length > 0){
			link_project =
				<div data-component="list-cards">
					{recentProjects.map(project => (
						<div className="card-container" key={`collaborator-${project.id}`}>
							{project.project_type === "production" &&
								<Link to={`/${link}/${this.state.company_id}/${project.id}`} className="card">
									<span className="image">
										{ project.banner_src &&
											<img src={project.banner_src} alt={project.title}/>
										}
									</span>
									<div className="title-card">
										<p className="text">{project.title}</p>

										<span className="data">Last update: {project.updated_at.substr(0, 10)}</span>
									</div>
								</Link>
							}

							{project.project_type === "finished" &&
								<Link to={`/shipping-management/${this.state.company_id}/${project.id}`} className="card">
									<span className="image">
										{ project.banner_src &&
											<img src={project.banner_src} alt={project.title}/>
										}
									</span>
									<div className="title-card">
										<p className="text">{project.title}</p>

										<span className="data">Last update: {project.updated_at.substr(0, 10)}</span>
									</div>
								</Link>
							}

							<button className="options-button" onClick={(e) => this.openOptions(e)}></button>
							<div className="options closed">
								<Link className="btn" to={`/${editLink}/${this.state.company_id}/${project.id}`}>Edit</Link>
								<button className="btn" onClick={(e) => this.modalDelete("opened", project.id)}>Delete</button>
							</div>
						</div>
					))}
				</div>
		} else {
			if (this.state.loading_projects) {
				link_project = <div data-component="list-cards"className="loading-projects"></div>
			} else {
				link_project =
				<div data-component="list-cards" className="no-projects">
					<p className="text">No recent projects</p>
				</div>
			}
		}

		let submitted_projects;
		const projectsSubmitteds = projectsTemp.filter(item => {
			return item.sent_to_publishers === true;
		});

		if(projectsSubmitteds.length > 0){
			submitted_projects =
				<div data-component="list-cards">
					{projectsSubmitteds.map(project => (
						<div className="card-container" key={`collaborator-${project.id}`}>
							<Link to={`/${link}/${this.state.company_id}/${project.id}`} className="card">
								<span className="image">
									{ project.banner_src &&
										<img src={project.banner_src} alt={project.title}/>
									}
								</span>
								<div className="title-card">
									<p className="text">{project.title}</p>

									<span className="data">Last update: {project.updated_at.substr(0, 10)}</span>
								</div>
							</Link>

							<button className="options-button" onClick={(e) => this.openOptions(e)}></button>
							<div className="options closed">
								<Link className="btn" to={`/${editLink}/${this.state.company_id}/${project.id}`}>Edit</Link>
								<button className="btn" onClick={(e) => this.modalDelete("opened", project.id)}>Delete</button>
							</div>
						</div>
					))}
				</div>
		} else {
			if (this.state.loading_projects) {
				submitted_projects = <div data-component="list-cards"className="loading-projects"></div>
			} else {
				submitted_projects =
				<div data-component="list-cards" className="no-projects">
					<p className="text">No projects Submitted</p>
				</div>
			}
		}

		return (
			<div data-page="main">
				<Header />

				<TitlePage title="Projects"/>

				<div className="container-fluid" data-component="main-content">
					<div className="container">
						<div className={`row actions ${this.state.user_type === "admin" ? "two-cols" : ""}`}>
							{company_selection}

							{/* <div className="search">
								<Search onSubmit={e => this.hendleSearch(e)} placeholder="Search..." value={this.state.value} onChange={e => this.onChange(e)}/>
							</div> */}
						</div>

						<div className="row new-projects">
							<strong className="title">Start new project</strong>

							<div data-component="list-cards">
								<div className="card-container">
									<Link to="/create-project/0/0" className="card new">
										<span className="image"></span>
										<p className="title-card">New Project</p>
									</Link>
								</div>

								{templates}
							</div>
						</div>

						<div className="row recent-projects">
							<strong className="title">Recent projects</strong>

							{link_project}
						</div>

						{
							this.state.user_type === "admin" &&
							<div className="row recent-projects submited">
								<strong className="title">Submitted projects</strong>

								{submitted_projects}
							</div>
						}
					</div>
				</div>

				<div data-component="modal" className={`modal-cancel ${this.state.modal_delete}`}>
					<div className="content">
						<p className="text"><b>Are you sure that you want to permanently delete this project?</b><br /><b>This will also delete any uploaded files. Be careful, this process cannot be undone. </b></p>
						<button onClick={e => this.modalDelete('closed')} className="btn grey">No</button>
						<button onClick={e => this.deletePoject('closed', this.state.selected_project)} to="/projects" className="btn blue-light">Yes</button>
					</div>
				</div>

				<div data-component="modal" className={`modal-cancel ${this.state.modal_beta}`}>
					<div className="content">
						<p className="text">This platform is in Beta and not complete.</p>
						<button onClick={e => this.modalBeta('closed')} className="btn grey">Enter</button>
					</div>
				</div>
			</div>
		)
	};
}