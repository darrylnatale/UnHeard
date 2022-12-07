import { Context } from "../Context";
import { useContext } from "react";
import useInterval from "../Functions/use-interval.hook";
const Timer = (functionToCall) => {
    const {selectedArtist, moreToFetch} = useContext(Context);
    

    useInterval(() => functionToCall(), 15000)

    return (null);
}
 
export default Timer;