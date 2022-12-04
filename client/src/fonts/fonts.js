import { createGlobalStyle } from "styled-components";

import artisan from "./artisan.otf"

export default createGlobalStyle`

@font-face {
    font-family: 'artisan';
    src: local('artisan'),
    url(${artisan}) format('otf');
    
    font-weight: 300;
    font-style: normal;
}

`