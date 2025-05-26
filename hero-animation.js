// 3D Force Graph animation for hero section
const HeroAnimation = {
  graph: null,
  intervalId: null,

  // Generate graph data like the basic example
  generateGraphData() {
    const N = 80; // Reduced number for better performance in hero section
    
    const nodes = [...Array(N).keys()].map(i => ({ id: i }));
    
    const links = [...Array(N).keys()]
      .filter(id => id)
      .map(id => ({
        source: id,
        target: Math.round(Math.random() * (id-1))
      }));
    
    return { nodes, links };
  },

  // Initialize the 3D graph animation
  init() {
    const heroGraphElement = document.getElementById('hero-graph');
    
    if (!heroGraphElement) {
      console.log('Hero graph element not found, skipping animation');
      return;
    }

    // Check if 3D Force Graph library is loaded
    if (typeof ForceGraph3D === 'undefined') {
      console.warn('3D Force Graph library not loaded, animation disabled');
      return;
    }

    try {
      const graphData = this.generateGraphData();
      
      // Create the 3D force graph using constructor approach like the example
      this.graph = new ForceGraph3D(heroGraphElement);
      
      // Apply basic configuration
      this.graph
        .graphData(graphData)
        .backgroundColor('rgba(0,0,0,0)')
        .width(heroGraphElement.offsetWidth || window.innerWidth)
        .height(heroGraphElement.offsetHeight || 400)
        // Configuration des liens pour les rendre visibles
        .linkColor(() => `hsl(${Math.random() * 360}, 70%, 60%)`)
        .linkWidth(2)
        .linkOpacity(0.6)
        // Configuration des nœuds
        .nodeColor(() => '#00ff88')
        .nodeOpacity(0.8);

      // Apply interaction settings if methods exist
      if (typeof this.graph.enableZoomInteraction === 'function') {
        this.graph.enableZoomInteraction(false);
      }
      if (typeof this.graph.enablePanInteraction === 'function') {
        this.graph.enablePanInteraction(false);
      }
      if (typeof this.graph.enablePointerInteraction === 'function') {
        this.graph.enablePointerInteraction(false);
      }
      if (typeof this.graph.showNavInfo === 'function') {
        this.graph.showNavInfo(false);
      }

      // Auto-rotate the camera for a nice effect
      let angle = 0;
      const animate = () => {
        if (this.graph && typeof this.graph.cameraPosition === 'function') {
          angle += 0.005; // Slower rotation
          this.graph.cameraPosition({
            x: 300 * Math.sin(angle),
            z: 300 * Math.cos(angle),
            y: 50
          });
        }
        this.intervalId = requestAnimationFrame(animate);
      };
      this.intervalId = requestAnimationFrame(animate);

      console.log('3D Force Graph animation initialized successfully');

    } catch (error) {
      console.warn('Hero animation failed to load:', error);
    }
  },

  // Stop animation and cleanup
  stop() {
    if (this.intervalId) {
      cancelAnimationFrame(this.intervalId);
      this.intervalId = null;
    }
    if (this.graph) {
      this.graph = null;
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure all scripts are loaded
  setTimeout(() => {
    HeroAnimation.init();
  }, 500);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  HeroAnimation.stop();
});

// Re-initialize on page navigation if needed
window.HeroAnimation = HeroAnimation; 