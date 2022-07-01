import InnerError from "../../error/InnerError"
import IEntity from "../entity/IEntity"
import Streak from "../streak/Streak"
import Entity from "../entity/Entity"
import IRoad from "./IRoad"


class Road implements IRoad {
	private _length: number = 0

	private _firstStreak: Streak | undefined

	private _lastStreak: Streak | undefined

	private _setLastStreak(streak: Streak): void {
		this._lastStreak = streak
	}

	private _setFirstStreak(streak: Streak): void {
		this._firstStreak = streak
	}

	print(): string[] | string[][] {
		const result:string[][] = []
		let streak = this.getFirstStreak()
		while (streak) {
			const streakArr = []
			const first = streak.getFirstEntity()
			if (first?.isVictorious) {
				for (let i = 0, len = streak.getLength(); i < len; i++) {
					streakArr.push("W ")
				}
			} else {
				for (let i = 0, len = streak.getLength(); i < len; i++) {
					streakArr.push("L ")
				}
			}
			result.push(streakArr)
			streak = streak.getNextStreak() as Streak
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

	getPingpongIterator(): Generator<Entity[], void, boolean> {
		const first = this.getFirstStreak()
		const gen = function* (): Generator<Entity[], void, boolean> {
			const entities_arr: Entity[] = []
			let streak = first
			while (streak) {
				if (streak.getLength() === 1) {	// 當前streak是單跳
					entities_arr.push(streak.getFirstEntity() as Entity)
				} else {
					if (streak.getPreviousStreak()?.getLength() === 1) {
						const result = [...entities_arr]
						entities_arr.length = 0
						yield result
					}
				}
				streak = streak.getNextStreak()
			}
			if (entities_arr.length) {
				const result = [...entities_arr]
				entities_arr.length = 0
				yield result
			}
		}
		return gen()
	}
}

export default Road
