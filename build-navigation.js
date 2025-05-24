// Script pour automatiser la création de la navigation
const fs = require('fs');
const path = require('path');

function buildNavigationPage() {
  // Read the template file
  const template = fs.readFileSync('template.html', 'utf8');
  
  // Read the existing HTML files
  const pitchContent = fs.readFileSync('pitch-commercial.html', 'utf8');
  const interneContent = fs.readFileSync('agent-interne.html', 'utf8');
  const publicContent = fs.readFileSync('agent-public.html', 'utf8');
  const qualiteContent = fs.readFileSync('qualite-service.html', 'utf8');

  // Extract body content from each file
  function extractBodyContent(html) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let content = bodyMatch ? bodyMatch[1] : '';
    
    // Remove any existing navigation elements
    content = content.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
    content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    return content.trim();
  }

  const pitchBody = extractBodyContent(pitchContent);
  const interneBody = extractBodyContent(interneContent);
  const publicBody = extractBodyContent(publicContent);
  const qualiteBody = extractBodyContent(qualiteContent);

  // Replace placeholders in template
  const navigationHTML = template
    .replace('{{PITCH_CONTENT}}', pitchBody)
    .replace('{{INTERNE_CONTENT}}', interneBody)
    .replace('{{PUBLIC_CONTENT}}', publicBody)
    .replace('{{QUALITE_CONTENT}}', qualiteBody);

  fs.writeFileSync('index.html', navigationHTML);
  console.log('Navigation page créée avec succès! Site 100% statique prêt.');
}

// Watch mode function
function watchFiles() {
  const filesToWatch = ['pitch-commercial.html', 'agent-interne.html', 'agent-public.html', 'qualite-service.html', 'template.html'];
  
  console.log('🔍 Mode surveillance activé - Watching for changes...');
  console.log('📁 Fichiers surveillés:', filesToWatch.join(', '));
  
  // Build initial version
  buildNavigationPage();
  
  // Watch each file for changes
  filesToWatch.forEach(file => {
    if (fs.existsSync(file)) {
      fs.watchFile(file, { interval: 1000 }, (curr, prev) => {
        console.log(`📝 Changement détecté dans ${file} - Reconstruction...`);
        buildNavigationPage();
      });
    } else {
      console.warn(`⚠️  Fichier ${file} non trouvé`);
    }
  });
  
  console.log('✅ Surveillance active. Appuyez sur Ctrl+C pour arrêter.');
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
  watchFiles();
} else {
  buildNavigationPage();
} 