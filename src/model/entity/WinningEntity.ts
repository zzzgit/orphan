import Entity from "./Entity"
import IResult from "./IResult"

class WinningEntity extends Entity implements IResult {
	readonly isVictorious: boolean = true
}

export default WinningEntity
