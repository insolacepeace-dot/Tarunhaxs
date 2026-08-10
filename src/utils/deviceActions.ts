import { registerPlugin } from '@capacitor/core';

interface DeviceActionsPluginType {
  toggleFlashlight(): Promise<{ status: boolean }>;
  openWhatsApp(): Promise<void>;
  openClock(): Promise<void>;
  openCalendar(): Promise<void>;
}

const DeviceActions = registerPlugin<DeviceActionsPluginType>('DeviceActions');

let isWebTorchOn = false;
let webVideoTrack: MediaStreamTrack | null = null;

export const nativeToggleFlashlight = async (): Promise<boolean> => {
  try {
    const res = await DeviceActions.toggleFlashlight();
    return res.status;
  } catch (err) {
    console.warn("Native flashlight not available, falling back to Web Camera API:", err);
    try {
      if (isWebTorchOn) {
        if (webVideoTrack) {
          webVideoTrack.stop();
          webVideoTrack = null;
        }
        isWebTorchOn = false;
        return false;
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        const track = stream.getVideoTracks()[0];
        if (track) {
          // @ts-ignore
          await track.applyConstraints({ advanced: [{ torch: true }] });
          webVideoTrack = track;
          isWebTorchOn = true;
          return true;
        }
        return false;
      }
    } catch (webErr) {
      console.error("Web flashlight fallback failed:", webErr);
      return false;
    }
  }
};

export const nativeOpenWhatsApp = async (): Promise<void> => {
  try {
    await DeviceActions.openWhatsApp();
  } catch (err) {
    console.warn("Native WhatsApp launcher not available, using URL protocol:", err);
    window.open("whatsapp://send", "_blank");
  }
};

export const nativeOpenClock = async (): Promise<void> => {
  try {
    await DeviceActions.openClock();
  } catch (err) {
    console.warn("Native Clock launcher not available:", err);
    alert("⏰ Custom Alarm Action: Open Clock & Alarms!");
  }
};

export const nativeOpenCalendar = async (): Promise<void> => {
  try {
    await DeviceActions.openCalendar();
  } catch (err) {
    console.warn("Native Calendar launcher not available:", err);
    alert("📅 Custom Calendar Action: Open Calendar & Reminders!");
  }
};
