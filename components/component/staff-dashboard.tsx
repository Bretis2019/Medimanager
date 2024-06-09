"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import * as React from "react";
import {LoadingSpinner} from "@/components/ui/spinner";
import {extractDateTime, flattenObject, pb, stripHtmlTags} from "@/lib/utils";
import {RecordModel} from "pocketbase";
import Image from "next/image"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import {AppointmentModal} from "@/components/component/appointment-modal";
import {PatientModal} from "@/components/component/patient-modal";

interface User {
    id: string;
    name: string;
}

function HTMLCell({ data }: {data: string}) {
    const cleanedData = stripHtmlTags(data);
    return <TableCell className={"max-w-md"}>{cleanedData || "/"}</TableCell>;
}

export default function StaffDashboard() {
    const [activeTab, setActiveTab] = useState("appointments");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [patients, setPatients] = useState<RecordModel[]>([]);
    const [appointments, setAppointments] = useState<RecordModel[]>([]);

    const handleDelete = async (type: string, id: string) => {
        await pb.collection(type).delete(id);
        fetchData()
            .then(() => setLoading(false));
    }

    const fetchData = async () => {
        const user = {name: pb?.authStore?.model?.name, id: pb?.authStore?.model?.id}
        setLoading(true);
        const appointmentsResult = await pb.collection('appointments').getList(1, 50, {
            expand: 'patient,doctor',
            requestKey: null
        });
        setAppointments(appointmentsResult.items);
        const patientsResaults = await pb.collection('patients').getList(1, 50, {
            requestKey: null
        });
        setPatients(patientsResaults.items);
    }

    useEffect(() => {
        setUser({name: pb?.authStore?.model?.name, id: pb?.authStore?.model?.id});
        fetchData()
            .then(() => setLoading(false));
    }, []);

    const filteredAppointments = appointments.filter((appointment) => {
        const { id, ...rest } = appointment;
        let appointmentString = flattenObject(rest);
        return appointmentString.includes(searchTerm.toLowerCase());
    });

    const filteredPatients = patients.filter((patient) => {
        const { id, ...rest } = patient;
        let patientString = flattenObject(rest);
        return patientString.includes(searchTerm.toLowerCase());
    });

    const handleRefresh = async () => {
        fetchData()
            .then(() => setLoading(false));
    }


    if(loading){
        return (
            <div className={"w-full h-screen flex space-x-1 justify-center items-center"}>
                <LoadingSpinner />
                <h1>Loading...</h1>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="bg-gray-900 text-white p-4 flex-col flex md:flex-row items-center justify-between">
                <div className={"flex items-center gap-x-2"}>
                    <div className={"bg-white rounded"}>
                        <Image width={50} height={50} src="/logo.svg" alt="logo" />
                    </div>
                    <h1 className="text-2xl font-bold">Staff Dashboard</h1>
                </div>
                <div className="grid-cols-2 md:flex items-center md:gap-4">
                    <Button
                        variant={activeTab === "appointments" ? "secondary" : "default"}
                        onClick={() => setActiveTab("appointments")}
                    >
                        Appointments
                    </Button>
                    <Button
                        variant={activeTab === "patients" ? "secondary" : "default"}
                        onClick={() => setActiveTab("patients")}
                    >
                        Patients
                    </Button>
                    <Button variant={"default"} className={"border border-gray-500"}><Link href={"/profile"}>{user?.name}</Link></Button>
                </div>
            </div>
            <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 w-full">
                    <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[80svw]"
                    />
                </div>
                {activeTab === "appointments" && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAppointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell>{appointment?.expand?.patient?.name}</TableCell>
                                    <TableCell>{extractDateTime(appointment.date).date}</TableCell>
                                    <TableCell>{extractDateTime(appointment.date).time}</TableCell>
                                    <HTMLCell data={appointment.reason}/>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon">
                                                <AppointmentModal appointment={appointment} onRefresh={handleRefresh} trigger={<FilePenIcon className="w-4 h-4" />}/>
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon">
                                                        <TrashIcon className="w-4 h-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete this appointment.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete("appointments", appointment.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {activeTab === "patients" && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date of birth</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPatients.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell>{patient.name}</TableCell>
                                    <TableCell>{extractDateTime(patient.dob).date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon">
                                                <PatientModal onRefresh={handleRefresh} patient={patient} trigger={<FilePenIcon className="w-4 h-4" />}/>
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}

function FilePenIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
        </svg>
    )
}


function TrashIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}