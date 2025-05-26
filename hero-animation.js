// 3D Force Graph animation for hero section
const HeroAnimation = {
  graph: null,
  intervalId: null,
  // Variables d'animation partagées
  cumulativeVariationX: 0,
  cumulativeVariationY: 0,
  cumulativeVariationZ: 0,

  // Generate tree data with agent as root
  generateGraphData() {
    const nodes = [];
    const links = [];
    
    // Configuration de l'arbre
    const treeConfig = {
      maxNodes: 1000,
      levels: 4,
      branchingByLevel: {
        0: { min: 8, max: 12 },    
        1: { min: 2, max: 4 },    
        2: { min: 3, max: 20 }
      }
    };
    
    // Types de nœuds pour le premier niveau
    const nodeTypes = [
      { type: 'database', label: 'Base de données', color: 'white' },
      { type: 'files', label: 'Répertoire de fichiers', color: 'white' },
      { type: 'website', label: 'Site web', color: 'white' }
    ];
    
    let nodeCounter = 0;
    
    // Créer le nœud racine (agent central)
    const rootNode = { 
      id: 'agent', 
      isCenter: true, 
      level: 0 
    };
    nodes.push(rootNode);
    
    /**
     * Crée récursivement les nœuds enfants
     * @param {Object} currentNode - Le nœud parent actuel
     * @param {Object} treeConfig - Configuration de l'arbre
     */
    const createChildren = (currentNode, treeConfig) => {
      const nextLevel = currentNode.level + 1;
      
      // Vérifier si on a atteint les limites
      if (nextLevel >= treeConfig.levels || nodes.length >= treeConfig.maxNodes) {
        return;
      }
      
      // Obtenir la configuration de branchement pour le niveau suivant
      const branchConfig = treeConfig.branchingByLevel[currentNode.level];
      if (!branchConfig) {
        return;
      }

      // console.log('branchConfig',branchConfig);
      
      // Calculer le nombre d'enfants à créer
      const childrenCount = Math.floor(
        Math.random() * (branchConfig.max - branchConfig.min + 1)
      ) + branchConfig.min;
      if(currentNode.level === 0){
        console.log('branchConfig',branchConfig,'childrenCount',childrenCount);
      }

      // console.log('currentNode',currentNode,'childrenCount',childrenCount);
      
      // Créer les nœuds enfants
      for (let i = 0; i < childrenCount && nodes.length < treeConfig.maxNodes; i++) {
        if(currentNode.level === 0){
          console.log('ITERATION',i,treeConfig.maxNodes);
        }
        // console.log('ITERATION',nodes.length);
        const childId = ++nodeCounter;
        
        // Créer le nœud enfant avec toutes ses propriétés
        const childNode = {
          id: childId,
          isCenter: false,
          level: nextLevel,
          parent: currentNode.id
        };
        
        // Assigner un type spécifique pour les nœuds de niveau 1
        if (nextLevel === 1) {
          const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
          childNode.nodeType = nodeType.type;
          childNode.typeLabel = nodeType.label;
          childNode.typeColor = nodeType.color;
        }

        // console.log('push childNode',{level: childNode.level, nodeType: childNode.nodeType});
        
        nodes.push(childNode);
        
        // Créer le lien enfant vers parent (inversé) pour que les flèches pointent vers le centre
        links.push({
          source: childId,      // Changed: child is now source
          target: currentNode.id // Changed: parent is now target
        });
        
        // Créer récursivement les enfants de ce nœud
        createChildren(childNode, treeConfig);
      }
    };
    
    // Démarrer la création récursive depuis l'agent central
    createChildren(rootNode, treeConfig);
    
    console.log(`Graphe généré: ${nodes.length} nœuds, ${links.length} liens`);
    
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
        .width(window.innerWidth)
        .height(Math.max(heroGraphElement.offsetHeight || 400, 600))
        // Configuration des liens pour les rendre visibles
        .linkColor(() => 'white')
        .linkWidth(1)
        .linkOpacity(0.1)
        // Configuration des nœuds avec différentes tailles selon le niveau
        .nodeThreeObject(node => {
          if (node.isCenter) {
            // Créer un cube pour le nœud racine "agent" - taille augmentée
            const geometry = new THREE.BoxGeometry(15, 15, 15);
            const material = new THREE.MeshBasicMaterial({ 
              color: 'white',
              wireframe: false,
              transparent: true,
              opacity: 0.1
            });
            const cube = new THREE.Mesh(geometry, material);
            
            return cube;
          } else if (node.level === 1 && node.nodeType) {
            // Nœuds de niveau 1 avec formes spécifiques selon le type
            let mesh;
            
            switch (node.nodeType) {
              case 'database':
                // Plusieurs cylindres empilés pour base de données - taille augmentée
                const dbGroup = new THREE.Group();
                const cylinderMaterial = new THREE.MeshBasicMaterial({ 
                  color: 'white',
                  transparent: true,
                  opacity: 0.1
                });
                
                // Créer 3 cylindres empilés plus grands
                for (let i = 0; i < 3; i++) {
                  const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 3, 8);
                  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
                  cylinder.position.y = i * 4 - 4; // Espacement vertical augmenté
                  dbGroup.add(cylinder);
                }
                mesh = dbGroup;
                break;
                
              case 'website':
                // Planisphère en fil de fer pour site web - taille augmentée
                const sphereGeometry = new THREE.SphereGeometry(7, 16, 12);
                const sphereMaterial = new THREE.MeshBasicMaterial({ 
                  color: 'white',
                  wireframe: true,
                  transparent: true,
                  opacity: 0.1
                });
                mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
                break;
                
              case 'files':
                // Forme de répertoire/dossier pour fichiers - taille augmentée
                const folderGroup = new THREE.Group();
                const folderMaterial = new THREE.MeshBasicMaterial({ 
                  color: 'white',
                  transparent: true,
                  opacity: 0.1
                });
                
                // Corps principal du dossier plus grand
                const mainBodyGeometry = new THREE.BoxGeometry(10, 7, 2);
                const mainBody = new THREE.Mesh(mainBodyGeometry, folderMaterial);
                folderGroup.add(mainBody);
                
                // Onglet du dossier plus grand
                const tabGeometry = new THREE.BoxGeometry(5, 2, 2.2);
                const tab = new THREE.Mesh(tabGeometry, folderMaterial);
                tab.position.set(-2.5, 4.5, 0);
                folderGroup.add(tab);
                
                mesh = folderGroup;
                break;
                
              default:
                const defaultGeometry = new THREE.SphereGeometry(6);
                const defaultMaterial = new THREE.MeshBasicMaterial({ 
                  color: 'white',
                  transparent: true,
                  opacity: 0.1
                });
                mesh = new THREE.Mesh(defaultGeometry, defaultMaterial);
            }
            
            return mesh;
          } else {
            // Nœuds normaux avec taille réduite pour niveau 2+ - tous blancs
            const size = Math.max(1, 4 - node.level);
            const geometry = new THREE.SphereGeometry(size);
            
            const material = new THREE.MeshBasicMaterial({ 
              color: 'white',
              transparent: true,
              opacity: 0.1
            });
            return new THREE.Mesh(geometry, material);
          }
        })
        .nodeLabel(node => {
          if (node.isCenter) {
            return 'Agent Central';
          } else if (node.level === 1 && node.typeLabel) {
            return `${node.typeLabel} ${node.id}`;
          } else {
            return `Nœud ${node.id} (Niveau ${node.level})`;
          }
        })

        // Alternative tree-specific force configuration
        // .d3Force('link', d3.forceLink()
        //   .id(d => d.id)
        //   .distance(link => {
        //     const sourceLevel = typeof link.source === 'object' ? link.source.level : 0;
        //     const targetLevel = typeof link.target === 'object' ? link.target.level : 0;
        //     const maxLevel = Math.max(sourceLevel, targetLevel);
            
        //     // Exponential distance scaling for tree structure
        //     return 50 + (maxLevel * 30);
        //   })
        //   .strength(link => {
        //     const sourceLevel = typeof link.source === 'object' ? link.source.level : 0;
        //     const targetLevel = typeof link.target === 'object' ? link.target.level : 0;
        //     const minLevel = Math.min(sourceLevel, targetLevel);
            
        //     // Stronger links closer to root
        //     return 1 - (minLevel * 0.2);
        //   })
        // )
        
        // Many-body force with level-based strength
        .d3Force('charge', d3.forceManyBody()
          .strength(node => {
            const baseStrength = -200;
            const levelMultiplier = Math.pow(0.5, node.level); // Decay with level
            return baseStrength * levelMultiplier;
          })
        )
        
        // Tree-specific positioning forces
        .d3Force('treeRadial', d3.forceRadial(
          node => 0 + (node.level * 30), // Radial distance by level
          0, 0, 0
        ).strength(0.5));

      // Configuration supplémentaire pour un meilleur rendu d'arbre
      this.graph
        // Warm-up ticks for initial positioning
        .warmupTicks(100)
        .cooldownTicks(1000)
        
        // Control simulation
        .enableNodeDrag(false) // Disable dragging to maintain structure
        .enableNavigationControls(false) // Disable default controls for auto-rotation
        
        // Link directionality for tree structure
        .linkDirectionalArrowLength(3)
        .linkDirectionalArrowRelPos(1);

      // Apply interaction settings if methods exist
      if (typeof this.graph.enableZoomInteraction === 'function') {
        this.graph.enableZoomInteraction(true);
      }
      if (typeof this.graph.enablePanInteraction === 'function') {
        this.graph.enablePanInteraction(true);
      }
      if (typeof this.graph.enablePointerInteraction === 'function') {
        this.graph.enablePointerInteraction(true);
      }
      if (typeof this.graph.showNavInfo === 'function') {
        this.graph.showNavInfo(true);
      }


      
      let timeOffset = 0;
      
      const animate = () => {
        if (this.graph && typeof this.graph.cameraPosition === 'function') {
          // Incrémenter le temps
          timeOffset += 0.01;
          
          // Rotation continue sur chaque axe avec des vitesses différentes
          this.cumulativeVariationX = timeOffset * 0.01; // Rotation lente sur X
          this.cumulativeVariationY = timeOffset * 0.02; // Rotation plus lente sur Y
          this.cumulativeVariationZ = timeOffset * 0.005; // Rotation plus rapide sur Z
          
          // Rotation cumulative de la caméra sur elle-même (roll) - plus lente pour être plus régulière
          const cumulativeCameraRoll = timeOffset * 0.02; // Vitesse réduite pour un roll plus régulier
          
          // Find the central agent position
          const agentPosition = { x: 0, y: 0, z: 0 };
          
          // Camera position with rotation on all 3 axes - tour complet
          const radius = 150;
          const cameraX = agentPosition.x + radius * Math.sin(this.cumulativeVariationX);
          const cameraZ = agentPosition.z + radius * Math.cos(this.cumulativeVariationZ);
          const cameraY = agentPosition.y + radius * Math.sin(this.cumulativeVariationY); // Y plus contenu
          
          // Positionner la caméra normalement
          this.graph.cameraPosition({
            x: cameraX,
            z: cameraZ,
            y: cameraY
          }, agentPosition);
          
          // Modifier l'up vector pour créer le roll régulier
          if (this.graph.camera && this.graph.camera().up) {
            const camera = this.graph.camera();
            
            // Roll régulier : rotation constante de l'up vector
            camera.up.set(
              0,  // X fixe
              Math.cos(cumulativeCameraRoll),  // Y oscille
              Math.sin(cumulativeCameraRoll)   // Z oscille
            );
            camera.updateMatrixWorld();
          }
        }
        
        this.intervalId = setTimeout(animate, 10);
      };
      
      animate();

      console.log('3D Force Graph animation initialized successfully');

    } catch (error) {
      console.warn('Hero animation failed to load:', error);
    }
  },

  // Stop animation and cleanup
  stop() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
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