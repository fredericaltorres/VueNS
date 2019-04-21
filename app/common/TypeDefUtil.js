import Tracer from './Tracer';
import moment from "moment"; // http://momentjs.com/
import TypeUtil from '../common/TypeUtil';
import {FIRESTORE_TIMESTAMP} from '../common/TypeUtil';

class TypeDefUtil {
	
	getTypeDefProperties(typeDef) {

		const properties = Object.keys(typeDef).filter(
			(property) => {
				return !property.startsWith("__");
			}			
		);
		return properties;
	}
	// Verify that the type definition contains allthe required meta data properties
	verifyTypeDef(typeDef) {

		if(!typeDef.__name) Tracer.throw(Error(`property __name in typeDef missing`));
		if(!typeDef.__collectionName) Tracer.throw(Error(`property __collectionName in typeDef ${typeDef.__name} missing`));
	}
	// Verify that document doc match the type definition
	verifyType(typeDef, doc, throwEx = true) {

		this.verifyTypeDef(typeDef);
		Tracer.log(`verifyType ${typeDef.__name}`);
		let r = true;
		this.getTypeDefProperties(typeDef).forEach((property) => {

			let expectedType = typeDef[property];
			let actualValue = doc[property];

			// if expectedType is contains an advanced property type definition rather than a string
			if(TypeUtil.isObject(expectedType)) {

				const propertyTypeDef = expectedType;
				expectedType = propertyTypeDef.__type;
				let acceptableValues = propertyTypeDef.__values;
				const actualType = TypeUtil.getType(actualValue);
				if(!acceptableValues.includes(actualValue)) {
					const errMsg = `TypeUtil.verifyType error on enum property:${property}, expectedType:${expectedType}, actualType:${actualType}, invalid value:${actualValue}`;
					r = false;
					if(throwEx) Tracer.throw(errMsg);
				}
			}
			else {

				const actualType = TypeUtil.getType(actualValue);

				if(expectedType === FIRESTORE_TIMESTAMP) {

					if(!(TypeUtil.isNumber(actualValue.nanoseconds) && TypeUtil.isNumber(actualValue.seconds))) {
						//nanoseconds: 661000000, seconds: 1541389535
						const errMsg = `TypeUtil.verifyType error on property:${property}, expectedType:${expectedType}, actualType:${actualType}`;
						r = false;
						if(throwEx) Tracer.throw(errMsg);
					}				
				}
				else {

					if(expectedType !== actualType) {
						const errMsg = `TypeUtil.verifyType error on property:${property}, expectedType:${expectedType}, actualType:${actualType}`;
						r = false;
						if(throwEx) Tracer.throw(errMsg);
					}
				}
			}
		});
		return r;
	}
	createFromProps(typeDef, props, otherProps) {

		let newDoc = {};
		// get the list of property from the typeDef and copy the name/value
		// from the props into a new document. Then add otherProps
		this.getTypeDefProperties(typeDef).forEach((property) => {

			const actualValue = props[property];
			newDoc[property] = actualValue;
		});
		newDoc = { ...newDoc, ...otherProps};
		return newDoc;
	}
	// https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
	formatFirebaseTimestamp(timestamp, format = 'YYYY/MM/DD h:mm:ss a') {

		let m = null;
		if(TypeUtil.isFunction(timestamp.toDate))
			 m = moment(timestamp.toDate()); // Browser mode
		else
			m = moment(timestamp); // NativeScript mode
		const s = m.format(format);
		return s;
	}
}

export default new TypeDefUtil();
