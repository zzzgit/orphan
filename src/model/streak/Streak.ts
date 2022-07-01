import Entity from "../entity/Entity"

class Streak {
	private _firstEntity: Entity | undefined

	private _lastEntity: Entity | undefined

	private _next:Streak | undefined

	private _prev:Streak | undefined

	private _length:number = 0

	get isVictorious(): boolean {
		const first = this.getFirstEntity()
		if (!first) {
			return false
		}
		return first.isVictorious
	}

	getFirstEntity(): Entity|undefined {
		return this._firstEntity
	}

	getLastEntity(): Entity | undefined {
		return this._lastEntity
	}

	getNextStreak(): Streak | undefined {
		return this._next
	}

	getPreviousStreak(): Streak | undefined {
		return this._prev
	}

	setNextStreak(streak: Streak): void {
		this._next = streak
	}

	setPreviousStreak(streak: Streak): void {
		this._prev = streak
		streak.setNextStreak(this)
	}

	getLength(): number {
		return this._length
	}

	addEntity(entity: Entity) :boolean {
		if (!this._lastEntity) {
			this._firstEntity = this._lastEntity = entity
			this._length++
			return true
		}
		if (this.getLastEntity()?.isVictorious != entity.isVictorious) {
			return false
		}
		entity.setPreviousEntity(this._lastEntity)
		this._lastEntity = entity
		this._length++
		return true
	}
}

export default Streak
