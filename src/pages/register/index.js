import React, { Component } from 'react';
import api from '../../services/api';
import { Redirect, Link } from 'react-router-dom';
import { isAuthenticated } from "../../services/auth";

export default class SignUp extends Component {
	state = {
		register_complete: false,
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		company_name: "",
		error: ""
	}

	componentDidMount() {
		//if page reloads without close any modal
		document.querySelector('body').classList.remove("no-scroll");

	}

	hendleSignUp = async (e) => {
		e.preventDefault();
		const { name, password, confirmPassword, company_name } = this.state;
		const email = this.state.email.toLowerCase();

		if (!name || !email || !company_name || !password || !confirmPassword) {
			this.setState({ error: "Fill in all fields" });
		} else {
			if(password === confirmPassword) {
				try {
					document.querySelector('.form .btn-register').classList.add("load");
					await api.post("/app_users/user_company", { name, email, password, company_name });
					setTimeout(() => {
						document.querySelector('#name', '#email', '#company_name', '#password', '#confirmPassword').blur();
						this.setState({ register_complete: true })
					}, 2000);
				} catch (error) {
					document.querySelector('.form .btn-register').classList.remove("load");
					this.setState({ error: "There is already an account created with this email address" });

					if(!error.message === "Request failed with status code 422") {
						this.setState({ error: "A server error occurred while registering your account T.T Please try again later" });
					} else {
					}
				}
			} else {
				this.setState({ error: "Password confirmation does not match password" });
			}
		}
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	render() {
		if (isAuthenticated()) {
			return <Redirect to='/projects' />
		}

		return (
			<div data-page="sign-up" className="with-text">
				<svg className="bg-logo" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 228.4 224.6">
					<path fill="2f55a4" d="M218 162.1l-16.4 16.4c-7.8 5.6-18.7 4.9-25.7-2.1l-56.7-56.7-.3-.3-32.7-32.7c-1-1.1-2.1-2.2-3.2-3.2l-13-13-28.3-28.3h28.9c0 .2 4.7 0 7.1 0 5.9 0 11.6 1 16.8 2.9 5.6 2 10.7 5 15.2 8.8L140.8 85l6.3 6.3 10.8 10.8 28.2 28.2 18 18 13.9 13.8zm-42.3 42.8l-16.4 16.4c-7 5-16.4 4.9-23.3-.1-.8-.6-1.6-1.3-2.3-2L87.5 173l-.6-.6-20-20-8.2-8.2h38.6c5.5.3 10.8 1.5 15.8 3.5 5.3 2.1 10.2 5.2 14.5 8.9l4.3 4.3c3 3.4 12.2 12.2 12.2 12.2l18 18 13.6 13.8z"/>
					<path fill="2f55a4" d="M213.3 73.5l-14-14L157.8 18l-6.5-6.5c-4.3-3.6-9.2-6.3-14.4-8.3s-11-3-16.9-3H1.2c0 .2 27.1 28 27.1 28h64.6c5.6.1 11 1.2 16 3 5.8 2.2 11.2 5.3 15.7 9.5 1.4 1.3 2.8 2.6 4.1 4.1l56.9 56.9c7.4 7.4 19.2 7.7 26.9.9l14.9-14.9c.1-.1-14.1-14.2-14.1-14.2z"/>
				</svg>

				<div className="text-holder">
					<p className="text"><strong>Seat 7 Entertainment</strong><br/>is the fastest growing business development and executive production company specializing in the video game, interactive, and digital space.</p>
				</div>

				<div className="container-sign-up">
					<svg className="bg-logo-right" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 228.4 224.6">
						<path fill="2f55a4" d="M218 162.1l-16.4 16.4c-7.8 5.6-18.7 4.9-25.7-2.1l-56.7-56.7-.3-.3-32.7-32.7c-1-1.1-2.1-2.2-3.2-3.2l-13-13-28.3-28.3h28.9c0 .2 4.7 0 7.1 0 5.9 0 11.6 1 16.8 2.9 5.6 2 10.7 5 15.2 8.8L140.8 85l6.3 6.3 10.8 10.8 28.2 28.2 18 18 13.9 13.8zm-42.3 42.8l-16.4 16.4c-7 5-16.4 4.9-23.3-.1-.8-.6-1.6-1.3-2.3-2L87.5 173l-.6-.6-20-20-8.2-8.2h38.6c5.5.3 10.8 1.5 15.8 3.5 5.3 2.1 10.2 5.2 14.5 8.9l4.3 4.3c3 3.4 12.2 12.2 12.2 12.2l18 18 13.6 13.8z"/>
						<path fill="2f55a4" d="M213.3 73.5l-14-14L157.8 18l-6.5-6.5c-4.3-3.6-9.2-6.3-14.4-8.3s-11-3-16.9-3H1.2c0 .2 27.1 28 27.1 28h64.6c5.6.1 11 1.2 16 3 5.8 2.2 11.2 5.3 15.7 9.5 1.4 1.3 2.8 2.6 4.1 4.1l56.9 56.9c7.4 7.4 19.2 7.7 26.9.9l14.9-14.9c.1-.1-14.1-14.2-14.1-14.2z"/>
					</svg>
					<svg className="logo" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 261.7 368.3">
						<path fill="#2f55a4" d="M235.3 164l-16.4 16.4c-7.8 5.6-18.7 4.9-25.7-2.1l-56.7-56.7-.3-.3-32.7-32.7c-1-1.1-2.1-2.2-3.2-3.2l-13-13L59 44.1h28.9c0 .2 4.7 0 7.1 0 5.9 0 11.6 1 16.8 2.9 5.6 2 10.7 5 15.2 8.8l31.1 31.1 6.3 6.3 10.8 10.8 28.2 28.2 18 18 13.9 13.8zM193 206.3l-16.4 16.4c-7 5-16.4 4.9-23.3-.1-.8-.6-1.6-1.3-2.3-2l-46.2-46.2-.6-.6-20-20-8.2-8.2h38.6c5.5.3 10.8 1.5 15.8 3.5 5.3 2.1 10.2 5.2 14.5 8.9l4.3 4.3c3 3.4 12.2 12.2 12.2 12.2l18 18 13.6 13.8z"/>
						<path fill="#2f55a4" d="M231.7 75.7l-14.2-14.2-41.9-41.9L169 13c-4.3-3.6-9.3-6.4-14.6-8.4-5.3-2-11.1-3-17.1-3h-120c0 .2 27.4 28.3 27.4 28.3H110c5.7.1 11.1 1.2 16.2 3 5.9 2.2 11.3 5.4 15.9 9.6 1.4 1.3 2.8 2.6 4.1 4.1l57.5 57.5c7.5 7.5 19.4 7.8 27.2.9L246 89.9l-14.3-14.2z"/>
						<path fill="#2f55a4" d="M30.8 247c10.2 0 15.6 5.4 15.6 15.6V274c0 1.1-.5 1.7-1.7 1.7H33.3c-1.1 0-1.7-.6-1.7-1.7v-8.4c0-2.8-1.4-4.3-4.3-4.3h-5.2c-2.7 0-4.3 1.5-4.3 4.3v14.9l25.7 8.4c1.8.8 2.8 1.9 2.8 4v24.9c0 10.2-5.4 15.6-15.6 15.6h-12c-10 0-15.6-5.4-15.6-15.6v-11.3c0-1.2.6-1.7 1.7-1.7H16c1.2 0 1.7.5 1.7 1.7v8.3c0 2.9 1.6 4.3 4.3 4.3h5.2c2.8 0 4.3-1.4 4.3-4.3v-14.4L6 292c-1.9-.6-2.9-1.9-2.9-4v-25.5c0-10.2 5.5-15.6 15.6-15.6h12.1zM100.2 259.5c0 1.1-.4 1.8-1.7 1.8h-27V283h20.6c1.1 0 1.7.6 1.7 1.8v10.7c0 1.2-.6 1.8-1.7 1.8H71.5v21.8h27c1.3 0 1.7.5 1.7 1.7v10.8c0 1.1-.4 1.7-1.7 1.7H58.7c-1 0-1.6-.6-1.6-1.7v-82.9c0-1.1.6-1.7 1.6-1.7h39.7c1.3 0 1.7.6 1.7 1.7v10.8zM148.4 333.4c-1 0-1.5-.5-1.7-1.5l-3-15.8h-19.2l-2.9 15.8c-.2 1-.8 1.5-1.7 1.5h-11.6c-1.2 0-1.7-.6-1.4-1.8l17.9-83.1c.2-1.1.9-1.5 1.8-1.5h15c1 0 1.6.4 1.8 1.5l17.9 83.1c.2 1.2-.2 1.8-1.5 1.8h-11.4zM134 265.9l-6.9 37.7h13.8l-6.9-37.7zM201.7 247c1.2 0 1.7.6 1.7 1.7v10.8c0 1.1-.5 1.7-1.7 1.7h-12.5v70.4c0 1.2-.5 1.7-1.7 1.7h-11.2c-1.1 0-1.7-.5-1.7-1.7v-70.4H162c-1.1 0-1.7-.6-1.7-1.7v-10.8c0-1.1.6-1.7 1.7-1.7h39.7zM258.1 247c1.7 0 2.2 1.1 1.6 2.6l-31.5 82c-.4 1.2-1.2 1.7-2.5 1.7l-11.2.1c-1.6 0-2.3-1-1.7-2.5l26.7-69.6h-14.8c-6.9 0-12.5-5.6-12.5-12.5 0-1.2.6-1.7 1.7-1.8h44.2z"/>
					</svg>

					{!this.state.register_complete &&
						<form className="form" onSubmit={this.hendleSignUp}>
							{this.state.error &&
								<div className="label label-error">
									<p className="text">{this.state.error}</p>
								</div>
							}
							<div className="label">
								<input
									id="name"
									name="name"
									type="text"
									placeholder="Name"
									value={this.state.name}
									onChange={e => this.onChange(e)}
								/>
							</div>
							<div className="label">
								<input
									id="email"
									name="email"
									type="email"
									placeholder="Email"
									value={this.state.email}
									onChange={e => this.onChange(e)}
								/>
							</div>
							<div className="label">
								<input
									id="company_name"
									name="company_name"
									type="text"
									placeholder="Company"
									value={this.state.company}
									onChange={e => this.onChange(e)}
								/>
							</div>
							<div className="label">
								<input
									id="password"
									name="password"
									type="password"
									placeholder="Password"
									onChange={e => this.onChange(e)}
								/>
								<span className="icon"></span>
							</div>
							<div className="label">
								<input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									placeholder="Confirm your password"
									onChange={e => this.onChange(e)}
								/>
							</div>
							<button type="submit" className="btn btn-register"> Sign Up </button>
						</form>
					}

					{this.state.register_complete &&
						<div className="register-complete">
							<p className="title">Welcome!</p>
							<p className="text">
								<svg height="509pt" viewBox="0 -36 509.248 509" width="509pt" xmlns="http://www.w3.org/2000/svg">
									<path d="M171.902 438.074L0 266.172l100.625-100.61 71.277 71.297L408.625.125l100.621 100.621zm0 0" fill="#addb31"/>
								</svg>
								You have successfully created your account.
								<br/><br/>
								<strong>Keep an eye on your email.</strong><br/>
								You will receive a notice when your account is verified granting you access to the platform.
							</p>
							{/* <button onClick={() => this.setState({register_complete: false})} className="link">do you wish to register again?</button> */}
						</div>
					}
				</div>

				<Link to="/login" className="btn button-signin">Sign in</Link>
			</div>
		)
	};
}