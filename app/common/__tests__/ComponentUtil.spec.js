import ComponentUtil from '../ComponentUtil'
import TypeUtil from '../TypeUtil'

const ReactComponentMock = function() {

	this.setState = (state) => {
		this.state = state;
	}
	this.__init__ = () => {
		this.state = {};
	}
	this.__init__();
}

const reactComponentMock = new ReactComponentMock();

describe('ComponentUtil', () => {

	beforeEach(() => {
		reactComponentMock.__init__();
	});
	it('forceRefresh', () => {

		ComponentUtil.forceRefresh(reactComponentMock, { a : 1});
		expect(reactComponentMock.state.a).toEqual(1);
		expect(TypeUtil.isNumber(reactComponentMock.state.timeStamp)).toEqual(true);	
	});
	[true, false].forEach((input) => {

		it(`setIsLoading(${input})`, () => {

			ComponentUtil.setIsLoading(reactComponentMock, input);		
			expect(reactComponentMock.state.isLoading).toEqual(input);
		});		
	});	

	it(`executeAsBusy()`, (done) => {

		let counter = 0;
		const func = () => {
			expect(reactComponentMock.state.isLoading).toEqual(true);
			return new Promise((resolve, reject) => {

				counter += 1;
				resolve();
				done();
			});			
		};
		ComponentUtil.executeAsBusy(reactComponentMock, func)
		.then(() => {
			expect(counter).toEqual(1);
			expect(reactComponentMock.state.isLoading).toEqual(false);
		});		
	});		
});
