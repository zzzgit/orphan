/* eslint-disable @typescript-eslint/no-type-alias */

type Outcome = {
	array: number[]
	statistics: {
		average: number
		max: number
		min: number
		sum: number
		streak: number
	}
	bet:{
		all: number
		banco:{
			win: number
			lose: number
			w2l: number
		}
		punto: {
			win: number
			lose: number
			w2l: number
		}
	}
	strategy:{
		balance: number
		limitTimes: number
		stopTimes: number
	}
}


export default Outcome
