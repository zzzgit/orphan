import InnerError from "../../error/InnerError"
import Badge from "../badge/Badge"
import IEntity from "./IEntity"
import IMun from "./IMun"
import IResult from "./IResult"

class Entity implements IEntity, IMun, IResult {
	private _prev: Entity |undefined

	private _next: Entity |undefined

	private _index: number = -1

	private _tagArray: Badge[] = []

	readonly isPunto: boolean

	readonly isBanco: boolean

	isVictorious: boolean = false

	constructor(isBanco: boolean) {
		this.isBanco = !!isBanco
		this.isPunto = !isBanco
	}

	setNextEntity(entity: IEntity): void {
		const converted = entity as unknown
		this._next = converted as Entity
	}

	getNextEntity(): IEntity | undefined {
		const converted = this._next as unknown
		return converted as IEntity
	}

	setIndex(index: number): void {
		this._index = index
	}

	setPreviousEntity(entity: IEntity): void {
		if (!(entity instanceof Entity)) {
			throw new InnerError(`[Entity][setPreviousEntity]: parameter entity should a instance of Entity!`)
		}
		this._prev = entity
		// entity.setNextEntity(this)
		entity._next = this
	}

	getIndex(): number {
		return this._index
	}

	getPreviousEntity(): IEntity | undefined {
		if (!this._prev) {
			return undefined
		}
		return this._prev
	}

	getTagArray(): Badge[] {
		return [...this._tagArray]
	}

	addTag(tag: Badge): void {
		this._tagArray.push(tag)
	}
}

export default Entity
