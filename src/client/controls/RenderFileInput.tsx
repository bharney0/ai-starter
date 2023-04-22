import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ChangeEvent, ChangeEventHandler } from 'react';
import { Field } from 'redux-form';

class renderFileInput extends React.Component<any, any> {
	onChange = (e: ChangeEvent) => {
		const target = (e as any).target as HTMLInputElement;
		if (!target.files || !target.files[0]) {
			return;
		}
		const { input, displayFieldId } = this.props;
		input.onChange(target.files[0]);
		var displayValue = document.getElementById(displayFieldId);
		(displayValue as HTMLInputElement).value = target.files[0].name;
	};

	removeFile = () => {
		const { input, displayFieldId } = this.props;
		input.value = null;
		var displayValue = document.getElementById(displayFieldId) as any;
		if (displayValue && displayValue.value) {
			displayValue.value = null;
		}
	};

	render() {
		const { resetKey, id, displayFieldId, defaultValue, ...inputProps } = this.props;
		return (
			<div className="input-group">
				<label className="input-group-btn mb-0">
					<span className="btn btn-outline-primary group-right">
						<FontAwesomeIcon
							className="svg-inline--fa fa-w-16 fa-lg"
							size="1x"
							icon={faFolderOpen}
						/>
						&nbsp;Upload Image&hellip;
						<input
							{...inputProps}
							key={resetKey}
							type="file"
							accept=".jpeg,.jpg,.png,.gif"
							onChange={(event: ChangeEvent) => this.onChange(event)}
							onBlur={() => {}}
							className="d-none"
						/>
					</span>
				</label>
				<Field
					name={displayFieldId}
					id={displayFieldId}
					disabled
					placeholder="Image Url"
					component="input"
					readOnly
					className="form-control"
					type="text"
				/>
				<span className="btn btn-outline-secondary group-left" onClick={this.removeFile}>
					<FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" icon={faTrash} />
				</span>
			</div>
		);
	}
}

export default renderFileInput;
