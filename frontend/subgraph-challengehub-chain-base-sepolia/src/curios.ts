import {
  OwnershipTransferred as OwnershipTransferredEvent,
  QuestCompleted as QuestCompletedEvent,
  QuestCreated as QuestCreatedEvent,
  QuestInvalidated as QuestInvalidatedEvent,
  RewardClaimed as RewardClaimedEvent
} from "../generated/Curios/Curios"
import {
  OwnershipTransferred,
  QuestCompleted,
  QuestCreated,
  QuestInvalidated,
  RewardClaimed
} from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestCompleted(event: QuestCompletedEvent): void {
  let entity = new QuestCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._tokenAddress = event.params._tokenAddress
  entity._questIndex = event.params._questIndex
  entity._winner = event.params._winner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestCreated(event: QuestCreatedEvent): void {
  let entity = new QuestCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._tokenAddress = event.params._tokenAddress
  entity._questIndex = event.params._questIndex
  entity.questType = event.params.questType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestInvalidated(event: QuestInvalidatedEvent): void {
  let entity = new QuestInvalidated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._tokenAddress = event.params._tokenAddress
  entity._questIndex = event.params._questIndex

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardClaimed(event: RewardClaimedEvent): void {
  let entity = new RewardClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._tokenAddress = event.params._tokenAddress
  entity._questIndex = event.params._questIndex
  entity._claimer = event.params._claimer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
