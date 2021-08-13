import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import api from '../../services/api';

import Header from '../../components/header';
import TitlePage from '../../components/title-page';
import TagManagement from "../../components/tag-management";
import PublisherForm from "../../components/forms/publisher-form";
// import CollaboratorsForm from "../../components/forms/publisher-collaborators-form";
import TagsField from "../../components/TagsField";

export default class Publisher extends Component {
	state = {
		id: 0,
		publisher_name: "",
		generalName: "",
		general_email: "",
		general_phone: "",
		collaborators: [],
		action_collaborator_form: "",
		collaborator_id: "",
		collaborator_name: "",
		collaborator_email: "",
		collaborator_office: [],
		collaborator_phone: "",
		error_publisher: "",
		success_publisher: "",
		error_collaborator: "",
		success_collaborator: "",
		redirect: false,
		clearTags: false,
		allTags: [],
		reloadTags: false,
		openManageTags: false
	}

	componentDidMount () {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

		const id = this.props.match.params.id;
		this.setState({id});
		this.loadTags();
	
		if (parseInt(id) !== 0) {
			//load publisher data
			this.loadPublisher(id);
			this.loadCollaborators(id);
			this.setState({action_collaborator_form: "Add New Collaborator"});
		}
	}

	loadTags = async () => {
		try {
			const response = await api.get("tags");

			this.setState({
				allTags: response.data
			})
		} catch (error) {
			console.log(error);
		}
	}

	loadPublisher = async (id) => {
		try {
			const response = await api.get(`publishers/${id}`);
			this.setState({
				publisher_name: response.data.name,
				generalName: response.data.contact_name,
				general_email: response.data.email,
				general_phone: response.data.phone,
			})
		} catch(error) {
			console.log(error);
		}
	}

	loadCollaborators = async (id) => {
		try {
			const response = await api.get(`publishers/${id}/employees`);
			if(response.data.length > 0) {
				this.setState({
					action_collaborator_form: "",
					collaborators: response.data,
				})
			} else {
				this.setState({
					action_collaborator_form: "Add New Collaborator",
					collaborator: {
						id: 0
					},
				})
			}
		} catch(error) {
			console.log(error);
		}
	}

	getLastPublisher = async (e) => {
		try {
			const response = await api.get(`publishers`);
			const lastItem = response.data.slice(-1);
			this.setState({
				id: lastItem[0].id,
				redirect: true
			});
		} catch (error) {
			console.log(error);
		}
	}

	hendleDelete = async (id) => {
		try {
			await api.delete(`publishers/${this.state.id}/employees/${id}`);
			this.loadCollaborators(this.state.id);
		} catch(error) {
			console.log(error);
		}
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	hendleCollaborator = async (e, id) => {
		e.preventDefault();

		const { collaborator_name, collaborator_email, collaborator_office, collaborator_phone } = this.state;

		if (!collaborator_name || !collaborator_email || !collaborator_office || !collaborator_phone) {
			//empty fills
			this.setState({ success_collaborator: "" });
			this.setState({ error_collaborator: "Fill in all fields" });
		} else {
			const tags = collaborator_office.toString();
			try {
				if(this.state.action_collaborator_form === "Add New Collaborator") {
					this.setState({ error_collaborator: "" });
					document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.add("load");
					await api.post(`publishers/${this.state.id}/employees`, { name: collaborator_name, email: collaborator_email, office_post:tags, phone: collaborator_phone });
					document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.remove("load");
					this.setState({ success_collaborator: "Collaborator added successfully" });
				}
				else {
					document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.add("load");
					await api.put(`publishers/${this.state.id}/employees/${id}`, { name: collaborator_name, email: collaborator_email, office_post:tags, phone: collaborator_phone });
					document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.remove("load");
					this.setState({ success_collaborator: "Collaborator updated successfully" });
				}

				this.loadCollaborators(this.state.id);
			} catch (error) {
				console.log(error);
			}
		}
	}

	openFormCollaborator = (id, action) => {
		this.setState({
			success_collaborator: "",
			error_collaborator: "",
			clearTags: true
		});

		if(action === "edit") {
				const collaborator = this.state.collaborators.filter( item => {
					return item.id === id;
				})

				let tags = [];
				if(collaborator[0].office_post) {
					tags = collaborator[0].office_post.split(",").map( item => {
						return parseInt(item, 10);
					});
				}

				this.setState({
					action_collaborator_form: "Edit Collaborator",
					collaborator_id: collaborator[0].id,
					collaborator_name: collaborator[0].name,
					collaborator_email: collaborator[0].email,
					collaborator_office: tags,
					collaborator_phone: collaborator[0].phone
				});
		} else {
			this.setState({
				action_collaborator_form: "Add New Collaborator",
				collaborator_id: 0,
				collaborator_name: "",
				collaborator_email: "",
				collaborator_office: [],
				collaborator_phone: "",
				clearTags: true
			});
		}
	}
/*
	openFormCollaborator = (item, action) => {
		if(action === "edit") {
			let tags = [];
			if(item.office_post) {
				tags = item.office_post.split(",").map( item => {
					return parseInt(item, 10);
				});
			}

			item.tags = tags;

			this.setState({
				action_collaborator_form: "Edit Collaborator",
				collaborator: item
			});
		} else {
			this.setState({
				action_collaborator_form: "Add New Collaborator",
				collaborator: {
					id: 0
				}
			});
		}
	}
*/
	closeFormCollaborator = () => {
		if(this.state.collaborators.length) {
			this.setState({
				action_collaborator_form: "",
				collaborator: null,
			});
		}
	}

	render() {
		//Redirect to publisher edit page
		if (this.state.redirect) {
			return <Redirect to={`/list-publishers/1`} />
		}

		const hendleTagdSaved = (status) => {
			this.setState({
				clearTags: status
			})
		}

		const hendleOnChangeTags = (list) => {
			this.setState({
				collaborator_office: list
			});
		}

		const updateTags = (list) => {
			this.setState({
				reloadTags: true,
				allTags: list
			})
		}

		const reloadedTags = (status) => {
			this.setState({
				reloadTags: status
			})
		}

		const hendleOpenManageTags = (e) => {
			e.preventDefault();

			if(this.state.openManageTags) {
				document.querySelector('body').classList.remove("no-scroll");
				this.setState({openManageTags: false});
			} else {
				document.querySelector('body').classList.add("no-scroll");
				this.setState({openManageTags: true});
			}
		}
		
		const setRedirect = (status) => {
			this.setState({
				redirect: status
			});
		}

		/*let newCollaborator;
		if(this.state.collaborator) {
			newCollaborator = 
				<div key={this.state.collaborator.id}>
					<CollaboratorsForm
						allTags={this.state.allTags}
						updateAllTags={updateTags}
						reloadTags={this.state.reloadTags}
						reloadedTags={reloadedTags}
						hendleOpenManageTags={hendleOpenManageTags}
						collaborator={this.state.collaborator}
						action={this.state.action_collaborator_form}
						cancel={this.closeFormCollaborator}
						reoladContacts={this.loadCollaborators(this.state.id)}
					/>
				</div>
		}*/

		//Button submit form collaborator
		let buttonSaveNewCollaborator;
		if(this.state.action_collaborator_form === "Add New Collaborator") {
			buttonSaveNewCollaborator = <button type="submit" className="btn blue-light btn-save">Add</button>
		} else if(this.state.action_collaborator_form === "Edit Collaborator") {
			buttonSaveNewCollaborator = <button type="submit"className="btn blue-light btn-save">Save</button>
		}
		
		let buttonCancelNewCollaborator;
		if(this.state.collaborators.length > 0) {
			buttonCancelNewCollaborator = <span className="btn grey btn-delete" onClick={() => this.closeFormCollaborator("new")}>Cancel</span>
		}

		let formCollaboratorMessage;
		if(this.state.success_collaborator) {
			formCollaboratorMessage =
				<div className="label col sm-12 md-12 lg-12 collaborator-form-message">
					<p className="text text-success">{this.state.success_collaborator}</p>
				</div>
		}

		if(this.state.error_collaborator) {
			formCollaboratorMessage =
				<div className="label col sm-12 md-12 lg-12 collaborator-form-message">
					<p className="text text-error">{this.state.error_collaborator}</p>
				</div>
		}

		//Form collaborator
		let newCollaborator;
		if(this.state.action_collaborator_form === "Add New Collaborator" || this.state.action_collaborator_form === "Edit Collaborator") {
			newCollaborator = 
				<div className="new-collaborator">
					<strong className="collaborators-title">{this.state.action_collaborator_form}</strong>

					<form className="row flex collaborator-form" data-component="form" onSubmit={(e) => this.hendleCollaborator(e, this.state.collaborator_id)}>
						<div className="label col sm-12 md-6 lg-6">
							<label htmlFor="collaborator_name">Collaborator name</label>
							<input
								autoComplete="collaborator_name"
								id="collaborator_name"
								name="collaborator_name"
								type="text"
								placeholder="Publisher collaborator name"
								value={this.state.collaborator_name}
								onChange={e => this.onChange(e)}
							/>
						</div>
						<div className="label col sm-12 md-6 lg-6">
							<label htmlFor="collaborator_email">Collaborator Email</label>
							<input
								id="collaborator_email"
								autoComplete="collaborator_email"
								name="collaborator_email"
								type="email"
								placeholder="Publisher collaborator email"
								value={this.state.collaborator_email}
								onChange={e => this.onChange(e)}
							/>
						</div>
						<div className="label col sm-12 md-6 lg-6">
							<TagsField
								allTags={this.state.allTags}
								updateTags={updateTags}
								reloadTags={this.state.reloadTags}
								reloadedTags={reloadedTags}
								clearTags={this.state.clearTags}
								contactId={this.state.collaborator_id}
								contactTags={this.state.collaborator_office}
								hendleTagdSaved={hendleTagdSaved}
								hendleOnChangeTags={hendleOnChangeTags}
								hendleOpenManageTags={hendleOpenManageTags}
							/>
						</div>
						<div className="label col sm-12 md-6 lg-6">
							<label htmlFor="collaborator_phone">Collaborator Phone number</label>
							<input
								autoComplete="collaborator_phone"
								id="collaborator_phone"
								name="collaborator_phone"
								type="tel"
								placeholder="Publisher collaborator phone"
								value={this.state.collaborator_phone}
								onChange={e => this.onChange(e)}
							/>
						</div>

						<div className="label col sm-12 md-12 lg-12 actions">
							{buttonCancelNewCollaborator}
							{buttonSaveNewCollaborator}
						</div>
						
						{formCollaboratorMessage}
					</form>
				</div>
		} else {
			newCollaborator = "";
		}
		
		//Collaborator list
		let collaboratorList;
		if(this.state.collaborators.length > 0 && this.state.id !== 0){
			collaboratorList = 
				<div data-component="collaborators-list" className="collaborators">
					<strong className="collaborators-title">Collaborators</strong>

					<div data-component="collaborators-table">
						<div className="collaborators-table-header">
							<div className="col-inverse flex align-center sm-4 md-4 lg-4">
								<strong className="body-title">Collaborator name</strong>
							</div>
							<div className="col-inverse flex align-center sm-4 md-4 lg-4">
								<strong className="body-title">Email</strong>
							</div>
							<div className="col-inverse flex align-center sm-8 md-8 lg-8">
								<strong className="body-title">Phone</strong>
							</div>
							<div className="col-inverse flex align-center sm-8 md-6 lg-6 header-actions">
								<strong className="body-title">Action</strong>
							</div>
						</div>

						<div className="collaborators-table-body">
							{this.state.collaborators.map(collaborator => (
								<div className="table-item" key={`collaborator-${collaborator.id}`}>
									<div className="col-inverse flex align-center sm-1 md-1 lg-4">
										<p className="body-text">{collaborator.name}</p>
									</div>
									<div className="col-inverse flex align-center sm-1 md-1 lg-4">
										<a className="body-text link" href={"mailto:"+collaborator.email}>{collaborator.email}</a>
									</div>
									<div className="col-inverse flex align-center sm-2 md-1 lg-8">
										<p className="body-text"> {collaborator.phone} </p>
									</div>
									<div className="col-inverse flex align-center justfy-center sm-2 md-2 lg-6 body-actions">
										<button onClick={() => this.hendleDelete(collaborator.id)} className="btn grey">delete</button>
										<button onClick={() => this.openFormCollaborator(collaborator.id, "edit")} className="btn grey">edit</button>
									</div>
								</div>
							))}
						</div>
					</div>

					<button className="btn blue register-collaborator" onClick={() => this.openFormCollaborator("new")}>Register new collaborator</button>
				</div>
		}

		let publisherForm;
		if(this.state.publisher_name !== "") {
			publisherForm =
				<div>
					<PublisherForm
						id={this.state.id}
						name={this.state.publisher_name}
						contactName={this.state.generalName}
						email={this.state.general_email}
						phone={this.state.general_phone}
						finish={setRedirect}
						cancelLink={"/list-publishers/1"}
					/>
				</div>
		} else {
			publisherForm =
				<PublisherForm
					id={0}
					name={""}
					contactName={""}
					email={""}
					phone={""}
					finish={setRedirect}
					cancelLink={"/list-publishers/1"}
				/>
		}

		return (
			<div data-page="publisher">
				<Header/>

				<TitlePage title="Publisher Page"/>

				<div className="container-fluid" data-component="content-plublisher">
					<div className="container gutter">
						{publisherForm}
						{collaboratorList}
						{newCollaborator}
					</div>
				</div>

				{this.state.openManageTags &&
					<TagManagement
						allTags={this.state.allTags}
						hendleOpenManageTags={hendleOpenManageTags}
						updateTags={updateTags}
					/>
				}
			</div>
		)
	};
}