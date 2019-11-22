import React from 'react';
import MapUpdater from "../map-updater";
export default class CanvasMap extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        console.log(this.canvasRef);
        let mapUpdater=new MapUpdater(this.canvasRef);
    }


    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} />
            </div>
        );
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    shouldComponentUpdate() {
        return false;
    }

}