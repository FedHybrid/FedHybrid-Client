'use client'

import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    height: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', sans-serif;
    min-height: 100%;
    background-color: #ffffff;
    color: #ffffff;
    line-height: 1.6;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }

  a:hover {
    color: #1f2937;
  }

  nav {
    background-color: #ffffff;
    padding: 1rem 1.5rem;
  }

  nav .container {
    max-width: 80rem;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo-group {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-menu {
      display: flex;
      align-items: center;
      margin-left: auto;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: #374151;
  }


  .nav-menu a {
    padding: 0.5rem 0.75rem;
    transition: color 0.2s;
  }

  .nav-menu a:hover {
    color: #111827;
  }

  .nav-divider {
    color: #9ca3af;
    margin: 0 0.25rem;
  }

  main {
    min-height: 100vh;
    background-color: #ffffff;
    padding: 2rem 1.5rem;
    max-width: 80rem;
    margin: 0 auto;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .logo-f { color: black; }
  .logo-h { color: #9333ea; }
  .logo-b { color: #2563eb; }
`

export default GlobalStyles
