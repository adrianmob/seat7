import React, { Component } from 'react';
import api from "../../../services/api";

export default class ModalMessageContent extends Component {
	constructor(props){
		super(props);
    this.state = {
			companyId: this.props.companyId,
			projectId: this.props.projectId,
			list: this.props.list,
			projectFiles: this.props.links,
			listFiles: []
    }
	}

	componentDidMount() {
		this.loadListFiles(this.props.list.list_id);
	}

	loadListFiles = async (listID) => {
		try {
			const response = await api.get(`/project_submission_lists/${listID}/files`);
			await this.setState({
				listFiles: response.data || []
			})
		} catch (err) {
				console.log(err)
		}
	}

	avaliableLink = async (file) => {
		const listID = this.state.list.list_id;
		const newListFiles = this.state.listFiles;

		try {
			const response = await api.post(`/project_submission_lists/${listID}/files`, {
				"file_id": file.id,
				"list_id": listID
			});

			const newFile = await {
				"id": response.data.id,
				"file_id": response.data.file_id,
				"list_id": response.data.list_id
			}

			await newListFiles.push(newFile);
			await this.setState({
				listFiles: newListFiles || []
			})
		} catch (err) {
				console.log(err)
		}
	}

	unavaliableLink = async (file) => {
		const listID = this.state.list.list_id;
		let reomoveItem;
		
		console.log(this.state.listFiles);

		const newListFiles = this.state.listFiles.filter(item => {
			if(item.file_id === file.id) {
				reomoveItem = item.id;
			}

			return item.file_id !== file.id
		});

		try {
			await api.delete(`/project_submission_lists/${listID}/files/${reomoveItem}`);
			await this.setState({
				listFiles: newListFiles || []
			})
		} catch (err) {
				console.log(err)
		}
	}

	render() {
		//Unlock files butons
		const listFiles = this.state.listFiles;
		function LinkAvaliable(props) {
			const {link, onClickAvaliable, onClickUnavaliable} = props
			
			const available = listFiles.filter( item => {
				if(item.file_id === link.id) {
					return item;
				}
			});

			const bts = <div className="link-col" key={link.id}>
				<button onClick={onClickAvaliable} className={`btn grey ${available.length > 0 ? "avaliable" : ""}`}>Avaliable</button>
				<button onClick={onClickUnavaliable} className={`btn grey ${available.length <= 0 ? "unavaliable" : ""}`}>Unavaliable</button>
			</div>
			return bts
		}

		return (
			<div className="modal-content modal-unlock-files">
				<div className="files-header">
					<div className="col flex align-center sm-12 lg-3">
							<p className="title">Title</p>
					</div>
					<div className="col flex align-center sm-12 lg-5">
					<p className="title">Description</p>
					</div>
					<div className="col flex align-center header-action sm-12 lg-4">
							<p className="title">Action</p>
					</div>
				</div>
				<div className="list-files">
					{this.state.projectFiles.map(link => (
						<div className="link-container" key={`collaborator-${link.id}`}>
							<div className="col flex align-center sm-12 md-6 lg-3">
								<div className="link-col"><p className="text">{link.title}</p></div>
							</div>
							<div className="col flex align-center sm-12 md-12 lg-5">
								<div className="link-col description">
									<p className="text">{link.description}</p>
									<a href={link.file_url} target="blank" className="btn view">View</a>
								</div>
							</div>
							<div className="col flex align-center body-action sm-12 md-6 lg-4">
								<LinkAvaliable
									link={link}
									onClickAvaliable={e => this.avaliableLink(link)}
									onClickUnavaliable={e => this.unavaliableLink(link)}
								/>
							</div>
						</div>
					))}
				</div>

				{/* <div className="save-container">
					<button className="link" onClick={e => this.saveAvaliableLinks()}>Save</button>
				</div> */}
			</div>
		)
	};
}