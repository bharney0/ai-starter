import * as React from 'react';
import { Field, GenericField, reduxForm } from 'redux-form';
import renderFileInput from '../../controls/RenderFileInput';

const InputField = Field as new () => GenericField<any>;

export const profileForm = ({
	pristine,
	submitting,
	handleSubmit
}: {
	pristine: any;
	submitting: any;
	handleSubmit: any;
}) => {
	return (
		<form id="profileForm" className="form-wrapper" onSubmit={handleSubmit}>
			<div className="form-group">
				<label htmlFor="imageUrl" className="form-control-label">
					Image Url
				</label>
				<InputField
					type="file"
					name="imageBlob"
					id="imageBlob"
					displayFieldId="imageUrl"
					placeholder="Image Url"
					component={renderFileInput}
					className="form-control"
				/>
			</div>
			<div className="form-group">
				<button className="btn btn-lg btn-primary btn-block" type="submit" disabled={submitting}>
					Save Profile
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
