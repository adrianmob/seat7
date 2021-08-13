import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import api from '../../services/api';
import { getToken, getUserType, getUserId, logout } from "../../services/auth";

// Redux
import { bindActionCreators } from 'redux';
import { loadInfos } from '../../actions';
import { connect } from 'react-redux';

import Header from '../../components/header';
import TitlePage from '../../components/title-page';
import Upload from '../../components/upload';
import ChangePassword from '../../components/change-password';

class User extends Component {
	state = {
		current_user_type: "",
		user_type: false,
		active: "",
		user_id: "",
		name: "",
		email: "",
		company_name: "",
		password: "",
		confirmPassword: "",
		logo_user: "",
		new_logo_src: "",
		logo_file_upload: "",
		newProjects: "",
		clientRequest: "",
		error: "",
		success: "",
		save: false,
		redirect: false
	}

	componentDidMount() {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

		const id = parseInt(this.props.match.params.id);
		// const page = parseInt(this.props.match.params.page);
		// this.setUsertype(id);

		const {
			active,
			logo_user,
			name,
			email,
			company,
			user_type,
			user_id,
			newProjects,
			clientRequest
		} = this.props;

		const currentUser = getUserType();
		this.setState({current_user_type: currentUser});

		if((name == null || name === "") && id !== 0){
			// if not save on redux and not new user
			if(currentUser === "admin"){
				this.loadApiUser(id, "admin");
			} else {
				this.loadApiUser(id, "normal");
			}
		} else {
			// data saved on redux
			if(currentUser === "admin"){
				// admin user loged 
				if(id !== 0) {
					// not new user
					this.loadApiUser(id, user_type);
				} else {
					this.setState({user_id: id});
				}
			}
			else {
				//normal user loged
				this.setState({
					active: active,
					logo_user: logo_user,
					name: name,
					email: email,
					company_name: company,
					user_type: user_type,
					user_id: user_id,
					newProjects: newProjects,
					clientRequest: clientRequest
				})
			}
		}
	}

	loadApiUser = async (id, admin) => {
		const token = getToken();
		let userId;

		if(admin === "admin") {
			userId = id;
		} else {
			userId = getUserId();
		}

		try {
			if (parseInt(this.state.user_id) !== 0) {
				//load data by admin user
				let response;
				// if(admin === "admin" && userId !==1 ) {
				// 	response = await api.get(`app_users/${userId}?filter[include]=companies&access_token=${token}`);
				// 	this.setState({user_type: 'admin'});
				// } else {
				// }
				response = await api.get(`app_users/${userId}?filter[include]=companies&access_token=${token}`);
				this.setState({user_type: response.data.user_type});
				// console.log(response);

				this.setState({
					active: response.data.active,
					logo_user: response.data.logo_url ? 'https://seat7-uploads.s3.amazonaws.com/'+response.data.logo_url : '',
					name: response.data.name,
					email: response.data.email,
					user_id: response.data.user_id,
					user_type: response.data.user_type,
					company_name: response.data.user_type === "admin" ? "Seat 7" : response.data.companies[0].name
				})
			}
		} catch(error) {
			console.log(error);
			this.setState({ error: "An authorization error occurred with api" });
			this.hendleLogout();
		}
	}

	hendleLogout = () => {
		logout();
		this.setState({ redirect: true });
	}

	hendleSave = async (e) => {
		e.preventDefault();
		console.log('teste');

		const { new_logo_src, company_name, name, password, confirmPassword } = this.state;
		const email = this.state.email.toLowerCase();

		if (parseInt(this.state.user_id) === 0) {
			//add new user by admin
			if (!company_name || !name || !email || !password || !confirmPassword) {
				//empty fills
				this.setState({ success: "" });
				this.setState({ error: "Fill in all fields" });
			} else {
				if(password === confirmPassword) {
					//password confirmation
					try {
						//add user
						document.querySelector('[data-component="form"] .btn-save').classList.add("load");
						this.setState({ active: true });
						const active = this.state;
						await api.post("/app_users/user_company", { name, email, password, company_name, active });

						// await this.setState({ register_complete: true })
					} catch (error) {
						document.querySelector('[data-component="form"] .btn-save').classList.remove("load");
						if(error.message === "Request failed with status code 422") {
							this.setState({ error: "There is already an account created with this email address" });
						} else {
							this.setState({ error: "A server error occurred while registering your account T.T Please try again later" });
						}
					}
				} else {
					this.setState({ success: "" });
					this.setState({ error: "Password confirmation does not match password" });
				}
			}
		} else {
			// const userId = getUserId();
			try {
				document.querySelector('[data-component="form"] .btn-save').classList.add("load");
				const token = getToken();
				await api.put(`/app_users/${this.state.user_id}?access_token=${token}`, { name, email, company_name });

				if(new_logo_src) {
					this.setState({
						logo_user: new_logo_src, 
						new_logo_src: ''
					})

					await this.insertLogo();
				}

				await document.querySelector('[data-component="form"] .btn-save').classList.remove("load");
				await this.setState({ success: "User data successfully changed" });

				//Redux
				if (this.state.user_type === "admin" && parseInt(this.state.user_id) === 0) {
					//changed admin datas
					this.setState({ redirect: true })
				} else {
					if(parseInt(this.state.user_id) === parseInt(getUserId())){
						const { loadInfos } = this.props;
						const { logo_user, active, user_id, user_type } = this.state;
						const newProjects = "";
						const clientRequest = "";
						loadInfos(active, logo_user, name, email, company_name, user_id, user_type, newProjects, clientRequest);
					}

					// get new token id when change email
					// const response = await api.post("/app_users/login", { email, password });
					// login(response.data.id, response.data.userId);
				}

				setTimeout(() => {
					this.setState({ success: "" });
				}, 5000);
			} catch (err) {
				console.log(err);
				this.setState({ error: "There was an error with the server when trying to change user data T.T Please try again later" });
				document.querySelector('[data-component="form"] .btn-save').classList.remove("load");
			}
		}
	}

	insertLogo = async _ => {
		try {
			const { user_id, logo_file_upload } = this.state
			const form = new FormData();
			form.append('file', logo_file_upload);
			console.log('insert logo for user:' + user_id);


			return await api.put(`app_users/${user_id}/logo/upload`, form);
		} catch (error) {
			console.log("insertLogoImageError", error);
			throw error
		}
	}

	uploadLogo = (file, file_upload) => {
		this.setState({
			new_logo_src: file,
			logo_file_upload: file_upload
		})
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	partnerStatus  = async (status, id) => {
		this.setState({ active: status });

		try {
			if(status) {
				await api.get(`app_users/${id}/activate`);
			} else {
				await api.get(`app_users/${id}/deactivate`);
			}

			await localStorage.removeItem("company_selected");

			this.setState({ success: "User status changed" });
			
			setTimeout(() => {
				this.setState({ success: "" })
			}, 2000);
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to='/list-users/1' />
		}

		let cancelLink;
		let status;
		if (this.state.current_user_type === "admin") {
			if(parseInt(this.state.user_id) !== 0 && this.state.user_type !== "admin") {
				//add status button if not new user or admin user
				status =
				<div className="label actions client-status">
					<p className="label-text">This account must be active or not?</p>
					<div className={this.state.active + " row"}>
						<span className="btn grey" onClick={() => this.partnerStatus(true, this.state.user_id)}>Active</span>
						<span className="btn grey" onClick={() => this.partnerStatus(false, this.state.user_id)}>Inactive</span>
					</div>
				</div>
			}

			cancelLink = "/list-users/1";
		}
		else {
			cancelLink = "/projects";
		}

		let changePass;
		let newPass;
		
		if (parseInt(this.state.user_id) === 0) {
			newPass =
				<div className="newUser">
					<div className="label col sm-12 md-12 lg-12">
						<label htmlFor="company_name">Password</label>
						<input
							autoComplete="new-password"
							name="password"
							type="password"
							placeholder="*****"
							value={this.state.password}
							onChange={e => this.onChange(e)}
						/>
					</div>
					
					<div className="label col sm-12 md-12 lg-12">
						<label htmlFor="company_name">Confirm password</label>
						<input
							autoComplete="new-password"
							name="confirmPassword"
							type="password"
							placeholder="*****"
							value={this.state.confirmPassword}
							onChange={e => this.onChange(e)}
						/>
					</div>
				</div>;
		} else {
			if (this.state.current_user_type !== "admin") {
				changePass = <ChangePassword />;
			}
		}

		return (
			<div data-page="user">
				<Header logo_src={this.state.logo_src}/>

				<TitlePage title="User"/>

				<div className="container-fluid" data-component="content-user">
					<div className="container">
						<form className="col sm-12 md-12 lg-8" autoComplete="new-password" data-component="form" onSubmit={this.hendleSave}>

							{status}

							<Upload title="Profile Image" id="profileImage" size="300x300" imgPreview={this.state.logo_file_upload ? this.state.new_logo_src : ""} handleClick={this.uploadLogo.bind(this)}/>

							{this.state.user_type !== "admin" &&
								<div className="label col sm-12 md-12 lg-12">
									<label htmlFor="company_name">Company name</label>
									<input
										autoComplete="off"
										name="company_name"
										type="text"
										placeholder="Company name"
										value={this.state.company_name}
										onChange={e => this.onChange(e)}
									/>
								</div>
							}
							<div className="label col sm-12 md-12 lg-12">
								<label htmlFor="name">User name</label>
								<input
									autoComplete="off"
									name="name"
									type="text"
									placeholder="User name"
									value={this.state.name}
									onChange={e => this.onChange(e)}
								/>
							</div>
							<div className="label col sm-12 md-12 lg-12">
								<label htmlFor="company_name">Email</label>
								<input
									autoComplete="off"
									name="email"
									type="email"
									placeholder="Email"
									value={this.state.email}
									onChange={e => this.onChange(e)}
								/>
							</div>

							<div className="label col sm-12 md-12 lg-12">
								{newPass}
							</div>

							<div className="label col sm-12 md-12 lg-12">
								{changePass}
							</div>

							{this.state.error &&
								<div className="label col sm-12 md-12 lg-12">
									<div className="col sm-12 md-9 lg-9">
										<p className="text text-error">{this.state.error}</p>
									</div>
								</div>
							}

							{this.state.success &&
								<div className="label col sm-12 md-12 lg-12">
									<div className="col sm-12 md-9 lg-9">
										<p className="text text-success">{this.state.success}</p>
									</div>
								</div>
							}

							<div className="label actions">
								<div className="row">
									<Link to={cancelLink} className="btn grey with-icon btn-cancel">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407.436 407.436"><path d="M315.869 21.178L294.621 0 91.566 203.718l203.055 203.718 21.248-21.178-181.945-182.54z"/></svg>
										<p className="text">Back</p>
									</Link>
									<button type="submit" className="btn blue btn-save">Save</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	};
}

const mapStateToProps = store => ({
  active: store.updateUserInfos.active,
  logo_user: store.updateUserInfos.logo_user,
  name: store.updateUserInfos.name,
  company: store.updateUserInfos.company,
  email: store.updateUserInfos.email,
	user_type: store.updateUserInfos.user_type,
	user_id: store.updateUserInfos.user_id,
	newProjects: store.updateUserInfos.newProjects,
	clientRequest: store.updateUserInfos.clientRequest
});

const mapDispatchToProps = dispatch =>
	bindActionCreators({ loadInfos }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(User);