import { getAlerts } from "@/utils/alerts";
import WebsiteAlert, { Alert } from "../ui/WebsiteAlert";
import { AlertOctagonIcon } from "lucide-react";

export interface DbAlert {
    id: number;
    title: string;
    description: string;
    type: string;
    started_at: string;
    ends_at: string;
}
export interface IAlertContainerProps {
    alerts: DbAlert[];
}

export async function AlertContainer({ alerts: dbAlerts }: IAlertContainerProps) {
    const alerts = await getAlerts();

    if (!alerts && !dbAlerts) return (<></>);
    return (<div className='flex flex-col w-[80%] pb-4 mx-auto'>
        {alerts.map((alert, index) => <WebsiteAlert key={index} data={alert} />)}
        {dbAlerts.map((alert, index) =>
            <div key={index} className={`select-none bg-yellow-300/40 py-4 px-4 w-full bg-opacity-50 sm:rounded-2xl flex flex-row gap-2`}>
                <div className="flex flex-row items-center justify-center">
                    <AlertOctagonIcon size={56} />
                </div>
                <div className="w-[2px] bg-white">

                </div>
                <div className="text-md">
                    <h3 className="text-lg font-bold">
                        {alert.title}
                    </h3>
                    {alert.description}
                    <div className="flex flex-col sm:flex-row sm:gap-4 mt-2">
                        <div>
                            Starts at <strong>{new Date(alert.started_at).toDateString()}</strong>
                        </div>

                        <div>
                            Ends at <strong>{new Date(alert.ends_at).toDateString()}</strong>
                        </div>
                    </div>
                </div>

            </div>
        )}
    </div>)
}