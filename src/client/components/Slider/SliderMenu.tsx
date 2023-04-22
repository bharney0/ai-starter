import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { NavContext } from '../../App';
interface NavProps {
	onUpdate: () => void;
}

export class SliderMenu extends React.PureComponent<{}, {}> {
	public render() {
		return (
			<NavContext.Consumer>
				{({ onUpdate }: NavProps) => (
					<React.Fragment>
						<NavLink
							className={({ isActive }) =>
								isActive ? 'list-group-item active' : 'list-group-item'
							}
							to={'/counter'}
							onClick={onUpdate}
						>
							Counter
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								isActive ? 'list-group-item active' : 'list-group-item'
							}
							to={'/fetchdata'}
							onClick={onUpdate}
						>
							Fetch Data
						</NavLink>
					</React.Fragment>
				)}
			</NavContext.Consumer>
		);
	}
}

export default SliderMenu;
