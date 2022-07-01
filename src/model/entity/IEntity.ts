import Badge from "../badge/Badge"

interface IEntity{
	/**
	 * the index in a map rather than in the streak
	 */
	getIndex ():number
	setIndex (index:number):void
	setPreviousEntity(entity: IEntity): void
	getPreviousEntity(): IEntity | undefined
	setNextEntity(entity: IEntity): void
	getNextEntity(): IEntity | undefined
	getTagArray():Badge[]
	addTag(tag: Badge): void
}

export default IEntity
