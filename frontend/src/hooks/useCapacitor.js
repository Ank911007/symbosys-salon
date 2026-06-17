import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

export function useCapacitor() {
  useEffect(() => {
    const initCapacitor = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Style status bar for dark mode default
          await StatusBar.setStyle({ style: Style.Dark });
          
          // Allow content to go under the status bar
          await StatusBar.setOverlaysWebView({ overlay: true });
          
          // Configure keyboard
          if (Capacitor.getPlatform() === 'ios') {
            await Keyboard.setAccessoryBarVisible({ isVisible: true });
          }
          await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
        } catch (error) {
          console.error("Capacitor Init Error:", error);
        }
      }
    };
    
    initCapacitor();
  }, []);
}
