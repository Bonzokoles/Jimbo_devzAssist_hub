// Cloudflare Tunnel Utilities (Simplified version)

/**
 * Load tunnel configuration from localStorage
 */
export const loadTunnelConfig = () => {
  try {
    const stored = localStorage.getItem('bonzo_tunnel_config');
    if (!stored) {
      return {
        devPort: 5173,
        backendPort: '',
        tunnelEnabled: false,
        cloudflaredPath: 'cloudflared',
      };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load tunnel config:', error);
    return {
      devPort: 5173,
      backendPort: '',
      tunnelEnabled: false,
      cloudflaredPath: 'cloudflared',
    };
  }
};

/**
 * Save tunnel configuration to localStorage
 */
export const saveTunnelConfig = (config) => {
  try {
    localStorage.setItem('bonzo_tunnel_config', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Failed to save tunnel config:', error);
    return false;
  }
};

/**
 * Start Cloudflare tunnel (simulated)
 * In production, this would execute: cloudflared tunnel --url http://localhost:{port}
 */
export const startTunnel = async (port, cloudflaredPath) => {
  try {
    console.log(`Starting Cloudflare tunnel on port ${port} using ${cloudflaredPath}`);
    
    // Simulate tunnel startup delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a simulated Cloudflare URL
    const randomId = Math.random().toString(36).substring(2, 15);
    const url = `https://${randomId}-${Date.now().toString(36)}.trycloudflare.com`;
    
    // Save tunnel status to localStorage
    const status = {
      active: true,
      url: url,
      port: port,
      startTime: new Date().toISOString(),
    };
    localStorage.setItem('bonzo_tunnel_status', JSON.stringify(status));
    
    return {
      success: true,
      url: url,
      message: 'Tunnel started successfully',
    };
  } catch (error) {
    console.error('Failed to start tunnel:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Stop Cloudflare tunnel (simulated)
 */
export const stopTunnel = async () => {
  try {
    console.log('Stopping Cloudflare tunnel');
    
    // Simulate tunnel shutdown delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear tunnel status from localStorage
    localStorage.removeItem('bonzo_tunnel_status');
    
    return {
      success: true,
      message: 'Tunnel stopped successfully',
    };
  } catch (error) {
    console.error('Failed to stop tunnel:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Get current tunnel status
 */
export const getTunnelStatus = () => {
  try {
    const stored = localStorage.getItem('bonzo_tunnel_status');
    if (!stored) {
      return {
        active: false,
        url: null,
      };
    }
    
    const status = JSON.parse(stored);
    return {
      active: status.active || false,
      url: status.url || null,
      port: status.port || null,
      startTime: status.startTime || null,
    };
  } catch (error) {
    console.error('Failed to get tunnel status:', error);
    return {
      active: false,
      url: null,
    };
  }
};

/**
 * Check if cloudflared is installed (placeholder)
 * In production, this would check if the binary exists
 */
export const checkCloudflaredInstalled = async (cloudflaredPath) => {
  try {
    console.log(`Checking if cloudflared is installed at ${cloudflaredPath}`);
    
    // Simulate check
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For now, always return true (simulated environment)
    return {
      installed: true,
      version: '2024.1.0 (simulated)',
      path: cloudflaredPath,
    };
  } catch (error) {
    return {
      installed: false,
      error: error.message,
    };
  }
};
