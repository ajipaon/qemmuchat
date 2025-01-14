import { useEffect } from "react";
import { useActivityHeartBeat } from "./query";
import { useActivityStore } from "../../config/globalStore/activityData";



export default function Activity() {

    const { data } = useActivityStore()
    const mutateHearthBeat = useActivityHeartBeat()

    const updateActivity = () => {

        mutateHearthBeat.mutate(data)
    }

    useEffect(() => {
        updateActivity();

        const intervalId = setInterval(updateActivity, 7000);
        return () => clearInterval(intervalId);
    }, []);

    return <></>

}