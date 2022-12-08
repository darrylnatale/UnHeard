import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";
const Releases = () => {
    const {releases} =  useContext(Context)
    
    return (
        <Category>
            {releases.map((release) => {
                return <>
                <img src={release.thumb}/>
                <p>{release.title}</p>
                <p>{release.year}</p>
                </>
            })}
        </Category>
    )
}

 
export default Releases;

const Category = styled.div`

`