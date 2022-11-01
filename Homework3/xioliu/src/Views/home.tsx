import React from "react";
import './home.css'
// @ts-ignore
import csvPath from '../data/test.csv';

import * as d3 from "d3";
import Histogram from "../charts/histogram";
import Piechart from "../charts/piechart";
import Parallel from "../charts/parallel";

function Home() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        const readCsv = async () => {
            // @ts-ignore
            d3.csv(csvPath).then((csv_data) => setData(csv_data));
        }
        readCsv();
    }, [])

    // // @ts-ignore
    // console.log(data[0]);
    return (
        <div className={'background'}>
            <div className={'title_txt'}>
                <text> Analysis of Airline Passenger Satisfaction</text>
            </div>
            <div className={'overall'}>
                <Histogram data={data}/>
            </div>

            <div className={'contexts'}>
                <div className={'left'}>
                    <Piechart data={data} />
                </div>

                <div className={'right'}>
                    <Parallel data={data} />
                </div>
            </div>

        </div>
    )
}

export default Home
