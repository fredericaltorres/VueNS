class BrowserUtil {

	getCurrentUrl () {

		return new URL(window.location.href);
	}
    getQueryStringParameter(name) { 

		return this.getCurrentUrl().get(name);
	}
	isEqualQueryStringParameter(name, value) {

		return this.getCurrentUrl().searchParams.get(name) === value;
	}
}

export default new BrowserUtil();
