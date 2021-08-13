import { LocalConvenienceStoreOutlined } from "@material-ui/icons";
import React, { Component } from "react";
import api from '../../../services/api';

import TagsField from "../../TagsField";

export default class CollaboratorsForm extends Component {
	constructor(props){
		super(props);
    this.state = {
			action: this.props.action,
			collaborator_id: this.props.collaborator.id,
			collaborator_name: this.props.collaborator.name,
			collaborator_email: this.props.collaborator.email,
			collaborator_office: this.props.collaborator.id !== 0 ? this.props.collaborator.tags : [],
			collaborator_phone: this.props.collaborator.phone,
			collaborator: this.props.collaborator,
			allTags: this.props.allTags,
			clearTags: false,
			reloadTags: this.props.reloadTags
		}
	}

	componentDidMount () {
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	hendleCollaborator = async (e, id) => {
		e.preventDefault();

		const { collaborator_name, collaborator_email, collaborator_office, collaborator_phone } = this.state;

		console.log(collaborator_name);
		console.log(collaborator_email);
		console.log(collaborator_office);
		console.log(collaborator_phone);

		// if (!collaborator_name || !collaborator_email || !collaborator_office || !collaborator_phone) {
		// 	//empty fills
		// 	this.setState({ success_collaborator: "" });
		// 	this.setState({ error_collaborator: "Fill in all fields" });
		// } else {
		// 	const tags = collaborator_office.toString();
		// 	try {
		// 		if(this.state.action_collaborator_form === "Add New Collaborator") {
		// 			this.setState({ error_collaborator: "" });
		// 			document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.add("load");
		// 			await api.post(`publishers/${this.state.id}/employees`, { name: collaborator_name, email: collaborator_email, office_post:tags, phone: collaborator_phone });
		// 			document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.remove("load");
		// 			this.setState({ success_collaborator: "Collaborator added successfully" });
		// 		}
		// 		else {
		// 			document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.add("load");
		// 			await api.put(`publishers/${this.state.id}/employees/${id}`, { name: collaborator_name, email: collaborator_email, office_post:tags, phone: collaborator_phone });
		// 			document.querySelector('[data-component="form"].collaborator-form .btn-save').classList.remove("load");
		// 			this.setState({ success_collaborator: "Collaborator updated successfully" });
		// 		}

		// 		this.props.loadCollaborators(this.state.id);
		// 		this.props.cancel();
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// }
	}

	render() {
		const state = this.state;

		const updateTags = (list) => {
			this.setState({
				allTags: list
			});

			this.props.updateAllTags(list);
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

		//Button submit form collaborator
		let buttonSaveNewCollaborator;
		let buttonCancelNewCollaborator;
		if(state.action === "Add New Collaborator") {
			buttonSaveNewCollaborator = <button type="submit" className="btn blue-light btn-save">Add</button>
			buttonCancelNewCollaborator = <span className="btn grey btn-delete" onClick={() => this.props.cancel()}>Cancel</span>
		} else if(state.action === "Edit Collaborator") {
			buttonSaveNewCollaborator = <button type="submit"className="btn blue-light btn-save">Save</button>
			buttonCancelNewCollaborator = <span className="btn grey btn-delete" onClick={() => this.props.cancel()}>Cancel</span>
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

		return (
			<div className="new-collaborator">
				<strong className="collaborators-title">{state.action}</strong>
				<form data-component="form" className="row flex collaborator-form" onSubmit={(e) => this.hendleCollaborator(e, state.collaborator_id)}>
					<div className="label col sm-12 md-6 lg-6">
						<label htmlFor="collaborator_name">Collaborator name</label>
						<input
							autoComplete="collaborator_name"
							id="collaborator_name"
							name="collaborator_name"
							type="text"
							placeholder="Publisher collaborator name"
							value={state.collaborator_name}
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
							value={state.collaborator_email}
							onChange={e => this.onChange(e)}
						/>
					</div>
					<div className="label col sm-12 md-6 lg-6">
						<TagsField
							allTags={state.allTags}
							updateTags={updateTags}
							reloadTags={this.props.reloadTags}
							reloadedTags={this.props.reloadedTags}
							clearTags={state.clearTags}
							contactId={state.collaborator_id}
							contactTags={state.collaborator_office}
							hendleTagdSaved={hendleTagdSaved}
							hendleOnChangeTags={hendleOnChangeTags}
							hendleOpenManageTags={this.props.hendleOpenManageTags}
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
							value={state.collaborator_phone}
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
		);
	}
}