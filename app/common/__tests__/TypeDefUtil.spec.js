import TypeUtil from '../TypeUtil';
import TypeDefUtil from '../TypeDefUtil';
import { FIRESTORE_TIMESTAMP } from '../TypeUtil';

describe('TypeDefUtil', () => {
	[
		{ 
			typeDef : { 
				__name:'name',
				__collectionName:'collectionName',
				n:'Number', s:'String', b:'Boolean', o:'Object', nu:'null', date:'Date', array:'Array', func:'Function'
			 }, 
		  	actualObj : { n:1, s:'s', b:true, o:{}, nu:null, date:new Date(), array:[], func:() => {} } 
		},
		{ 
			typeDef : { 
				__name:'name',
				__collectionName:'collectionName',
				 createdAt: FIRESTORE_TIMESTAMP,
			 }, 
			 actualObj : { createdAt: { nanoseconds: 661000000, seconds: 1541389535 }
		} 
		}
	].forEach(
		({typeDef, actualObj}) => {
			it(`verifyType typeDef:${JSON.stringify(typeDef)}`, () => {
				expect(TypeDefUtil.verifyType(typeDef, actualObj, false)).toBe(true);
			});
		}
	);

	it(`verifyType with enum type`, () => {

		const typeDefDBObjectName = 'DBLink';

		// const categoryPropertyTypeDef = {
		// 	__type: 'String',
		// 	__values: ['hardware', 'software', 'other'],
		// 	getDefault: () => this.__values[0],
		// };

		function categoryPropertyTypeDef () {

			this.__type = 'String';
			this.__values = ['hardware', 'software', 'other'];
			this.getDefault = function() { return this.__values[0]; }
		};
		
		const typeDef = {
		
			__name: 		  typeDefDBObjectName,
			__collectionName: typeDefDBObjectName+'s',
		
			id:				  'String',
			link:			  'String',
			description:	  'String',
			category:	  	  new categoryPropertyTypeDef(),
			order:			  'Number',
			files:			  'Object',
			createdAt: 		  FIRESTORE_TIMESTAMP,
		};
		
		const dbLink = {
			__name: 		  typeDefDBObjectName,
			__collectionName: typeDefDBObjectName+'s',
		
			id:				  'String',
			link:			  'String',
			description:	  'String',
			category:	  	  'hardware',
			order:			  1,
			files:			  {},
			createdAt: 		  { nanoseconds: 661000000, seconds: 1541389535 },
		};

		expect(TypeDefUtil.verifyType(typeDef, dbLink, false)).toBe(true);
		expect("hardware").toBe(typeDef.category.getDefault());
	});

});
