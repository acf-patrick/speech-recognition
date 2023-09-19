import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    :root {
        font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        font-weight: 400;
    
        color-scheme: light dark;
        color: rgba(255, 255, 255, 0.87);
        background-color: ${({ theme }) => theme.colors.background};
    
        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
        overflow: hidden;
    }

    body {
        color: ${({ theme }) => theme.colors.primary}
    }
`;
