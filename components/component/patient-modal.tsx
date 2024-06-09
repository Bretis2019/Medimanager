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
import {useState} from "react";
import {pb} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {DatePicker} from "@/components/ui/date-picker";

interface patient {
    value: string;
    label: string;
    id: string,
}

export function PatientModal({onRefresh, patient, trigger}: any) {
    const [name, setName] = useState(patient.name || "");
    const [dob, setDob] = useState( patient.dob || "");

    const edit = async () => {
        const data = {
            "patient": patient.id,
            "name": name,
            "dob": dob
        };

        await pb.collection('patients').update(patient.id , data)
            .then(() => {
                onRefresh();
            })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{patient? "Edit" : "Create"} Medical Record</DialogTitle>
                    <DialogDescription>
                        Fill out the details for the {!patient && "new"} medical record.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder={"Hypertension, Diabetes, Migraine..."} />
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                        <Label htmlFor="date" className="text-right">
                            Date of Birth
                        </Label>
                        <DatePicker value={dob} onChange={setDob}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={edit} disabled={!name || !dob}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
