import Entity from "./Entity"
import IResult from "./IResult"

class LosingEntity extends Entity implements IResult {
	readonly isVictorious: boolean = false
}

export default LosingEntity
