import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { getToken, getUserId, logout, isAuthenticated } from "../../services/auth";
import api from '../../services/api';
import Helmet from 'react-helmet';

// Redux
import { bindActionCreators } from 'redux';
import { loadInfos } from '../../actions';
import { connect } from 'react-redux';

class Header extends Component {
	state = {
		"active": "",
		user_type: "",
		logo_user: "",
		user_id: "",
		name: "",
		email: "",
		company: "",
		// newProjects: "",
		clientRequest: "",
		submenu: "closed",
		redirect: false,
		redux: true
	}

	componentDidMount() {
		const {
			active,
			name,
			company,
			email,
			user_type,
			user_id,
			newProjects,
			clientRequest
		} = this.props;

		if(name == null || name === ""){
			this.setState({ redux: false});
			this.loadUserInfos();
		} else {
			this.setState({
				active: active,
				name: name,
				email: email,
				company: company,
				user_type: user_type,
				user_id: user_id,
				newProjects: newProjects,
				clientRequest: clientRequest,
			})
		}
	}

	loadUserInfos = async () => {
		const token = getToken();
		const userId = getUserId();

		try {
			const response = await api.get(`app_users/${userId}?filter[include]=companies&access_token=${token}`);
			this.setState({
				active: response.data.active,
				logo_user: response.data.logo_url ? 'https://seat7-uploads.s3.amazonaws.com/'+response.data.logo_url : '',
				name: response.data.name,
				email: response.data.email,
				user_id: response.data.user_id,
				company: response.data.user_type === "admin" ? "Seat 7" : response.data.companies[0].name,
				user_type: response.data.user_type
			});

			if(response.data.user_type === "admin") {
				const countResponse = await api.get(`app_users/count?where={"active":null}&access_token=${token}`);

				const config = {
					headers: {
						'is_template': false,
						'sent_to_publishers': false,
						'access_token': token
					}
				}
				const countProjects = await api.get(`projects/count`, config);

				await this.setState({
					newProjects: countProjects.data.count,
					clientRequest: countResponse.data.count
				})
			}
		} catch(error) {
			this.hendleLogout();
		}
	}

	hendleLogout = async () => {
		// document.querySelector("#logout-button").classList.add("load");
		logout();

		setTimeout(() => {
			// document.querySelector("#logout-button").classList.remove("load");
			this.setState({redirect: true})
		}, 1000);
	}

	openSubmenu = () => {
		this.setState({submenu: this.state.submenu === "opened" ? "closed" : "opened"})
	}

	render() {
		const {
			loadInfos,
			logo_user,
			name,
			company,
			clientRequest
		} = this.props;
		
		if (isAuthenticated() === false || this.state.redirect) {
			const { active, logo_user, name, email, company, user_id, user_type, clientRequest } = "";
			loadInfos(active, logo_user, name, email, company, user_id, user_type, clientRequest);
			return <Redirect to='/Login' />
		}

		if(!this.state.redux) {
			let {
				active,
				logo_user,
				name,
				company,
				email,
				user_type,
				user_id
			} = this.state;

			if(this.state.user_type === "admin") {
				let { clientRequest } = this.state;
				loadInfos(active, logo_user, name, email, company, user_id, user_type, clientRequest);
			} else {
				let { clientRequest } = "";
				loadInfos(active, logo_user, name, email, company, user_id, user_type, clientRequest);
			}
		}

		let adminMenus;
		if(this.state.user_type === "admin") {
			adminMenus =
				<div>
					<Link to="/list-users/1" className="link">Clients <span>{clientRequest}</span></Link>
					<Link to="/list-publishers/1" className="link">Publishers</Link>
				</div>
		} else {
			adminMenus = <Link to={`/user/${this.state.user_id}`} className="link">User</Link>
		}

		let user_logo;
		if (logo_user) {
			user_logo = <img src={logo_user} alt={`logo ${company}`}/>
		}

		return (
			<header data-component="main-header">
				<Helmet>
					<title>Seat 7</title>
					<meta name="theme-color" content="#0056a7"/>
					{/* <meta http-equiv='cache-control' content='no-cache' />
					<meta http-equiv='expires' content='0' />
					<meta http-equiv='pragma' content='no-cache' /> */}
				</Helmet>

				<div className="container-fluid align-center">
					<div className="container align-center">
						<Link to="/" className="link main-logo">
							<svg className="logo" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 261.7 368.3">
								<path fill="#ffffff" d="M235.3 164l-16.4 16.4c-7.8 5.6-18.7 4.9-25.7-2.1l-56.7-56.7-.3-.3-32.7-32.7c-1-1.1-2.1-2.2-3.2-3.2l-13-13L59 44.1h28.9c0 .2 4.7 0 7.1 0 5.9 0 11.6 1 16.8 2.9 5.6 2 10.7 5 15.2 8.8l31.1 31.1 6.3 6.3 10.8 10.8 28.2 28.2 18 18 13.9 13.8zM193 206.3l-16.4 16.4c-7 5-16.4 4.9-23.3-.1-.8-.6-1.6-1.3-2.3-2l-46.2-46.2-.6-.6-20-20-8.2-8.2h38.6c5.5.3 10.8 1.5 15.8 3.5 5.3 2.1 10.2 5.2 14.5 8.9l4.3 4.3c3 3.4 12.2 12.2 12.2 12.2l18 18 13.6 13.8z"/>
								<path fill="#ffffff" d="M231.7 75.7l-14.2-14.2-41.9-41.9L169 13c-4.3-3.6-9.3-6.4-14.6-8.4-5.3-2-11.1-3-17.1-3h-120c0 .2 27.4 28.3 27.4 28.3H110c5.7.1 11.1 1.2 16.2 3 5.9 2.2 11.3 5.4 15.9 9.6 1.4 1.3 2.8 2.6 4.1 4.1l57.5 57.5c7.5 7.5 19.4 7.8 27.2.9L246 89.9l-14.3-14.2z"/>
								<path fill="#ffffff" d="M30.8 247c10.2 0 15.6 5.4 15.6 15.6V274c0 1.1-.5 1.7-1.7 1.7H33.3c-1.1 0-1.7-.6-1.7-1.7v-8.4c0-2.8-1.4-4.3-4.3-4.3h-5.2c-2.7 0-4.3 1.5-4.3 4.3v14.9l25.7 8.4c1.8.8 2.8 1.9 2.8 4v24.9c0 10.2-5.4 15.6-15.6 15.6h-12c-10 0-15.6-5.4-15.6-15.6v-11.3c0-1.2.6-1.7 1.7-1.7H16c1.2 0 1.7.5 1.7 1.7v8.3c0 2.9 1.6 4.3 4.3 4.3h5.2c2.8 0 4.3-1.4 4.3-4.3v-14.4L6 292c-1.9-.6-2.9-1.9-2.9-4v-25.5c0-10.2 5.5-15.6 15.6-15.6h12.1zM100.2 259.5c0 1.1-.4 1.8-1.7 1.8h-27V283h20.6c1.1 0 1.7.6 1.7 1.8v10.7c0 1.2-.6 1.8-1.7 1.8H71.5v21.8h27c1.3 0 1.7.5 1.7 1.7v10.8c0 1.1-.4 1.7-1.7 1.7H58.7c-1 0-1.6-.6-1.6-1.7v-82.9c0-1.1.6-1.7 1.6-1.7h39.7c1.3 0 1.7.6 1.7 1.7v10.8zM148.4 333.4c-1 0-1.5-.5-1.7-1.5l-3-15.8h-19.2l-2.9 15.8c-.2 1-.8 1.5-1.7 1.5h-11.6c-1.2 0-1.7-.6-1.4-1.8l17.9-83.1c.2-1.1.9-1.5 1.8-1.5h15c1 0 1.6.4 1.8 1.5l17.9 83.1c.2 1.2-.2 1.8-1.5 1.8h-11.4zM134 265.9l-6.9 37.7h13.8l-6.9-37.7zM201.7 247c1.2 0 1.7.6 1.7 1.7v10.8c0 1.1-.5 1.7-1.7 1.7h-12.5v70.4c0 1.2-.5 1.7-1.7 1.7h-11.2c-1.1 0-1.7-.5-1.7-1.7v-70.4H162c-1.1 0-1.7-.6-1.7-1.7v-10.8c0-1.1.6-1.7 1.7-1.7h39.7zM258.1 247c1.7 0 2.2 1.1 1.6 2.6l-31.5 82c-.4 1.2-1.2 1.7-2.5 1.7l-11.2.1c-1.6 0-2.3-1-1.7-2.5l26.7-69.6h-14.8c-6.9 0-12.5-5.6-12.5-12.5 0-1.2.6-1.7 1.7-1.8h44.2z"/>
							</svg>
						</Link>

						<button onClick={() => this.openSubmenu()} className={`user-menu ${this.state.submenu}`}>
							<div className="logo-partner">
								{user_logo}
							</div>

							<div className="user-name-container">
								<p className="user-name">{name}</p>
								<p className="company-name">{company}</p>
							</div>

							<div className="user-submenu">
								<Link to="/" className="link">Projects</Link>
								<Link to="/contacts/1" className="link">Contacts</Link>
								{adminMenus}
								<a href="#logout" className="link" id="logout-button" onClick={() => this.hendleLogout()}>Logout</a>
							</div>
						</button>
					</div>
				</div>
			</header>
		)
	}
}

const mapStateToProps = store => ({
  active: store.updateUserInfos.active,
  logo_user: store.updateUserInfos.logo_user,
  name: store.updateUserInfos.name,
  email: store.updateUserInfos.email,
  company: store.updateUserInfos.company,
	user_type: store.updateUserInfos.user_type,
	user_id: store.updateUserInfos.user_id,
	newProjects: store.updateUserInfos.newProjects,
	clientRequest: store.updateUserInfos.clientRequest
});

const mapDispatchToProps = dispatch =>
	bindActionCreators({ loadInfos }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);