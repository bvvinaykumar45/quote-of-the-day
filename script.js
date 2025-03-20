// local quotes, in case API call fails
const quotes = [
  {"quote": "Life isn’t about getting and having, it’s about giving and being.", "author": "Kevin Kruse"},
  {"quote": "Whatever the mind of man can conceive and believe, it can achieve.", "author": "Napoleon Hill"},
  {"quote": "Strive not to be a success, but rather to be of value.", "author": "Albert Einstein"},
  {"quote": "Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.", "author": "Robert Frost"},
  {"quote": "I attribute my success to this: I never gave or took any excuse.", "author": "Florence Nightingale"},
  {"quote": "You miss 100% of the shots you don’t take.", "author": "Wayne Gretzky"},
  {"quote": "I’ve missed more than 9000 shots in my career. I’ve lost almost 300 games. 26 times I’ve been trusted to take the game winning shot and missed. I’ve failed over and over and over again in my life. And that is why I succeed.", "author": "Michael Jordan"},
  {"quote": "The most difficult thing is the decision to act, the rest is merely tenacity.", "author": "Amelia Earhart"},
  {"quote": "Every strike brings me closer to the next home run.", "author": "Babe Ruth"},
  {"quote": "Definiteness of purpose is the starting point of all achievement.", "author": "W. Clement Stone"},
  {"quote": "We must balance conspicuous consumption with conscious capitalism.", "author": "Kevin Kruse"},
  {"quote": "Life is what happens to you while you’re busy making other plans.", "author": "John Lennon"},
  {"quote": "We become what we think about.", "author": "Earl Nightingale"},
  {"quote": "Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do, so throw off the bowlines, sail away from safe harbor, catch the trade winds in your sails.  Explore, Dream, Discover.", "author": "Mark Twain"},
  {"quote": "Life is 10% what happens to me and 90% of how I react to it.", "author": "Charles Swindoll"},
  {"quote": "The most common way people give up their power is by thinking they don’t have any.", "author": "Alice Walker"},
  {"quote": "The mind is everything. What you think you become.", "author": "Buddha"},
  {"quote": "The best time to plant a tree was 20 years ago. The second best time is now.", "author": "Chinese Proverb"},
  {"quote": "An unexamined life is not worth living.", "author": "Socrates"},
  {"quote": "Eighty percent of success is showing up.", "author": "Woody Allen"},
];

// background-image paths
const backgroundImages = [
  './images/grass-fields.jpg',
  './images/hot-air-ballons.jpg',
  './images/mountain-range.jpg',
  './images/pink-flower.jpg',
  './images/sand-dune.jpg',
  './images/sky-horizon.jpg',
  './images/wall.jpg',
  './images/yellow-flowers.jpg',
];

// API links
const freeApiRandomQuoteURL = 'https://api.freeapi.app/v1/public/quotes/quote/random';
const twitterURL = 'https://twitter.com/intent/tweet/';
const linkTarget = '_blank';

// fetching background-image and quote containers
const quoteContainer = document.querySelector('.quote-container');
const backgroundImageContainer = document.querySelector('.background-image-container');

// fetching buttons
const copyButton = document.getElementById('copy-button');
const generateButton = document.getElementById('new-quote-button');
const downloadButton = document.getElementById('download-button');
const tweetButton = document.getElementById('share-to-x-button');

// creating elements to hold quote and author
const quoteElement = document.createElement('p');
quoteElement.classList.add('quote-holder');
const authorElement = document.createElement('p');
authorElement.classList.add('author-holder');

// fetching 
function generateRandomQuote() {
fetch(freeApiRandomQuoteURL)
 .then(res => res.json())
 .then(apiData => {
     quoteElement.textContent = apiData.data.content;
     authorElement.textContent = apiData.data.author;
     quoteContainer.appendChild(quoteElement);
     quoteContainer.appendChild(authorElement)
  })
  .catch(e => {
      console.log(e);
      const randomIndex = Math.floor(Math.random() * quotes.length);
      quoteElement.textContent = quotes[randomIndex].quote;
      authorElement.textContent = quotes[randomIndex].author;
      quoteContainer.appendChild(quoteElement);
      quoteContainer.appendChild(authorElement);
  })
  .finally(() => {
     const randomIndex = Math.floor(Math.random() * backgroundImages.length)
     backgroundImageContainer.style.backgroundImage = `url(${backgroundImages[randomIndex]})`;
 });
}

// Code to run on DOM Content Load - Fetches Quote from API
document.addEventListener('DOMContentLoaded', generateRandomQuote);

// Resigtering Event Listener on Copy button - copy's quote to clipboard
copyButton.addEventListener('click', () => {
  const elements = quoteContainer.children;
  navigator.clipboard.writeText(`${elements[0].textContent} - ${elements[1].textContent}`);
  toastNotify(`Copied`);
});

// Registering Event Listener on New Quote button - fetches quote from API
generateButton.addEventListener('click', generateRandomQuote);

// Registering Event Listener on X Tweet button - opens a new twitter post dialog box with quote text filled in it
tweetButton.addEventListener('click', () => {
  const twitterQuery = `text=${quoteElement.textContent} - ${authorElement.textContent}`;
  return window.open(`${twitterURL}?${twitterQuery}`, linkTarget);
});

// Registering Event Listener on Download button - Exports a copy of Quote(`As displayed on screen`) to your local machine
downloadButton.addEventListener('click', (e) => {
  // Get Quote and Author Text
  const quote = `${quoteElement.textContent}`;
  const author = `${authorElement.textContent}`;

  // Get the div element and image you want to convert
  const quoteImage = document.querySelector('.background-image-container');
  const imageUrl = quoteImage.computedStyleMap().get('background-image').toString();
  const image = new Image();
  image.src = imageUrl.slice(4, -1).replace(/"/g, "");

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set the canvas dimensions to match the div
  canvas.width = quoteImage.offsetWidth;
  canvas.height = quoteImage.offsetHeight;

  // Compute the image top-left x, y co-ordinates(as rendered in background of div) to clip
  const sx = image.width/2 - quoteImage.offsetWidth/2;
  const sy = image.height/2 - quoteImage.offsetHeight/2;

  // Render the image content to the canvas
  context.drawImage(image, sx, sy, quoteImage.offsetWidth, quoteImage.offsetHeight, 0, 0, canvas.width, canvas.height);

  // Place blur rectangle on canvas
  context.fillStyle = `rgb(255 255 255/ 0.46)`
  const fillRectWidth = quoteImage.offsetWidth - 40;
  const fillRectHeight = quoteImage.offsetHeight - 40;
  context.beginPath();
  context.roundRect(20, 20, fillRectWidth, fillRectHeight, [20,0]);
  context.fill();

  // Write Quote Text on canvas
  context.fillStyle = `rgb(34 12 89)`;
  context.font = '400 36px Lugrasimo';
  context.textAlign = "center";
  let wrappedText = wrapText(context, quote, canvas.width/2, 65, canvas.width-50, 45);
  wrappedText.forEach((item) => {
    context.fillText(item[0], item[1], item[2]);
  });

  // Write Author name on to canvas
  context.font = '400 16px Lugrasimo';
  context.fillText(author, canvas.width/2, canvas.height-40);

  // Convert the canvas to a data URL
  const imageDataURL = canvas.toDataURL('image/png', 0.9); // 0.9 is the quality (0-1)

  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.download = 'quote.png';
  link.href = imageDataURL;

  // Append the link to the document and click it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Wraps the quote text according to the canvas's dimensions
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  let words = text.split(' ');
  let line = '';
  let testLine = '';
  let lineArray = [];

  for(let n=0; n<words.length; n++) {
    testLine += `${words[n]} `;
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;

    if(testWidth > maxWidth && n > 0) {
      lineArray.push([line, x, y]);
      y += lineHeight;
      line = `${words[n]} `;
      testLine = `${words[n]} `;
    } else {
      line += `${words[n]} `;
    }

    if(n === words.length-1) {
      lineArray.push([line, x, y]);
    }
  }
  return lineArray;
}

// Generates toast notification
function toastNotify(message) {
  const toastDiv = document.createElement('div');
  toastDiv.id = "toast";
  toastDiv.innerHTML = `<p>${message}`;
  toastDiv.classList.add('show');
  document.body.appendChild(toastDiv);
  setTimeout(() => {
    toastDiv.classList.remove('show');
    toastDiv.remove();
  }, 10000);
}