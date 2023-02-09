import React, {useEffect} from "react";
import "./App.css";
import {Button, Card, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function Player({player, index, markPlayer, removePlayer}) {
    return (
        <div
            className="player"
        >
            <span style={{textDecoration: player.isDone ? "line-through" : ""}}>{player.text}</span>
            <div>
          <span style={{marginRight: "50px"}}>
          </span>
                <Button variant="outline-success" onClick={() => markPlayer(index)}
                        style={{background: player.isDone ? "lightgreen" : "white"}}>Done</Button>{' '}
                <Button variant="outline-danger" onClick={() => removePlayer(index)}>Remove</Button>
            </div>
        </div>
    );
}

function FormPlayer({addPlayer, players}) {
    const [value, setValue] = React.useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addPlayer(value);
        setValue("");
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label><b>Add players and enemies(max 100)</b></Form.Label>
                <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)}
                              placeholder="Add new(maximum 100)"/>
            </Form.Group>
            <Button variant="primary mb-3" type="submit" disabled={players.length >= 10}>
                Add players and enemies
            </Button>
        </Form>
    );
}

function App() {
    const [players, setPlayers] = React.useState([]);

    useEffect(() => {
        const players = JSON.parse(localStorage.getItem('players'));
        if (players) {
            setPlayers(players);
        }
    }, []);

    const addPlayer = text => {
        const newPlayer = [...players, {text}];
        setPlayers(newPlayer);
        localStorage.setItem('players', JSON.stringify(newPlayer));
    };

    const markPlayer = index => {
        const newPlayer = [...players];
        newPlayer[index].isDone = !newPlayer[index].isDone;
        setPlayers(newPlayer);
    };

    const removePlayer = index => {
        const newPlayers = [...players];
        newPlayers.splice(index, 1);
        setPlayers(newPlayers);
        localStorage.setItem('players', JSON.stringify(newPlayers));
    };

    const rollInitiative = () => {
        let newInitiativeList = [];

        const dice = {
            sides: 100,
            roll: function () {
                var randomNumber = Math.floor(Math.random() * this.sides) + 1;
                while (newInitiativeList.find(element => element.rolledNumber === randomNumber)) {
                    randomNumber = Math.floor(Math.random() * this.sides) + 1;
                }
                return randomNumber;
            }
        };

        players.forEach(player => {
            let item = {
                ...player,
                rolledNumber: dice.roll(),
                isDone: false
            }
            newInitiativeList.push(item)
        })

        newInitiativeList.sort((function (a, b) {
            return b.rolledNumber - a.rolledNumber
        }))

        setPlayers(newInitiativeList)
    }

    return (
        <div className="app">
            <div className="container">
                <h1 className="text-center mb-4">Dragonbane Initiativ roll</h1>
                <FormPlayer addPlayer={addPlayer} players={players}/>
                <b>First at top, last att bottom</b>
                <div>
                    {players.map((player, index) => (
                        <Card key={index}>
                            <Card.Body>
                                <Player
                                    key={index}
                                    index={index}
                                    player={player}
                                    markPlayer={markPlayer}
                                    removePlayer={removePlayer}
                                />
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
            <div style={{textAlign: "center", marginTop: "10px"}}>
                <Button onClick={() => rollInitiative()}>
                    Roll initiativ
                </Button>
            </div>
        </div>
    );
}

export default App;