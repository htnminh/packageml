const fs = require('fs');

/**
 * Generate a simple SVG logo for PackageML
 * @param {number} size - Size of the logo
 * @param {string} primaryColor - Primary color (hex)
 * @param {string} secondaryColor - Secondary color (hex)
 * @returns {string} SVG logo as a string
 */
function generateLogoSVG(size, primaryColor = '#3f51b5', secondaryColor = '#ff4081') {
  const padding = size * 0.15;
  const innerSize = size - (padding * 2);
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:0.8" />
      </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bgGradient)" />
    
    <!-- Package Box -->
    <rect x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" rx="${size * 0.05}" 
      fill="white" opacity="0.9" />
    
    <!-- ML Text -->
    <text x="${size / 2}" y="${size * 0.65}" font-family="Arial" font-weight="bold" font-size="${size * 0.3}" 
      fill="${secondaryColor}" text-anchor="middle">ML</text>
    
    <!-- Package Lines -->
    <line x1="${padding}" y1="${size / 2}" x2="${size - padding}" y2="${size / 2}" 
      stroke="white" stroke-width="${size * 0.02}" opacity="0.7" />
    <line x1="${size / 2}" y1="${padding}" x2="${size / 2}" y2="${size - padding}" 
      stroke="white" stroke-width="${size * 0.02}" opacity="0.7" />
  </svg>`;
}

// Generate favicon
const faviconSvg = generateLogoSVG(64);
// fs.writeFileSync('favicon.svg', faviconSvg);
console.log('Favicon SVG generated. Convert to ICO format for use as favicon.ico');

// Generate larger logos
const logo192 = generateLogoSVG(192);
const logo512 = generateLogoSVG(512);

// fs.writeFileSync('logo192.svg', logo192);
// fs.writeFileSync('logo512.svg', logo512);
console.log('Logo SVGs generated. Convert to PNG format for use as app icons.');

console.log(`
To use these logos:
1. Uncomment the fs.writeFileSync lines in this file
2. Run this script with Node.js
3. Convert the SVGs to appropriate formats:
   - favicon.svg → favicon.ico
   - logo192.svg → logo192.png
   - logo512.svg → logo512.png
4. Place the converted files in the public directory
`); 