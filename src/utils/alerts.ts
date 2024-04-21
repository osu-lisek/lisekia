import { Alert } from "@/components/ui/WebsiteAlert";
import { cookies } from "next/headers";


export async function addAlert(alert: Alert) {
    let currentCookies = cookies();

    let alertsCookies = currentCookies.get("alerts");
    
    let alerts: Alert[] = [];

    try {
        alerts = JSON.parse(alertsCookies?.value ?? "[]");
    }catch (e) {

    }

    alerts.push(alert);

    currentCookies.set("alerts", JSON.stringify(alerts));
}

export async function getAlerts(): Promise<Alert[]> {
    let currentCookies = cookies();

    let alertsCookies = currentCookies.get("alerts");
    
    let alerts: Alert[] = [];

    try {
        alerts = JSON.parse(alertsCookies?.value ?? "[]");
    }catch (e) {

    }

    // currentCookies.delete("alerts");

    return alerts;
}