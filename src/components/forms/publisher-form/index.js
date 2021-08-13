import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

export default class PublisherForm extends Component {
	constructor(props){
		super(props);
    this.state = {
			id: this.props.id,
			publisher_name: this.props.name,
			general_name: this.props.contactName,
			general_email: this.props.email,
			general_phone: this.props.phone,
			success_publisher: "",
			error_publisher: ""
    }
	}

	componentDidMount() {
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	savePublisherData = async (e) => {
		e.preventDefault();

		const { publisher_name, general_name, general_email, general_phone } = this.state;

		if (parseInt(this.state.id) === 0) {
			//add new publisher
			if (!publisher_name || !general_name || !general_email || !general_phone) {
				//empty fills
				this.setState({ success_publisher: "" });
				this.setState({ error_publisher: "Fill in all fields" });
			} else {
				try {
					this.setState({ error_publisher: "" });
					document.querySelector('[data-component="form"].publisher-form .btn-save').classList.add("load");
					await api.post("publishers", { name: publisher_name, email: general_email, phone: general_phone, contact_name: general_name, active: true });
					document.querySelector('[data-component="form"].publisher-form .btn-save').classList.remove("load");
					this.setState({ success_publisher: "Publisher added successfully" });
					this.props.finish(true);
				} catch (e) {
					console.log(e);
					document.querySelector('[data-component="form"].publisher-form .btn-save').classList.remove("load");
					this.setState({ error: "A server error occurred while registering a publisher T.T Please try again later" });
				}
			}
		} else {
			//edit publisher
			if (!publisher_name || !general_name || !general_email || !general_phone) {
				//empty fills
				this.setState({ success_publisher: "" });
				this.setState({ error_publisher: "Fill in all fields" });
			} else {
				try {
					this.setState({ error_publisher: "" });
					document.querySelector('[data-component="form"].publisher-form .btn-save').classList.add("load");
					await api.put(`publishers/${this.state.id}`, { name: publisher_name, email: general_email, phone: general_phone, contact_name: general_name, active: true });
					document.querySelector('[data-component="form"].publisher-form .btn-save').classList.remove("load");
					this.setState({ success_publisher: "Publisher updated successfully" });
					if(!this.props.cancelLink) {
						this.props.finish(true);
					}
				} catch (error) {
					document.querySelector('[data-component="form"].publisher-form .btn-save').classList.remove("load");
					this.setState({ error: "A server error occurred while update a publisher T.T Please try again later" });
				}
			}
		}
	}

	render() {
		return (
			<form data-component="form" className="row flex publisher-form" onSubmit={(e) => this.savePublisherData(e)}>
				<div className="label col sm-12 md-6 lg-6">
					<label htmlFor="publisher_name">Publisher name</label>
					<input
						autoComplete="off"
						name="publisher_name"
						type="text"
						placeholder="Publisher name"
						value={this.state.publisher_name}
						onChange={e => this.onChange(e)}
					/>
				</div>
				<div className="label col sm-12 md-6 lg-6">
					<label htmlFor="general_name">Contact name</label>
					<input
						autoComplete="off"
						name="general_name"
						type="text"
						placeholder="Name for main contact on publisher"
						value={this.state.general_name}
						onChange={e => this.onChange(e)}
					/>
				</div>
				<div className="label col sm-12 md-6 lg-6">
					<label htmlFor="general_email">Email</label>
					<input
						autoComplete="general_email"
						name="general_email"
						type="email"
						placeholder="Publisher main email"
						value={this.state.general_email}
						onChange={e => this.onChange(e)}
					/>
				</div>
				<div className="label col sm-12 md-6 lg-6">
					<label htmlFor="general_phone">Phone number</label>
					<input
						autoComplete="phone"
						name="general_phone"
						type="tel"
						placeholder="Publisher main phone"
						value={this.state.general_phone}
						onChange={e => this.onChange(e)}
					/>
				</div>

				<div className="label col sm-12 md-12 lg-12 actions">
					{this.props.cancelLink &&
						<Link to={this.props.cancelLink} className="btn grey with-icon">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407.436 407.436"><path d="M315.869 21.178L294.621 0 91.566 203.718l203.055 203.718 21.248-21.178-181.945-182.54z"/></svg>
							<p className="text">Cancel</p>
						</Link>
					}
					<button type="submit" className="btn blue-light btn-save">{this.state.id !== 0 ? "Update" : "Save"}</button>
				</div>

				{this.state.success_publisher &&
					<div className="label col sm-12 md-12 lg-12">
						<p className="text text-success">{this.state.success_publisher}</p>
					</div>
				}

				{this.state.error_publisher &&
					<div className="label col sm-12 md-12 lg-12">
						<p className="text text-error">{this.state.error_publisher}</p>
					</div>
				}
			</form>
		)
	};
}