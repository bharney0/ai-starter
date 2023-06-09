import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { ApplicationState, AppState } from '../../store/index';
import * as WeatherForecastsState from '../../store/WeatherForecasts';
import { useState } from 'react';

// At runtime, Redux will merge together...
type WeatherForecastProps = WeatherForecastsState.WeatherForecastsState & {
	// ... state we've requested from the Redux store
	weatherForcastActions: typeof WeatherForecastsState.actionCreators;
};

const FetchData = (props: WeatherForecastProps) => {
	const [startDateIndex, setStartDateIndex] = useState(0);

	// This method runs when the component is first added to the page
	const params = useParams<{ startDateIndex: string }>();
	if (params.startDateIndex) {
		parseInt(params.startDateIndex) || 0;
	}
	props.weatherForcastActions.requestWeatherForecasts(startDateIndex);

	const renderForecastsTable = () => {
		return (
			<table className="table">
				<thead>
					<tr>
						<th>Date</th>
						<th>Temp. (C)</th>
						<th>Temp. (F)</th>
						<th>Summary</th>
					</tr>
				</thead>
				<tbody>
					{props.forecasts.map(forecast => (
						<tr key={forecast.dateFormatted}>
							<td>{forecast.dateFormatted}</td>
							<td>{forecast.temperatureC}</td>
							<td>{forecast.temperatureF}</td>
							<td>{forecast.summary}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	};

	const renderPagination = () => {
		let prevStartDateIndex = (props.startDateIndex || 0) - 5;
		let nextStartDateIndex = (props.startDateIndex || 0) + 5;

		return (
			<p className="clearfix text-center">
				<Link className="btn btn-default pull-left" to={`/fetchdata/${prevStartDateIndex}`}>
					Previous
				</Link>
				<Link className="btn btn-default pull-right" to={`/fetchdata/${nextStartDateIndex}`}>
					Next
				</Link>
				{props.isLoading ? (
					<FontAwesomeIcon
						className="svg-inline--fa fa-w-16 fa-lg"
						icon={faSpinner}
						spin
						size="2x"
					/>
				) : (
					[]
				)}
			</p>
		);
	};

	return (
		<div>
			<h1>Weather forecast</h1>
			<p>
				This component demonstrates fetching data from the server and working with URL parameters.
			</p>
			{renderForecastsTable()}
			{renderPagination()}
		</div>
	);
};

export default connect(
	(state: AppState) => state.weatherForecasts, // Selects which state properties are merged into the component's props
	(dispatch: Dispatch) => {
		return {
			weatherForcastActions: bindActionCreators(WeatherForecastsState.actionCreators, dispatch)
		};
	}
)(FetchData);
