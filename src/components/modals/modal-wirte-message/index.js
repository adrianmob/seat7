import React, { Component } from 'react';
import api from "../../../services/api";

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default class ModalMessageContent extends Component {
	constructor(props){
		super(props);
    this.state = {
			list: this.props.list,
			companyId: this.props.companyId,
			projectId: this.props.projectId,
			projectTitle: this.props.projectTitle,
			companyName: this.props.companyName,
			id_list: this.props.list.list_id,
			subject: this.props.list.status.subject || "",
			message: "",
    }
	}

	componentDidMount() {
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	saveMessage = async (e) => {
		e.preventDefault();
		document.querySelector('.modal-write-message .btn-save').classList.add("load");
		const {list, companyId, projectId, subject, message} = this.state;

		try {
			await api.put(`/companies/${companyId}/projects/${projectId}/submission-lists/${list.list_id}`, {project_id: projectId, subject, message});
			await document.querySelector('.modal-write-message .btn-save').classList.remove("load");
			await this.props.changeMessage(subject, message, list.list_id);
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		return (
			<div className="modal-content modal-write-message with-ck-editor">
				<form>
					<input
						id="subject"
						name="subject"
						type="text"
						placeholder="Subject"
						value={this.state.subject}
						onChange={e => this.onChange(e)}
					/>

					<CKEditor
						id="message"
						editor={ ClassicEditor }
						data={
							this.props.list.status.message || `<p>I am pleased to submit to you the materials of <strong>${this.state.projectTitle}</strong> in development by <strong>${this.state.companyName}</strong>. Below you will find the link to list of materials included</p>`
						}
						onInit={ editor => {
							// You can store the "editor" and use when it is needed.
							{/* console.log( 'Editor is ready to use!', editor ); */}
							const data = editor.getData();
							this.setState({message: data});
						}}
						onChange={ ( event, editor ) => {
							const data = editor.getData();
							this.setState({message: data});
							{/* console.log( { event, editor, data } ); */}
						}}
						onBlur={ ( event, editor ) => {
							console.log( 'Blur.', editor );
						}}
						onFocus={ ( event, editor ) => {
							console.log( 'Focus.', editor );
						}}
					/>

					<button type="submit" className="btn blue btn-save" onClick={(e) => this.saveMessage(e)}>Save</button>
				</form>
			</div>
		)
	};
}