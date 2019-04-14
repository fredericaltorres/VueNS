// This color console log mode does not work in IE 11
class Tracer {

	constructor() {
		this.traceOn = true;
		this.coloredConsole = true;
	}
	internalTrace(text, style0, style1, logMethod) {
		if (this.traceOn) {
			if(this.coloredConsole)
				logMethod(text, style0, style1);
			else 
				logMethod(text);
		}
			
	}
	getName(instance) {
		if (instance && instance.name) return instance.name;
		return '';
	}
	getTimeStamp () {
		return new Date().toLocaleTimeString('en-US');
	};
	getPrefix(instance) {
		const name = this.getName(instance);
		if(name)
			return `[${this.getTimeStamp()}, ${name}]`;
		else
			return `[${this.getTimeStamp()}]`;
	}
	logObject(obj, instance = null)  {
		
		this.log(JSON.stringify(obj, null, 2), instance);
	}
	logComponent(reactComponent, instance = null)  {

		const state = `state:${JSON.stringify(reactComponent.state, null, 4)}`;
		this.log(state, reactComponent);
		const props = `props:${JSON.stringify(reactComponent.props, null, 4)}`;
		this.log(props, reactComponent);
	}
	log(m, instance = null) {
		const mm = this.getPrefix(instance);
		if(this.coloredConsole) {
			this.internalTrace(`%c ${mm}%c ${m}`, 'color:green;', 'color:blue;', console.log);
		}
		else {
			this.internalTrace(`${mm} ${m}`, 'color:green;', 'color:blue;', console.log);
		}
		return mm + m;
	}
	warn(m, instance = null) {
		const mm = `[${this.getTimeStamp()}, ${this.getName(instance)}]`;
		if(this.coloredConsole) {
			this.internalTrace(`%c ${mm}%c ${m}`, 'color:green;', 'color:blue;', console.warn);
		}
		else {
			this.internalTrace(`${mm} ${m}`, 'color:green;', 'color:blue;', console.warn);
		}
		return mm + m;
	}
	notifyUser(m, instance = null) {
		this.warn(m, instance);
		alert(m);
	}
	error(m, instance = null) {
		const mm = `[${this.getTimeStamp()}, ${this.getName(instance)}]`;
		if(this.coloredConsole) {
			this.internalTrace(`%c ${mm}%c ${m}`, 'color:green;', 'color:red;', console.error);
		}
		else {
			this.internalTrace(`${mm} ${m}`, 'color:green;', 'color:red;', console.error);
		}
		return mm + m;
	}
	throw (error, instance = null) {
		this.error(error.toString(), instance);
		throw error;
	}
	throwIfUndefined(parameter, parameterName, instance = null) {
		if(typeof(parameter) === 'undefined')
			this.throw(`Parameter ${parameterName} must be defined`, instance);
	}	
}

export default new Tracer();
