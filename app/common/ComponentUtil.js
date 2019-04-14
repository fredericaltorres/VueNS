import React from "react";
import TypeUtil from './TypeUtil';
import Tracer from './Tracer';

export const ESCAPE_KEY = 27;
export const ENTER_KEY  = 13;

//////////////////////////////////////////////////////////////////////////////
/// Utility class for react components
class ComponentUtil  {

	// - Force the refresh of the react component by setting a new value in the state for property timeStamp. 
	// - Also accept to update the state with statePropertiesToUpdate.
	// - Execute callBack method after update
	static forceRefresh (reactComponent, statePropertiesToUpdate, callBack = null) {

		const state = reactComponent.state;
		const timeStamp = new Date().getTime();
		let newState = null;
		if(statePropertiesToUpdate) 
			newState = { ...state, ...statePropertiesToUpdate, timeStamp };
		else
			newState = { ...state, timeStamp };
		reactComponent.setState(newState, callBack ? callBack : undefined);
	}

	static setIsLoading(reactComponent, state) {
		
		Tracer.log(`setIsLoading: ${state}`); // TODO: Do not log when running 
		ComponentUtil.forceRefresh(reactComponent, { isLoading: state });
	}

	// Execute the function func(), but activate the isBusy state of 
	// the component (state.isLoading) before and after execution.
	static executeAsBusy(reactComponent, func, onDoneFunc = null) {
		
		if(!TypeUtil.isFunction(func))
			TypeUtil.throwInvalidParameterType('func', 'function');

		// const isAlreadyLoading = reactComponent.state.isLoading;
		ComponentUtil.setIsLoading(reactComponent, true);

		return new Promise((resolve, reject) => {

			const r = func();
			// If func() return a promise we wait for the execution
			// before turning the isLoading mode off
			if(TypeUtil.isPromise(r)) {
				return r.then(() => {
					ComponentUtil.setIsLoading(reactComponent, false);
					if(onDoneFunc)
						onDoneFunc();
					resolve();
				});
			} 
			else {
				ComponentUtil.setIsLoading(reactComponent, false);
				if(onDoneFunc)
					onDoneFunc();
				resolve();
			}
		});
	}	

	static getNewUniqueId() {
		
		return Math.random().toString(16).substr(2, 16);
	}

	static generateOptionsForSelect(optionValueArray) {

		return optionValueArray.map((optionValue) => {
			return <option key={optionValue} value={optionValue}>{optionValue}</option>;
		 });		
	}
}

export default ComponentUtil;
