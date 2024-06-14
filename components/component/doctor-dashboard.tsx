"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import * as React from "react";
import {LoadingSpinner} from "@/components/ui/spinner";
import {calculateAge, extractDateTime, flattenObject, pb, stripHtmlTags} from "@/lib/utils";
import {RecordModel} from "pocketbase";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import Image from "next/image"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import {PerscriptionModal} from "@/components/component/perscription-modal";
import {AppointmentModal} from "@/components/component/appointment-modal";
import {HistoryModal} from "@/components/component/history-modal";

interface User {
  id: string;
  name: string;
}

function HTMLCell({ data }: {data: string}) {
  const cleanedData = stripHtmlTags(data);
  return <TableCell className={"max-w-md"}>{cleanedData || "/"}</TableCell>;
}

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<RecordModel[]>([]);
  const [prescriptions, setPrescriptions] = useState<RecordModel[]>([]);
  const [history, setHistory] = useState<RecordModel[]>([]);

  const handleDelete = async (type: string, id: string) => {
    await pb.collection(type).delete(id);
    fetchData()
        .then(() => setLoading(false));
  }

  const fetchData = async () => {
    const user = {name: pb?.authStore?.model?.name, id: pb?.authStore?.model?.id}
    setLoading(true);
    const appointmentsResult = await pb.collection('appointments').getList(1, 50, {
      filter: `doctor = '${user?.id}'`,
      expand: 'patient',
      requestKey: null
    });
    setAppointments(appointmentsResult.items);
    const perscriptionsResult = await pb.collection('perscriptions').getList(1, 50, {
      filter: `doctor = '${user?.id}'`,
      expand: 'patient',
      requestKey: null
    });
    setPrescriptions(perscriptionsResult.items);
    const historyResult = await pb.collection('history').getList(1, 50, {
      filter: `doctor = '${user?.id}'`,
      expand: 'patient',
      requestKey: null
    });
    setHistory(historyResult.items);
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

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const { start, end, frequency, id, ...rest } = prescription;
    let prescriptionString = flattenObject(rest);
    return prescriptionString.includes(searchTerm.toLowerCase());
  });

  const filteredHistory = history.filter((record) => {
    const { id, ...rest } = record;
    let recordString = flattenObject(rest);
    return recordString.includes(searchTerm.toLowerCase());
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
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          </div>
          <div className="pt-2 md:pt-0 flex flex-wrap items-center justify-center md:gap-4">
            <Button
                variant={activeTab === "appointments" ? "secondary" : "default"}
                onClick={() => setActiveTab("appointments")}
            >
              Appointments
            </Button>
            <Button
                variant={activeTab === "prescriptions" ? "secondary" : "default"}
                onClick={() => setActiveTab("prescriptions")}
            >
              Prescriptions
            </Button>
            <Button
                variant={activeTab === "medical-history" ? "secondary" : "default"}
                onClick={() => setActiveTab("medical-history")}
            >
              Medical History
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
            <div className={"pt-2 md:pt-0"}>
              {activeTab === "appointments" && <AppointmentModal onRefresh={handleRefresh} trigger={<Button>Create New Appointment</Button>}/>}
              {activeTab === "prescriptions" && <PerscriptionModal onRefresh={handleRefresh} trigger={<Button variant="default">Create New Prescription</Button>}/>}
              {activeTab === "medical-history" && <HistoryModal onRefresh={handleRefresh} trigger={<Button>Add New Medical Record</Button>}/>}
            </div>
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
                            <Button variant="outline" size="icon" >
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
          {activeTab === "prescriptions" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.map((perscription) => (
                      <TableRow key={perscription.id}>
                        <HoverCard>
                          <HoverCardTrigger><TableCell>{perscription?.expand?.patient.name}</TableCell></HoverCardTrigger>
                          <HoverCardContent>
                            {calculateAge(perscription?.expand?.patient.dob)} years old
                          </HoverCardContent>
                        </HoverCard>
                        <TableCell>{perscription.medication}</TableCell>
                        <TableCell>{perscription.dosage}mg</TableCell>
                        <TableCell>{perscription.frequency} {perscription.frequency === 1 ? "time" : "times"} a day</TableCell>
                        <TableCell>{extractDateTime(perscription.start).date}</TableCell>
                        <TableCell>{extractDateTime(perscription.end).date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" >
                              <PerscriptionModal onRefresh={handleRefresh} perscription={perscription} trigger={<FilePenIcon className="w-4 h-4" />}/>
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
                                    This action cannot be undone. This will permanently delete this prescription.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete("perscriptions", perscription.id)}>Continue</AlertDialogAction>
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
          {activeTab === "medical-history" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record?.expand?.patient.name}</TableCell>
                        <TableCell>{extractDateTime(record.created).date}</TableCell>
                        <HTMLCell data={record.diagnosis} />
                        <HTMLCell data={record.treatment} />
                        <HTMLCell data={record.notes} />
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon">
                              <HistoryModal onRefresh={handleRefresh} history={record} trigger={<FilePenIcon className="w-4 h-4" />}/>
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
                                    This action cannot be undone. This will permanently delete this medical history report.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete("history", record.id)} >Continue</AlertDialogAction>
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