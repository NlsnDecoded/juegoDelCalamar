// import logo from './logo.svg';
import './App.css';
// import Button from "./app/Button";
// import Image from "./app/views/image";
import React, {Component} from "react";
// import ColorPicker from "./app/views/colorPicker";
// import RecognizeCompetitor from "./app/actions/RecognizeCompetitor";
// import AddCompetitor from "./app/actions/AddCompetitor";
// import LayerApp from "./app/layers/layerApp";
import TestLayer from "./app/layers/TestLayer";


class App extends Component {
    render() {

        return (
            <div>
                <TestLayer />
                {/*<LayerApp />*/}

                {/*<Image />*/}
                {/*<AddCompetitor />*/}
                {/*--------------------------------*/}
                {/*<br /><span>Recognize Competitor</span>*/}
                {/*<RecognizeCompetitor />*/}
                {/*<ColorPicker/>*/}
            </div>
        )
    }
//
//     return(
//
// <div className="App">
// <Image />
// </div>
//
// )
//     ;
}

export default App;
