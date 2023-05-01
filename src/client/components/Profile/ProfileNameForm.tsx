import React from 'react';
import { Field, GenericField, reduxForm } from 'redux-form';

export const profileForm = ({
	submitting,
	handleSubmit,
	...props
}: {
	submitting: any;
	handleSubmit: any;
}) => {
	return (
		<form id="profileForm" className="form-wrapper" onSubmit={handleSubmit}>
			<div className="form-group">
				<label htmlFor="email" className="form-control-label">
					Email
				</label>
				<Field
					name="email"
					id="email"
					placeholder="Email"
					disabled
					component="input"
					className="form-control"
					type="text"
				/>
			</div>
			<div className="form-group">
				<label htmlFor="firstName" className="form-control-label">
					First Name
				</label>
				<Field
					name="firstName"
					id="firstName"
					placeholder="First Name"
					required
					component="input"
					className="form-control"
					type="text"
				/>
			</div>
			<div className="form-group">
				<label htmlFor="lastName" className="form-control-label">
					Last Name
				</label>
				<Field
					name="lastName"
					id="lastName"
					placeholder="Last Name"
					required
					component="input"
					className="form-control"
					type="text"
				/>
			</div>
			<div className="form-group">
				<button className="btn btn-lg btn-primary btn-block" type="submit" disabled={submitting}>
					Next
				</button>
			</div>
		</form>
	);
};

export default reduxForm<{}, {}>({
	form: 'profileForm',
	destroyOnUnmount: false, //        <------ preserve form data
	forceUnregisterOnUnmount: true // <------ unregister fields on unmount
})(profileForm);
