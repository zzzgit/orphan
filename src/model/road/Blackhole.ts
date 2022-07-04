import InnerError from "../../error/InnerError"
import IEntity from "../entity/IEntity"
import Streak from "../streak/Streak"
import Entity from "../entity/Entity"
import IRoad from "./IRoad"
import Outcome from "../Outcome"
import {std, max, min} from 'mathjs'


class Blackhole implements IRoad {
	private _length: number = 0

	private _firstStreak: Streak | undefined

	private _lastStreak: Streak | undefined

	private _setLastStreak(streak: Streak): void {
		this._lastStreak = streak
	}

	private _setFirstStreak(streak: Streak): void {
		this._firstStreak = streak
	}

	private _getArray(): number[] {
		const result:number[] = []
		let streak = this.getFirstStreak()
		while (streak) {
			let value = streak.getLength()
			if (!streak.getFirstEntity()?.isVictorious) {
				value = 0 - value
			}
			result.push(value)
			streak = streak.getNextStreak() as Streak
		}
		return result
	}

	private _getModel(): Outcome {
		const model: Outcome = {
			array: [],
			statistics: {
				std: 0,
				max: 0,
				min: 0,
				sum: 0,
				streak: 0,
			},
			bet: {
				all: 0,
				banco: {
					win: 0,
					lose: 0,
					w2l: 0,
				},
				punto: {
					win: 0,
					lose: 0,
					w2l: 0,
				},
			},
			strategy: {
				balance: 0,
				limitTimes: 0,
				stopTimes: 0,
			},
		}
		return model
	}

	getOutcome(): Outcome {
		const result: Outcome = this._getModel()
		// array
		const array = this._getArray()
		result.array = array
		const sum = array.reduce((accumulator, a) => accumulator + a, 0)
		result.statistics = {
			// average: sum / this.getSize(),
			max: max(array),
			min: min(array),
			sum: sum,
			streak: array.length,
			std: +std(array),
		}
		// traverse the streaks
		const banco = {
			win: 0,
			lose: 0,
		}
		const punto = {
			win: 0,
			lose: 0,
		}
		let streak = this.getFirstStreak()
		while (streak) {
			let first = streak.getFirstEntity()
			if (first?.isVictorious) {
				while (first) {
					if (first.isBanco) {
						banco.win++
					} else {
						punto.win++
					}
					first = first.getNextEntity() as Entity
				}
			} else {
				while (first) {
					if (first.isBanco) {
						banco.lose++
					} else {
						punto.lose++
					}
					first = first.getNextEntity() as Entity
				}
			}
			streak = streak.getNextStreak() as Streak
		}
		result.bet = {
			all: this.getSize(),
			banco: {
				win: banco.win,
				lose: banco.lose,
				w2l: Math.round(banco.win / banco.lose * 10000) / 100,
			},
			punto: {
				win: punto.win,
				lose: punto.lose,
				w2l: Math.round(punto.win / punto.lose * 10000) / 100,
			},
		}
		// strategy
		let balance = 0
		let level = 1
		let chipGained = 0
		let stopTimes = 0
		let limitTimes = 0
		streak = this.getFirstStreak()
		while (streak) {
			let first = streak.getFirstEntity()
			if (first?.isVictorious) {
				while (first) {
					if (first.isBanco) {
						balance = balance + level * (.95 + 0)
					} else {
						balance = balance + level
					}
					chipGained = chipGained + level
					if (chipGained >= 7) {
						limitTimes++
						level = 1
						chipGained = 0
					}
					first = first.getNextEntity() as Entity
				}
			} else {
				while (first) {
					const originalLevel = level
					balance = balance - level
					chipGained = chipGained - level
					if (chipGained <= -155) {
						stopTimes++
						level = 1
						chipGained = 0
					}
					if (originalLevel === 4 && chipGained <= -75) {
						level = 8
					} else if (originalLevel === 2 && chipGained <= -35) {
						level = 4
					} else if (originalLevel === 1 && chipGained <= -15) {
						level = 2
					}
					first = first.getNextEntity() as Entity
				}
			}
			streak = streak.getNextStreak() as Streak
		}
		result.strategy = {
			balance: Math.round(balance),
			stopTimes: stopTimes,
			limitTimes: limitTimes,
		}
		return result
	}

	getSize(): number {
		return this._length
	}

	addEntity(entity: Entity): boolean {
		// no streak
		if (!this.getFirstStreak()) {
			const steak: Streak = new Streak()
			this._setFirstStreak(steak)
			this._setLastStreak(steak)
		}
		const lastStreak = this.getLastStreak() as Streak
		const result = lastStreak.addEntity(entity)
		// streak is not suitable
		if (!result) {
			const newStreak: Streak = new Streak()
			newStreak.setPreviousStreak(lastStreak)
			this._setLastStreak(newStreak)
			this.getLastStreak()?.addEntity(entity)
		}
		entity.setIndex(this._length)
		this._length++
		return true
	}

	getFirstStreak(): Streak | undefined {
		return this._firstStreak
	}

	getLastStreak(): Streak | undefined {
		return this._lastStreak
	}

	getFirstEntity(): Entity | undefined {
		throw new InnerError(`[Road][getFirstEntity]:`)
	}

	getLastEntity(): IEntity | undefined {
		throw new InnerError(`[Road][getLastEntity]:`)
	}
}

export default Blackhole
