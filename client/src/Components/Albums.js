import styled from "styled-components";
import { Context } from "../Context";
import { useContext } from "react";

const Albums = () => {

    const {discogsData} = useContext(Context)
    
    return ( <>
    <h1>... on {discogsData.length} albums</h1>
   <Album>
    {discogsData.masters.mainReleases.roles.main.map((item,index) => {
         
         return <div key={Math.floor(Math.random(index) * 160000000)}>
           {/* <div>{discogsData.artist} - {item.title}</div> */}
           <Image src={item.images[0].uri} />
           </div>  
       })
       }
       </Album>
    </> );
}
 
export default Albums;

const Image = styled.img`
width: 100px;
`

const Album = styled.div`
  display: flex;
  flex-wrap: wrap;
`