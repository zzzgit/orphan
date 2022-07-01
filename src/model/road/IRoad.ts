
import IEntity from "../entity/IEntity"
import Outcome from "../Outcome"
import Streak from "../streak/Streak"

interface IRoad {
	getFirstEntity(): IEntity | undefined
	getLastEntity(): IEntity | undefined
	getFirstStreak(): Streak | undefined
	getLastStreak(): Streak | undefined
	// 不能出現重複的object,成功就返回true，其他的類，在其他的項目中，也要有這樣的實現
	addEntity(entity: IEntity, isVictorious: boolean): boolean
	getSize(): number
	getOutcome(): Outcome
}

export default IRoad
