import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        this.setState({
            result: "result",
            nodes: ["A", "B", "C", "D", "E"],
        })
    }

    onClickExactPath = async () => {
        const url = this.getPaths("exactPath")+this.state.exactPath
        const response = await axios.get(url);
        this.setState({
            result: response.data,
        })
    }

    onClickShortestPath = async () => {
        const url = this.getPaths("shortest")+this.state.source+"/"+this.state.target
        const data = (await axios.get(url)).data;
        this.setState({
            result: data,
            shortestPath: true
        })
    }

    onClickConditionOnStops = async () => {
        let url = ""
        if(this.state.condition === "Max"){
            url = this.getPaths("maxNumberStops")+"Max/"+this.state.source+"/"+this.state.source+"/"+this.state.number
        } else {
            url = this.getPaths("exactNumberStops")+this.state.source+"/"+this.state.target+"/"+this.state.number
        }
        const data = (await axios.get(url)).data;
        this.setState({
            result: data
        })
    }

    onClickMaxDistance = async () => {
        const url = this.getPaths("maxDistance")+this.state.source+"/"+this.state.target+"/"+this.state.max
        const data = (await axios.get(url)).data;
        this.setState({
            result: data
        })
    }

    getDistanceByPath = async () => {
        const path = this.state.result
        let formattedPath = "";
        const list = path.slice(1, path.length-1).split(", ")
        list.forEach((stop) => {formattedPath += stop})
        const url = this.getPaths("exactPath")+formattedPath
        const distance =  (await axios.get(url)).data
        this.setState({
            distance: distance
        })
    }

    handleChange(event) {
        this.setState({exactPath: event.target.value});
    }

    handleSourceChange(event) {
        this.setState({source: event.target.value });
    }

    handleTargetChange(event) {
        this.setState({target: event.target.value });
    }

    handleConditionChange(event) {
        this.setState({condition: event.target.value});
    }

    handleNumberChange(event) {
        this.setState({number: event.target.value})
    }

    handleMaxDistanceChange(event) {
        this.setState({max: event.target.value})
    }

    getPaths(path) {
        const baseUrl = "http://localhost:8080/shortestPath/"
        const exactNumberStops = baseUrl+"exactNumberStops/"
        const maxNumberStops = baseUrl+"stops/"
        const exactPath = baseUrl+"exactPath/"
        const maxDistance = baseUrl+"maxDistance/"

        switch (path) {
            case "shortest":
                return baseUrl
            case "exactNumberStops":
                return exactNumberStops
            case "maxNumberStops":
                return maxNumberStops
            case "exactPath":
                return exactPath
            case "maxDistance":
                return maxDistance
            default:
                return ""
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h2>Welcome to ThoughtWorks Train Manage System!</h2>
                </header>
                <main>
                    <div className="App-grid-container">
                        <div className="App-exact-path">
                            <h4>Get Distance By Exact Path</h4>
                            <input type="text" placeholder="input like ABC" value={this.state.value} onChange={this.handleChange}/>
                            <button onClick={this.onClickExactPath}>Execute</button>
                        </div>
                        <div className="App-condition-stops">
                            <h4>Get Number of Trips With Condition on Stops</h4>
                            <select value={this.state.condition} onChange={this.handleConditionChange.bind(this)}>
                                <option value="" disabled selected>Select Condition</option>
                                <option value="Max">Max</option>
                                <option value="Equal">Equal</option>
                            </select>
                            {this.state.condition ?
                                this.state.condition==="Max" ?
                                    <>
                                        <select id="source" value={this.state.source} onChange={this.handleSourceChange.bind(this)}>
                                            <option value="fake" disabled selected>Select Start City</option>
                                            {this.state.nodes.map((node) => <option value={node}>{node}</option>)}
                                        </select>
                                        <input value={this.state.number} placeholder="input number of stops" onChange={this.handleNumberChange.bind(this)}/>
                                        <button onClick={this.onClickConditionOnStops}>Execute</button>
                                    </>
                                    :
                                    <>
                                        <select value={this.state.source} onChange={this.handleSourceChange.bind(this)}>
                                            <option value="" disabled selected>Select Start City</option>
                                            {this.state.nodes.map((node) => <option value={node}>{node}</option>)}
                                        </select>
                                        <select value={this.state.target} onChange={this.handleTargetChange.bind(this)}>
                                            <option value="" disabled selected>Select End City</option>
                                            {this.state.nodes.map((node) => <option value={node}>{node}</option>)}
                                        </select>
                                        <input value={this.state.number} placeholder="input number of stops" onChange={this.handleNumberChange.bind(this)}/>
                                        <button onClick={this.onClickConditionOnStops}>Execute</button>
                                    </>
                                : null
                            }
                        </div>
                        <div className="App-condition-distance">
                            <h4>Get Paths with Maximum Distance</h4>
                            <select value={this.state.source} onChange={this.handleSourceChange.bind(this)}>
                                <option value="" disabled selected>Select Start City</option>
                                {this.state.nodes.map((node) => <option value={node}>{node}</option>)}
                            </select>
                            <select value={this.state.target} onChange={this.handleTargetChange.bind(this)}>
                                <option value="" disabled selected>Select End City</option>
                                {this.state.nodes.map((node) => <option value={node}>{node}</option>)}
                            </select>
                            <input value={this.state.max} placeholder="input max distance" onChange={this.handleMaxDistanceChange.bind(this)}/>
                            <button onClick={this.onClickMaxDistance}>Execute</button>
                        </div>
                        <div className="App-shortest-path">
                            <h4>Get Shortest Path And Distance</h4>
                            <select id="source" value={this.state.source} onChange={this.handleSourceChange.bind(this)}>
                                <option value="" disabled selected>Select Start City</option>
                                {this.state.nodes.map((node) => <option value={node}>{node}</option>)}
                            </select>
                            <select id="target" value={this.state.target} onChange={this.handleTargetChange.bind(this)}>
                                <option value="" disabled selected>Select End City</option>
                                {this.state.nodes.map((node) => <option value={node}>{node}</option>)}
                            </select>
                            <button onClick={this.onClickShortestPath}>Get Path</button>
                            <button onClick={this.getDistanceByPath}>Get Distance</button>
                        </div>
                        <div className="App-result">
                            <p>{this.state.result}</p>
                            {this.state.distance ? <p>Distance: {this.state.distance}</p> : null}
                        </div>
                    </div>
                </main>
                <footer className="App-footer">
                    All rights reserved by ThoughtWorks.
                </footer>
            </div>
        );
    }
}

export default App;
