import Tracer from './Tracer';

export const FIRESTORE_TIMESTAMP = 'Firestore.Timestamp';

class TypeUtil {
	
	getType (v) {

		var type;
		if (v === null)
			return "null";
		if (typeof v === 'undefined')
			return "undefined";

		type = Object.prototype.toString.call(v);
		type = type.replace("[object ", "");
		type = type.replace("]", "");
		return type;
	}

    isFunction(v) { return this.getType(v) === "Function";  }
    isString  (v) { return this.getType(v) === "String";    }
    isBoolean (v) { return this.getType(v) === "Boolean";   }
    isNumber  (v) { return this.getType(v) === "Number";    }
    isDate    (v) { return this.getType(v) === "Date";      }
    isArray   (v) { return this.getType(v) === "Array";     }
    isObject  (v) { return this.getType(v) === "Object";    }
	isRegExp  (v) { return this.getType(v) === "RegExp";    }
	isPromise (v) { return !!(v.then) }

    isInteger (x) {

        if(this.isNumber(x)) {
            var y = parseInt(x);
            if (isNaN(y)) return false;
            return x===y && x.toString()==y.toString();
        }
	}	
	throwInvalidParameterType (parameterName, parameterValue, expectedType) {
		if(this.getType(parameterValue)!==expectedType)
			Tracer.throw(Error(`Parameter:${parameterName} must be of type:${expectedType}`));
	}
}

export default new TypeUtil();
