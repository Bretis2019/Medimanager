"use client"
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import {useEffect, useState} from "react";
import {pb} from "@/lib/utils";
import Image from "next/image"
import { useRouter } from 'next/navigation';

type UserType = "patient" | "staff" | "doctor";

export function AuthPage({ method }: { method: string }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if(pb.authStore.isValid){
      router.push('/dashboard');
    }
  }, []);



  const submit = async (type: UserType) => {
    switch (type) {
      case "doctor":
        if (method === "Login") {
          await pb.collection('doctors').authWithPassword(email, password);
          if(pb.authStore.isValid){
            router.push('/dashboard');
          }
        }else{
          const data = {
            "username": null,
            "email": email,
            "emailVisibility": false,
            "password": password,
            "passwordConfirm": password,
            "name": "init_value",
            "specialization": [
              "Cardiologist"
            ]
          };
          try{
            await pb.collection('doctors').create(data);
            router.push('/onboard/doctors');
          }
          catch(error: any){
            setError((error?.data?.data?.email?.message as string | undefined) || (error?.data?.data?.password?.message as string | undefined) || "Invalid email or password");
          }
        }
        break;
      case "staff":
        if (method === "Login") {
          await pb.collection('staff').authWithPassword(email, password);
          if(pb.authStore.isValid){
            router.push('/dashboard');
          }
        }else{
          const data = {
            "username": null,
            "email": email,
            "name": "init_value",
            "emailVisibility": false,
            "password": password,
            "passwordConfirm": password
          };
          try{
            await pb.collection('staff').create(data);
            router.push('/onboard/staff');
          }
          catch(error: any){
            setError((error?.data?.data?.email?.message as string | undefined) || (error?.data?.data?.password?.message as string | undefined) || "Invalid email or password");
          }
        }
        break;
      case "patient":
        if (method === "Login") {
          await pb.collection('patients').authWithPassword(email, password);
          if(pb.authStore.isValid){
            router.push('/dashboard');
          }
        }else{
          const data = {
            "username": null,
            "email": email,
            "emailVisibility": true,
            "password": password,
            "passwordConfirm": password,
            "name": "init_value",
            "dob": "2022-01-01 10:00:00.123Z",
            "address": "init_value"
          };
          try{
            await pb.collection('patients').create(data);
            router.push('/onboard/patients');
          }
          catch(error: any){
            setError((error?.data?.data?.email?.message as string | undefined) || (error?.data?.data?.password?.message as string | undefined) || "Invalid email or password");
          }
        }
        break;
    }
  }

  return (
    <div className="h-screen flex flex-col space-y-8 justify-center items-center w-full max-w-md mx-auto py-12">
      <div className={"flex flex-col items-center"}>
        <Image className={"rounded-full overflow-hidden"} src={"/logo.svg"} alt={"logo"} width={50} height={50}/>
        <h1 className={"text-xl font-semibold"}>MediManage</h1>
      </div>
      <Tabs className="w-full" defaultValue="patient">
        <TabsList className="grid grid-cols-3 gap-2">
          <TabsTrigger value="patient">Patient</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="doctor">Doctor</TabsTrigger>
        </TabsList>
        <TabsContent value="patient">
          <Card>
            <CardHeader>
              <CardTitle>Patient {method}</CardTitle>
              <CardDescription>Enter your email and password to {method === "Login" ? "access" : "create"} your patient account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-email">Email</Label>
                <Input id="patient-email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} value={email} type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-password">Password</Label>
                <Input id="patient-password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder={"********"} type="password" />
              </div>
            </CardContent>
            <CardFooter className={"flex flex-col space-y-2"}>
              <Button onClick={() => submit("patient")} className="w-full">{method === "Login" ? "Sign In" : "Sign Up"}</Button>
              {method === "Login" ? (
                  <CardDescription>Don&apos;t have an account ? <Link className={"hover:underline text-black"} href={"/signup"}>Sign up</Link></CardDescription>
              ) : (
                  <CardDescription>Already have an account ? <Link className={"hover:underline text-black"} href={"login"}>Sign In</Link></CardDescription>
              )}
              <CardDescription className={"text-red-500"}>{error}</CardDescription>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff {method}</CardTitle>
              <CardDescription>Enter your email and password to {method === "Login" ? "access" : "create"} your staff account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staff-email">Email</Label>
                <Input id="staff-email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} value={email} type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-password">Password</Label>
                <Input id="staff-password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder={"********"} type="password" />
              </div>
            </CardContent>
            <CardFooter className={"flex flex-col space-y-2"}>
              <Button onClick={() => submit("staff")} className="w-full">{method === "Login" ? "Sign In" : "Sign Up"}</Button>
              {method === "Login" ? (
                  <CardDescription>Don&apos;t have an account ? <Link className={"hover:underline text-black"} href={"/signup"}>Sign up</Link></CardDescription>
              ) : (
                  <CardDescription>Already have an account ? <Link className={"hover:underline text-black"} href={"login"}>Sign In</Link></CardDescription>
              )}
              <CardDescription className={"text-red-500"}>{error}</CardDescription>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="doctor">
          <Card>
            <CardHeader>
              <CardTitle>Doctor {method}</CardTitle>
              <CardDescription>Enter your email and password to {method === "Login" ? "access" : "create"} your doctor account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-email">Email</Label>
                <Input id="doctor-email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} value={email} type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-password">Password</Label>
                <Input id="doctor-password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder={"********"} type="password" />
              </div>
            </CardContent>
            <CardFooter className={"flex flex-col space-y-2"}>
              <Button onClick={() => submit("doctor")} className="w-full">{method === "Login" ? "Sign In" : "Sign Up"}</Button>
              {method === "Login" ? (
                  <CardDescription>Don&apos;t have an account ? <Link className={"hover:underline text-black"} href={"/signup"}>Sign up</Link></CardDescription>
              ) : (
                  <CardDescription>Already have an account ? <Link className={"hover:underline text-black"} href={"login"}>Sign In</Link></CardDescription>
              )}
              <CardDescription className={"text-red-500"}>{error}</CardDescription>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
