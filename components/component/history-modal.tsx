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

interface patient {
    value: string;
    label: string;
    id: string,
}

export function HistoryModal({onRefresh, history, trigger}: any) {
    const [patients, setPatients] = useState<patient[]>([]);
    const [patient, setPatient] = useState(history?.expand.patient.name || "");
    const [diagnosis, setDiagnosis] = useState( history?.diagnosis || "");
    const [treatment, setTreatment] = useState( history?.treatment || "");
    const [notes, setNotes] = useState( history?.notes || "");

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
            "diagnosis": diagnosis,
            "treatment": treatment,
            "notes": notes
        };

        await pb.collection('history').create(data)
            .then(() => {
                onRefresh();
            })
    }

    const edit = async () => {
        const patientId = findPatientId(patient);
        const data = {
            "doctor": pb?.authStore?.model?.id,
            "patient": patientId,
            "diagnosis": diagnosis,
            "treatment": treatment,
            "notes": notes
        };

        await pb.collection('history').update(history?.id , data)
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
                    <DialogTitle>{history? "Edit" : "Create"} Medical Record</DialogTitle>
                    <DialogDescription>
                        Fill out the details for the {!history && "new"} medical record.
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
                        <Label htmlFor="diagnosis" className="text-right">
                            Diagnosis
                        </Label>
                        <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} type="text" placeholder={"Hypertension, Diabetes, Migraine..."} />
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="treatment" className="text-right">
                            Treatment
                        </Label>
                        <Input value={treatment} onChange={(e) => setTreatment(e.target.value)} type="text" placeholder={"Medication, Physical therapy, Surgery..."} />
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Input value={notes} onChange={(e) => setNotes(e.target.value)} type="text" placeholder={"Follow-up in two weeks, Monitor blood pressure..."} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={history ? edit : submit} disabled={!treatment || !diagnosis || !notes || !patient}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
