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
							to={'/portfolio'}
							onClick={onUpdate}
						>
							Portfolio
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								isActive ? 'list-group-item active' : 'list-group-item'
							}
							to={'/about'}
							onClick={onUpdate}
						>
							About
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								isActive ? 'list-group-item active' : 'list-group-item'
							}
							to={'/contact'}
							onClick={onUpdate}
						>
							Contact
						</NavLink>
						{/* <NavLink
							className={({ isActive }) =>
								isActive ? 'list-group-item active' : 'list-group-item'
							}
							to={'/blog'}
							onClick={onUpdate}
						>
							Blog
						</NavLink>*/}
					</React.Fragment>
				)}
			</NavContext.Consumer>
		);
	}
}

export default SliderMenu;
