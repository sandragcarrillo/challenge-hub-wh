import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  QuestCompleted,
  QuestCreated,
  QuestInvalidated,
  RewardClaimed
} from "../generated/Curios/Curios"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createQuestCompletedEvent(
  _tokenAddress: Address,
  _questIndex: BigInt,
  _winner: Address
): QuestCompleted {
  let questCompletedEvent = changetype<QuestCompleted>(newMockEvent())

  questCompletedEvent.parameters = new Array()

  questCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenAddress",
      ethereum.Value.fromAddress(_tokenAddress)
    )
  )
  questCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "_questIndex",
      ethereum.Value.fromUnsignedBigInt(_questIndex)
    )
  )
  questCompletedEvent.parameters.push(
    new ethereum.EventParam("_winner", ethereum.Value.fromAddress(_winner))
  )

  return questCompletedEvent
}

export function createQuestCreatedEvent(
  _tokenAddress: Address,
  _questIndex: BigInt,
  questType: i32
): QuestCreated {
  let questCreatedEvent = changetype<QuestCreated>(newMockEvent())

  questCreatedEvent.parameters = new Array()

  questCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenAddress",
      ethereum.Value.fromAddress(_tokenAddress)
    )
  )
  questCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "_questIndex",
      ethereum.Value.fromUnsignedBigInt(_questIndex)
    )
  )
  questCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "questType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(questType))
    )
  )

  return questCreatedEvent
}

export function createQuestInvalidatedEvent(
  _tokenAddress: Address,
  _questIndex: BigInt
): QuestInvalidated {
  let questInvalidatedEvent = changetype<QuestInvalidated>(newMockEvent())

  questInvalidatedEvent.parameters = new Array()

  questInvalidatedEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenAddress",
      ethereum.Value.fromAddress(_tokenAddress)
    )
  )
  questInvalidatedEvent.parameters.push(
    new ethereum.EventParam(
      "_questIndex",
      ethereum.Value.fromUnsignedBigInt(_questIndex)
    )
  )

  return questInvalidatedEvent
}

export function createRewardClaimedEvent(
  _tokenAddress: Address,
  _questIndex: BigInt,
  _claimer: Address
): RewardClaimed {
  let rewardClaimedEvent = changetype<RewardClaimed>(newMockEvent())

  rewardClaimedEvent.parameters = new Array()

  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenAddress",
      ethereum.Value.fromAddress(_tokenAddress)
    )
  )
  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "_questIndex",
      ethereum.Value.fromUnsignedBigInt(_questIndex)
    )
  )
  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam("_claimer", ethereum.Value.fromAddress(_claimer))
  )

  return rewardClaimedEvent
}
