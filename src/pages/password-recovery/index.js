import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { isAuthenticated } from "../../services/auth";

export default class PasswordRecovery extends Component {
	render() {
		if (isAuthenticated()) {
			return <Redirect to='/projects' />
		}

		return (
			<div data-page="user">
				<div className="container-fluid">
					<div className="cotainer">
						<p className="title-page">your password has been sent to your email</p>
						<Link to="/login" className="btn">Login</Link>
					</div>
				</div>
			</div>
		)
	};
}