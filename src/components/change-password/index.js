import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default class Header extends Component {
	state = {
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
		error: "",
		success: "",
		active: ""
	}

	hendleChangePassword = async () => {
		const { oldPassword, newPassword, confirmPassword } = this.state;
		document.querySelector('.change-password-content').style.height = "306px";

		if (!oldPassword || !newPassword || !confirmPassword) {
			this.setState({ success: "" });
			this.setState({ error: "Fill in all fields" });
			console.log("aqui");
		} else {
			if(newPassword === confirmPassword) {
				try {
					await api.post(`app_users/change-password`, {oldPassword, newPassword});
					this.setState({ oldPassword: "" });
					this.setState({ newPassword: "" });
					this.setState({ confirmPassword: "" });
					this.setState({ error: "" });
					this.setState({ success: "Password changed successfully" });
				} catch (err) {
					this.setState({ success: "" });
					this.setState({ error: "Current password incorrect" });
				}
			} else {
				this.setState({ success: "" });
				this.setState({ error: "Password confirmation does not match password" });
			}
		}
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	openChangePassword = () => {
		this.setState({ active: 'opened' });
		document.querySelector('.change-password-content').style.height = "273px";
	}
	
	closeChangePassword = () => {
		this.setState({ active: '' });
		document.querySelector('.change-password-content').style.height = "0";
		this.setState({ error: "" });
		this.setState({ success: "" });
	}

	render() {
		return (
			<div data-component="change-password" autoComplete="new-password" className={this.state.active}>
				<div className="change-password-header">
					<strong className="-title">Change Password</strong>
					<a href="javascrip:void(0)" className="btn grey" onClick={() => this.openChangePassword()}>Edit</a>
				</div>

				<div className="change-password-content">
					<div className="row">
						<div className="col sm-6 md-5 lg-5 align-right"><p className="text">Current Password</p></div>
						<div className="col sm-6 md-4 lg-4">
							<input
								autoComplete="new-password"
								name="oldPassword"
								type="password"
								placeholder="*****"
								value={this.state.oldPassword}
								onChange={e => this.onChange(e)}
							/>
						</div>
					</div>
					
					<div className="row">
						<div className="col sm-6 md-5 lg-5 align-right"><p className="text">New password</p></div>
						<div className="col sm-6 md-4 lg-4">
							<input
								autoComplete="new-password"
								name="newPassword"
								type="password"
								placeholder="*****"
								value={this.state.newPassword}
								onChange={e => this.onChange(e)}
							/>
						</div>
					</div>
					
					<div className="row">
						<div className="col sm-6 md-5 lg-5 align-right"><p className="text">Repeat new password</p></div>
						<div className="col sm-6 md-4 lg-4">
							<input
								autoComplete="new-password"
								name="confirmPassword"
								type="password"
								placeholder="*****"
								value={this.state.confirmPassword}
								onChange={e => this.onChange(e)}
							/>
						</div>
					</div>

					{this.state.error &&
						<div className="row">
							<div className="col sm-12 md-9 lg-9">
								<p className="text text-error">{this.state.error}</p>
							</div>
						</div>
					}

					{this.state.success &&
						<div className="row">
							<div className="col sm-12 md-9 lg-9">
								<p className="text text-success">{this.state.success}</p>
							</div>
						</div>
					}
					
					<div className="row save-button">
						<div className="col sm-12 md-9 lg-9 align-right">
							<a href="javascrip:void(0)" onClick={() => this.closeChangePassword()} className="btn grey">Cancel</a>
							<a href="javascrip:void(0)" onClick={this.hendleChangePassword} className="btn blue">Save</a>
						</div>
					</div>

					<div className="row">
						<div className="col sm-12 md-9 lg-9 align-right">
							<Link to="/forget-password" className="link">Did you forgot your password?</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}