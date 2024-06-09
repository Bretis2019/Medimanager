"use client"
import Link from "next/link"
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import {extractDateTime, pb, stripHtmlTags} from "@/lib/utils";
import {useEffect, useState} from "react";
import {RecordModel} from "pocketbase";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import * as React from "react";
import {Button} from "@/components/ui/button";
import {LoadingSpinner} from "@/components/ui/spinner";
import Image from "next/image";

interface User {
  id: string;
  name: string;
}


function HTMLCell({ data }: {data: string}) {
  const cleanedData = stripHtmlTags(data);
  return <TableCell className={"max-w-md"}>{cleanedData || "/"}</TableCell>;
}



export function PatientDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<RecordModel[]>([]);
  const [perscriptions, setPerscriptions] = useState<RecordModel[]>([]);
  const [history, setHistory] = useState<RecordModel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (user: User) => {
    setLoading(true);
    const appointmentsResult = await pb.collection('appointments').getList(1, 50, {
      filter: `patient = '${user?.id}'`,
      expand: 'doctor',
      requestKey: null
    });
    setAppointments(appointmentsResult.items);
    const perscriptionsResult = await pb.collection('perscriptions').getList(1, 50, {
      filter: `patient = '${user?.id}'`,
      expand: 'doctor',
      requestKey: null
    });
    setPerscriptions(perscriptionsResult.items);
    const historyResult = await pb.collection('history').getList(1, 50, {
      filter: `patient = '${user?.id}'`,
      expand: 'doctor',
      requestKey: null
    });
    setHistory(historyResult.items);
  }

  useEffect(() => {
      setUser({name: pb?.authStore?.model?.name, id: pb?.authStore?.model?.id});
      fetchData({name: pb?.authStore?.model?.name, id: pb?.authStore?.model?.id})
          .then(() => setLoading(false));
  }, []);


  if(loading){
    return (
        <div className={"w-full h-screen flex space-x-1 justify-center items-center"}>
          <LoadingSpinner />
          <h1>Loading...</h1>
        </div>
    )
  }
  return (
    <div className="grid min-h-screen w-full">
      <div className="flex flex-col">
        <div className="flex h-14 lg:h-[60px] justify-between items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <div className={"flex items-center gap-x-2"}>
            <div className={"bg-white rounded"}>
              <Image width={50} height={50} src="/logo.svg" alt="logo" />
            </div>
            <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          </div>
          <Button variant={"outline"}><Link href={"/profile"} className={"text-black"}>{user?.name}</Link></Button>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Tabs className="grid gap-4 md:gap-8" defaultValue="appointments">
            <TabsList className="flex gap-4 md:gap-8">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              <TabsTrigger value="medical-history">Medical History</TabsTrigger>
            </TabsList>
            <TabsContent value="appointments">
              <div className="border shadow-sm rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      appointments.map(appointment => (
                          <TableRow key={appointment.id}>
                            <TableCell>{extractDateTime(appointment.date).date}</TableCell>
                            <TableCell>{extractDateTime(appointment.date).time}</TableCell>
                            <TableCell>Dr. {appointment?.expand?.doctor.name}</TableCell>
                            <TableCell>{appointment?.expand?.doctor.specialization[0]}</TableCell>
                            <HTMLCell data={appointment.reason}/>
                          </TableRow>
                      ))
                    }

                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="prescriptions">
              <div className="border shadow-sm rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Prescribed By</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      perscriptions.map(perscription => (
                          <TableRow key={perscription.id}>
                            <TableCell>{perscription.medication}</TableCell>
                            <TableCell>{perscription.dosage}mg</TableCell>
                            <TableCell>{perscription.frequency} {perscription.frequency === 1 ? "time" : "times"} a day</TableCell>
                            <HoverCard>
                              <HoverCardTrigger><TableCell>Dr. {perscription?.expand?.doctor.name}</TableCell></HoverCardTrigger>
                              <HoverCardContent>
                                {perscription?.expand?.doctor.specialization[0]}
                              </HoverCardContent>
                            </HoverCard>

                            <TableCell>{extractDateTime(perscription.start).date}</TableCell>
                            <TableCell>{extractDateTime(perscription.end).date}</TableCell>
                          </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="medical-history">
              <div className="border shadow-sm rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Provider</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      history.map(record => (
                          <TableRow key={record.id}>
                            <TableCell>{extractDateTime(record.created).date}</TableCell>
                            <HTMLCell data={record.diagnosis}/>
                            <HTMLCell data={record.treatment}/>
                            <HoverCard>
                              <HoverCardTrigger><TableCell>Dr. {record?.expand?.doctor.name}</TableCell></HoverCardTrigger>
                              <HoverCardContent>
                                {record?.expand?.doctor.specialization[0]}
                              </HoverCardContent>
                            </HoverCard>
                          </TableRow>
                      )
                      )
                    }
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}