// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Curios is Ownable {
    // Quest Type
    enum QuestType { Quiz, Game }

    // Quest model
    struct Quest {
        address creator;
        uint index;
        QuestType questType; // Type of quest (Quiz or Game)
        string name;
        string hint;
        bytes32 merkleRoot; // For Quiz type
        string merkleBody;
        uint maxWinners;
        string metadata;
        bool valid;
        address[] winnersIndex;
        uint requiredScore; // Minimum score for Game type
        uint rewardAmount; // Reward amount per winner in Ether
    }

    // State
    mapping(address => Quest[]) public quests;
    mapping(address => mapping(uint => mapping(address => bool))) public winners;

    // Events
    event QuestCreated(address indexed _tokenAddress, uint indexed _questIndex, QuestType questType);
    event QuestCompleted(address indexed _tokenAddress, uint indexed _questIndex, address indexed _winner);
    event QuestInvalidated(address indexed _tokenAddress, uint indexed _questIndex);
    event RewardClaimed(address indexed _tokenAddress, uint indexed _questIndex, address indexed _claimer);

    // Constructor
    constructor(address initialOwner) Ownable(initialOwner) {}

    // Creates a new quest
    function createQuest(
        address _tokenAddress,
        string memory _name,
        string memory _hint,
        uint _maxWinners,
        bytes32 _merkleRoot,
        string memory _merkleBody,
        string memory _metadata,
        QuestType _questType,
        uint _requiredScore,
        uint _rewardAmount
    ) public onlyOwner payable {
        require(msg.value >= _rewardAmount * _maxWinners, "Insufficient Ether to fund rewards");

        Quest storage newQuest = quests[_tokenAddress].push();
        uint questIndex = quests[_tokenAddress].length - 1;

        newQuest.creator = msg.sender;
        newQuest.index = questIndex;
        newQuest.questType = _questType;
        newQuest.name = _name;
        newQuest.hint = _hint;
        newQuest.merkleRoot = _merkleRoot;
        newQuest.merkleBody = _merkleBody;
        newQuest.maxWinners = _maxWinners;
        newQuest.metadata = _metadata;
        newQuest.valid = true;
        newQuest.requiredScore = _requiredScore;
        newQuest.rewardAmount = _rewardAmount;

        emit QuestCreated(_tokenAddress, questIndex, _questType);
    }

    // Submit proof for the quest (Quiz)
    function submitProof(
        address _tokenAddress,
        uint _questIndex,
        bytes32[] memory _proof,
        bytes32 _answer
    ) public {
        Quest storage quest = quests[_tokenAddress][_questIndex];

        require(quest.valid, "Quest is not valid");
        require(quest.questType == QuestType.Quiz, "Invalid quest type");
        require(quest.winnersIndex.length < quest.maxWinners || quest.maxWinners == 0, "Max winners reached");
        require(msg.sender != quest.creator, "Creator cannot win their own quest");
        require(MerkleProof.verify(_proof, quest.merkleRoot, _answer), "Invalid Merkle proof");

        winners[_tokenAddress][_questIndex][msg.sender] = true;
        quest.winnersIndex.push(msg.sender);

        emit QuestCompleted(_tokenAddress, _questIndex, msg.sender);
    }

    // Submit score for the quest (Game)
    function submitScore(
        address _tokenAddress,
        uint _questIndex,
        uint _score
    ) public {
        Quest storage quest = quests[_tokenAddress][_questIndex];

        require(quest.valid, "Quest is not valid");
        require(quest.questType == QuestType.Game, "Invalid quest type");
        require(_score >= quest.requiredScore, "Score is too low");
        require(quest.winnersIndex.length < quest.maxWinners || quest.maxWinners == 0, "Max winners reached");
        require(msg.sender != quest.creator, "Creator cannot win their own quest");
        require(!winners[_tokenAddress][_questIndex][msg.sender], "Already claimed");

        winners[_tokenAddress][_questIndex][msg.sender] = true;
        quest.winnersIndex.push(msg.sender);

        emit QuestCompleted(_tokenAddress, _questIndex, msg.sender);
    }

    // Claim reward
    function claimReward(address _tokenAddress, uint _questIndex) public {
        Quest storage quest = quests[_tokenAddress][_questIndex];

        require(winners[_tokenAddress][_questIndex][msg.sender], "Not a winner");
        require(address(this).balance >= quest.rewardAmount, "Insufficient contract balance");

        winners[_tokenAddress][_questIndex][msg.sender] = false; // Prevent re-claiming
        payable(msg.sender).transfer(quest.rewardAmount);

        emit RewardClaimed(_tokenAddress, _questIndex, msg.sender);
    }

    // Invalidate a quest
    function invalidateQuest(address _tokenAddress, uint _questIndex) public {
        Quest storage quest = quests[_tokenAddress][_questIndex];
        require(msg.sender == quest.creator || msg.sender == owner(), "Not authorized");
        require(quest.valid, "Quest already invalidated");

        quest.valid = false;

        emit QuestInvalidated(_tokenAddress, _questIndex);
    }

    // Fallback function to receive Ether
    receive() external payable {}

    // Withdraw contract balance (only owner)
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
