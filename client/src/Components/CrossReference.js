import { Context } from "../Context";
import { useContext } from "react";
import styled from "styled-components";

const CrossReference = () => {

    const {answer} = useContext(Context)

    return ( <>Hm, you're the first to search for that musician. 
    We need to confirm the spotify artist. 
    Did you mean 
    <p>{answer[0].name}?</p>
    {answer[0].images[0] && <Image src={answer[0].images[0].url}/>}
    </> );
}
 
export default CrossReference;

const Image = styled.img`
width: 125px;
`