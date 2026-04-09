// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FeedbackBoard {

    struct Feedback{
        address sender;
        string message;
        uint256 timestamp;
    }

    Feedback[] public feedbacks;

    event FeedbackSubmitted(address indexed sender, string message, uint256 timestamp);

    function submitFeedback(string memory _msg) public {
        feedbacks.push(Feedback(msg.sender, _msg, block.timestamp));
        emit FeedbackSubmitted(msg.sender, _msg, block.timestamp);
    }

    function getFeedback(uint index) public view returns(address, string memory, uint256)
    {
        require(index < feedbacks.length,"Index out of range");
        Feedback memory feed = feedbacks[index];
        return(feed.sender, feed.message, feed.timestamp);
    }

    function getTotalFeedback() public view returns (uint) {
        return(feedbacks.length);
    }

}
