// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25;

contract CryptoRoulette {

    Roulette public roulette;
    address owner;
    uint minAmount = 0.001 ether;
    mapping(address => bool) trustedAddresses;
    mapping(address => bool) hasBetted;
    Bet[] public bets;
    Bet[] winners;
    event Reveal(Bet[] winners, Roulette roulette);
    event NewBet(Bet[] bets);

    constructor() {
        owner = msg.sender;
        trustedAddresses[owner] = true;
        uint random = randomNumber(block.number - 1);
        roulette = Roulette(random);
    }

    struct Roulette {
        uint result;
    }

    struct Bet {
        address player;
        uint amount;
        uint number;
        uint wonAmount;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyTrusted() {
        require(trustedAddresses[msg.sender]);
        _;
    }

    function bet(uint _number) payable public {
        require(msg.value > minAmount, "Bet amount should be at least 0.001 ETH");
        require(_number < 30, "Input number must be less than 30");
        require(!hasBetted[msg.sender], "You can only bet once");
        Bet memory newBet = Bet(msg.sender, msg.value, _number, 0);
        bets.push(newBet);
        hasBetted[msg.sender] = true;
        emit NewBet(bets);
    }

    function getBets() public view returns (Bet[] memory) {
        return bets;
    }

    function end() public onlyTrusted {
        for (uint i = 0; i < bets.length; i++) {
            if (bets[i].amount == roulette.result) {
                bets[i].wonAmount = bets[i].amount * 2;
                winners.push(bets[i]);
            }
            hasBetted[bets[i].player] = false;
        }
        emit Reveal(winners, roulette);
        resetGame();
    }

    function resetGame() internal onlyTrusted {
        uint random = randomNumber(block.number - 1);
        roulette = Roulette(random);
        delete winners;
        delete bets;
    }

    function addTrustedAddress(address _address) public onlyOwner {
        trustedAddresses[_address] = true;
    }

    function randomNumber(uint _blockNumber) internal view returns (uint) {
        return uint(blockhash(_blockNumber));
    }

}
