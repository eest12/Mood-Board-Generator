# Mood-Board-Generator

This is a React website to create a mood board consisting of famous quotes displayed over aesthetic images and colors. The quotes are provided by the [Type.fit API](https://type.fit/api/quotes), and the images are fetched from the [Unsplash API](https://unsplash.com/developers).

As of now, the website is in its early stages. The current code simply allows the user to request a new quote and a new background image or color.

An Unsplash API key is required. In the future, this key will be hidden with Netlify functions, but for now the key is stored in an untracked `src/config.js` file:

    export const unsplashKey = "your_key_here";