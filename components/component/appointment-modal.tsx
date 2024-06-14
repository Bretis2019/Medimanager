"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {Combobox} from "@/components/ui/combo-box";
import {useEffect, useState} from "react";
import {pb} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {DateTimePicker} from "@/components/ui/date-timer-picker";

interface patient {
    value: string;
    label: string;
    id: string,
}

export function AppointmentModal({onRefresh, appointment, trigger}: any) {
    const [patients, setPatients] = useState<patient[]>([]);
    const [patient, setPatient] = useState(appointment?.expand.patient.name || "");
    const [date, setDate] = useState(appointment?.date ? new Date(appointment?.date) : null);
    const [reason, setReason] = useState( appointment?.reason || "");

    const fetchData = async () => {
        const resultList = await pb.collection('patients').getList(1, 50, {
            requestKey: null
        });
        setPatients(resultList.items.map((item) => {
            return {
                id: item.id,
                value: item.name,
                label: item.name
            }
        }));
    }

    function findPatientId(name: string) {
        return patients.find((patient) => patient.value === name)?.id;
    }

    const submit = async () => {
        const patientId = findPatientId(patient);
        const data = {
            "doctor": pb?.authStore?.model?.id,
            "patient": patientId,
            "date": date ,
            "reason": reason,
        };

        await pb.collection('appointments').create(data)
            .then(() => {
                onRefresh();
            })
    }

    const edit = async () => {
        const patientId = findPatientId(patient);
        const data = {
            "doctor": pb?.authStore?.model?.collectionName === "doctors" ? pb?.authStore?.model?.id : appointment.expand.doctor.id,
            "patient": patientId,
            "date": date,
            "reason": reason,
        };

        await pb.collection('appointments').update(appointment?.id , data)
            .then(() => {
                onRefresh();
            })
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{appointment? "Edit" : "Create"} Appointment</DialogTitle>
                    <DialogDescription>
                        Fill out the details for the {!appointment && "new"} appointment.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-14 py-4">
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="patient" className="text-right">
                            Patient
                        </Label>
                        <Combobox data={patients} placeholder={"Select patient..."} value={patient} onChange={setPatient} />
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="reason" className="text-right">
                            Reason
                        </Label>
                        <Input value={reason} onChange={(e) => setReason(e.target.value)} type="text" placeholder={"Routine check-up, Discuss symptoms..."} />
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <DateTimePicker date={date} setDate={setDate}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={appointment ? edit : submit} disabled={!date || !reason || !patient}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
