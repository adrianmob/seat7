import React, { Component } from 'react';
import { getToken, getUserId, logout, isAuthenticated } from "../../services/auth";
import { Redirect, Link } from 'react-router-dom';
import api from '../../services/api';
import Helmet from 'react-helmet';

export default class ClearCache extends Component {
	state = {
		redirect: false
	};
			
	componentDidMount () {
		if(getToken() !== "") {
			this.logout();
		}
	}

	logout = async () => {
		const TOKEN_KEY = "@seat7-Token";
		const USER_ID = "@user_id";
		const USER_TYPE = "user_type";

		try {
			await api.post(`app_users/logout`);			
			await localStorage.removeItem(USER_TYPE);
			await localStorage.removeItem(TOKEN_KEY);
			await localStorage.removeItem(USER_ID);
			await localStorage.removeItem("company_selected");
			await localStorage.removeItem("beta");
			await localStorage.removeItem("category_selected");
			this.setState({
				redirect: true
			})
		} catch (error) {
			await localStorage.removeItem(USER_TYPE);
			await localStorage.removeItem(TOKEN_KEY);
			await localStorage.removeItem(USER_ID);
			await localStorage.removeItem("company_selected");
			await localStorage.removeItem("beta");
			await localStorage.removeItem("category_selected");
			this.setState({
				redirect: true
			})
		}
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to='/login' />
		}

		return (
			<div className="body">
				<Helmet>
					<title>Seat 7 - Reloading</title>
					<meta name="theme-color" content="#0056a7"/>
					{/* <meta http-equiv='cache-control' content='no-cache' />
					<meta http-equiv='expires' content='0' />
					<meta http-equiv='pragma' content='no-cache' /> */}
				</Helmet>
				Wait
			</div>
		);
	}
}