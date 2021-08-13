import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { isAuthenticated } from "../../services/auth";

export default class EvaluationRegister extends Component {
	render() {
		if (isAuthenticated()) {
			return <Redirect to='/projects' />
		}

		return (
			<div data-page="user">
				<div className="container-fluid">
					<div className="cotainer">
						<p className="title-page">your registration was successful, wait for email confirmation before you can login to the platform</p>
						<Link to="/login" className="btn">Login</Link>
					</div>
				</div>
			</div>
		)
	};
}