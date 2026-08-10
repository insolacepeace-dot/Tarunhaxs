package com.diguu.ai;

import android.content.Intent;
import android.provider.AlarmClock;
import android.provider.CalendarContract;
import android.content.Context;
import android.hardware.camera2.CameraManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DeviceActions")
public class DeviceActionsPlugin extends Plugin {
    private boolean isFlashlightOn = false;

    @PluginMethod
    public void toggleFlashlight(PluginCall call) {
        Context context = getContext();
        CameraManager cameraManager = (CameraManager) context.getSystemService(Context.CAMERA_SERVICE);
        try {
            String cameraId = cameraManager.getCameraIdList()[0];
            isFlashlightOn = !isFlashlightOn;
            cameraManager.setTorchMode(cameraId, isFlashlightOn);
            JSObject ret = new JSObject();
            ret.put("status", isFlashlightOn);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error toggling flashlight: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openWhatsApp(PluginCall call) {
        try {
            Intent intent = getContext().getPackageManager().getLaunchIntentForPackage("com.whatsapp");
            if (intent != null) {
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);
                call.resolve();
            } else {
                Intent webIntent = new Intent(Intent.ACTION_VIEW);
                webIntent.setData(android.net.Uri.parse("https://api.whatsapp.com/"));
                webIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(webIntent);
                call.resolve();
            }
        } catch (Exception e) {
            call.reject("Error launching WhatsApp: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openClock(PluginCall call) {
        try {
            Intent intent = new Intent(AlarmClock.ACTION_SHOW_ALARMS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            try {
                Intent launchIntent = getContext().getPackageManager().getLaunchIntentForPackage("com.google.android.deskclock");
                if (launchIntent != null) {
                    launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    getContext().startActivity(launchIntent);
                    call.resolve();
                } else {
                    call.reject("Clock app not found");
                }
            } catch (Exception ex) {
                call.reject("Error opening Clock: " + ex.getMessage());
            }
        }
    }

    @PluginMethod
    public void openCalendar(PluginCall call) {
        try {
            long startMillis = System.currentTimeMillis();
            android.net.Uri.Builder builder = CalendarContract.CONTENT_URI.buildUpon();
            builder.appendPath("time");
            android.content.ContentUris.appendId(builder, startMillis);
            Intent intent = new Intent(Intent.ACTION_VIEW, builder.build());
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Error opening Calendar: " + e.getMessage());
        }
    }
}
