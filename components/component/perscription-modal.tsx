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
import {medications} from "@/lib/values";
import {useEffect, useState} from "react";
import {pb} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {DatePicker} from "@/components/ui/date-picker";

interface patient {
    value: string;
    label: string;
    id: string,
}

export function PerscriptionModal({onRefresh, perscription, trigger}: any) {
    const [medication, setMedication] = useState(perscription?.medication ||"");
    const [patients, setPatients] = useState<patient[]>([]);
    const [patient, setPatient] = useState(perscription?.expand.patient.name || "");
    const [startDate, setStartDate] = useState(perscription?.start || null);
    const [endDate, setEndDate] = useState( perscription?.end ||null);
    const [frequency, setFrequency] = useState( perscription?.frequency ||0);
    const [dosage, setDosage] = useState( perscription?.dosage ||0);

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
            "medication": medication,
            "dosage": dosage,
            "frequency": frequency,
            "start": startDate,
            "end": endDate
        };

        await pb.collection('perscriptions').create(data)
            .then(() => {
                onRefresh();
            })
    }

    const edit = async () => {
        const patientId = findPatientId(patient);
        const data = {
            "doctor": pb?.authStore?.model?.id,
            "patient": patientId,
            "medication": medication,
            "dosage": dosage,
            "frequency": frequency,
            "start": startDate,
            "end": endDate
        };

        await pb.collection('perscriptions').update(perscription?.id , data)
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
                    <DialogTitle>{perscription? "Edit" : "Create"} Prescription</DialogTitle>
                    <DialogDescription>
                        Fill out the details for the {!perscription && "new"} prescription.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="patient" className="text-right">
                            Patient
                        </Label>
                        <Combobox data={patients} placeholder={"Select patient..."} value={patient} onChange={setPatient} />
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="medication" className="text-right">
                            Medication
                        </Label>
                        <Combobox data={medications} placeholder={"Select medication..."} value={medication} onChange={setMedication} />
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="dosage" className="text-right">
                            Dosage
                        </Label>
                        <Input value={dosage < 1 ? '': dosage} onChange={(e) => setDosage(parseInt(e.target.value))} type="number" placeholder={"500mg"} />
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="frequency" className="text-right">
                            Frequency
                        </Label>
                        <Input value={frequency < 1 ? '': frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} type="number" placeholder={"2 times a day"} />
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="start date" className="text-right">
                            Start date
                        </Label>
                        <DatePicker value={startDate} onChange={setStartDate}/>
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="end date" className="text-right">
                            End date
                        </Label>
                        <DatePicker value={endDate} onChange={setEndDate}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={perscription ? edit : submit} disabled={!startDate || !endDate || dosage < 1 || frequency < 1 || !patient || !medication}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
