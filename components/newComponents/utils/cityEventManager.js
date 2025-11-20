// Simple event manager for city changes
class CityEventManager {
  constructor() {
    this.eventTarget = new EventTarget();
  }

  // Emit city change event
  emitCityChange(newCity) {
    // console.log('🌍 CityEventManager: Emitting city change to:', newCity);
    const event = new CustomEvent('cityChanged', {
      detail: { city: newCity }
    });
    this.eventTarget.dispatchEvent(event);
  }

  // Subscribe to city change events
  onCityChange(callback) {
    // console.log('🌍 CityEventManager: Component subscribed to city changes');
    this.eventTarget.addEventListener('cityChanged', callback);
    
    // Return unsubscribe function
    return () => {
      this.eventTarget.removeEventListener('cityChanged', callback);
    };
  }
}

// Create a singleton instance
export const cityEventManager = new CityEventManager();
