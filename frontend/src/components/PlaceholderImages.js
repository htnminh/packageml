import React from 'react';

/**
 * Create a simple SVG-based placeholder image for platform preview
 * @param {string} id - Unique ID for the gradient
 * @param {string} text - Text to display on the image
 * @param {number} width - Width of the image 
 * @param {number} height - Height of the image
 * @param {string} primaryColor - Primary color (hex)
 * @param {string} secondaryColor - Secondary color (hex)
 * @returns {string} SVG image as a data URL
 */
export const createPlaceholderImage = (id, text, width, height, primaryColor = '#3f51b5', secondaryColor = '#ff4081') => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:0.7" />
        </linearGradient>
        <linearGradient id="graphGrad${id}" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style="stop-color:${secondaryColor};stop-opacity:0.7" />
          <stop offset="100%" style="stop-color:${primaryColor};stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad${id})" rx="12" />
      
      <!-- Mock UI Elements -->
      <rect x="40" y="40" width="${width - 80}" height="60" fill="white" rx="8" opacity="0.9" />
      <rect x="60" y="60" width="240" height="20" fill="#e0e0e0" rx="4" />
      <rect x="${width - 200}" y="60" width="120" height="20" fill="${primaryColor}" rx="4" />
      
      <!-- Mock charts/graphs -->
      <rect x="40" y="120" width="${(width - 100) / 2}" height="${height - 200}" fill="white" rx="8" opacity="0.9" />
      
      <!-- Mock chart lines -->
      <polyline points="60,${height - 160} 120,${height - 260} 180,${height - 200} 240,${height - 300} 300,${height - 180}" 
        stroke="${secondaryColor}" stroke-width="3" fill="none" />
      
      <!-- Mock data table -->
      <rect x="${width / 2 + 10}" y="120" width="${(width - 100) / 2}" height="${height - 200}" fill="white" rx="8" opacity="0.9" />
      ${generateMockTableLines(width / 2 + 30, 150, (width - 140) / 2, height - 240, 6)}
      
      <!-- Text label -->
      <rect x="${width / 2 - 120}" y="${height - 60}" width="240" height="40" fill="white" rx="20" opacity="0.9" />
      <text x="${width / 2}" y="${height - 35}" font-family="Arial" font-size="16" fill="${primaryColor}" text-anchor="middle">${text}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Generates mock table lines for the placeholder image
 */
const generateMockTableLines = (x, y, width, height, rows) => {
  const rowHeight = height / (rows + 1);
  let tableHTML = '';
  
  // Header row
  tableHTML += `<rect x="${x}" y="${y}" width="${width}" height="${rowHeight}" fill="#f5f5f5" rx="4" />`;
  
  // Data rows
  for (let i = 1; i <= rows; i++) {
    const yPos = y + (rowHeight * i);
    const opacity = i % 2 === 0 ? 0.04 : 0.02;
    tableHTML += `<rect x="${x}" y="${yPos}" width="${width}" height="${rowHeight}" fill="#000" opacity="${opacity}" rx="4" />`;
    
    // Add mock text lines
    const textY = yPos + (rowHeight / 2);
    tableHTML += `
      <rect x="${x + 20}" y="${textY - 5}" width="${width / 3 - 40}" height="10" fill="#e0e0e0" rx="2" />
      <rect x="${x + width / 3}" y="${textY - 5}" width="${width / 3 - 20}" height="10" fill="#e0e0e0" rx="2" />
    `;
  }
  
  return tableHTML;
};

/**
 * Get placeholder image for platform preview
 */
export const getPlatformPreviewImage = () => {
  return createPlaceholderImage('platform', 'PackageML Platform', 1000, 600);
};

/**
 * Get placeholder image for dashboard preview
 */
export const getDashboardPreviewImage = () => {
  return createPlaceholderImage('dashboard', 'Analytics Dashboard', 1000, 700, '#3f51b5', '#00c853');
};

export default {
  getPlatformPreviewImage,
  getDashboardPreviewImage
}; 